import React from 'react';
import medalGoldImg from '../../assets/medali/emas.png';
import medalSilverImg from '../../assets/medali/perak.png';
import medalBronzeImg from '../../assets/medali/perunggu.png';
import medalHarapan1Img from '../../assets/medali/harapan1.png';
import medalHarapan2Img from '../../assets/medali/harapan2.png';
import medalHarapan3Img from '../../assets/medali/harapan3.png';

export const MEDAL_IMAGES = {
  1: medalGoldImg,
  2: medalSilverImg,
  3: medalBronzeImg,
  4: medalHarapan1Img,
  5: medalHarapan2Img,
  6: medalHarapan3Img,
};

const DEFAULT_LABELS = {
  1: 'Medali Emas (Juara 1)',
  2: 'Medali Perak (Juara 2)',
  3: 'Medali Perunggu (Juara 3)',
  4: 'Medali Kaca (Juara Harapan 1)',
  5: 'Medali Besi (Juara Harapan 2)',
  6: 'Medali Kayu (Juara Harapan 3)',
};

export default function RankMedal({ rank, className = 'w-9 h-9', title }) {
  const src = MEDAL_IMAGES[rank];
  if (!src) return null;
  const defaultLabel = DEFAULT_LABELS[rank] || `Medali Peringkat ${rank}`;

  return (
    <img
      src={src}
      alt={title || defaultLabel}
      title={title || defaultLabel}
      loading="lazy"
      decoding="async"
      className={`${className} object-contain drop-shadow-[0_2px_4px_rgba(15,23,42,0.25)] select-none shrink-0`}
    />
  );
}
