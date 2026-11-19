import React, { useState, useEffect, useRef } from 'react';
import { appConfirm } from '../../../utils/appDialog.js';
import {
  Check,
  X,
  RotateCcw,
  ChevronRight,
  ZoomIn,
  User,
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

  const [gridFilter, setGridFilter] = useState('all'); // 'all' | 'pending' | 'flagged' | 'verified'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [flyOut, setFlyOut] = useState(null); // 'left' | 'right' | null
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

  // Saat berganti peleton, arahkan ke personel pertama yang belum terverifikasi
  useEffect(() => {
    if (animTimerRef.current) clearTimeout(animTimerRef.current);
    setFlyOut(null);
    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);
    setHistory([]);
    setZoomedPerson(null);
    setGridFilter('all');

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
  const nextCards = personnels.slice(currentIndex + 1, currentIndex + 3);

  const commitSwipe = (direction, customNote = null) => {
    if (!currentPerson || flyOut) return;

    setFlyOut(direction);
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });

    if (canOperate && onInspect) {
      if (direction === 'right') {
        onInspect(currentPerson, true, '');
      } else if (direction === 'left') {
        onInspect(currentPerson, false, customNote || 'Ditandai perlu cek ulang di DP 1');
      }
    }

    setHistory(prev => [...prev, currentIndex]);

    animTimerRef.current = setTimeout(() => {
      setFlyOut(null);
      setCurrentIndex(prev => Math.min(personnels.length, prev + 1));
    }, 190);
  };

  const commitExcused = () => {
    commitSwipe('left', 'Sakit / Izin');
  };

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

  const handleSkipNext = () => {
    if (flyOut || !currentPerson) return;
    setHistory(prev => [...prev, currentIndex]);
    setCurrentIndex(prev => Math.min(personnels.length, prev + 1));
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
    } catch (_) {
      // ignore
    }
  };

  const handlePointerMove = (e) => {
    if (!isDragging || flyOut) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = (e.clientY - dragStartRef.current.y) * 0.25;
    setDragOffset({ x: dx, y: dy });
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    const dx = dragOffset.x;
    setIsDragging(false);

    if (dx > 85) {
      commitSwipe('right');
    } else if (dx < -85) {
      commitSwipe('left');
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
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

  const activeTranslateX = flyOut === 'right' ? 420 : flyOut === 'left' ? -420 : dragOffset.x;
  const activeTranslateY = flyOut ? 20 : dragOffset.y;
  const activeRotate = flyOut === 'right' ? 16 : flyOut === 'left' ? -16 : dragOffset.x * 0.04;
  const rightStampOpacity = flyOut === 'right' ? 1 : Math.min(1, Math.max(0, (dragOffset.x - 25) / 65));
  const leftStampOpacity = flyOut === 'left' ? 1 : Math.min(1, Math.max(0, (-dragOffset.x - 25) / 65));

  const dantonPerson = personnels.find(p => p.roleType === 'danton');
  const pasukanPersons = personnels.filter(p => p.roleType === 'pasukan');
  const cadanganPersons = personnels.filter(p => p.roleType === 'cadangan');

  const matchesGridFilter = (person) => {
    if (gridFilter === 'all') return true;
    return getPersonStatus(person) === gridFilter;
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
        {/* Foto 3:4 Full Edge-to-Edge — Klik foto untuk Zoom */}
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
                <span className="text-lg font-black text-slate-400">{person.code}</span>
                <span className="text-[9.5px] font-medium mt-0.5 text-slate-400">Tanpa Foto</span>
              </div>
            }
          />

          {/* Top Left Code Badge */}
          <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wide shadow-sm ${
            person.roleType === 'danton'
              ? 'bg-amber-400 text-slate-950'
              : person.roleType === 'cadangan'
              ? 'bg-purple-600 text-white'
              : 'bg-slate-950/80 text-white backdrop-blur-xs'
          }`}>
            {person.code}
          </span>

          {/* Top Right Status Pill */}
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

          {/* Subtle Zoom Hover Icon */}
          {isValidPhotoUrl(person.photo) && (
            <span className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-black/55 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs">
              <ZoomIn className="w-3.5 h-3.5" />
            </span>
          )}
        </div>

        {/* Info & Clean Toggle Actions */}
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
                isFlagged
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700'
              }`}
              title="Tandai perlu cek ulang"
            >
              Tandai
            </button>
            <button
              type="button"
              disabled={!canOperate}
              onClick={() => onInspect?.(person, false, 'Sakit / Izin')}
              className={`py-1.5 px-1 rounded-lg text-[10.5px] font-bold flex items-center justify-center transition-all cursor-pointer disabled:opacity-40 whitespace-nowrap ${
                isExcused
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/70'
              }`}
              title="Tandai Sakit / Izin"
            >
              Izin
            </button>
            <button
              type="button"
              disabled={!canOperate}
              onClick={() => onInspect?.(person, true, '')}
              className={`py-1.5 px-1 rounded-lg text-[10.5px] font-bold flex items-center justify-center transition-all cursor-pointer disabled:opacity-40 whitespace-nowrap ${
                isVerified
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200/80'
              }`}
              title="Cocok / Valid"
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
      {/* MODE 1: ERGONOMIC SWIPE DECK + INTERACTIVE FORMATION MAP */}
      {activeViewMode === 'swipe' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* LEFT (5 COLS): FRAMED SWIPE STAGE (3:4 FULL PHOTO) + TACTILE CONTROLS */}
          <div className="lg:col-span-5 bg-slate-50/70 rounded-2xl border border-slate-200/80 p-4 flex flex-col items-center justify-between">
            <div className="relative w-full max-w-[276px] h-[488px] flex items-center justify-center select-none">
              {currentPerson ? (
                <>
                  {/* Background Stacked Cards */}
                  {[...nextCards].reverse().map((bgPerson, revIdx) => {
                    const stackDepth = nextCards.length - revIdx;
                    const dragBoost = Math.min(1, Math.abs(dragOffset.x) / 140);
                    const scale = stackDepth === 1 ? 0.95 + dragBoost * 0.04 : 0.90 + dragBoost * 0.03;
                    const translateY = stackDepth === 1 ? 12 - dragBoost * 8 : 22 - dragBoost * 6;

                    return (
                      <div
                        key={bgPerson.id}
                        style={{
                          transform: `translateY(${translateY}px) scale(${scale})`,
                          zIndex: 10 - stackDepth
                        }}
                        className="absolute inset-x-0 top-0 bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden pointer-events-none transition-transform duration-150"
                      >
                        <div className="w-full aspect-[3/4] bg-slate-100 relative overflow-hidden">
                          <PersonAvatarImg
                            photo={bgPerson.photo}
                            name={bgPerson.name}
                            className="w-full h-full object-cover object-top opacity-70"
                            fallback={
                              <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-600">
                                <User className="w-10 h-10 opacity-40" />
                              </div>
                            }
                          />
                        </div>
                        <div className="p-3 bg-white h-[104px]">
                          <div className="text-[11px] font-bold text-slate-400 truncate">
                            Berikutnya: {bgPerson.code} • {bgPerson.name}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* TOP INTERACTIVE CARD */}
                  <div
                    key={currentPerson.id}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    style={{
                      transform: `translate3d(${activeTranslateX}px, ${activeTranslateY}px, 0) rotate(${activeRotate}deg)`,
                      transition: isDragging ? 'none' : 'transform 200ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                      zIndex: 20
                    }}
                    className={`absolute inset-x-0 top-0 bg-white rounded-3xl border shadow-xl overflow-hidden touch-none ${
                      isDragging ? 'cursor-grabbing shadow-2xl' : 'cursor-grab'
                    } ${
                      rightStampOpacity > 0.15
                        ? 'border-emerald-400 ring-2 ring-emerald-400/30'
                        : leftStampOpacity > 0.15
                        ? 'border-rose-400 ring-2 ring-rose-400/30'
                        : 'border-slate-200/90'
                    }`}
                  >
                    {/* Photo Area: True 3:4 Full Edge-to-Edge */}
                    <div className="relative w-full aspect-[3/4] bg-slate-100 overflow-hidden">
                      <PersonAvatarImg
                        photo={currentPerson.photo}
                        name={currentPerson.name}
                        className="w-full h-full object-cover object-top select-none pointer-events-none"
                        fallback={
                          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-100/90 border-b border-slate-200/80">
                            <div className="w-18 h-18 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-slate-600 text-2xl font-black mb-2.5">
                              {currentPerson.code}
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                              Pasfoto Belum Diunggah
                            </span>
                            <span className="text-[10.5px] text-slate-400 mt-1 max-w-[200px] leading-snug">
                              Verifikasi dengan kartu pelajar / fisik langsung
                            </span>
                          </div>
                        }
                      />

                      {isValidPhotoUrl(currentPerson.photo) && (
                        <>
                          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/55 to-transparent pointer-events-none" />
                          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none" />
                        </>
                      )}

                      {/* Top Badges */}
                      <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10">
                        <span className={`px-2.5 py-1 rounded-full text-[10.5px] font-black uppercase tracking-wider shadow-xs backdrop-blur-md border ${
                          currentPerson.roleType === 'danton'
                            ? 'bg-amber-400/95 text-slate-950 border-amber-300'
                            : currentPerson.roleType === 'cadangan'
                            ? 'bg-purple-600/90 text-white border-purple-400/40'
                            : 'bg-slate-900/85 text-white border-white/15'
                        }`}>
                          {currentPerson.roleType === 'danton'
                            ? 'Danton'
                            : currentPerson.roleType === 'cadangan'
                            ? `Cadangan · ${currentPerson.code}`
                            : `${currentPerson.code} · Saf ${currentPerson.saf} Bjr ${currentPerson.banjar}`}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-mono font-bold border ${
                            isValidPhotoUrl(currentPerson.photo)
                              ? 'bg-black/55 backdrop-blur-md text-white border-white/15'
                              : 'bg-white/90 text-slate-700 border-slate-200'
                          }`}>
                            {currentIndex + 1}/{personnels.length}
                          </span>
                          {isValidPhotoUrl(currentPerson.photo) && (
                            <button
                              type="button"
                              onPointerDown={(e) => e.stopPropagation()}
                              onClick={(e) => {
                                e.stopPropagation();
                                setZoomedPerson(currentPerson);
                              }}
                              className="w-7 h-7 rounded-full bg-black/55 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center border border-white/20 transition-colors cursor-pointer"
                              title="Perbesar Foto"
                            >
                              <ZoomIn className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Bottom Status on Photo (Only when already inspected) */}
                      <div className="absolute bottom-2.5 right-3 flex items-center justify-end z-10 pointer-events-none">
                        {getPersonStatus(currentPerson) === 'verified' && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9.5px] font-black uppercase tracking-wide shadow-sm flex items-center gap-1 shrink-0">
                            <Check className="w-2.5 h-2.5 stroke-[3]" /> Cocok
                          </span>
                        )}
                        {getPersonStatus(currentPerson) === 'excused' && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[9.5px] font-black uppercase tracking-wide shadow-sm flex items-center gap-1 shrink-0">
                            <Stethoscope className="w-2.5 h-2.5" /> Sakit/Izin
                          </span>
                        )}
                        {getPersonStatus(currentPerson) === 'flagged' && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[9.5px] font-black uppercase tracking-wide shadow-sm flex items-center gap-1 shrink-0">
                            <AlertTriangle className="w-2.5 h-2.5" /> Cek Ulang
                          </span>
                        )}
                      </div>

                      {/* Swipe Stamp Overlays */}
                      <div
                        style={{ opacity: rightStampOpacity }}
                        className="absolute inset-0 bg-emerald-500/20 pointer-events-none flex items-start justify-start p-5 z-20"
                      >
                        <div className="-rotate-12 border-4 border-emerald-400 bg-emerald-950/75 backdrop-blur-xs text-emerald-300 px-3.5 py-1 rounded-2xl font-black text-xl tracking-widest uppercase shadow-lg">
                          COCOK ✓
                        </div>
                      </div>
                      <div
                        style={{ opacity: leftStampOpacity }}
                        className="absolute inset-0 bg-rose-500/20 pointer-events-none flex items-start justify-end p-5 z-20"
                      >
                        <div className="rotate-12 border-4 border-rose-400 bg-rose-950/75 backdrop-blur-xs text-rose-300 px-3.5 py-1 rounded-2xl font-black text-xl tracking-widest uppercase shadow-lg">
                          TANDAI ✕
                        </div>
                      </div>
                    </div>

                    {/* Identity Footer */}
                    <div className="p-3 bg-white flex flex-col justify-between h-[104px]">
                      <div>
                        <h4 className="text-sm sm:text-[15px] font-black text-slate-900 leading-tight uppercase truncate" title={currentPerson.name}>
                          {currentPerson.name}
                        </h4>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-mono font-semibold">
                            NISN: {currentPerson.nisn || '-'}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold">
                            Kls {currentPerson.className || '-'}
                          </span>
                          {currentPerson.medicalHistory && (
                            <span className="px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-[9.5px] font-bold truncate max-w-full">
                              Medis: {currentPerson.medicalHistory}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                        <span>Geser kiri <strong className="text-rose-500">Tandai</strong> • kanan <strong className="text-emerald-600">Cocok</strong></span>
                        <span className="font-mono text-[9.5px] hidden sm:inline bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">← / →</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* END OF DECK SUMMARY CARD */
                <div className="w-full h-[468px] bg-white rounded-3xl border border-slate-200 shadow-lg p-6 flex flex-col items-center justify-center text-center space-y-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                    isMinPersonnelMet
                      ? 'bg-emerald-100 text-emerald-600 border border-emerald-200'
                      : 'bg-amber-100 text-amber-600 border border-amber-200'
                  }`}>
                    {isMinPersonnelMet ? <Sparkles className="w-7 h-7" /> : <AlertTriangle className="w-7 h-7" />}
                  </div>

                  <div>
                    <h4 className="text-base font-black text-slate-900">
                      Selesai Melewati {personnels.length} Personel
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                      Terverifikasi <strong className="text-emerald-700">{verifiedCount} cocok</strong>
                      {excusedCount > 0 ? <>, <strong className="text-amber-600">{excusedCount} sakit/izin</strong></> : ''}
                      {flaggedCount > 0 ? <>, <strong className="text-rose-600">{flaggedCount} cek ulang</strong></> : ''}
                      {pendingCount > 0 ? <>, dan <strong>{pendingCount} belum dicek</strong></> : ''}.
                    </p>
                    {isMinPersonnelMet && (
                      <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10.5px] font-bold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Otomatis Masuk DP 2 &amp; Siap Dinilai</span>
                      </div>
                    )}
                  </div>

                  <div className="w-full space-y-2 pt-1">
                    {hasNextTeam && onNextTeam && (
                      <button
                        type="button"
                        onClick={onNextTeam}
                        className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
                      >
                        <span>Lanjut ke Peleton Berikutnya</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}

                    {(flaggedCount > 0 || pendingCount > 0) && (
                      <button
                        type="button"
                        onClick={jumpToFirstRemaining}
                        className="w-full py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-all cursor-pointer"
                      >
                        Tinjau Personel Belum Valid ({flaggedCount + pendingCount})
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setCurrentIndex(0)}
                      className="w-full py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
                    >
                      Ulangi dari Danton
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* TACTILE CONTROLS DIRECTLY VISIBLE IN 1 VIEWPORT */}
            {currentPerson && (
              <div className="w-full max-w-[340px] space-y-2 mt-2.5">
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={handleUndo}
                    disabled={currentIndex === 0 && history.length === 0}
                    className="w-10 h-10 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center shadow-2xs transition-all cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed active:scale-95 shrink-0"
                    title="Kembali (Backspace)"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => commitSwipe('left')}
                    disabled={!canOperate}
                    className="flex-1 h-10 px-3 rounded-xl bg-white hover:bg-rose-50 border-2 border-rose-200 hover:border-rose-400 text-rose-600 font-black text-[11px] uppercase tracking-wider shadow-2xs flex items-center justify-center gap-1 transition-all cursor-pointer disabled:opacity-40 active:scale-95"
                    title="Tandai perlu cek ulang (Panah Kiri)"
                  >
                    <X className="w-3.5 h-3.5 stroke-[2.75]" />
                    <span>Tandai</span>
                  </button>

                  <button
                    type="button"
                    onClick={commitExcused}
                    disabled={!canOperate}
                    className="flex-1 h-10 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 text-amber-800 font-black text-[11px] uppercase tracking-wider shadow-2xs flex items-center justify-center gap-1 transition-all cursor-pointer disabled:opacity-40 active:scale-95"
                    title="Tandai personel Sakit / Izin"
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>Sakit/Izin</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => commitSwipe('right')}
                    disabled={!canOperate}
                    className="flex-1 h-10 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] uppercase tracking-wider shadow-md shadow-emerald-600/25 flex items-center justify-center gap-1 transition-all cursor-pointer disabled:opacity-40 active:scale-95"
                    title="Wajah & identitas cocok (Panah Kanan)"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Cocok</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSkipNext}
                    className="w-10 h-10 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center shadow-2xs transition-all cursor-pointer active:scale-95 shrink-0"
                    title="Lewati"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT (7 COLS): INTERACTIVE FORMATION MINI-MAP */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Peta Barisan Peleton
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Klik posisi anggota untuk langsung melompat ke kartunya
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {canOperate && onVerifyAll && verifiedCount < personnels.length && (
                    <button
                      type="button"
                      onClick={async () => {
                        const ok = await appConfirm(
                          `Verifikasi seluruh ${personnels.length} personel ${team?.schoolName || ''} sekaligus sebagai COCOK?`,
                          { title: 'Cocokkan Semua Personel', confirmText: 'Ya, Cocokkan Semua', variant: 'success' }
                        );
                        if (ok) {
                          onVerifyAll();
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black inline-flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all active:scale-95"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Cocokkan Semua</span>
                    </button>
                  )}
                  <span className="text-xs font-mono font-black text-slate-800 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
                    {verifiedCount}/{personnels.length}
                  </span>
                </div>
              </div>

              {/* Progress Bar + Threshold */}
              <div className="space-y-1.5">
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isMinPersonnelMet ? 'bg-emerald-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10.5px]">
                  <span className="text-slate-500 font-medium">
                    Ambang lulus DP 1: <strong className="text-slate-700">Min. 22 personel</strong>
                  </span>
                  {isMinPersonnelMet ? (
                    <span className="font-black text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Siap Dinilai (DP 2)</span>
                    </span>
                  ) : (
                    <span className="font-bold text-amber-700">
                      Kurang {Math.max(0, 22 - verifiedCount)} personel lagi
                    </span>
                  )}
                </div>
              </div>

              {/* 1. Komandan & Cadangan (Satu Baris Kompak Sejajar) */}
              {(dantonPerson || cadanganPersons.length > 0) && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    Komandan &amp; Cadangan
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[...(dantonPerson ? [dantonPerson] : []), ...cadanganPersons].map(person => {
                      const idx = personnels.findIndex(p => p.id === person.id);
                      const status = getPersonStatus(person);
                      const isCurrent = idx === currentIndex;
                      const isDan = person.roleType === 'danton';
                      return (
                        <button
                          key={person.id}
                          type="button"
                          onClick={() => jumpToPerson(idx)}
                          className={`relative p-2 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-slate-50 border-slate-900 ring-2 ring-slate-900/15 shadow-xs'
                              : status === 'verified'
                              ? 'bg-emerald-50/60 border-emerald-200 hover:bg-emerald-50'
                              : status === 'excused'
                              ? 'bg-amber-50/70 border-amber-200 hover:bg-amber-50'
                              : status === 'flagged'
                              ? 'bg-rose-50/70 border-rose-200 hover:bg-rose-50'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className={`w-9 h-9 rounded-lg overflow-hidden shrink-0 border flex items-center justify-center text-[10px] font-black ${
                            isDan ? 'bg-amber-100 border-amber-200 text-amber-800' : 'bg-purple-100 border-purple-200 text-purple-700'
                          }`}>
                            <PersonAvatarImg
                              photo={person.photo}
                              name={person.name}
                              fallback={<span>{person.code}</span>}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1">
                              <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded leading-none ${
                                isDan ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-700'
                              }`}>
                                {isDan ? 'Danton' : person.code}
                              </span>
                            </div>
                            <div className="text-[11px] font-bold text-slate-900 uppercase truncate mt-1">
                              {person.name}
                            </div>
                          </div>
                          {status === 'verified' && (
                            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          )}
                          {status === 'excused' && (
                            <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                              <Stethoscope className="w-2.5 h-2.5" />
                            </span>
                          )}
                          {status === 'flagged' && (
                            <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0">
                              <X className="w-3 h-3 stroke-[3]" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. Pasukan Inti (3 Saf x 7 Banjar dengan Foto Lebih Jelas) */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Pasukan Inti (3 Saf × 7 Banjar)
                </span>
                <div className="space-y-1.5">
                  {[1, 2, 3].map(safNum => {
                    const safMembers = pasukanPersons.slice((safNum - 1) * 7, safNum * 7);
                    return (
                      <div key={safNum} className="flex items-center gap-2">
                        <span className="text-[9.5px] font-mono font-black uppercase text-slate-400 w-9 shrink-0">
                          Saf {safNum}
                        </span>
                        <div className="grid grid-cols-7 gap-1.5 flex-1">
                          {safMembers.map(person => {
                            const idx = personnels.findIndex(p => p.id === person.id);
                            const status = getPersonStatus(person);
                            const isCurrent = idx === currentIndex;
                            return (
                              <button
                                key={person.id}
                                type="button"
                                onClick={() => jumpToPerson(idx)}
                                title={`${person.code} • ${person.name}`}
                                className={`relative p-1.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                                  isCurrent
                                    ? 'bg-slate-50 border-slate-900 ring-2 ring-slate-900/20 shadow-xs scale-[1.03] z-10'
                                    : status === 'verified'
                                    ? 'bg-emerald-50/70 border-emerald-200 hover:bg-emerald-50'
                                    : status === 'excused'
                                    ? 'bg-amber-50 border-amber-300 hover:bg-amber-100/70'
                                    : status === 'flagged'
                                    ? 'bg-rose-50 border-rose-300 hover:bg-rose-100/70'
                                    : 'bg-white border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                {isValidPhotoUrl(person.photo) ? (
                                  <>
                                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-200 overflow-hidden shrink-0">
                                      <PersonAvatarImg
                                        photo={person.photo}
                                        name={person.name}
                                        fallback={
                                          <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-500 text-[9px] font-black">
                                            {person.code}
                                          </div>
                                        }
                                      />
                                    </div>
                                    <span className="text-[9.5px] font-mono font-bold text-slate-700 leading-none">
                                      {person.code}
                                    </span>
                                  </>
                                ) : (
                                  <div className="w-full py-2.5 flex items-center justify-center">
                                    <span className="text-[11px] font-mono font-black text-slate-700 leading-none">
                                      {person.code}
                                    </span>
                                  </div>
                                )}
                                {status === 'verified' && (
                                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-2 ring-white">
                                    <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                                  </span>
                                )}
                                {status === 'excused' && (
                                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center ring-2 ring-white" title="Sakit / Izin">
                                    <Stethoscope className="w-2.5 h-2.5" />
                                  </span>
                                )}
                                {status === 'flagged' && (
                                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center ring-2 ring-white">
                                    <X className="w-2.5 h-2.5 stroke-[3]" />
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* MODE 2: GRID 25 FOTO TERSTRUKTUR PER FORMASI + FILTER CEPAT */
        <div className="space-y-5">
          {/* Grid Filter & Quick Verify All Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-bold">
              {[
                { id: 'all', label: `Semua (${personnels.length})` },
                { id: 'pending', label: `Belum (${pendingCount})` },
                { id: 'excused', label: `Sakit/Izin (${excusedCount})` },
                { id: 'flagged', label: `Cek Ulang (${flaggedCount})` },
                { id: 'verified', label: `Cocok (${verifiedCount})` },
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setGridFilter(f.id)}
                  className={`px-3 py-1 rounded-full border transition-colors cursor-pointer ${
                    gridFilter === f.id
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
                  if (ok) {
                    onVerifyAll();
                  }
                }}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black inline-flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all active:scale-95"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Cocokkan Semua ({personnels.length}/{personnels.length})</span>
              </button>
            )}
          </div>

          {/* Section 1: Komandan & Cadangan + Pasukan Inti */}
          {(() => {
            const visibleDanton = dantonPerson && matchesGridFilter(dantonPerson) ? [dantonPerson] : [];
            const visiblePasukan = pasukanPersons.filter(matchesGridFilter);
            const visibleCadangan = cadanganPersons.filter(matchesGridFilter);
            const totalVisible = visibleDanton.length + visiblePasukan.length + visibleCadangan.length;

            if (totalVisible === 0) {
              return (
                <div className="py-12 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  Tidak ada personel yang cocok dengan filter ini.
                </div>
              );
            }

            const mainSquad = [...visibleDanton, ...visiblePasukan];

            return (
              <div className="space-y-5">
                {mainSquad.length > 0 && (
                  <div className="space-y-2.5">
                    <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                      Komandan &amp; Pasukan Inti ({mainSquad.length} Personel)
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
                      {mainSquad.map(renderGridCard)}
                    </div>
                  </div>
                )}

                {visibleCadangan.length > 0 && (
                  <div className="space-y-2.5">
                    <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                      Personel Cadangan ({visibleCadangan.length} Personel)
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
                      {visibleCadangan.map(renderGridCard)}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* ZOOM PHOTO LIGHTBOX MODAL */}
      {zoomedPerson && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setZoomedPerson(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-slate-900 aspect-[3/4] max-h-[65vh] w-full flex items-center justify-center overflow-hidden">
              <PersonAvatarImg
                photo={zoomedPerson.photo}
                name={zoomedPerson.name}
                className="w-full h-full object-contain bg-slate-950"
                fallback={
                  <div className="text-slate-400 text-xs">Foto tidak tersedia</div>
                }
              />
              <button
                type="button"
                onClick={() => setZoomedPerson(null)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/65 text-white text-[11px] font-black uppercase">
                {zoomedPerson.code} • {zoomedPerson.roleLabel}
              </span>
            </div>
            <div className="p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h4 className="text-sm font-black text-slate-900 uppercase truncate">
                  {zoomedPerson.name}
                </h4>
                <p className="text-xs font-mono text-slate-500 mt-0.5">
                  NISN: {zoomedPerson.nisn || '-'} · Kelas {zoomedPerson.className || '-'}
                </p>
              </div>
              {canOperate && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      onInspect?.(zoomedPerson, false, 'Ditandai perlu cek ulang di DP 1');
                      setZoomedPerson(null);
                    }}
                    className="px-2.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-black cursor-pointer"
                  >
                    Tandai
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onInspect?.(zoomedPerson, false, 'Sakit / Izin');
                      setZoomedPerson(null);
                    }}
                    className="px-2.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-black cursor-pointer"
                  >
                    Sakit/Izin
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onInspect?.(zoomedPerson, true, '');
                      setZoomedPerson(null);
                    }}
                    className="px-2.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black cursor-pointer"
                  >
                    Cocok
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
