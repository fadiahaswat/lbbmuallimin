import React, { useState, useEffect, useRef } from 'react';
import { appConfirm } from '../../../utils/appDialog.js';
import {
  Check,
  X,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCheck,
  Stethoscope
} from 'lucide-react';
import { formatImageUrl, getFallbackImageUrl } from '../../../services/sheetService.js';

function isValidPhotoUrl(url) {
  return Boolean(url && typeof url === 'string' && url !== '#' && !url.startsWith('#'));
}

function getInitials(name = '', fallbackCode = 'P') {
  const words = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  if (words.length === 1 && words[0].length >= 2) return words[0].slice(0, 2).toUpperCase();
  return fallbackCode;
}

function PersonAvatarImg({ photo, name, className = 'w-full h-full object-cover object-top', fallback }) {
  const [imgState, setImgState] = useState('primary');

  useEffect(() => {
    setImgState('primary');
  }, [photo]);

  if (!isValidPhotoUrl(photo) || imgState === 'error') {
    return fallback;
  }

  const src = imgState === 'primary' ? formatImageUrl(photo) : getFallbackImageUrl(photo);
  if (!src) return fallback;

  return (
    <img
      src={src}
      alt={name || 'Personel'}
      draggable={false}
      className={className}
      onError={() => {
        if (imgState === 'primary') {
          const fb = getFallbackImageUrl(photo);
          if (fb && fb !== formatImageUrl(photo)) {
            setImgState('fallback');
            return;
          }
        }
        setImgState('error');
      }}
    />
  );
}

export default function PersonnelSwipeDeck({
  team,
  personnels = [],
  inspections = {},
  canOperate = false,
  onInspect,
  onVerifyAll,
  onNextTeam,
  hasNextTeam = false,
  isMinPersonnelMet = false,
  viewMode = 'swipe',
  onViewModeChange = null
}) {
  const [internalViewMode, setInternalViewMode] = useState('swipe');
  const activeViewMode = onViewModeChange ? viewMode : internalViewMode;
  const setActiveViewMode = onViewModeChange || setInternalViewMode;

  const [rosterFilter, setRosterFilter] = useState('all'); // 'all' | 'pending' | 'verified' | 'excused' | 'flagged'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [flyOut, setFlyOut] = useState(null);
  const [zoomedPerson, setZoomedPerson] = useState(null);

  const dragStartRef = useRef({ x: 0, y: 0, pointerId: null });
  const animTimerRef = useRef(null);

  const getInspectionEntry = (person) => {
    if (!person) return null;
    for (const key of person.aliasKeys || [person.id]) {
      if (inspections[key] !== undefined) return inspections[key];
    }
    return null;
  };

  const getPersonStatus = (person) => {
    const entry = getInspectionEntry(person);
    if (entry?.verified === true) return 'verified';
    if (entry?.verified === false && entry?.inspectedAt) {
      if (/sakit|izin/i.test(entry?.note || '')) return 'excused';
      return 'flagged';
    }
    return 'pending';
  };

  useEffect(() => {
    if (animTimerRef.current) clearTimeout(animTimerRef.current);
    setFlyOut(null);
    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);
    setHistory([]);
    setZoomedPerson(null);
    setRosterFilter('all');

    const firstUnverifiedIdx = personnels.findIndex((p) => {
      const entry = (p.aliasKeys || [p.id]).map(k => inspections[k]).find(Boolean);
      return !entry?.verified;
    });
    setCurrentIndex(firstUnverifiedIdx >= 0 ? firstUnverifiedIdx : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [team?.id]);

  useEffect(() => {
    return () => {
      if (animTimerRef.current) clearTimeout(animTimerRef.current);
    };
  }, []);

  const verifiedCount = personnels.filter(p => getPersonStatus(p) === 'verified').length;
  const excusedCount = personnels.filter(p => getPersonStatus(p) === 'excused').length;
  const flaggedCount = personnels.filter(p => getPersonStatus(p) === 'flagged').length;
  const pendingCount = Math.max(0, personnels.length - verifiedCount - excusedCount - flaggedCount);
  const progressPct = personnels.length > 0 ? Math.round((verifiedCount / personnels.length) * 100) : 0;

  const currentPerson = currentIndex < personnels.length ? personnels[currentIndex] : null;

  const commitSwipe = (direction, customNote = null) => {
    if (!currentPerson || flyOut) return;
    setFlyOut(direction);
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });

    if (canOperate && onInspect) {
      if (direction === 'right') {
        onInspect(currentPerson, true, '');
      } else {
        onInspect(currentPerson, false, customNote || 'Ditandai perlu cek ulang di DP 1');
      }
    }

    setHistory(prev => [...prev, currentIndex]);
    animTimerRef.current = setTimeout(() => {
      setFlyOut(null);
      setCurrentIndex(prev => Math.min(personnels.length, prev + 1));
    }, 170);
  };

  const commitExcused = () => commitSwipe('left', 'Sakit / Izin');

  const handleUndo = () => {
    if (flyOut) return;
    if (history.length > 0) {
      const prevIdx = history[history.length - 1];
      setHistory(prev => prev.slice(0, -1));
      setCurrentIndex(prevIdx);
    } else if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleStep = (delta) => {
    if (flyOut || personnels.length === 0) return;
    setCurrentIndex(prev => {
      const next = prev + delta;
      if (next < 0) return 0;
      if (next >= personnels.length) return personnels.length - 1;
      return next;
    });
  };

  // Keyboard shortcuts (<- Tandai, -> / Enter Cocok, S Sakit/Izin, Backspace / Z Undo)
  useEffect(() => {
    if (activeViewMode !== 'swipe' || zoomedPerson) return undefined;
    const onKeyDown = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if ((e.key === 'ArrowRight' || e.key === 'Enter') && currentPerson) {
        e.preventDefault();
        commitSwipe('right');
      } else if (e.key === 'ArrowLeft' && currentPerson) {
        e.preventDefault();
        commitSwipe('left');
      } else if ((e.key === 's' || e.key === 'S') && currentPerson) {
        e.preventDefault();
        commitExcused();
      } else if (e.key === 'Backspace' || e.key === 'z' || e.key === 'Z') {
        e.preventDefault();
        handleUndo();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const handlePointerDown = (e) => {
    if (flyOut || !currentPerson) return;
    if (e.button !== undefined && e.button !== 0) return;
    dragStartRef.current = { x: e.clientX, y: e.clientY, pointerId: e.pointerId };
    setIsDragging(true);
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch (_) {}
  };

  const handlePointerMove = (e) => {
    if (!isDragging || flyOut) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = (e.clientY - dragStartRef.current.y) * 0.2;
    setDragOffset({ x: dx, y: dy });
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    const dx = dragOffset.x;
    setIsDragging(false);
    if (dx > 80) commitSwipe('right');
    else if (dx < -80) commitSwipe('left');
    else setDragOffset({ x: 0, y: 0 });
  };

  const jumpToPerson = (idx) => {
    if (animTimerRef.current) clearTimeout(animTimerRef.current);
    setFlyOut(null);
    setDragOffset({ x: 0, y: 0 });
    setCurrentIndex(idx);
    if (activeViewMode !== 'swipe') setActiveViewMode('swipe');
  };

  const jumpToFirstRemaining = () => {
    const idx = personnels.findIndex(p => getPersonStatus(p) !== 'verified');
    setCurrentIndex(idx >= 0 ? idx : 0);
  };

  const activeTranslateX = flyOut === 'right' ? 320 : flyOut === 'left' ? -320 : dragOffset.x;
  const activeRotate = flyOut === 'right' ? 10 : flyOut === 'left' ? -10 : dragOffset.x * 0.03;
  const rightStampOpacity = flyOut === 'right' ? 1 : Math.min(1, Math.max(0, (dragOffset.x - 25) / 60));
  const leftStampOpacity = flyOut === 'left' ? 1 : Math.min(1, Math.max(0, (-dragOffset.x - 25) / 60));

  const dantonPerson = personnels.find(p => p.roleType === 'danton');
  const pasukanPersons = personnels.filter(p => p.roleType === 'pasukan');
  const cadanganPersons = personnels.filter(p => p.roleType === 'cadangan');

  const matchesFilter = (person) => {
    if (rosterFilter === 'all') return true;
    return getPersonStatus(person) === rosterFilter;
  };

  const filteredPersonnels = personnels.filter(matchesFilter);

  const getPositionLabel = (person) => {
    if (!person) return '';
    if (person.roleType === 'danton') return 'Komandan Peleton';
    if (person.roleType === 'cadangan') return `Cadangan · ${person.code}`;
    return `Saf ${person.saf} · Banjar ${person.banjar}`;
  };

  const renderGridCard = (person) => {
    const status = getPersonStatus(person);
    const isVerified = status === 'verified';
    const isExcused = status === 'excused';
    const isFlagged = status === 'flagged';

    return (
      <div
        key={person.id}
        className={`group rounded-2xl border overflow-hidden transition-all flex flex-col bg-white ${
          isVerified
            ? 'border-emerald-300/90 shadow-2xs'
            : isExcused
            ? 'border-amber-300 ring-1 ring-amber-200 shadow-2xs'
            : isFlagged
            ? 'border-rose-300 ring-1 ring-rose-200 shadow-2xs'
            : 'border-slate-200 hover:border-slate-300 shadow-2xs'
        }`}
      >
        <div
          onClick={() => isValidPhotoUrl(person.photo) && setZoomedPerson(person)}
          className={`relative aspect-[3/4] bg-slate-100 overflow-hidden ${
            isValidPhotoUrl(person.photo) ? 'cursor-zoom-in' : ''
          }`}
        >
          <PersonAvatarImg
            photo={person.photo}
            name={person.name}
            className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-300"
            fallback={
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100/90 text-slate-400 border-b border-slate-200/70">
                <span className="text-lg font-black text-slate-400">{getInitials(person.name, person.code)}</span>
                <span className="text-[9.5px] font-medium mt-0.5 text-slate-400">Tanpa Foto</span>
              </div>
            }
          />

          <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wide shadow-sm ${
            person.roleType === 'danton'
              ? 'bg-amber-400 text-slate-950'
              : person.roleType === 'cadangan'
              ? 'bg-purple-600 text-white'
              : 'bg-slate-950/80 text-white backdrop-blur-xs'
          }`}>
            {person.code}
          </span>

          {isVerified && (
            <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md ring-2 ring-white">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </span>
          )}
          {isExcused && (
            <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-black uppercase flex items-center gap-0.5 shadow-md ring-2 ring-white">
              <Stethoscope className="w-2.5 h-2.5" />
              <span>Izin</span>
            </span>
          )}
          {isFlagged && (
            <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md ring-2 ring-white">
              <AlertTriangle className="w-3 h-3" />
            </span>
          )}

          {isValidPhotoUrl(person.photo) && (
            <span className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-black/55 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs">
              <ZoomIn className="w-3.5 h-3.5" />
            </span>
          )}
        </div>

        <div className="p-2.5 flex-1 flex flex-col justify-between gap-2">
          <div className="min-w-0">
            <h5 className="text-[11.5px] font-black text-slate-900 uppercase leading-tight truncate" title={person.name}>
              {person.name}
            </h5>
            <p className="text-[10px] text-slate-500 font-mono truncate mt-0.5">
              {person.nisn || '-'} · Kls {person.className || '-'}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-1 pt-1">
            <button
              type="button"
              disabled={!canOperate}
              onClick={() => onInspect?.(person, false, 'Ditandai perlu cek ulang di DP 1')}
              className={`py-1.5 px-1 rounded-lg text-[10.5px] font-bold flex items-center justify-center transition-all cursor-pointer disabled:opacity-40 whitespace-nowrap ${
                isFlagged ? 'bg-rose-600 text-white shadow-2xs' : 'bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700'
              }`}
            >
              Tandai
            </button>
            <button
              type="button"
              disabled={!canOperate}
              onClick={() => onInspect?.(person, false, 'Sakit / Izin')}
              className={`py-1.5 px-1 rounded-lg text-[10.5px] font-bold flex items-center justify-center transition-all cursor-pointer disabled:opacity-40 whitespace-nowrap ${
                isExcused ? 'bg-amber-500 text-white shadow-2xs' : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/70'
              }`}
            >
              Izin
            </button>
            <button
              type="button"
              disabled={!canOperate}
              onClick={() => onInspect?.(person, true, '')}
              className={`py-1.5 px-1 rounded-lg text-[10.5px] font-bold flex items-center justify-center transition-all cursor-pointer disabled:opacity-40 whitespace-nowrap ${
                isVerified ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200/80'
              }`}
            >
              Cocok
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* MODE 1: MASTER-DETAIL SPLIT COCKPIT (SPOTLIGHT CARD + INTERACTIVE ROSTER LIST/GRID) */}
      {activeViewMode === 'swipe' ? (
        <div className="flex flex-col lg:flex-row lg:items-stretch gap-4">
          {/* LEFT: TIGHT SPOTLIGHT INSPECTION CARD (MATCHES RIGHT PANEL HEIGHT ON DESKTOP) */}
          <div className="w-full lg:w-[320px] xl:w-[340px] shrink-0">
            {currentPerson ? (
              <div
                key={currentPerson.id}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                style={{
                  transform: `translate3d(${activeTranslateX}px, 0, 0) rotate(${activeRotate}deg)`,
                  transition: isDragging ? 'none' : 'transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                }}
                className={`bg-white rounded-2xl border overflow-hidden shadow-md touch-none select-none flex flex-col lg:h-[560px] ${
                  isDragging ? 'cursor-grabbing shadow-xl' : 'cursor-grab'
                } ${
                  rightStampOpacity > 0.15
                    ? 'border-emerald-400 ring-2 ring-emerald-400/30'
                    : leftStampOpacity > 0.15
                    ? 'border-rose-400 ring-2 ring-rose-400/30'
                    : 'border-slate-200/90'
                }`}
              >
                {/* Dark Obsidian Card Header with Prev/Next */}
                <div className="bg-slate-950 text-white px-3.5 py-2.5 flex items-center justify-between gap-2 shrink-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider shrink-0 ${
                      currentPerson.roleType === 'danton'
                        ? 'bg-amber-400 text-slate-950'
                        : currentPerson.roleType === 'cadangan'
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/15 text-white'
                    }`}>
                      {currentPerson.code}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-300 truncate">
                      {getPositionLabel(currentPerson)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0" onPointerDown={e => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => handleStep(-1)}
                      disabled={currentIndex === 0}
                      className="w-6 h-6 rounded-md bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white flex items-center justify-center cursor-pointer transition-colors"
                      title="Sebelumnya"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10.5px] font-mono font-bold text-slate-300 px-1">
                      {currentIndex + 1}/{personnels.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleStep(1)}
                      disabled={currentIndex >= personnels.length - 1}
                      className="w-6 h-6 rounded-md bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white flex items-center justify-center cursor-pointer transition-colors"
                      title="Berikutnya"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Portrait Photo Stage */}
                <div className="relative w-full aspect-[4/4.6] lg:aspect-auto lg:flex-1 min-h-0 bg-slate-100 overflow-hidden">
                  <PersonAvatarImg
                    photo={currentPerson.photo}
                    name={currentPerson.name}
                    className="w-full h-full object-cover object-top select-none pointer-events-none"
                    fallback={
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-slate-50 to-slate-100/90">
                        <div className={`w-20 h-20 rounded-2xl border shadow-2xs flex items-center justify-center text-2xl font-mono font-black mb-3 ${
                          currentPerson.roleType === 'danton'
                            ? 'bg-amber-50 border-amber-200 text-amber-800'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}>
                          {getInitials(currentPerson.name, currentPerson.code)}
                        </div>
                        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                          Pasfoto Belum Tersedia
                        </span>
                        <span className="text-[11px] text-slate-400 mt-1 max-w-[210px] leading-snug">
                          Cocokkan dengan kartu pelajar atau identitas fisik
                        </span>
                      </div>
                    }
                  />

                  {/* Zoom Button */}
                  {isValidPhotoUrl(currentPerson.photo) && (
                    <button
                      type="button"
                      onPointerDown={e => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        setZoomedPerson(currentPerson);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/55 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center border border-white/20 transition-colors cursor-pointer z-10"
                      title="Perbesar Foto"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  )}

                  {/* Active Status Badge */}
                  {getPersonStatus(currentPerson) !== 'pending' && (
                    <div className="absolute bottom-3 right-3 z-10">
                      {getPersonStatus(currentPerson) === 'verified' && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wide shadow-md inline-flex items-center gap-1">
                          <Check className="w-3 h-3 stroke-[3]" /> Cocok
                        </span>
                      )}
                      {getPersonStatus(currentPerson) === 'excused' && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white text-[10px] font-black uppercase tracking-wide shadow-md inline-flex items-center gap-1">
                          <Stethoscope className="w-3 h-3" /> Sakit/Izin
                        </span>
                      )}
                      {getPersonStatus(currentPerson) === 'flagged' && (
                        <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase tracking-wide shadow-md inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Cek Ulang
                        </span>
                      )}
                    </div>
                  )}

                  {/* Swipe Stamps */}
                  <div
                    style={{ opacity: rightStampOpacity }}
                    className="absolute inset-0 bg-emerald-500/20 pointer-events-none flex items-start justify-start p-5 z-20"
                  >
                    <div className="-rotate-12 border-4 border-emerald-400 bg-emerald-950/80 text-emerald-300 px-3 py-1 rounded-xl font-black text-lg tracking-widest uppercase">
                      COCOK ✓
                    </div>
                  </div>
                  <div
                    style={{ opacity: leftStampOpacity }}
                    className="absolute inset-0 bg-rose-500/20 pointer-events-none flex items-start justify-end p-5 z-20"
                  >
                    <div className="rotate-12 border-4 border-rose-400 bg-rose-950/80 text-rose-300 px-3 py-1 rounded-xl font-black text-lg tracking-widest uppercase">
                      TANDAI ✕
                    </div>
                  </div>
                </div>

                {/* Integrated Identity + Tactile Action Dock */}
                <div className="p-3.5 bg-white border-t border-slate-100 space-y-3 shrink-0" onPointerDown={e => e.stopPropagation()}>
                  <div>
                    <h4 className="text-sm font-black text-slate-950 uppercase leading-snug truncate" title={currentPerson.name}>
                      {currentPerson.name}
                    </h4>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono font-semibold">
                        NISN: {currentPerson.nisn || '—'}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold">
                        Kls {currentPerson.className || '—'}
                      </span>
                      {currentPerson.medicalHistory && (
                        <span className="px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-bold truncate max-w-full">
                          Medis: {currentPerson.medicalHistory}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Integrated 3-Action Bar + Undo */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleUndo}
                      disabled={currentIndex === 0 && history.length === 0}
                      className="w-9 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-35 shrink-0"
                      title="Undo (Backspace)"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => commitSwipe('left')}
                      disabled={!canOperate}
                      className="flex-1 h-10 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 font-bold text-[11px] flex items-center justify-center gap-1 transition-all cursor-pointer disabled:opacity-40 active:scale-95"
                      title="Tandai cek ulang (←)"
                    >
                      <X className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Tandai</span>
                    </button>
                    <button
                      type="button"
                      onClick={commitExcused}
                      disabled={!canOperate}
                      className="flex-1 h-10 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-bold text-[11px] flex items-center justify-center gap-1 transition-all cursor-pointer disabled:opacity-40 active:scale-95"
                      title="Sakit / Izin (S)"
                    >
                      <Stethoscope className="w-3.5 h-3.5" />
                      <span>Izin</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => commitSwipe('right')}
                      disabled={!canOperate}
                      className="flex-[1.2] h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] shadow-xs flex items-center justify-center gap-1 transition-all cursor-pointer disabled:opacity-40 active:scale-95"
                      title="Cocok / Valid (→ atau Enter)"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Cocok</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* END OF DECK SUMMARY CARD */
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center justify-center text-center space-y-4 min-h-[420px] lg:h-[560px]">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  isMinPersonnelMet
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                    : 'bg-amber-50 text-amber-600 border border-amber-200'
                }`}>
                  {isMinPersonnelMet ? <Sparkles className="w-7 h-7" /> : <AlertTriangle className="w-7 h-7" />}
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">
                    Selesai Melewati {personnels.length} Personel
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    <strong className="text-emerald-700">{verifiedCount} cocok</strong>
                    {excusedCount > 0 ? <> · <strong className="text-amber-600">{excusedCount} izin</strong></> : ''}
                    {flaggedCount > 0 ? <> · <strong className="text-rose-600">{flaggedCount} cek ulang</strong></> : ''}
                    {pendingCount > 0 ? <> · <strong>{pendingCount} belum dicek</strong></> : ''}
                  </p>
                  {isMinPersonnelMet && (
                    <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10.5px] font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Lolos DP 1 · Siap Dinilai</span>
                    </div>
                  )}
                </div>
                <div className="w-full space-y-2 pt-1">
                  {hasNextTeam && onNextTeam && (
                    <button
                      type="button"
                      onClick={onNextTeam}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Lanjut ke Peleton Berikutnya</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {(flaggedCount > 0 || pendingCount > 0) && (
                    <button
                      type="button"
                      onClick={jumpToFirstRemaining}
                      className="w-full py-2 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs cursor-pointer"
                    >
                      Tinjau Belum Valid ({flaggedCount + pendingCount})
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setCurrentIndex(0)}
                    className="w-full py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Ulangi dari Awal
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: INTERACTIVE ROSTER WITH NAMES, PHOTOS, BARIS/GRID TOGGLE & DIRECT 1-CLICK VERIFY */}
          <div className="flex-1 min-w-0 w-full lg:h-[560px] flex flex-col bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs">
            {/* Roster Header & Filters */}
            <div className="px-4 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
              <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-bold">
                {[
                  { id: 'all', label: `Semua (${personnels.length})` },
                  { id: 'pending', label: `Belum (${pendingCount})` },
                  { id: 'verified', label: `Cocok (${verifiedCount})` },
                  ...(excusedCount > 0 ? [{ id: 'excused', label: `Izin (${excusedCount})` }] : []),
                  ...(flaggedCount > 0 ? [{ id: 'flagged', label: `Cek Ulang (${flaggedCount})` }] : []),
                ].map(f => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setRosterFilter(f.id)}
                    className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                      rosterFilter === f.id
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {canOperate && onVerifyAll && verifiedCount < personnels.length && (
                <button
                  type="button"
                  onClick={async () => {
                    const ok = await appConfirm(
                      `Verifikasi seluruh ${personnels.length} personel ${team?.schoolName || ''} sekaligus sebagai COCOK?`,
                      { title: 'Cocokkan Semua Personel', confirmText: 'Ya, Cocokkan Semua', variant: 'success' }
                    );
                    if (ok) onVerifyAll();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold inline-flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all active:scale-95"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Cocokkan Semua</span>
                </button>
              )}
            </div>

            {/* Slim Progress Strip */}
            <div className="h-1 w-full bg-slate-100 overflow-hidden shrink-0">
              <div
                className={`h-full transition-all duration-300 ${isMinPersonnelMet ? 'bg-emerald-500' : 'bg-blue-600'}`}
                style={{ width: `${progressPct}%` }}
              />
            </div>

            {/* Scannable 2-Column Interactive Roster List */}
            <div className="p-3.5 flex-1 min-h-0 overflow-y-auto max-h-[500px] lg:max-h-none">
              {filteredPersonnels.length === 0 ? (
                <div className="h-full min-h-[200px] flex items-center justify-center text-xs text-slate-400 font-medium">
                  Tidak ada personel pada filter ini.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {filteredPersonnels.map(person => {
                    const idx = personnels.findIndex(p => p.id === person.id);
                    const status = getPersonStatus(person);
                    const isCurrent = idx === currentIndex;
                    const isVerified = status === 'verified';
                    const isExcused = status === 'excused';
                    const isFlagged = status === 'flagged';

                    return (
                      <div
                        key={person.id}
                        onClick={() => jumpToPerson(idx)}
                        className={`p-2 rounded-xl border flex items-center justify-between gap-2.5 transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-slate-50 border-slate-900 ring-1 ring-slate-900/15 shadow-2xs'
                            : isVerified
                            ? 'bg-emerald-50/40 border-emerald-200/80 hover:bg-emerald-50/70'
                            : isExcused
                            ? 'bg-amber-50/50 border-amber-200 hover:bg-amber-50'
                            : isFlagged
                            ? 'bg-rose-50/50 border-rose-200 hover:bg-rose-50'
                            : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div className={`w-9 h-9 rounded-lg overflow-hidden shrink-0 border flex items-center justify-center text-[10px] font-mono font-black ${
                            person.roleType === 'danton'
                              ? 'bg-amber-50 border-amber-200 text-amber-800'
                              : person.roleType === 'cadangan'
                              ? 'bg-purple-50 border-purple-200 text-purple-700'
                              : 'bg-slate-100 border-slate-200/80 text-slate-600'
                          }`}>
                            <PersonAvatarImg
                              photo={person.photo}
                              name={person.name}
                              fallback={<span>{person.code}</span>}
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[9px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded leading-none shrink-0 ${
                                person.roleType === 'danton'
                                  ? 'bg-amber-100 text-amber-800'
                                  : person.roleType === 'cadangan'
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-slate-100 text-slate-600'
                              }`}>
                                {person.code}
                              </span>
                              <span className="text-[11.5px] font-bold text-slate-900 uppercase truncate">
                                {person.name}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 truncate mt-0.5">
                              {getPositionLabel(person)}
                            </div>
                          </div>
                        </div>

                        {/* Direct 1-Click Quick Status Buttons */}
                        <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                          <button
                            type="button"
                            disabled={!canOperate}
                            onClick={() => onInspect?.(person, false, 'Ditandai perlu cek ulang di DP 1')}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40 ${
                              isFlagged
                                ? 'bg-rose-600 text-white'
                                : 'bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600'
                            }`}
                            title="Tandai cek ulang"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={!canOperate}
                            onClick={() => onInspect?.(person, false, 'Sakit / Izin')}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40 ${
                              isExcused
                                ? 'bg-amber-500 text-white'
                                : 'bg-slate-100 hover:bg-amber-100 text-slate-400 hover:text-amber-700'
                            }`}
                            title="Sakit / Izin"
                          >
                            <Stethoscope className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={!canOperate}
                            onClick={() => onInspect?.(person, true, '')}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40 ${
                              isVerified
                                ? 'bg-emerald-600 text-white shadow-2xs'
                                : 'bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white border border-emerald-200/80'
                            }`}
                            title="Cocok / Valid"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[2.75]" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : activeViewMode === 'list' ? (
        /* MODE 2: FULL-WIDTH BARIS (DAFTAR ROSTER LENGKAP) */
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-bold">
              {[
                { id: 'all', label: `Semua (${personnels.length})` },
                { id: 'pending', label: `Belum Dicek (${pendingCount})` },
                { id: 'verified', label: `Cocok (${verifiedCount})` },
                ...(excusedCount > 0 ? [{ id: 'excused', label: `Sakit/Izin (${excusedCount})` }] : []),
                ...(flaggedCount > 0 ? [{ id: 'flagged', label: `Cek Ulang (${flaggedCount})` }] : []),
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setRosterFilter(f.id)}
                  className={`px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                    rosterFilter === f.id
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {canOperate && onVerifyAll && verifiedCount < personnels.length && (
              <button
                type="button"
                onClick={async () => {
                  const ok = await appConfirm(
                    `Verifikasi seluruh ${personnels.length} personel ${team?.schoolName || ''} sekaligus sebagai COCOK?`,
                    { title: 'Cocokkan Semua Personel', confirmText: 'Ya, Cocokkan Semua', variant: 'success' }
                  );
                  if (ok) onVerifyAll();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm cursor-pointer transition-all active:scale-95"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Cocokkan Semua</span>
              </button>
            )}
          </div>

          {filteredPersonnels.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 font-medium">
              Tidak ada personel pada filter ini.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5">
              {filteredPersonnels.map(person => {
                const status = getPersonStatus(person);
                const isVerified = status === 'verified';
                const isExcused = status === 'excused';
                const isFlagged = status === 'flagged';

                return (
                  <div
                    key={person.id}
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-2.5 transition-all ${
                      isVerified
                        ? 'bg-emerald-50/40 border-emerald-200/90'
                        : isExcused
                        ? 'bg-amber-50/50 border-amber-200'
                        : isFlagged
                        ? 'bg-rose-50/50 border-rose-200'
                        : 'bg-white border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => isValidPhotoUrl(person.photo) && setZoomedPerson(person)}
                        className={`w-10 h-10 rounded-lg overflow-hidden shrink-0 border flex items-center justify-center text-[10px] font-mono font-black ${
                          isValidPhotoUrl(person.photo) ? 'cursor-zoom-in' : 'cursor-default'
                        } ${
                          person.roleType === 'danton'
                            ? 'bg-amber-50 border-amber-200 text-amber-800'
                            : person.roleType === 'cadangan'
                            ? 'bg-purple-50 border-purple-200 text-purple-700'
                            : 'bg-slate-100 border-slate-200/80 text-slate-600'
                        }`}
                      >
                        <PersonAvatarImg
                          photo={person.photo}
                          name={person.name}
                          fallback={<span>{person.code}</span>}
                        />
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[9px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded leading-none shrink-0 ${
                            person.roleType === 'danton'
                              ? 'bg-amber-100 text-amber-800'
                              : person.roleType === 'cadangan'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {person.code}
                          </span>
                          <span className="text-[11.5px] font-bold text-slate-900 uppercase truncate" title={person.name}>
                            {person.name}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">
                          {getPositionLabel(person)} · NISN {person.nisn || '—'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={!canOperate}
                        onClick={() => onInspect?.(person, false, 'Ditandai perlu cek ulang di DP 1')}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40 ${
                          isFlagged
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600'
                        }`}
                        title="Tandai cek ulang"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={!canOperate}
                        onClick={() => onInspect?.(person, false, 'Sakit / Izin')}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40 ${
                          isExcused
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-100 hover:bg-amber-100 text-slate-400 hover:text-amber-700'
                        }`}
                        title="Sakit / Izin"
                      >
                        <Stethoscope className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={!canOperate}
                        onClick={() => onInspect?.(person, true, '')}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40 ${
                          isVerified
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white border border-emerald-200/80'
                        }`}
                        title="Cocok / Valid"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[2.75]" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* MODE 2: FULL 3:4 PHOTO GRID */
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-bold">
              {[
                { id: 'all', label: `Semua (${personnels.length})` },
                { id: 'pending', label: `Belum Dicek (${pendingCount})` },
                { id: 'verified', label: `Cocok (${verifiedCount})` },
                ...(excusedCount > 0 ? [{ id: 'excused', label: `Sakit/Izin (${excusedCount})` }] : []),
                ...(flaggedCount > 0 ? [{ id: 'flagged', label: `Cek Ulang (${flaggedCount})` }] : []),
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setRosterFilter(f.id)}
                  className={`px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                    rosterFilter === f.id
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {canOperate && onVerifyAll && verifiedCount < personnels.length && (
              <button
                type="button"
                onClick={async () => {
                  const ok = await appConfirm(
                    `Verifikasi seluruh ${personnels.length} personel ${team?.schoolName || ''} sekaligus sebagai COCOK?`,
                    { title: 'Cocokkan Semua Personel', confirmText: 'Ya, Cocokkan Semua', variant: 'success' }
                  );
                  if (ok) onVerifyAll();
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black inline-flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all active:scale-95"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Cocokkan Semua ({personnels.length})</span>
              </button>
            )}
          </div>

          {/* Komandan & Pasukan Inti */}
          {(dantonPerson && matchesFilter(dantonPerson)) || pasukanPersons.some(matchesFilter) ? (
            <div className="space-y-2.5">
              <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-400 block">
                Komandan &amp; Pasukan Inti ({(dantonPerson && matchesFilter(dantonPerson) ? 1 : 0) + pasukanPersons.filter(matchesFilter).length})
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {dantonPerson && matchesFilter(dantonPerson) && renderGridCard(dantonPerson)}
                {pasukanPersons.filter(matchesFilter).map(renderGridCard)}
              </div>
            </div>
          ) : null}

          {/* Cadangan */}
          {cadanganPersons.filter(matchesFilter).length > 0 && (
            <div className="space-y-2.5">
              <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-400 block">
                Personel Cadangan ({cadanganPersons.filter(matchesFilter).length})
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {cadanganPersons.filter(matchesFilter).map(renderGridCard)}
              </div>
            </div>
          )}

          {filteredPersonnels.length === 0 && (
            <div className="py-12 text-center text-xs text-slate-400">
              Tidak ada personel pada kategori filter ini.
            </div>
          )}
        </div>
      )}

      {/* ZOOM PHOTO LIGHTBOX MODAL */}
      {zoomedPerson && (
        <div
          onClick={() => setZoomedPerson(null)}
          className="fixed inset-0 z-[100] bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200"
          >
            <div className="relative aspect-[3/4] bg-slate-900">
              <PersonAvatarImg
                photo={zoomedPerson.photo}
                name={zoomedPerson.name}
                className="w-full h-full object-contain bg-slate-950"
                fallback={
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                    Foto tidak tersedia
                  </div>
                }
              />
              <button
                type="button"
                onClick={() => setZoomedPerson(null)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  {zoomedPerson.code} • {getPositionLabel(zoomedPerson)}
                </span>
                <h5 className="text-sm font-black text-slate-900 uppercase truncate">{zoomedPerson.name}</h5>
                <p className="text-[11px] font-mono text-slate-500">
                  NISN {zoomedPerson.nisn || '-'} · Kelas {zoomedPerson.className || '-'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setZoomedPerson(null)}
                className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold shrink-0 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
