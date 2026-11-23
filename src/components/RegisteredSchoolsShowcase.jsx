import React, { useMemo, useState } from 'react';
import { useCompetition } from '../context/CompetitionContext.jsx';
import { formatImageUrl, getFallbackImageUrl } from '../services/sheetService.js';

/**
 * Normalisasi nama sekolah untuk menggabungkan 2 peleton dari 1 sekolah menjadi 1 entri unik.
 */
function cleanSchoolBaseName(rawName) {
  return String(rawName || '')
    .trim()
    .replace(/\s*[-–—]?\s*\(?\b(TIM|PELETON|REGU|PASUKAN)\s*[A-D1-2]\b\)?$/i, '')
    .replace(/\s+[A-B]$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function isTestingSchool(team, baseName) {
  if (!team || team.isDummy) return true;
  const combined = `${team.schoolName || ''} ${team.schoolBaseName || ''} ${baseName || ''}`.toUpperCase();
  return /\b(TESTING|TEST|DUMMY|COBA)\b/.test(combined);
}

function SchoolLogoImage({ school, sizeClass = 'w-10 h-10', onBroken }) {
  const [imgSrc, setImgSrc] = useState(() => (school.logoUrl ? formatImageUrl(school.logoUrl) : ''));
  const [triedFallback, setTriedFallback] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!imgSrc || failed) return null;

  return (
    <img
      src={imgSrc}
      alt={`Logo ${school.name}`}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (!triedFallback && school.logoUrl) {
          const fallback = getFallbackImageUrl(school.logoUrl);
          if (fallback && fallback !== imgSrc) {
            setTriedFallback(true);
            setImgSrc(fallback);
            return;
          }
        }
        setFailed(true);
        if (onBroken) onBroken(school.key);
      }}
      className={`${sizeClass} object-contain shrink-0 select-none`}
    />
  );
}

/**
 * Menampilkan daftar logo sekolah yang telah mendaftar (deduplikasi: 2 peleton 1 sekolah = 1 logo).
 * - variant="strip": Strip marquee pelan & tenang (cocok di bawah Hero).
 * - variant="grid": Daftar logo rapi dengan filter jenjang (cocok di bawah Slot Kuota).
 */
export default function RegisteredSchoolsShowcase({ variant = 'strip' }) {
  const { teams } = useCompetition();
  const [brokenKeys, setBrokenKeys] = useState({});

  const markBroken = (key) => {
    setBrokenKeys(prev => (prev[key] ? prev : { ...prev, [key]: true }));
  };

  const uniqueSchools = useMemo(() => {
    const map = new Map();
    const REGISTERED_STATUSES = new Set(['registered', 'verified', 'drawn']);
    const activeTeams = (teams || []).filter(t => t && REGISTERED_STATUSES.has(t.status));

    activeTeams.forEach(team => {
      const jenjang = String(team.jenjang || 'SMP').toUpperCase();
      const baseName = cleanSchoolBaseName(team.schoolBaseName || team.schoolName || '');
      if (!baseName || isTestingSchool(team, baseName)) return;

      const key = `${jenjang}::${baseName.toUpperCase()}`;
      const rawLogo = team.files?.schoolLogo?.url;
      const validLogo = rawLogo && rawLogo !== '#' ? rawLogo : '';

      if (map.has(key)) {
        const existing = map.get(key);
        existing.platoonCount += 1;
        if (!existing.logoUrl && validLogo) {
          existing.logoUrl = validLogo;
        }
      } else {
        map.set(key, {
          key,
          name: baseName,
          jenjang,
          logoUrl: validLogo,
          platoonCount: 1,
        });
      }
    });

    return Array.from(map.values())
      .filter(s => Boolean(s.logoUrl) && !brokenKeys[s.key])
      .sort((a, b) => {
        if (a.jenjang !== b.jenjang) return a.jenjang === 'SD' ? -1 : 1;
        return a.name.localeCompare(b.name, 'id');
      });
  }, [teams, brokenKeys]);

  if (uniqueSchools.length === 0) return null;

  // =========================================================================
  // VARIANT 1: STRIP MARQUEE HALUS (DI BAWAH HERO) — LOGO SAJA
  // =========================================================================
  if (variant === 'strip') {
    const shouldAnimate = uniqueSchools.length >= 6;
    const marqueeDuration = `${Math.max(24, uniqueSchools.length * 2.4)}s`;
    const displayItems = shouldAnimate ? [...uniqueSchools, ...uniqueSchools] : uniqueSchools;

    return (
      <section
        aria-label="Logo Sekolah Terdaftar LBB Mu'allimin 2027"
        className="bg-slate-950 border-y border-white/[0.06] py-5 sm:py-6 overflow-hidden relative font-sans"
      >
        <div className="container mx-auto px-6 mb-3.5">
          <p className="text-center text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Sekolah Terdaftar · <span className="text-slate-200">{uniqueSchools.length} Kontingen Se-DIY</span>
          </p>
        </div>

        <div className="relative lbb-marquee-wrap">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-slate-950 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-slate-950 to-transparent z-10" />

          {shouldAnimate ? (
            <div
              className="lbb-marquee-track items-center gap-8 sm:gap-11 px-6"
              style={{ '--marquee-duration': marqueeDuration }}
            >
              {displayItems.map((school, idx) => (
                <div
                  key={`${school.key}-${idx}`}
                  title={`${school.name} (${school.jenjang === 'SD' ? 'SD/MI' : 'SMP/MTs'})`}
                  className="inline-flex items-center justify-center shrink-0 opacity-85 hover:opacity-100 hover:scale-110 transition-all duration-200"
                >
                  <SchoolLogoImage
                    school={school}
                    sizeClass="w-10 h-10 sm:w-11 sm:h-11 drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]"
                    onBroken={markBroken}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-7 sm:gap-10 px-6">
              {uniqueSchools.map(school => (
                <div
                  key={school.key}
                  title={`${school.name} (${school.jenjang === 'SD' ? 'SD/MI' : 'SMP/MTs'})`}
                  className="inline-flex items-center justify-center shrink-0 opacity-85 hover:opacity-100 hover:scale-110 transition-all duration-200"
                >
                  <SchoolLogoImage
                    school={school}
                    sizeClass="w-10 h-10 sm:w-11 sm:h-11 drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]"
                    onBroken={markBroken}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  // =========================================================================
  // VARIANT 2: DERETAN LOGO SIMPLE & BERSIH (DI BAWAH SLOT KUOTA)
  // =========================================================================
  return (
    <div className="max-w-5xl mx-auto mb-12 sm:mb-16 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 mb-5">
        Sekolah Terdaftar · <span className="text-slate-200">{uniqueSchools.length} Kontingen</span>
      </p>

      <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-7">
        {uniqueSchools.map(school => (
          <div
            key={school.key}
            title={`${school.name} · ${school.jenjang === 'SD' ? 'SD/MI' : 'SMP/MTs'}${
              school.platoonCount > 1 ? ` (${school.platoonCount} Peleton)` : ''
            }`}
            className="inline-flex items-center justify-center opacity-85 hover:opacity-100 hover:scale-110 transition-all duration-200"
          >
            <SchoolLogoImage
              school={school}
              sizeClass="w-11 h-11 sm:w-12 sm:h-12 drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]"
              onBroken={markBroken}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
