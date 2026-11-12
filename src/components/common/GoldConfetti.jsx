import React, { useEffect, useRef, useState, useCallback } from 'react';

// Palet Emas Mewah (Juara Utama / Juara Umum)
const GOLD_COLORS = [
  '#FFD700', // Pure Gold
  '#F59E0B', // Amber
  '#FBBF24', // Bright Gold
  '#FDE047', // Light Gold
  '#FEF08A', // Champagne
  '#D97706', // Bronze Gold
  '#FFFFFF', // White Sparkle
  '#F3C64F', // Royal Yellow Gold
];

// Palet Perak Elegan (Juara Harapan)
const SILVER_COLORS = [
  '#FFFFFF', // Pure White Sparkle
  '#F8FAFC', // Crisp Platinum
  '#F1F5F9', // Bright Silver
  '#E2E8F0', // Soft Silver
  '#CBD5E1', // Metallic Silver
  '#94A3B8', // Deep Chrome
  '#BAE6FD', // Ice Sky Shimmer
  '#7DD3FC', // Frost Crystal
];

/**
 * Komponen Confetti Hujan (Rain Animation) Terisolasi di Dalam Wadah Kartu/Podium
 * - variant: 'gold' (Piala Utama / Umum) | 'silver' (Juara Harapan)
 * - duration: kurleb 15 detik (default 15000ms)
 * - Turun seperti hujan lembut (rain fall) dari atas wadah dengan 3D fluttering
 */
export default function GoldConfetti({ 
  variant = 'gold',
  duration = 15000,
  maxParticles = 95,
  autoFire = true,
  onComplete
}) {
  const canvasRef = useRef(null);
  const [isActive, setIsActive] = useState(autoFire);

  const colors = variant === 'silver' ? SILVER_COLORS : GOLD_COLORS;

  const startRain = useCallback(() => {
    setIsActive(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (!container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Hitung ukuran wadah pembungkus
    let width = 0;
    let height = 0;

    const syncSize = () => {
      if (!canvas || !container) return;
      const rect = container.getBoundingClientRect();
      width = canvas.width = Math.max(200, Math.floor(rect.width || container.clientWidth || 800));
      height = canvas.height = Math.max(150, Math.floor(rect.height || container.clientHeight || 500));
    };

    syncSize();

    let resizeObserver = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => syncSize());
      resizeObserver.observe(container);
    }
    window.addEventListener('resize', syncSize);

    // Generator partikel confetti
    function createParticle(initialY = null) {
      const isStar = Math.random() > 0.8;
      const sizeW = Math.random() * 5 + 5; // 5 - 10px
      const sizeH = isStar ? sizeW : sizeW * (Math.random() * 0.8 + 1.2); // 8 - 18px

      return {
        x: Math.random() * width,
        y: initialY !== null ? initialY : (Math.random() * -height * 0.8) - 10,
        vy: Math.random() * 1.8 + 1.2, // Kecepatan jatuh hujan lembut (1.2 - 3.0 px/frame)
        sway: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.04 + 0.02,
        swayAmp: Math.random() * 1.2 + 0.4,
        sizeW,
        sizeH,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 4,
        tiltAngle: Math.random() * Math.PI,
        tiltSpeed: Math.random() * 0.07 + 0.03,
        isStar,
        opacity: Math.random() * 0.35 + 0.65, // 0.65 - 1.0
      };
    }

    // Buat batch awal partikel terdistribusi dari atas wadah
    const particles = [];
    for (let i = 0; i < maxParticles; i++) {
      // Sebar sebagian di atas dan sebagian di area atas panggung
      const startY = (Math.random() * -height * 0.9) + (Math.random() * height * 0.4) - 20;
      particles.push(createParticle(startY));
    }

    const startTime = Date.now();
    let animationFrameId;

    function render() {
      const elapsed = Date.now() - startTime;

      // Selesai setelah durasi 15 detik
      if (elapsed > duration) {
        ctx.clearRect(0, 0, width, height);
        setIsActive(false);
        if (resizeObserver) resizeObserver.disconnect();
        window.removeEventListener('resize', syncSize);
        if (onComplete) onComplete();
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Memudar mulus di 2.5 detik terakhir
      const fadeProgress = Math.max(0, (elapsed - (duration - 2500)) / 2500);
      const globalOpacity = Math.max(0, 1 - fadeProgress);

      const canRespawn = elapsed < (duration - 2500);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Gravitasi & gerak mengayun seperti hujan melayang
        p.y += p.vy;
        p.sway += p.swaySpeed;
        p.x += Math.sin(p.sway) * p.swayAmp;

        p.rotation += p.rotationSpeed;
        p.tiltAngle += p.tiltSpeed;

        // Jika jatuh melebihi dasar wadah
        if (p.y > height + 25) {
          if (canRespawn) {
            // Respawn di atas wadah agar hujan terus mengalir selama 15 detik
            p.y = -20 - (Math.random() * 30);
            p.x = Math.random() * width;
            p.color = colors[Math.floor(Math.random() * colors.length)];
            p.vy = Math.random() * 1.8 + 1.2;
          } else {
            continue; // Biarkan habis di akhir durasi
          }
        }

        const tilt = Math.cos(p.tiltAngle);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.scale(tilt, 1);

        ctx.globalAlpha = p.opacity * globalOpacity;
        ctx.fillStyle = p.color;

        if (p.isStar) {
          // Bintang berkilau 4 sudut
          ctx.beginPath();
          const s = p.sizeW * 0.9;
          ctx.moveTo(0, -s);
          ctx.lineTo(s * 0.3, -s * 0.3);
          ctx.lineTo(s, 0);
          ctx.lineTo(s * 0.3, s * 0.3);
          ctx.lineTo(0, s);
          ctx.lineTo(-s * 0.3, s * 0.3);
          ctx.lineTo(-s, 0);
          ctx.lineTo(-s * 0.3, -s * 0.3);
          ctx.closePath();
          ctx.fill();
        } else {
          // Pita confetti halus persegi panjang
          ctx.fillRect(-p.sizeW / 2, -p.sizeH / 2, p.sizeW, p.sizeH);
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener('resize', syncSize);
    };
  }, [duration, maxParticles, colors, onComplete]);

  useEffect(() => {
    if (autoFire) {
      const cleanup = startRain();
      return cleanup;
    }
  }, [autoFire, startRain]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      aria-hidden="true"
    />
  );
}
