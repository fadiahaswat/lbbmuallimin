import React, { useState, useEffect, useRef } from 'react';
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
  Layers,
  LayoutGrid,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { formatImageUrl, getFallbackImageUrl } from '../../../services/sheetService.js';

function isValidPhotoUrl(url) {
  return Boolean(url && typeof url === 'string' && url !== '#' && !url.startsWith('#'));
}

function PersonAvatarImg({ photo, name, className = 'w-full h-full object-cover object-top', fallback }) {
  const [imgState, setImgState] = useState('primary'); // 'primary' | 'fallback' | 'error'

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
  isMinPersonnelMet = false
}) {
  const [viewMode, setViewMode] = useState('swipe'); // 'swipe' | 'grid'
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
    if (entry?.verified === false && entry?.inspectedAt) return 'flagged';
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

    const firstUnverifiedIdx = personnels.findIndex((p) => {
      const entry = (p.aliasKeys || [p.id]).map(k => inspections[k]).find(Boolean);
      return !entry?.verified;
    });
    setCurrentIndex(firstUnverifiedIdx >= 0 ? firstUnverifiedIdx : 0);
    // Hanya reset saat tim berganti
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [team?.id]);

  useEffect(() => {
    return () => {
      if (animTimerRef.current) clearTimeout(animTimerRef.current);
    };
  }, []);

  const verifiedCount = personnels.filter(p => getPersonStatus(p) === 'verified').length;
  const flaggedCount = personnels.filter(p => getPersonStatus(p) === 'flagged').length;
  const pendingCount = Math.max(0, personnels.length - verifiedCount - flaggedCount);

  const currentPerson = currentIndex < personnels.length ? personnels[currentIndex] : null;
  const nextCards = personnels.slice(currentIndex + 1, currentIndex + 3);

  const commitSwipe = (direction) => {
    if (!currentPerson || flyOut) return;

    setFlyOut(direction);
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });

    if (canOperate && onInspect) {
      if (direction === 'right') {
        onInspect(currentPerson, true, '');
      } else if (direction === 'left') {
        onInspect(currentPerson, false, 'Ditandai perlu cek ulang di DP 1');
      }
    }

    setHistory(prev => [...prev, currentIndex]);

    animTimerRef.current = setTimeout(() => {
      setFlyOut(null);
      setCurrentIndex(prev => Math.min(personnels.length, prev + 1));
    }, 210);
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

  // Keyboard shortcuts (<- Tandai, -> Cocok, Backspace Undo)
  useEffect(() => {
    if (viewMode !== 'swipe' || zoomedPerson) return undefined;

    const onKeyDown = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.key === 'ArrowRight' && currentPerson) {
        e.preventDefault();
        commitSwipe('right');
      } else if (e.key === 'ArrowLeft' && currentPerson) {
        e.preventDefault();
        commitSwipe('left');
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleUndo();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  // Pointer drag handlers untuk kartu teratas
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
    const dy = (e.clientY - dragStartRef.current.y) * 0.28;
    setDragOffset({ x: dx, y: dy });
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    const dx = dragOffset.x;
    setIsDragging(false);

    if (dx > 90) {
      commitSwipe('right');
    } else if (dx < -90) {
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
    if (viewMode !== 'swipe') setViewMode('swipe');
  };

  const jumpToFirstRemaining = () => {
    const idx = personnels.findIndex(p => getPersonStatus(p) !== 'verified');
    setCurrentIndex(idx >= 0 ? idx : 0);
  };

  // Kalkulasi transform kartu teratas
  const activeTranslateX = flyOut === 'right' ? 440 : flyOut === 'left' ? -440 : dragOffset.x;
  const activeTranslateY = flyOut ? 24 : dragOffset.y;
  const activeRotate = flyOut === 'right' ? 18 : flyOut === 'left' ? -18 : dragOffset.x * 0.045;
  const rightStampOpacity = flyOut === 'right' ? 1 : Math.min(1, Math.max(0, (dragOffset.x - 25) / 70));
  const leftStampOpacity = flyOut === 'left' ? 1 : Math.min(1, Math.max(0, (-dragOffset.x - 25) / 70));

  const dantonPerson = personnels.find(p => p.roleType === 'danton');
  const pasukanPersons = personnels.filter(p => p.roleType === 'pasukan');
  const cadanganPersons = personnels.filter(p => p.roleType === 'cadangan');

  return (
    <div className="space-y-4">
      {/* Sub-Toolbar: Mode Switcher + Progress Summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50/90 border border-slate-200/80 rounded-2xl px-4 py-2.5">
        <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-slate-200/80 shadow-sm">
          <button
            type="button"
            onClick={() => setViewMode('swipe')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'swipe'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Slide Kartu (Swipe)</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Grid 25 Foto</span>
          </button>
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Cocok: {verifiedCount}
          </span>
          {flaggedCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-bold">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Cek Ulang: {flaggedCount}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600 font-semibold">
            Belum: {pendingCount}
          </span>
        </div>
      </div>

      {/* MODE 1: TINDER SWIPE DECK + FORMATION MINI-MAP */}
      {viewMode === 'swipe' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT / CENTER (7 COLS): TINDER CARD STACK */}
          <div className="lg:col-span-7 flex flex-col items-center">
            {/* Card Stack Stage */}
            <div className="relative w-full max-w-[380px] h-[490px] sm:h-[520px] flex items-center justify-center select-none my-1">
              {currentPerson ? (
                <>
                  {/* Background Stacked Cards (Next 2 Cards Peeking) */}
                  {[...nextCards].reverse().map((bgPerson, revIdx) => {
                    const stackDepth = nextCards.length - revIdx; // 1 = directly behind, 2 = third
                    const dragBoost = Math.min(1, Math.abs(dragOffset.x) / 140);
                    const scale = stackDepth === 1 ? 0.95 + dragBoost * 0.04 : 0.90 + dragBoost * 0.03;
                    const translateY = stackDepth === 1 ? 14 - dragBoost * 10 : 26 - dragBoost * 8;

                    return (
                      <div
                        key={bgPerson.id}
                        style={{
                          transform: `translateY(${translateY}px) scale(${scale})`,
                          zIndex: 10 - stackDepth
                        }}
                        className="absolute inset-x-0 top-0 h-[465px] sm:h-[490px] bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden pointer-events-none transition-transform duration-150"
                      >
                        <div className="h-[310px] sm:h-[335px] bg-slate-900 relative overflow-hidden">
                          <PersonAvatarImg
                            photo={bgPerson.photo}
                            name={bgPerson.name}
                            className="w-full h-full object-cover object-top opacity-75"
                            fallback={
                              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 text-slate-400">
                                <User className="w-12 h-12 opacity-40" />
                              </div>
                            }
                          />
                          <div className="absolute inset-0 bg-slate-950/20" />
                        </div>
                        <div className="p-4 bg-white">
                          <div className="text-xs font-bold text-slate-400 truncate">
                            Berikutnya: {bgPerson.code} • {bgPerson.name}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* TOP INTERACTIVE SWIPE CARD */}
                  <div
                    key={currentPerson.id}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    style={{
                      transform: `translate3d(${activeTranslateX}px, ${activeTranslateY}px, 0) rotate(${activeRotate}deg)`,
                      transition: isDragging ? 'none' : 'transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                      zIndex: 20
                    }}
                    className={`absolute inset-x-0 top-0 h-[465px] sm:h-[490px] bg-white rounded-3xl border shadow-xl overflow-hidden touch-none ${
                      isDragging ? 'cursor-grabbing shadow-2xl' : 'cursor-grab'
                    } ${
                      rightStampOpacity > 0.15
                        ? 'border-emerald-400 ring-2 ring-emerald-400/30'
                        : leftStampOpacity > 0.15
                        ? 'border-rose-400 ring-2 ring-rose-400/30'
                        : 'border-slate-200/90'
                    }`}
                  >
                    {/* Photo Hero Area */}
                    <div className="relative h-[315px] sm:h-[340px] bg-slate-900 overflow-hidden">
                      <PersonAvatarImg
                        photo={currentPerson.photo}
                        name={currentPerson.name}
                        className="w-full h-full object-cover object-top select-none pointer-events-none"
                        fallback={
                          <div className={`w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br ${
                            currentPerson.roleType === 'danton'
                              ? 'from-amber-900 via-slate-900 to-slate-950'
                              : currentPerson.roleType === 'cadangan'
                              ? 'from-purple-900 via-slate-900 to-slate-950'
                              : 'from-slate-800 via-slate-900 to-slate-950'
                          }`}>
                            <div className="w-24 h-24 rounded-3xl bg-white/10 border border-white/15 flex items-center justify-center text-white text-3xl font-black mb-3 shadow-inner">
                              {currentPerson.code}
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                              Pasfoto Belum Diunggah
                            </span>
                            <span className="text-[11px] text-slate-400 mt-1">
                              Verifikasi menggunakan kartu pelajar / fisik langsung
                            </span>
                          </div>
                        }
                      />

                      {/* Subtle Top & Bottom Gradient Scrim */}
                      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none" />

                      {/* Top Badges: Role Code & Photo Zoom */}
                      <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between gap-2 z-10">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-sm backdrop-blur-md border ${
                          currentPerson.roleType === 'danton'
                            ? 'bg-amber-400/95 text-slate-950 border-amber-300'
                            : currentPerson.roleType === 'cadangan'
                            ? 'bg-purple-600/90 text-white border-purple-400/40'
                            : 'bg-slate-900/85 text-white border-white/15'
                        }`}>
                          {currentPerson.code} • {currentPerson.roleType === 'danton' ? 'Danton' : currentPerson.roleType === 'cadangan' ? 'Cadangan' : `Saf ${currentPerson.saf} Banjar ${currentPerson.banjar}`}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <span className="px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-md text-white text-[11px] font-mono font-bold border border-white/15">
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
                              className="w-8 h-8 rounded-full bg-black/55 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center border border-white/20 transition-colors cursor-pointer"
                              title="Perbesar Foto"
                            >
                              <ZoomIn className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Current Verification Status Badge on Bottom of Photo */}
                      <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between z-10 pointer-events-none">
                        <span className="text-[11px] font-semibold text-white/90 truncate">
                          {currentPerson.roleLabel}
                        </span>
                        {getPersonStatus(currentPerson) === 'verified' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wide shadow-sm flex items-center gap-1 shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" /> Cocok
                          </span>
                        )}
                        {getPersonStatus(currentPerson) === 'flagged' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase tracking-wide shadow-sm flex items-center gap-1 shrink-0">
                            <AlertTriangle className="w-3 h-3" /> Cek Ulang
                          </span>
                        )}
                      </div>

                      {/* TINDER STAMP OVERLAY: COCOK / VALID (RIGHT SWIPE) */}
                      <div
                        style={{ opacity: rightStampOpacity }}
                        className="absolute inset-0 bg-emerald-500/20 pointer-events-none flex items-start justify-start p-6 z-20"
                      >
                        <div className="-rotate-12 border-4 border-emerald-400 bg-emerald-950/75 backdrop-blur-sm text-emerald-300 px-4 py-1.5 rounded-2xl font-black text-2xl tracking-widest uppercase shadow-lg">
                          COCOK ✓
                        </div>
                      </div>

                      {/* TINDER STAMP OVERLAY: CEK ULANG (LEFT SWIPE) */}
                      <div
                        style={{ opacity: leftStampOpacity }}
                        className="absolute inset-0 bg-rose-500/20 pointer-events-none flex items-start justify-end p-6 z-20"
                      >
                        <div className="rotate-12 border-4 border-rose-400 bg-rose-950/75 backdrop-blur-sm text-rose-300 px-4 py-1.5 rounded-2xl font-black text-2xl tracking-widest uppercase shadow-lg">
                          TANDAI ✕
                        </div>
                      </div>
                    </div>

                    {/* Card Identity Info Footer */}
                    <div className="p-4 sm:p-5 bg-white flex flex-col justify-between h-[150px]">
                      <div>
                        <h4 className="text-lg sm:text-xl font-black text-slate-900 leading-tight uppercase truncate" title={currentPerson.name}>
                          {currentPerson.name}
                        </h4>
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-mono font-semibold">
                            NISN: {currentPerson.nisn || '-'}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold">
                            Kelas: {currentPerson.className || '-'}
                          </span>
                          {currentPerson.medicalHistory && (
                            <span className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-bold truncate max-w-full">
                              Medis: {currentPerson.medicalHistory}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                        <span>Geser kiri <strong className="text-rose-500">Tandai</strong> • Geser kanan <strong className="text-emerald-600">Cocok</strong></span>
                        <span className="font-mono text-[10px] hidden sm:inline">← / →</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* END OF DECK SUMMARY CARD */
                <div className="w-full h-[465px] sm:h-[490px] bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-5">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                    isMinPersonnelMet
                      ? 'bg-emerald-100 text-emerald-600 border border-emerald-200'
                      : 'bg-amber-100 text-amber-600 border border-amber-200'
                  }`}>
                    {isMinPersonnelMet ? <Sparkles className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
                  </div>

                  <div>
                    <h4 className="text-lg font-black text-slate-900">
                      Selesai Melewati 25 Kartu Personel
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                      Terverifikasi <strong className="text-emerald-700">{verifiedCount} cocok</strong>
                      {flaggedCount > 0 ? <>, <strong className="text-rose-600">{flaggedCount} perlu cek ulang</strong></> : ''}
                      {pendingCount > 0 ? <>, dan <strong>{pendingCount} belum diperiksa</strong></> : ''}.
                    </p>
                    {isMinPersonnelMet && (
                      <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Otomatis Masuk DP 2 &amp; Siap Dinilai Juri</span>
                      </div>
                    )}
                  </div>

                  <div className="w-full space-y-2.5 pt-1">
                    {hasNextTeam && onNextTeam && (
                      <button
                        type="button"
                        onClick={onNextTeam}
                        className="w-full py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
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
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
                    >
                      Ulangi Kartu dari Danton (Awal)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* TACTILE SWIPE CONTROLS BELOW CARD */}
            {currentPerson && (
              <div className="flex items-center justify-center gap-3 sm:gap-4 mt-2">
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={currentIndex === 0 && history.length === 0}
                  className="w-11 h-11 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center shadow-sm transition-all cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed active:scale-95"
                  title="Kembali ke personel sebelumnya (Backspace)"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => commitSwipe('left')}
                  disabled={!canOperate}
                  className="h-12 sm:h-14 px-5 sm:px-6 rounded-full bg-white hover:bg-rose-50 border-2 border-rose-200 hover:border-rose-400 text-rose-600 font-black text-xs uppercase tracking-wider shadow-sm hover:shadow-md flex items-center gap-2 transition-all cursor-pointer disabled:opacity-40 active:scale-95"
                  title="Tandai perlu cek ulang (Panah Kiri)"
                >
                  <X className="w-5 h-5 stroke-[2.75]" />
                  <span>Tandai</span>
                </button>

                <button
                  type="button"
                  onClick={() => commitSwipe('right')}
                  disabled={!canOperate}
                  className="h-12 sm:h-14 px-6 sm:px-7 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-40 active:scale-95"
                  title="Wajah & identitas sesuai (Panah Kanan)"
                >
                  <Check className="w-5 h-5 stroke-[3]" />
                  <span>Cocok</span>
                </button>

                <button
                  type="button"
                  onClick={handleSkipNext}
                  className="w-11 h-11 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center shadow-sm transition-all cursor-pointer active:scale-95"
                  title="Lewati ke personel berikutnya"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* RIGHT (5 COLS): INTERACTIVE FORMATION MINI-MAP (BARISAN 25 PERSONEL) */}
          <div className="lg:col-span-5 bg-slate-50/80 rounded-3xl border border-slate-200/90 p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Peta Barisan Peleton
                </h4>
                <p className="text-[11px] text-slate-500">
                  Klik posisi anggota untuk lompat langsung ke kartunya
                </p>
              </div>
              <span className="text-xs font-mono font-black text-slate-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                {verifiedCount}/{personnels.length}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    isMinPersonnelMet ? 'bg-emerald-500' : 'bg-blue-600'
                  }`}
                  style={{ width: `${personnels.length ? Math.round((verifiedCount / personnels.length) * 100) : 0}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>Min. 22 Personel → Otomatis ke DP 2 &amp; Siap Dinilai</span>
                {isMinPersonnelMet ? (
                  <span className="font-bold text-emerald-600">✓ Siap Dinilai</span>
                ) : (
                  <span>Kurang {Math.max(0, 22 - verifiedCount)} lagi</span>
                )}
              </div>
            </div>

            {/* 1. Danton Slot */}
            {dantonPerson && (() => {
              const dIdx = personnels.indexOf(dantonPerson);
              const status = getPersonStatus(dantonPerson);
              const isCurrent = currentIndex === dIdx;

              return (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Komandan Peleton
                  </span>
                  <button
                    type="button"
                    onClick={() => jumpToPerson(dIdx)}
                    className={`w-full p-2.5 rounded-2xl border flex items-center justify-between gap-3 transition-all cursor-pointer text-left ${
                      isCurrent
                        ? 'bg-white border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                        : status === 'verified'
                        ? 'bg-emerald-50/80 border-emerald-200 hover:bg-emerald-50'
                        : status === 'flagged'
                        ? 'bg-rose-50/80 border-rose-200 hover:bg-rose-50'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-amber-100 border border-amber-300 shrink-0 flex items-center justify-center font-black text-[11px] text-amber-800">
                        <PersonAvatarImg
                          photo={dantonPerson.photo}
                          name={dantonPerson.name}
                          fallback={<span>DAN</span>}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-black text-slate-900 truncate">{dantonPerson.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono truncate">DAN • NISN {dantonPerson.nisn || '-'}</div>
                      </div>
                    </div>
                    <StatusDot status={status} />
                  </button>
                </div>
              );
            })()}

            {/* 2. Pasukan Inti (21 Personel: 3 Saf x 7 Banjar) */}
            {pasukanPersons.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Pasukan Inti (3 Saf × 7 Banjar)
                  </span>
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {pasukanPersons.map((p) => {
                    const pIdx = personnels.indexOf(p);
                    const status = getPersonStatus(p);
                    const isCurrent = currentIndex === pIdx;

                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => jumpToPerson(pIdx)}
                        title={`${p.code}: ${p.name}`}
                        className={`relative p-1 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-blue-600 border-blue-600 text-white ring-2 ring-blue-500/30 shadow-sm scale-105 z-10'
                            : status === 'verified'
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100/70'
                            : status === 'flagged'
                            ? 'bg-rose-50 border-rose-300 text-rose-900 hover:bg-rose-100/70'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center text-[10px] font-bold text-slate-500">
                          <PersonAvatarImg
                            photo={p.photo}
                            name={p.name}
                            fallback={<span>{p.code}</span>}
                          />
                        </div>
                        <span className="text-[9.5px] font-mono font-bold leading-none">{p.code}</span>
                        {status === 'verified' && !isCurrent && (
                          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        )}
                        {status === 'flagged' && !isCurrent && (
                          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-sm text-[8px] font-black">
                            !
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Cadangan (3 Personel) */}
            {cadanganPersons.length > 0 && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Personel Cadangan
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {cadanganPersons.map((c) => {
                    const cIdx = personnels.indexOf(c);
                    const status = getPersonStatus(c);
                    const isCurrent = currentIndex === cIdx;

                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => jumpToPerson(cIdx)}
                        className={`p-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer text-left min-w-0 ${
                          isCurrent
                            ? 'bg-white border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                            : status === 'verified'
                            ? 'bg-emerald-50/80 border-emerald-200'
                            : status === 'flagged'
                            ? 'bg-rose-50/80 border-rose-200'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-purple-100 text-purple-700 font-bold text-[10px] shrink-0 flex items-center justify-center">
                          <PersonAvatarImg
                            photo={c.photo}
                            name={c.name}
                            fallback={<span>{c.code}</span>}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] font-black text-slate-800 truncate">{c.code}</div>
                          <div className="text-[9.5px] text-slate-500 truncate">{c.name}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick Bulk Actions */}
            {canOperate && (
              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={onVerifyAll}
                  className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Verifikasi Semua (25)
                </button>
                {hasNextTeam && onNextTeam && (
                  <button
                    type="button"
                    onClick={onNextTeam}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Peleton Berikutnya</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* MODE 2: PHOTO GRID 25 PERSONEL */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3.5">
          {personnels.map((person, idx) => {
            const status = getPersonStatus(person);
            const isVerified = status === 'verified';
            const isFlagged = status === 'flagged';

            return (
              <div
                key={person.id}
                className={`rounded-2xl border overflow-hidden bg-white transition-all flex flex-col justify-between ${
                  isVerified
                    ? 'border-emerald-300 ring-1 ring-emerald-200/70'
                    : isFlagged
                    ? 'border-rose-300 ring-1 ring-rose-200/70'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Photo Top */}
                <div
                  onClick={() => jumpToPerson(idx)}
                  className="relative aspect-[4/4.2] bg-slate-900 overflow-hidden cursor-pointer group"
                >
                  <PersonAvatarImg
                    photo={person.photo}
                    name={person.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-200"
                    fallback={
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 text-slate-400 p-3 text-center">
                        <User className="w-8 h-8 opacity-50 mb-1" />
                        <span className="text-[9px] font-bold uppercase tracking-wider opacity-75">Tanpa Foto</span>
                      </div>
                    }
                  />
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                      person.roleType === 'danton'
                        ? 'bg-amber-400 text-slate-950'
                        : person.roleType === 'cadangan'
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-900/85 text-white'
                    }`}>
                      {person.code}
                    </span>
                  </div>
                  {isValidPhotoUrl(person.photo) && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setZoomedPerson(person);
                      }}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/55 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Perbesar Foto"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Info & Quick Action Buttons */}
                <div className="p-3 space-y-2.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-black text-slate-900 truncate" title={person.name}>
                      {person.name}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono truncate">
                      NISN: {person.nisn || '-'} • Kls {person.className || '-'}
                    </div>
                  </div>

                  {canOperate && (
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => onInspect(person, false, 'Ditandai perlu cek ulang')}
                        className={`py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          isFlagged
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600'
                        }`}
                      >
                        <X className="w-3 h-3" />
                        <span>Tandai</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onInspect(person, true, '')}
                        className={`py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          isVerified
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700'
                        }`}
                      >
                        <Check className="w-3 h-3" />
                        <span>Cocok</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PHOTO ZOOM LIGHTBOX MODAL */}
      {zoomedPerson && (
        <div
          onClick={() => setZoomedPerson(null)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200"
          >
            <div className="relative aspect-[3/4] max-h-[68vh] w-full bg-slate-950">
              <PersonAvatarImg
                photo={zoomedPerson.photo}
                name={zoomedPerson.name}
                className="w-full h-full object-contain"
                fallback={
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <User className="w-16 h-16" />
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
                <span className="text-[10px] font-black uppercase text-blue-600">{zoomedPerson.roleLabel}</span>
                <h4 className="text-base font-black text-slate-900 truncate">{zoomedPerson.name}</h4>
                <p className="text-xs text-slate-500 font-mono">NISN: {zoomedPerson.nisn || '-'} • Kelas {zoomedPerson.className || '-'}</p>
              </div>
              {canOperate && (
                <button
                  type="button"
                  onClick={() => {
                    onInspect(zoomedPerson, true, '');
                    setZoomedPerson(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase shrink-0 cursor-pointer"
                >
                  ✓ Cocok
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusDot({ status }) {
  if (status === 'verified') {
    return (
      <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
        <Check className="w-3.5 h-3.5 stroke-[3]" />
      </span>
    );
  }
  if (status === 'flagged') {
    return (
      <span className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm">
        <AlertTriangle className="w-3.5 h-3.5" />
      </span>
    );
  }
  return (
    <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center shrink-0">
      <CheckCircle2 className="w-3.5 h-3.5 opacity-40" />
    </span>
  );
}
