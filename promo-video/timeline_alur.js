// Timeline: "Alur Pendaftaran" (v2 Tactical Minimalism). Shared by scene_alur.js (browser) and audio_alur.mjs (node).
// 120 BPM -> beat 0.5 s. Every cut lands on a beat.
(function () {
  const T = {};
  T.fps = 30; T.dur = 40; T.beat = 0.5;
  T.cuts = [3, 6.5, 12.5, 20, 26, 34];   // hook | portal | akun+danton | bayar | pakta+verif | roster | cta

  const eOut3 = x => 1 - Math.pow(1 - x, 3);
  T.odo = (n, t0, d) => t => n * eOut3(Math.min(1, Math.max(0, (t - t0) / d)));

  T.hook = { l: [0, 0.35, 0.8, 1.15], sub: 1.6 };
  T.portal = { logo: 3.1, url: 3.5, btn: 3.9, cursor: [4.2, 4.75], click: 4.8, chips: 5.0, pick: [5.3, 5.5], note: 5.6 };
  T.akun = { modA: 6.6, email: 7.0, school: 7.6, upload: [8.0, 8.6], modB: 9.3, danton: 9.7, kartu: [10.1, 10.6], official: 10.85, wa: 11.15 };
  T.bayar = { title: 12.5, card: 12.75, logo: 13.0, rek0: 13.3, rekStep: 0.1, an: 14.5, berita: 15.0, tiers: [15.75, 16.25], hl: [17.0, 17.5], tag: 18.0, note: 18.5 };
  T.pakta = { upload: [20.3, 20.9], sign: [21.2, 22.2], code: [22.5, 23.1], verif: [23.4, 24.4], lock: 24.75, status: 25.1 };
  T.roster = { login: 26.1, title: 26.3, danton: 26.6, inti0: 26.8, step: 0.06, cad: [28.2, 28.3, 28.4], call: 28.6, table: 29.4, rows: [29.7, 30.0, 30.3], photos: [31.0, 31.4], notice: 32.0 };
  T.cta = { l1: 34.0, l2: 34.25, bar: 34.6, qr: [35.0, 35.5], lock: 35.9, scan: 36.1, rows: [36.4, 36.6, 36.8] };

  // derived SFX events
  T.shutters = [...T.cuts, T.portal.click, T.pakta.lock, T.cta.lock];
  T.slides = [T.akun.modA, T.akun.modB, T.bayar.card, ...T.bayar.tiers, T.pakta.sign[0] - .2, T.roster.table, ...T.roster.photos];
  T.typeRuns = [ // [start, chars] mono type-on ticks (48 cps)
    [T.portal.url, 30], [T.akun.email, 22], [T.akun.school, 16], [T.akun.danton, 19], [T.akun.official, 13], [T.akun.wa, 14],
    [T.bayar.an, 27], [T.bayar.berita, 27], [T.roster.login, 30]];
  T.rekTicks = []; for (let i = 0; i < 10; i++) T.rekTicks.push(T.bayar.rek0 + i * T.bayar.rekStep);
  T.snaps = [T.roster.danton]; for (let i = 0; i < 21; i++) T.snaps.push(T.roster.inti0 + i * T.roster.step);
  T.cadSnaps = T.roster.cad.slice();
  T.uploads = [T.akun.upload, T.akun.kartu, T.pakta.upload];
  T.dings = [...T.bayar.hl, T.pakta.code[1]];
  T.rowTicks = [T.portal.pick[0], T.portal.pick[1], T.bayar.tag, ...T.roster.rows, T.roster.notice, ...T.cta.rows];

  if (typeof module !== 'undefined') module.exports = T; else window.T = T;
})();
