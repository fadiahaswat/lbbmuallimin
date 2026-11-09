import {
  useRef,
  useState,
  type ChangeEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

type IconName =
  | "grid"
  | "card"
  | "users"
  | "file"
  | "chart"
  | "calendar"
  | "clock"
  | "pin"
  | "check"
  | "arrow"
  | "bell"
  | "logout"
  | "menu"
  | "shield"
  | "upload"
  | "download"
  | "print"
  | "edit"
  | "home"
  | "phone"
  | "close";

const iconPaths: Record<IconName, ReactNode> = {
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M3 10h18M7 15h4" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  file: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M8 13h8M8 17h6" />
    </>
  ),
  chart: (
    <>
      <path d="M4 19V9M10 19V5M16 19v-7M22 19H2" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M16 3v4M8 3v4M3 11h18" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  arrow: (
    <>
      <path d="M5 12h14M14 7l5 5-5 5" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
    </>
  ),
  logout: (
    <>
      <path d="M10 17l5-5-5-5M15 12H3M21 19V5a2 2 0 0 0-2-2h-6" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </>
  ),
  shield: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-5" />
    </>
  ),
  upload: (
    <>
      <path d="M12 16V4M7 9l5-5 5 5" />
      <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </>
  ),
  download: (
    <>
      <path d="M12 4v12M7 11l5 5 5-5" />
      <path d="M4 20h16" />
    </>
  ),
  print: (
    <>
      <path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </>
  ),
  edit: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z" />
    </>
  ),
  home: (
    <>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v11h14V10M9 21v-7h6v7" />
    </>
  ),
  phone: (
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.8 2.1z" />
  ),
  close: <path d="M18 6 6 18M6 6l12 12" />,
};

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {iconPaths[name]}
    </svg>
  );
}

const portalNavItems = [
  { id: "overview", label: "Beranda", icon: "home", badge: "" },
  { id: "idcard", label: "ID Card", icon: "grid", badge: "02" },
  { id: "roster", label: "Personel", icon: "users", badge: "22" },
  { id: "documents", label: "Berkas", icon: "file", badge: "6" },
] as const;

const competitionNavItems = [
  { id: "ucl", label: "UCL", icon: "pin", badge: "05" },
  { id: "scores", label: "Rekap Nilai", icon: "chart", badge: "06" },
  { id: "standings", label: "Klasemen", icon: "chart", badge: "07" },
] as const;

const schedules = {
  tm: {
    eyebrow: "TECHNICAL MEETING",
    date: "09 JAN 2027",
    day: "Sabtu",
    time: "13.00 WIB — Selesai",
    place: "Aula Kampus Induk Mu’allimin, Wirobrajan",
    note: "Wajib dihadiri 1 Pembina dan 1 Danton untuk validasi fisik berkas.",
  },
  trial: {
    eyebrow: "UJI LAPANGAN",
    date: "16 JAN 2027",
    day: "Sabtu",
    time: "07.00 — 13.00 WIB",
    place: "Kampus Terpadu Mu’allimin, Sedayu",
    note: "Orientasi arena, jalur masuk, titik kumpul, dan simulasi alur tampil.",
  },
  competition: {
    eyebrow: "HARI PERLOMBAAN",
    date: "24 JAN 2027",
    day: "Ahad",
    time: "06.00 — 17.00 WIB",
    place: "Kampus Terpadu Mu’allimin, Sedayu",
    note: "Daftar ulang, upacara pembukaan, pemeriksaan DP, dan penampilan arena.",
  },
};

function StatusPill({ children, muted = false }: { children: ReactNode; muted?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[.08em] ${muted ? "bg-slate-100 text-slate-500" : "bg-emerald-50 text-emerald-700"}`}
    >
      {!muted && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
      {children}
    </span>
  );
}

function AgendaContent({ onOpenPact }: { onOpenPact?: () => void }) {
  const [agenda, setAgenda] = useState<"tm" | "trial" | "competition">("tm");
  const [attendance, setAttendance] = useState<"pending" | "yes" | "no">("pending");
  const [vehicles, setVehicles] = useState({
    tm: { motor: 0, car: 0 },
    competition: { motor: 0, car: 0, minibus: 0, bus: 0 },
  });
  const event = {
    tm: {
      date: "SABTU, 9 JANUARI 2027",
      time: "13.00 WIB s.d. Selesai",
      title: "Technical Meeting & Validasi Fisik Berkas",
      copy: "Wajib dihadiri 1 Pembina dan 1 Danton. Agenda pengambilan nomor dada & pengundian nomor urut tampil peleton.",
      theme: "border-purple-200 bg-purple-50/60",
      badge: "bg-purple-100 text-purple-700",
      button: "bg-purple-600 hover:bg-purple-700",
    },
    trial: {
      date: "SABTU, 16 JANUARI 2027",
      time: "07.00 WIB s.d. 13.00 WIB",
      title: "Uji Coba Lapangan (UCL) & Orientasi Arena",
      copy: "Pengenalan pos arena perlombaan, pos DP 1, DP 2, dan area steril demi kesiapan teknis peleton.",
      theme: "border-emerald-200 bg-emerald-50/60",
      badge: "bg-emerald-100 text-emerald-700",
      button: "bg-emerald-600 hover:bg-emerald-700",
    },
    competition: {
      date: "AHAD, 24 JANUARI 2027",
      time: "06.00 WIB s.d. 17.00 WIB",
      title: "Hari-H Pelaksanaan LBB Mu’allimin 2027",
      copy: "Daftar ulang mulai 06.00 WIB, dilanjutkan upacara pembukaan dan perlombaan di lapangan utama.",
      theme: "border-red-200 bg-red-50/60",
      badge: "bg-red-100 text-red-700",
      button: "bg-red-600 hover:bg-red-700",
    },
  }[agenda];
  const phase = {
    tm: { number: "01", day: "09", month: "JAN", label: "Technical Meeting", accent: "purple" },
    trial: { number: "02", day: "16", month: "JAN", label: "Uji Coba Lapangan", accent: "emerald" },
    competition: { number: "03", day: "24", month: "JAN", label: "Hari Perlombaan", accent: "red" },
  }[agenda];

  const updateVehicle = (scope: "tm" | "competition", key: string, delta: number) => {
    setVehicles((current) => ({
      ...current,
      [scope]: {
        ...current[scope],
        [key]: Math.max(0, (current[scope] as Record<string, number>)[key] + delta),
      },
    }));
  };

  const VehicleSurvey = ({ scope }: { scope: "tm" | "competition" }) => {
    const items =
      scope === "tm"
        ? [
            ["motor", "Sepeda Motor", "Roda Dua (Parkir Motor)"],
            ["car", "Mobil Pribadi", "Sedan / MPV / SUV"],
          ]
        : [
            ["motor", "Sepeda Motor", "Suporter & Official"],
            ["car", "Mobil Pribadi", "Kendaraan guru & pendamping"],
            ["minibus", "Minibus / Elf / HiAce", "Elf kontingen (12–19 seat)"],
            ["bus", "Big / Medium Bus", "Bus besar rombongan (30–50+ seat)"],
          ];
    const total = Object.values(vehicles[scope]).reduce((sum, value) => sum + value, 0);
    const isTm = scope === "tm";
    return (
      <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-white">
        <div
          className={`flex flex-col gap-4 border-b px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 ${isTm ? "border-purple-100 bg-purple-50/60" : "border-red-100 bg-red-50/60"}`}
        >
          <div className="flex items-start gap-3">
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isTm ? "bg-purple-600 text-white" : "bg-red-600 text-white"}`}
            >
              <Icon name="card" size={17} />
            </span>
            <div>
              <p
                className={`text-[9px] font-black uppercase tracking-[.13em] ${isTm ? "text-purple-800" : "text-red-800"}`}
              >
                Mobilitas kontingen
              </p>
              <h3 className="mt-1 text-xs font-black text-slate-950">
                {isTm ? "Estimasi kendaraan saat TM" : "Survei kendaraan Hari-H"}
              </h3>
              <p className="mt-1 text-[9px] leading-relaxed text-slate-500">
                Data digunakan untuk alokasi parkir dan stiker keamanan.
              </p>
            </div>
          </div>
          <div className="flex min-w-[92px] items-center justify-between rounded-xl border border-white bg-white/80 px-3 py-2 shadow-sm sm:block sm:text-right">
            <span className="text-[8px] font-black uppercase tracking-wider text-slate-400">
              Total unit
            </span>
            <p className="text-xl font-black tracking-tight text-slate-950">
              {total}
              <span className="ml-1 text-[9px] font-bold text-slate-400">unit</span>
            </p>
          </div>
        </div>
        <div className="grid gap-2 p-3 sm:grid-cols-2 sm:p-4">
          {items.map(([key, label, note]) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-3 transition hover:border-slate-300 hover:bg-white"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm ring-1 ring-slate-200">
                  <Icon name={key === "motor" ? "home" : "card"} size={15} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[10px] font-black text-slate-900">{label}</p>
                  <p className="truncate text-[8px] text-slate-400">{note}</p>
                </div>
              </div>
              <div className="ml-2 flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-white p-0.5">
                <button
                  aria-label={`Kurangi ${label}`}
                  onClick={() => updateVehicle(scope, key, -1)}
                  className="h-7 w-7 rounded-md text-xs font-black text-slate-500 transition hover:bg-slate-100"
                >
                  −
                </button>
                <span className="w-6 text-center text-[10px] font-black">
                  {(vehicles[scope] as Record<string, number>)[key]}
                </span>
                <button
                  aria-label={`Tambah ${label}`}
                  onClick={() => updateVehicle(scope, key, 1)}
                  className={`h-7 w-7 rounded-md text-xs font-black text-white transition ${isTm ? "bg-purple-600 hover:bg-purple-700" : "bg-red-600 hover:bg-red-700"}`}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_18px_46px_rgba(15,23,42,.065)]">
      <div className="border-b border-slate-100 bg-gradient-to-r from-white via-white to-slate-50/80 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg">
              <Icon name="calendar" size={19} />
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-red-600" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <p className="section-kicker">OPERATION TIMELINE</p>
                <span className="rounded-full bg-red-50 px-2 py-0.5 text-[8px] font-black text-red-700">
                  WAJIB
                </span>
              </div>
              <h2 className="mt-1 text-base font-black tracking-tight text-slate-950 sm:text-lg">
                Agenda Kontingen 2027
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[8px] font-black uppercase tracking-[.12em] text-slate-500">
              Timeline aktif · 3 tahap
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="rounded-[20px] border border-slate-200 bg-slate-50/80 p-2">
          <div className="relative grid grid-cols-3 gap-1">
            <div className="absolute left-[16%] right-[16%] top-6 hidden h-px bg-slate-200 sm:block" />
            {(
              [
                ["tm", "01", "Technical Meeting", "09 Jan", "purple"],
                ["trial", "02", "Uji Coba", "16 Jan", "emerald"],
                ["competition", "03", "Hari-H", "24 Jan", "red"],
              ] as const
            ).map(([key, number, label, date, tone]) => {
              const active = agenda === key;
              const dot = {
                purple: "bg-purple-600",
                emerald: "bg-emerald-600",
                red: "bg-red-600",
              }[tone];
              return (
                <button
                  key={key}
                  onClick={() => setAgenda(key)}
                  className={`relative z-10 flex min-h-[70px] flex-col items-center justify-center rounded-2xl px-2 py-2 text-center transition sm:flex-row sm:gap-3 sm:text-left ${active ? "bg-white text-slate-950 shadow-[0_8px_22px_rgba(15,23,42,.09)] ring-1 ring-slate-200" : "text-slate-500 hover:bg-white/70"}`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-[8px] font-black transition ${active ? `${dot} text-white shadow-md` : "border border-slate-200 bg-white text-slate-400"}`}
                  >
                    {active ? <Icon name="check" size={12} /> : number}
                  </span>
                  <span className="mt-1.5 min-w-0 sm:mt-0">
                    <span
                      className={`block truncate text-[8px] font-black sm:text-[9px] ${active ? "text-slate-950" : "text-slate-500"}`}
                    >
                      {label}
                    </span>
                    <span className="mt-0.5 block text-[8px] text-slate-400">{date} 2027</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative mt-4 overflow-hidden rounded-[24px] bg-slate-950 text-white shadow-[0_18px_38px_rgba(15,23,42,.2)]">
          <div
            className={`absolute inset-y-0 left-0 w-1.5 ${agenda === "tm" ? "bg-purple-500" : agenda === "trial" ? "bg-emerald-500" : "bg-red-500"}`}
          />
          <div
            className={`absolute -right-16 -top-24 h-64 w-64 rounded-full blur-3xl ${agenda === "tm" ? "bg-purple-600/20" : agenda === "trial" ? "bg-emerald-600/20" : "bg-red-600/20"}`}
          />
          <div className="relative grid gap-5 p-5 sm:grid-cols-[88px_minmax(0,1fr)_auto] sm:items-center sm:p-6">
            <div className="hidden border-r border-white/10 pr-5 text-center sm:block">
              <p className="text-[9px] font-black tracking-[.2em] text-slate-500">{phase.month}</p>
              <p className="mt-1 text-4xl font-black tracking-[-.06em] text-white">{phase.day}</p>
              <p className="mt-1 text-[8px] font-bold text-slate-500">2027</p>
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-[8px] font-black uppercase tracking-wider ${event.badge}`}
                >
                  Tahap {phase.number} · {phase.label}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[.06] px-2.5 py-1 text-[8px] font-bold text-slate-300">
                  {event.time}
                </span>
              </div>
              <h3 className="mt-4 max-w-2xl text-xl font-black leading-tight tracking-[-.025em] text-white sm:text-2xl">
                {event.title}
              </h3>
              <p className="mt-2 max-w-2xl text-[10px] leading-relaxed text-slate-400">
                {event.copy}
              </p>
            </div>
            <a
              href="https://maps.google.com/?q=Madrasah+Muallimin+Muhammadiyah+Yogyakarta"
              target="_blank"
              rel="noreferrer"
              className={`inline-flex shrink-0 items-center justify-center gap-2 self-end rounded-xl px-4 py-3 text-[9px] font-black text-white shadow-lg sm:self-center ${event.button}`}
            >
              <Icon name="pin" size={14} /> {agenda === "trial" ? "Buka Lokasi" : "Buka Rute"}
            </a>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {agenda === "tm" && (
            <>
              <div className="grid gap-3 md:grid-cols-[.75fr_1.25fr]">
                <div className="relative overflow-hidden rounded-[20px] border border-purple-100 bg-purple-50/60 p-4">
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full border-[16px] border-purple-600/[.04]" />
                  <div className="relative flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-sm font-black text-white shadow-[0_8px_18px_rgba(147,51,234,.2)]">
                      #
                    </span>
                    <div className="min-w-0">
                      <p className="text-[8px] font-black uppercase tracking-wider text-purple-700">
                        Hasil undian tampil
                      </p>
                      <p className="mt-1 text-[10px] font-black text-slate-900">
                        Belum melakukan undian
                      </p>
                      <p className="mt-1 text-[8px] text-slate-500">Nomor terbit setelah sesi TM</p>
                    </div>
                  </div>
                </div>
                <LocationCard
                  campus="Aula Kampus Induk Mu’allimin Yogyakarta"
                  address="Jl. Letjen S. Parman No. 68, Wirobrajan, Kota Yogyakarta"
                  color="text-purple-600"
                />
              </div>
              <div className="flex flex-col gap-3 rounded-[20px] border border-slate-200 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                    <Icon name="shield" size={18} />
                  </span>
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-[.13em] text-red-700">
                      Dokumen wajib
                    </p>
                    <p className="mt-1 text-[10px] font-black text-slate-900">
                      Pakta Integritas Fisik
                    </p>
                    <p className="mt-1 text-[8px] leading-relaxed text-slate-500">
                      Cetak, tandatangani basah, dan bawa saat registrasi TM.
                    </p>
                  </div>
                </div>
                <button onClick={onOpenPact} className="primary-button shrink-0">
                  <Icon name="download" size={14} /> Unduh Pakta
                </button>
              </div>
              <VehicleSurvey scope="tm" />
              <AgendaMap />
            </>
          )}

          {agenda === "trial" && (
            <div className="grid gap-3 md:grid-cols-[1.1fr_.9fr]">
              <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-white">
                <div className="border-b border-slate-100 bg-emerald-50/60 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-[.13em] text-emerald-700">
                        RSVP KONTINGEN
                      </p>
                      <p className="mt-1 text-[10px] font-black">Konfirmasi Kehadiran UCL</p>
                    </div>
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[8px] font-black ${attendance === "yes" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : attendance === "no" ? "border-red-200 bg-red-50 text-red-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}
                    >
                      {attendance === "yes"
                        ? "HADIR"
                        : attendance === "no"
                          ? "TIDAK HADIR"
                          : "BELUM KONFIRMASI"}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-[9px] leading-relaxed text-slate-500">
                    Konfirmasi maksimal{" "}
                    <strong className="text-slate-700">10 Januari 2027, 23.59 WIB</strong>.
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => setAttendance("yes")}
                      className={
                        attendance === "yes" ? "primary-button !bg-emerald-600" : "secondary-button"
                      }
                    >
                      Hadir
                    </button>
                    <button
                      onClick={() => setAttendance("no")}
                      className={attendance === "no" ? "primary-button" : "secondary-button"}
                    >
                      Tidak Hadir
                    </button>
                  </div>
                </div>
              </div>
              <LocationCard
                campus="Kampus Terpadu Mu’allimin Yogyakarta"
                address="Bandut Lor, Argorejo, Sedayu, Bantul"
                color="text-emerald-600"
              />
            </div>
          )}

          {agenda === "competition" && (
            <>
              <div className="grid gap-3 md:grid-cols-[1.1fr_.9fr]">
                <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-white">
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5">
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-[.13em] text-red-700">
                        Competition flow
                      </p>
                      <p className="mt-1 text-[10px] font-black text-slate-950">
                        Rundown alur tampil
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-950 px-2.5 py-1 text-[8px] font-black text-white">
                      Arena 01
                    </span>
                  </div>
                  <div className="flex items-start px-4 py-4">
                    {[
                      ["01", "Daftar ulang"],
                      ["02", "Persiapan arena"],
                      ["03", "Waktu tampil"],
                    ].map(([number, label], index) => (
                      <div key={number} className="flex flex-1 items-start">
                        <div className="min-w-0 flex-1 text-center">
                          <span
                            className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-[8px] font-black ${index === 0 ? "bg-red-600 text-white" : "bg-slate-100 text-slate-400"}`}
                          >
                            {number}
                          </span>
                          <p className="mt-2 text-[8px] font-bold text-slate-600">{label}</p>
                        </div>
                        {index < 2 && <span className="mt-3.5 h-px w-4 shrink-0 bg-slate-200" />}
                      </div>
                    ))}
                  </div>
                  <div className="mx-4 mb-4 flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-[8px] font-semibold text-amber-800">
                    <Icon name="clock" size={13} /> Jadwal detail aktif setelah undian TM
                  </div>
                </div>
                <LocationCard
                  campus="Kampus Terpadu Mu’allimin Yogyakarta"
                  address="Bandut Lor, Argorejo, Sedayu, Bantul"
                  color="text-red-600"
                />
              </div>
              <VehicleSurvey scope="competition" />
              <AgendaMap />
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function LocationCard({
  campus,
  address,
  color,
}: {
  campus: string;
  address: string;
  color: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-[20px] border border-slate-200 bg-slate-50/60 p-4 transition hover:border-slate-300 hover:bg-white">
      <div className="absolute -bottom-10 -right-10 h-28 w-28 rounded-full border-[18px] border-slate-900/[.025]" />
      <div className="relative flex items-start gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200 ${color}`}
        >
          <Icon name="pin" size={18} />
        </span>
        <div className="min-w-0">
          <p className="text-[8px] font-black uppercase tracking-[.13em] text-slate-400">
            Lokasi agenda
          </p>
          <p className="mt-1 text-[10px] font-black text-slate-900">{campus}</p>
          <p className="mt-1 text-[9px] text-slate-500">{address}</p>
        </div>
      </div>
    </div>
  );
}

function AgendaMap() {
  return (
    <div className="relative h-64 overflow-hidden rounded-[20px] border border-slate-200 bg-slate-100 shadow-inner">
      <iframe
        title="Peta lokasi agenda"
        src="https://maps.google.com/maps?q=Madrasah+Muallimin+Muhammadiyah+Yogyakarta&t=&z=15&ie=UTF8&iwloc=&output=embed"
        className="h-full w-full border-0"
        loading="lazy"
      />
      <div className="absolute left-3 top-3 rounded-xl border border-white/80 bg-white/90 px-3 py-2 shadow-lg backdrop-blur">
        <p className="text-[8px] font-black uppercase tracking-[.12em] text-slate-400">
          Peta arena
        </p>
        <p className="mt-0.5 text-[9px] font-black text-slate-900">Kampus Mu’allimin</p>
      </div>
      <a
        href="https://maps.google.com/?q=Madrasah+Muallimin+Muhammadiyah+Yogyakarta"
        target="_blank"
        rel="noreferrer"
        className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-xl bg-slate-950/95 px-4 py-2.5 text-[9px] font-black text-white shadow-lg transition hover:bg-red-700"
      >
        <Icon name="pin" size={13} /> Mulai Navigasi Rute
      </a>
    </div>
  );
}

function Overview({
  onOpenPact,
  onSelectTab,
}: {
  onOpenPact?: () => void;
  onSelectTab?: (tab: string) => void;
}) {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,.045)]">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="section-kicker">RACE CONTROL</p>
            <h2 className="mt-1 text-base font-black tracking-tight text-slate-950">
              Status kompetisi
            </h2>
          </div>
          <div className="flex items-center gap-2 self-start rounded-full bg-amber-50 px-3 py-1.5 text-[9px] font-black uppercase tracking-[.12em] text-amber-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
            Menunggu Technical Meeting
          </div>
        </div>
        <div className="grid grid-cols-2 divide-x divide-y divide-slate-100 xl:grid-cols-4 xl:divide-y-0">
          {[
            ["01", "Nomor Dada", "Belum ditetapkan", "Diumumkan saat TM", "card", "emerald"],
            ["02", "Jadwal UCL", "Belum terbit", "Menunggu publikasi", "clock", "purple"],
            [
              "03",
              "Estimasi Tampil",
              "Belum tersedia",
              "Menunggu hasil undian",
              "calendar",
              "blue",
            ],
            ["04", "Basecamp", "Belum ditetapkan", "Diumumkan saat TM", "home", "amber"],
          ].map(([index, label, value, note, icon, tone]) => {
            const colors = {
              emerald: "bg-emerald-50 text-emerald-700",
              purple: "bg-purple-50 text-purple-700",
              blue: "bg-blue-50 text-blue-700",
              amber: "bg-amber-50 text-amber-700",
            }[tone];
            return (
              <div
                key={label}
                className="group relative min-h-[150px] p-4 transition hover:bg-slate-50/70 sm:p-5"
              >
                <div className="flex items-start justify-between">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${colors}`}>
                    <Icon name={icon as IconName} size={16} />
                  </span>
                  <span className="text-[9px] font-black tracking-[.14em] text-slate-300">
                    {index}
                  </span>
                </div>
                <p className="mt-4 text-[9px] font-black uppercase tracking-[.13em] text-slate-500">
                  {label}
                </p>
                <p className="mt-1 text-xs font-black text-slate-900">{value}</p>
                <p className="mt-1 text-[9px] font-semibold text-slate-400">{note}</p>
                <span className="absolute inset-x-5 bottom-0 h-0.5 origin-left scale-x-0 bg-red-600 transition-transform group-hover:scale-x-100" />
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.7fr)_320px]">
        <AgendaContent onOpenPact={onOpenPact} />

        <aside className="space-y-4 xl:sticky xl:top-24">
          <article className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_16px_38px_rgba(15,23,42,.07)]">
            <div className="relative overflow-hidden bg-slate-950 p-5 text-white">
              <div className="absolute -right-14 -top-20 h-44 w-44 rounded-full border-[28px] border-white/[.035]" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black tracking-[.16em] text-red-400">
                    READINESS SCORE
                  </p>
                  <h2 className="mt-1 text-base font-black tracking-tight">
                    Kontingen siap berlaga
                  </h2>
                  <p className="mt-1 text-[9px] font-medium text-slate-400">
                    Seluruh persyaratan utama terpenuhi
                  </p>
                </div>
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
                  <svg
                    className="absolute inset-0 h-full w-full -rotate-90"
                    viewBox="0 0 36 36"
                    aria-hidden="true"
                  >
                    <circle cx="18" cy="18" r="15" fill="none" stroke="#1e293b" strokeWidth="3" />
                    <circle
                      cx="18"
                      cy="18"
                      r="15"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                      strokeDasharray="94 94"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="text-[11px] font-black text-emerald-400">100%</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 p-4">
              {[
                ["Komandan", "M. Fadhil Arkananta"],
                ["Pasukan inti", "21 / 21"],
                ["Cadangan", "3 / 3"],
                ["Berkas", "6 / 6"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className={`${label === "Komandan" ? "col-span-2" : ""} rounded-xl border border-slate-100 bg-slate-50/80 p-3`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                      {label}
                    </span>
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <Icon name="check" size={9} />
                    </span>
                  </div>
                  <p className="mt-1.5 truncate text-[10px] font-black text-slate-800">{value}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 border-t border-slate-100 px-4 pb-4 pt-3">
              <button
                onClick={() => onSelectTab?.("roster")}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-red-700 px-3 py-2.5 text-[9px] font-black text-white transition hover:bg-red-800"
              >
                Kelola personel <Icon name="arrow" size={12} />
              </button>
              <button
                onClick={() => onSelectTab?.("documents")}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[9px] font-black text-slate-700 transition hover:border-slate-300"
              >
                Lihat berkas
              </button>
            </div>
          </article>

          <article className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-card">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <p className="section-kicker">RESOURCE DOCK</p>
                <h3 className="mt-1 text-sm font-black text-slate-950">Dokumen & bantuan</h3>
              </div>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <Icon name="grid" size={14} />
              </span>
            </div>
            <div className="space-y-2 p-3">
              <button
                onClick={() => onSelectTab?.("documents")}
                className="group flex w-full items-center gap-3 rounded-2xl bg-slate-950 p-3.5 text-left text-white transition hover:bg-slate-900"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-300/10 text-amber-300">
                  <Icon name="file" size={18} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[8px] font-black uppercase tracking-wider text-amber-300">
                    Dokumen resmi · PDF
                  </span>
                  <span className="mt-1 block truncate text-[10px] font-black">
                    Petunjuk Teknis LBB 2027
                  </span>
                </span>
                <span className="text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-white">
                  <Icon name="arrow" size={15} />
                </span>
              </button>
              <a
                href="https://wa.me/6281947491505"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3.5 transition hover:border-emerald-200 hover:bg-emerald-50"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-[0_7px_16px_rgba(5,150,105,.2)]">
                  <Icon name="phone" size={17} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[8px] font-black uppercase tracking-wider text-emerald-700">
                    WhatsApp panitia
                  </span>
                  <span className="mt-1 block text-[10px] font-black text-slate-900">
                    Ada kendala? Hubungi admin
                  </span>
                </span>
                <span className="text-emerald-700 transition group-hover:translate-x-0.5">
                  <Icon name="arrow" size={15} />
                </span>
              </a>
            </div>
          </article>
        </aside>
      </section>
    </div>
  );
}

function PanelHeader({
  title,
  description,
  icon,
  actions,
}: {
  title: string;
  description: string;
  icon: IconName;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3.5">
        <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg">
          <Icon name={icon} size={20} />
          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-red-600" />
        </span>
        <div>
          <p className="text-[8px] font-black uppercase tracking-[.18em] text-red-700">
            Portal Kontingen
          </p>
          <h2 className="mt-1 text-lg font-black tracking-[-.025em] text-slate-950 sm:text-xl">
            {title}
          </h2>
          <p className="mt-1 text-[10px] text-slate-500">{description}</p>
        </div>
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}

const qrRows = [
  "111111100101011111111",
  "100000101001010000001",
  "101110100111010111101",
  "101110101011010111101",
  "101110100101010111101",
  "100000101111010000001",
  "111111101010111111111",
  "000000001101000000000",
  "110011111001101011001",
  "001101001110010100110",
  "101011110101111010101",
  "010100001011000111010",
  "111001111101110011111",
  "000000001010100010100",
  "111111101110111010111",
  "100000100011100010010",
  "101110101101111111111",
  "101110100110001010010",
  "101110101011111011101",
  "100000101100100100011",
  "111111101011111101101",
];

function QrCode() {
  return (
    <div
      className="grid aspect-square w-full grid-cols-[repeat(21,minmax(0,1fr))] bg-white p-1"
      aria-label="QR peserta"
    >
      {qrRows.flatMap((row, y) =>
        [...row].map((cell, x) => (
          <span key={`${x}-${y}`} className={cell === "1" ? "bg-slate-950" : "bg-white"} />
        )),
      )}
    </div>
  );
}

function IdCardTab() {
  return (
    <section className="rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_46px_rgba(15,23,42,.06)] sm:p-7">
      <PanelHeader
        title="Credential & Tiket Registrasi"
        description="Tunjukkan QR kepada panitia saat check-in dan pembagian basecamp."
        icon="card"
        actions={
          <>
            <button
              onClick={() => setTimeout(() => window.print(), 50)}
              className="secondary-button"
            >
              <Icon name="print" size={15} /> Cetak
            </button>
            <button onClick={() => alert("QR peserta siap disimpan.")} className="primary-button">
              <Icon name="download" size={15} /> Unduh QR
            </button>
          </>
        }
      />
      <div className="mx-auto mt-7 max-w-4xl">
        <div className="relative overflow-hidden rounded-[30px] bg-slate-950 text-white shadow-[0_24px_60px_rgba(15,23,42,.24)]">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-red-700/15 blur-3xl" />
          <div className="absolute -bottom-28 right-10 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-7">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-[10px] font-black">
                L27
              </span>
              <div>
                <p className="text-[8px] font-black uppercase tracking-[.18em] text-amber-400">
                  Official participant credential
                </p>
                <p className="mt-0.5 text-[10px] font-black">LBB MU’ALLIMIN 2027</p>
              </div>
            </div>
            <span className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[8px] font-black uppercase tracking-wider text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Credential aktif
            </span>
          </div>
          <div className="relative grid lg:grid-cols-[minmax(0,1fr)_290px]">
            <div className="flex flex-col justify-between p-6 sm:p-8">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[.16em] text-slate-500">
                  Identitas peleton
                </p>
                <h3 className="mt-3 max-w-xl text-2xl font-black uppercase leading-[1.08] tracking-[-.035em] sm:text-3xl">
                  SD Muhammadiyah Sapen Yogyakarta
                </h3>
                <p className="mt-3 flex items-center gap-2 text-[10px] font-bold text-slate-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  Peleton Singo Menggolo · Jenjang SD
                </p>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4">
                {[
                  ["Kategori", "Homogen Putra"],
                  ["Urutan", "Belum TM"],
                  ["No. Dada", "—"],
                  ["Basecamp", "—"],
                ].map(([label, value]) => (
                  <div key={label} className="bg-slate-950/70 p-3">
                    <p className="text-[7px] font-black uppercase tracking-wider text-slate-500">
                      {label}
                    </p>
                    <p className="mt-1.5 truncate text-[9px] font-black text-white">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[8px] font-semibold text-slate-500">
                <span>VALID: 09–24 JAN 2027</span>
                <span>KAMPUS TERPADU SEDAYU</span>
              </div>
            </div>
            <div className="border-t border-white/10 bg-white/[.035] p-5 lg:border-l lg:border-t-0">
              <div className="mx-auto max-w-[230px] rounded-[22px] bg-white p-4 text-center shadow-2xl">
                <QrCode />
                <p className="mt-3 font-mono text-[11px] font-black tracking-[.12em] text-slate-950">
                  LBB27-SD-SAPEN
                </p>
                <div className="mt-2 flex items-center justify-center gap-1.5 text-[7px] font-black uppercase tracking-wider text-emerald-700">
                  <Icon name="shield" size={11} /> Scan untuk verifikasi
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            [
              "01",
              "Prosedur check-in",
              "Tunjukkan QR dan KTP official untuk menerima nomor dada serta perlengkapan.",
            ],
            [
              "02",
              "Prosedur check-out",
              "Pastikan basecamp bersih sebelum pengembalian kartu identitas kontingen.",
            ],
          ].map(([number, title, copy]) => (
            <div
              key={number}
              className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-[9px] font-black text-red-700 shadow-sm ring-1 ring-slate-200">
                {number}
              </span>
              <div>
                <p className="text-[9px] font-black text-slate-900">{title}</p>
                <p className="mt-1 text-[8px] leading-relaxed text-slate-500">{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const rosterNames = [
  "Farhan Al-Ghifari",
  "Bima Sakti Pratama",
  "Irfan Maulana",
  "Zaki Nur Rohman",
  "Naufal Dwi Cahyo",
  "Dimas Arya Putra",
  "Rifqi Hidayat",
  "Fajar Ramadhan",
  "Wildan Aditya",
  "Rendy Pangestu",
  "Ilham Kurniawan",
  "Daffa Ihsanudin",
  "Gibran Alamsyah",
  "Satria Bagaskara",
  "Hafidz Nur Syam",
  "Raka Mahendra",
  "Fauzan Akbar",
  "Reza Kurniawan",
  "Alif Fadillah",
  "Yusuf Maulana",
  "Arya Pratama",
];

type RosterPerson = {
  id: number;
  name: string;
  nisn: string;
  grade: string;
  saf: number;
  banjar: number;
  photo?: string;
};

function RosterTab() {
  const [editing, setEditing] = useState(false);
  const [members, setMembers] = useState<RosterPerson[]>(() =>
    rosterNames.map((name, index) => ({
      id: index + 1,
      name,
      nisn: `00${2701000 + index}`,
      grade: ["VIII-A", "VIII-B", "VIII-C"][index % 3],
      saf: Math.floor(index / 7) + 1,
      banjar: (index % 7) + 1,
    })),
  );
  const updateMember = (id: number, key: "name" | "nisn" | "grade", value: string) => {
    setMembers((current) =>
      current.map((member) => (member.id === id ? { ...member, [key]: value } : member)),
    );
  };
  const updatePhoto = (id: number, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const photo = URL.createObjectURL(file);
    setMembers((current) =>
      current.map((member) => (member.id === id ? { ...member, photo } : member)),
    );
  };
  return (
    <section className="rounded-[22px] border border-slate-200/80 bg-white p-5 shadow-card sm:p-7">
      <PanelHeader
        title="Susunan Personel"
        description="1 komandan, 21 pasukan inti, 3 cadangan, dan official pendamping."
        icon="users"
        actions={
          <button
            onClick={() => setEditing(!editing)}
            className={editing ? "primary-button" : "secondary-button"}
          >
            <Icon name={editing ? "check" : "edit"} size={15} />{" "}
            {editing ? "Simpan Susunan" : "Edit Personel"}
          </button>
        }
      />
      <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[20px] bg-slate-800 p-px shadow-[0_14px_32px_rgba(15,23,42,.12)] sm:grid-cols-4">
        {[
          ["25", "Personel aktif", "Lengkap"],
          ["21", "Pasukan inti", "3 saf"],
          ["03", "Cadangan", "Siap tugas"],
          ["03", "Official", "Terverifikasi"],
        ].map(([value, label, note]) => (
          <div key={label} className="bg-slate-950 px-4 py-4 text-white">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xl font-black tracking-[-.04em]">{value}</p>
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </div>
            <p className="mt-1 text-[8px] font-black uppercase tracking-[.12em] text-slate-400">
              {label}
            </p>
            <p className="mt-1 text-[8px] font-semibold text-emerald-400">{note}</p>
          </div>
        ))}
      </div>
      {editing && (
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-[10px] leading-relaxed text-blue-800">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Icon name="edit" size={13} />
          </span>
          <span>
            <strong className="block font-black">Mode penyuntingan aktif</strong>
            Klik area foto untuk mengunggah pasfoto 3×4, lalu perbarui identitas atau kelas.
            Perubahan tersimpan sebagai draft hingga tombol simpan dipilih.
          </span>
        </div>
      )}
      <div className="mt-4 grid gap-3 lg:grid-cols-[.85fr_1.1fr_1.25fr]">
        <article className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-red-700 to-red-900 p-5 text-white shadow-[0_14px_28px_rgba(185,28,28,.16)]">
          <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full border-[20px] border-white/[.05]" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <p className="text-[8px] font-black uppercase tracking-[.14em] text-red-200">
                Commanding officer
              </p>
              <span className="rounded-full border border-white/15 bg-white/10 px-2 py-1 text-[7px] font-black">
                DANTON
              </span>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-sm font-black text-red-700 shadow-lg">
                FA
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-black">M. Fadhil Arkananta</p>
                <p className="mt-1 text-[8px] text-red-200">NISN 002701000 · Kelas VI-A</p>
              </div>
            </div>
          </div>
        </article>
        <article className="rounded-[20px] border border-slate-200 bg-slate-50/70 p-4">
          <div className="flex items-center justify-between">
            <p className="text-[8px] font-black uppercase tracking-[.14em] text-blue-700">
              Official & Tim Pendukung
            </p>
            <span className="text-[8px] font-black text-slate-400">03 ORANG</span>
          </div>
          <div className="mt-3 space-y-1.5">
            {[
              ["Drs. Hendro Wibowo", "Pelatih / Pembina"],
              ["Dedi Firmansyah", "Tim Medis"],
              ["Bayu Wicaksono", "Dokumentasi"],
            ].map(([name, role]) => (
              <div
                key={name}
                className="flex items-center gap-2 rounded-xl border border-slate-100 bg-white p-2"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[9px] font-black text-blue-700">
                  {name
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[9px] font-black">{name}</p>
                  <p className="text-[8px] text-slate-400">{role}</p>
                </div>
                <Icon name="check" size={11} />
              </div>
            ))}
          </div>
        </article>
        <article className="rounded-[20px] border border-amber-200 bg-amber-50/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[8px] font-black uppercase tracking-[.14em] text-amber-800">
                Reserve unit
              </p>
              <p className="mt-1 text-[10px] font-black text-slate-900">Personel cadangan</p>
            </div>
            <span className="rounded-full bg-amber-100 px-2 py-1 text-[9px] font-black text-amber-800">
              SIAP
            </span>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {["Kevin Raditya", "Teguh Prasetyo", "Rafi Mahendra"].map((name, i) => (
              <div
                key={name}
                className="flex items-center gap-2 rounded-xl border border-amber-100 bg-white/90 p-2"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-[9px] font-black text-amber-800">
                  C{i + 1}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[8px] font-black">{name}</p>
                  <p className="text-[7px] text-slate-400">
                    Kelas VIII-{String.fromCharCode(65 + i)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
      <div className="mt-6 space-y-4">
        {[1, 2, 3].map((saf) => (
          <article
            key={saf}
            className="overflow-hidden rounded-[22px] border border-slate-200 bg-slate-50/60"
          >
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3.5">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-[10px] font-black text-white">
                  {String(saf).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-900">
                    Saf {saf} · {saf === 1 ? "Depan" : saf === 2 ? "Tengah" : "Belakang"}
                  </h3>
                  <p className="mt-0.5 text-[8px] text-slate-400">
                    7 personel · Banjar 1–7 · Pasfoto 3×4
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden text-[8px] font-bold text-slate-400 sm:inline">
                  {members.filter((member) => member.saf === saf && member.photo).length}/7 foto
                </span>
                <StatusPill>Data lengkap</StatusPill>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-4 xl:grid-cols-7">
              {members
                .filter((member) => member.saf === saf)
                .map((member) => (
                  <div
                    key={member.id}
                    className={`group overflow-hidden rounded-2xl border bg-white transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(15,23,42,.1)] ${editing ? "border-blue-300 ring-2 ring-blue-100" : "border-slate-200"}`}
                  >
                    <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200">
                      {member.photo ? (
                        <img
                          src={member.photo}
                          alt={`Pasfoto ${member.name}`}
                          className="h-full w-full object-cover object-[center_20%] transition duration-300 group-hover:scale-[1.025]"
                        />
                      ) : (
                        <div className="flex flex-col items-center text-slate-300">
                          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 shadow-sm ring-1 ring-slate-200">
                            <Icon name="users" size={20} />
                          </span>
                          <span className="mt-2 text-base font-black">
                            {member.name
                              .split(" ")
                              .map((part) => part[0])
                              .slice(0, 2)
                              .join("")}
                          </span>
                          <span className="mt-1 text-[7px] font-black uppercase tracking-wider text-slate-400">
                            Foto belum tersedia
                          </span>
                        </div>
                      )}
                      <span className="absolute left-1.5 top-1.5 rounded-full border border-white/20 bg-slate-950/90 px-2 py-1 text-[7px] font-black text-white shadow-lg backdrop-blur">
                        SAF {member.saf}
                      </span>
                      <span className="absolute right-1.5 top-1.5 rounded-full bg-red-600 px-2 py-1 text-[7px] font-black text-white shadow-lg">
                        B{member.banjar}
                      </span>
                      {editing && (
                        <label className="absolute inset-x-2 bottom-2 flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-slate-950/90 px-2 py-2 text-[8px] font-black text-white shadow-xl backdrop-blur transition hover:bg-blue-700">
                          <Icon name="upload" size={12} />
                          {member.photo ? "Ganti foto" : "Unggah foto"}
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={(event) => updatePhoto(member.id, event)}
                          />
                        </label>
                      )}
                    </div>
                    <div className="border-t border-slate-100 p-2.5">
                      {editing ? (
                        <div className="space-y-1.5">
                          <input
                            value={member.name}
                            onChange={(event) =>
                              updateMember(member.id, "name", event.target.value)
                            }
                            className="w-full rounded-md border border-slate-200 px-1.5 py-1 text-[9px] font-bold"
                          />
                          <input
                            value={member.nisn}
                            onChange={(event) =>
                              updateMember(member.id, "nisn", event.target.value)
                            }
                            className="w-full rounded-md border border-slate-200 px-1.5 py-1 font-mono text-[8px]"
                          />
                          <select
                            value={member.grade}
                            onChange={(event) =>
                              updateMember(member.id, "grade", event.target.value)
                            }
                            className="w-full rounded-md border border-slate-200 px-1 py-1 text-[8px]"
                          >
                            <option>VIII-A</option>
                            <option>VIII-B</option>
                            <option>VIII-C</option>
                          </select>
                        </div>
                      ) : (
                        <>
                          <p className="min-h-7 text-[9px] font-black leading-tight text-slate-900">
                            {member.name}
                          </p>
                          <div className="mt-2 flex items-center justify-between gap-2 border-t border-slate-100 pt-2">
                            <p className="truncate font-mono text-[7px] text-slate-400">
                              {member.nisn}
                            </p>
                            <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[7px] font-black text-slate-600">
                              {member.grade}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

type UploadMap = Record<string, string>;
const documentItems = [
  ["schoolLogo", "Logo Sekolah / Lambang Peleton", "logo-sekolah.png", true],
  ["recommendation", "Surat Rekomendasi Kepala Sekolah", "surat-rekomendasi.pdf", true],
  ["payment", "Bukti Transfer Pembayaran BSI", "bukti-transfer.jpg", true],
  ["dantonCard", "Kartu Pelajar Komandan", "", false],
] as const;

function DocumentsTab({ onRoster, onPact }: { onRoster: () => void; onPact: () => void }) {
  const [files, setFiles] = useState<UploadMap>(() =>
    Object.fromEntries(documentItems.map(([id, , name]) => [id, name])),
  );
  const completedFiles = documentItems.filter(([id]) => Boolean(files[id])).length;
  const completion = Math.round((completedFiles / documentItems.length) * 100);
  const upload = (id: string, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setFiles((current) => ({ ...current, [id]: file.name }));
  };
  return (
    <section className="rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_46px_rgba(15,23,42,.06)] sm:p-7">
      <PanelHeader
        title="Pusat Berkas Digital"
        description="Unggah atau perbarui berkas yang diminta oleh panitia verifikator."
        icon="file"
      />
      <div className="mt-6 overflow-hidden rounded-[22px] bg-slate-950 text-white shadow-[0_16px_34px_rgba(15,23,42,.16)]">
        <div className="grid sm:grid-cols-[1fr_auto]">
          <div className="p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              <p className="text-[8px] font-black uppercase tracking-[.16em] text-amber-400">
                Verification progress
              </p>
            </div>
            <h3 className="mt-2 text-lg font-black tracking-tight">
              {completedFiles} dari {documentItems.length} berkas telah siap
            </h3>
            <p className="mt-1 text-[9px] leading-relaxed text-slate-400">
              {completedFiles === documentItems.length
                ? "Seluruh berkas siap untuk diproses oleh panitia verifikator."
                : "Lengkapi berkas tersisa agar verifikasi administrasi dapat diproses."}
            </p>
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-red-600 to-amber-400 transition-[width] duration-500"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 border-t border-white/10 sm:w-[260px] sm:border-l sm:border-t-0">
            {[
              [`${completion}%`, "Kelengkapan"],
              [String(completedFiles).padStart(2, "0"), "Terlampir"],
              [String(documentItems.length - completedFiles).padStart(2, "0"), "Tindakan"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="flex flex-col items-center justify-center border-r border-white/10 px-3 py-4 text-center last:border-r-0"
              >
                <p className="text-lg font-black text-white">{value}</p>
                <p className="mt-1 text-[7px] font-black uppercase tracking-wider text-slate-500">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {documentItems.map(([id, title], index) => {
          const ready = Boolean(files[id]);
          return (
            <article
              key={id}
              className={`group overflow-hidden rounded-[20px] border bg-white transition hover:-translate-y-0.5 hover:shadow-md ${ready ? "border-slate-200" : "border-red-200 ring-2 ring-red-50"}`}
            >
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 bg-slate-50/70 px-4 py-3.5">
                <div className="flex min-w-0 items-start gap-3">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[8px] font-black ${ready ? "bg-slate-950 text-white" : "bg-red-600 text-white"}`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[9px] font-black uppercase leading-relaxed text-slate-800">
                      {title}
                    </h3>
                    <p
                      className={`mt-1 text-[7px] font-black uppercase tracking-wider ${ready ? "text-emerald-700" : "text-red-700"}`}
                    >
                      {ready ? "Berkas terlampir" : "Perlu dilengkapi"}
                    </p>
                  </div>
                </div>
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${ready ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                >
                  <Icon name={ready ? "check" : "file"} size={12} />
                </span>
              </div>
              <div className="flex items-center gap-3 p-4">
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${ready ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-400"}`}
                >
                  <Icon name={ready ? "shield" : "upload"} size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[10px] font-black text-slate-900">
                    {files[id] || "Belum ada file"}
                  </p>
                  <p className="mt-1 text-[8px] text-slate-400">
                    {ready ? "Siap untuk proses verifikasi" : "Format JPG, PNG, atau PDF"}
                  </p>
                </div>
                <label
                  className={`flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl px-3 py-2 text-[8px] font-black transition ${ready ? "border border-slate-200 bg-white text-slate-700 hover:border-slate-300" : "bg-red-700 text-white hover:bg-red-800"}`}
                >
                  <Icon name="upload" size={12} /> {ready ? "Ganti" : "Unggah"}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={(event) => upload(id, event)}
                  />
                </label>
              </div>
            </article>
          );
        })}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <article className="relative overflow-hidden rounded-[20px] border border-blue-200 bg-blue-50/60 p-5">
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full border-[16px] border-blue-600/[.04]" />
          <div className="relative">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
              <Icon name="users" size={17} />
            </span>
            <p className="mt-4 text-[9px] font-black uppercase tracking-[.12em] text-blue-900">
              Pasfoto Personel & Official
            </p>
            <p className="mt-2 text-[9px] leading-relaxed text-slate-600">
              Pasfoto 3×4 dikelola per individu melalui formation board personel.
            </p>
            <button
              onClick={onRoster}
              className="mt-4 flex items-center gap-2 text-[9px] font-black text-blue-700 transition hover:gap-3"
            >
              Buka formation board <Icon name="arrow" size={13} />
            </button>
          </div>
        </article>
        <article className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-red-700 to-red-900 p-5 text-white shadow-[0_14px_30px_rgba(185,28,28,.16)]">
          <div className="absolute -bottom-10 -right-8 h-32 w-32 rounded-full border-[20px] border-white/[.05]" />
          <div className="relative">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
              <Icon name="shield" size={17} />
            </span>
            <p className="mt-4 text-[9px] font-black uppercase tracking-[.12em] text-red-100">
              Pakta Integritas Fisik
            </p>
            <p className="mt-2 text-[9px] leading-relaxed text-red-100/70">
              Cetak, tandatangani basah, lalu serahkan saat Technical Meeting.
            </p>
            <button
              onClick={onPact}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-[8px] font-black text-red-800 transition hover:bg-amber-300"
            >
              <Icon name="download" size={13} /> Buka dokumen A4
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}

function ScoresTab() {
  return (
    <section className="rounded-[22px] border border-slate-200/80 bg-white p-5 shadow-card sm:p-7">
      <PanelHeader
        title="Hasil Penilaian"
        description="Rekap nilai resmi dari dewan juri dan status kejuaraan."
        icon="chart"
      />
      <div className="mt-6 rounded-3xl bg-slate-950 p-6 text-white sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-black tracking-[.16em] text-amber-400">
              TOTAL NILAI SEMENTARA
            </p>
            <p className="mt-2 text-5xl font-black">
              2.847<span className="text-lg text-slate-500">,50</span>
            </p>
            <p className="mt-2 text-xs text-slate-400">Peringkat sementara kategori SD Putri</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[.06] px-5 py-3 text-center">
            <p className="text-[9px] font-bold uppercase text-slate-400">Peringkat</p>
            <p className="text-3xl font-black text-amber-400">#04</p>
          </div>
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          ["Nilai Akhir Peleton", "2.209,50", "Juri 1 / 2 / 3: 738 / 731,5 / 740"],
          ["Nilai Akhir Komandan", "638,00", "Juri 1 / 2 / 3: 214 / 210 / 214"],
          ["Pengurangan Nilai", "-0", "Penalti Peleton: 0 • Danton: 0"],
        ].map(([title, score, detail], index) => (
          <div key={title} className="rounded-2xl border border-slate-200 p-4">
            <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">{title}</p>
            <p
              className={`mt-3 text-2xl font-black ${index === 2 ? "text-emerald-700" : "text-slate-900"}`}
            >
              {score}
            </p>
            <p className="mt-3 border-t border-slate-100 pt-2 text-[9px] font-semibold text-slate-500">
              {detail}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-[1.4fr_.6fr]">
        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
          <p className="text-[10px] font-black uppercase tracking-wider text-amber-900">
            Evaluasi & Catatan Dewan Juri
          </p>
          <p className="mt-2 text-xs leading-relaxed text-slate-700">
            “Gerakan sangat kompak dan tempo stabil. Pertahankan ketegasan aba-aba komandan pada
            transisi variasi formasi terakhir.”
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-[9px] font-bold uppercase text-slate-400">Dinilai oleh</p>
          <p className="mt-2 text-xs font-black text-slate-900">Dewan Juri Utama</p>
          <p className="mt-1 text-[9px] text-slate-500">24 Jan 2027 • 11.32 WIB</p>
        </div>
      </div>
      <p className="mt-5 rounded-xl bg-amber-50 p-3 text-[10px] font-semibold leading-relaxed text-amber-800">
        Nilai bersifat sementara sampai sidang dewan juri selesai. Keputusan akhir juri tidak dapat
        diganggu gugat.
      </p>
    </section>
  );
}

function PactModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 p-3 backdrop-blur-sm sm:p-6">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl bg-slate-100 shadow-2xl">
        <div className="flex items-center justify-between bg-slate-950 px-5 py-4 text-white">
          <div>
            <p className="text-[9px] font-black tracking-wider text-amber-400">DOKUMEN FISIK A4</p>
            <h3 className="text-sm font-black uppercase">Pakta Integritas Peserta</h3>
          </div>
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="primary-button">
              <Icon name="print" size={14} /> Cetak
            </button>
            <button
              aria-label="Tutup"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white"
            >
              <Icon name="close" />
            </button>
          </div>
        </div>
        <div className="p-3 sm:p-6">
          <div className="mx-auto min-h-[760px] max-w-[620px] bg-white px-8 py-12 font-serif text-[12px] leading-relaxed text-black shadow-lg sm:px-14">
            <div className="border-b-2 border-black pb-4 text-center">
              <p className="text-sm font-bold">PANITIA LOMBA BARIS-BERBARIS MU'ALLIMIN 2027</p>
              <p className="text-[10px]">Kampus Terpadu Sedayu, Yogyakarta</p>
            </div>
            <h4 className="mt-8 text-center text-base font-bold uppercase">
              Surat Pernyataan & Pakta Integritas Peserta
            </h4>
            <p className="text-center">
              Nomor Registrasi: <strong>LBB27-SD-SAPEN</strong>
            </p>
            <p className="mt-6">
              Yang bertanda tangan di bawah ini secara sah dan sadar bertindak atas nama kontingen:
            </p>
            <table className="mt-3 w-full">
              <tbody>
                {[
                  ["Official / Pelatih", "Drs. Hendro Wibowo"],
                  ["Sekolah / Madrasah", "SD Muhammadiyah Sapen Yogyakarta (SD)"],
                  ["Komandan Peleton", "M. Fadhil Arkananta"],
                  ["Nomor WhatsApp", "081210000000"],
                ].map(([a, b]) => (
                  <tr key={a}>
                    <td className="w-40 py-1">{a}</td>
                    <td>
                      : <strong>{b}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-5">Dengan ini menyatakan bahwa:</p>
            <ol className="mt-2 list-decimal space-y-2 pl-5 text-justify">
              <li>Seluruh anggota peleton adalah siswa aktif yang sah dari sekolah terkait.</li>
              <li>
                Tidak memanipulasi identitas, NISN, stempel, tanda tangan, maupun dokumen
                administrasi.
              </li>
              <li>Bersedia mematuhi petunjuk teknis, tata tertib, serta keputusan dewan juri.</li>
              <li>
                Menjunjung tinggi sportivitas dan menerima sanksi apabila terbukti melakukan
                pelanggaran.
              </li>
            </ol>
            <div className="mt-16 grid grid-cols-2 gap-8 text-center">
              <div>
                <p>Komandan Peleton</p>
                <div className="h-20" />
                <p className="font-bold underline">M. FADHIL ARKANANTA</p>
              </div>
              <div>
                <p>Yogyakarta, 9 Januari 2027</p>
                <div className="h-20" />
                <p className="font-bold underline">DRS. HENDRO WIBOWO</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RegistrationStatus({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="section-kicker">STATUS PENDAFTARAN 2027</p>
            <h3 className="mt-1 text-2xl font-black tracking-tight">Peleton Terverifikasi</h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400">
            <Icon name="close" />
          </button>
        </div>
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white">
              <Icon name="check" />
            </span>
            <div>
              <p className="text-sm font-black text-emerald-950">ACC Panitia Sekretariat</p>
              <p className="text-xs text-emerald-700">Seluruh data utama telah lolos verifikasi.</p>
            </div>
          </div>
        </div>
        <div className="mt-5 space-y-3">
          {[
            "Pendaftaran peleton diterima",
            "Administrasi pembayaran terverifikasi",
            "Data personel telah lengkap",
            "Nomor tampil & basecamp ditetapkan",
          ].map((label, i) => (
            <div key={label} className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <Icon name="check" size={14} />
              </span>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-800">{label}</p>
                <p className="text-[10px] text-slate-400">Tahap {i + 1} selesai</p>
              </div>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="primary-button mt-7 w-full justify-center py-3">
          Masuk ke portal peserta <Icon name="arrow" size={15} />
        </button>
      </div>
    </div>
  );
}

function ProfileEditModal({
  profile,
  onSave,
  onClose,
}: {
  profile: { school: string; city: string; danton: string; official: string; phone: string };
  onSave: (profile: {
    school: string;
    city: string;
    danton: string;
    official: string;
    phone: string;
  }) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState(profile);
  const fields = [
    ["school", "Nama sekolah / instansi"],
    ["city", "Kabupaten / kota asal"],
    ["danton", "Nama komandan peleton"],
    ["official", "Official / pendamping utama"],
    ["phone", "Nomor WhatsApp aktif"],
  ] as const;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSave(form);
        }}
        className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <p className="section-kicker">IDENTITAS TIM</p>
            <h3 className="text-xl font-black">Edit Profil Peleton</h3>
          </div>
          <button type="button" onClick={onClose} className="p-2 text-slate-400">
            <Icon name="close" />
          </button>
        </div>
        <div className="mt-5 space-y-3">
          {fields.map(([key, label]) => (
            <label key={key} className="block">
              <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {label}
              </span>
              <input
                value={form[key]}
                onChange={(event) => setForm({ ...form, [key]: event.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
              />
            </label>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="secondary-button">
            Batal
          </button>
          <button type="submit" className="primary-button">
            <Icon name="check" size={15} /> Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}

type RegistrationForm = {
  email: string;
  level: "SD" | "SMP";
  school: string;
  unit: string;
  address: string;
  region: string;
  teamType: "Homogen" | "Heterogen";
  gender: "Putra" | "Putri";
  danton: string;
  official: string;
  phone: string;
  agree: boolean;
};

function RegistrationWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [signatureOpen, setSignatureOpen] = useState(false);
  const [signed, setSigned] = useState(false);
  const [copied, setCopied] = useState("");
  const [files, setFiles] = useState<Record<string, string>>({});
  const [form, setForm] = useState<RegistrationForm>({
    email: "official.sd01@lbbmuallimin.id",
    level: "SD",
    school: "SD MUHAMMADIYAH SAPEN YOGYAKARTA",
    unit: "Tunggal",
    address: "Jl. Bimokurdo No. 33, Yogyakarta",
    region: "Kota Yogyakarta",
    teamType: "Homogen",
    gender: "Putri",
    danton: "M. FADHIL ARKANANTA",
    official: "DRS. HENDRO WIBOWO",
    phone: "081210000000",
    agree: false,
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  const update = <K extends keyof RegistrationForm>(key: K, value: RegistrationForm[K]) =>
    setForm((current) => ({ ...current, [key]: value }));
  const upload = (key: string, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setFiles((current) => ({ ...current, [key]: file.name }));
  };
  const copy = (value: string, key: string) => {
    navigator.clipboard?.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(""), 1600);
  };
  const pointerPosition = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  };
  const startDrawing = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawing.current = true;
    canvas.setPointerCapture(event.pointerId);
    const point = pointerPosition(event);
    const context = canvas.getContext("2d");
    context?.beginPath();
    context?.moveTo(point.x, point.y);
  };
  const draw = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const context = canvasRef.current?.getContext("2d");
    if (!context) return;
    const point = pointerPosition(event);
    context.lineWidth = 3;
    context.lineCap = "round";
    context.strokeStyle = "#0f172a";
    context.lineTo(point.x, point.y);
    context.stroke();
  };
  const clearSignature = () => {
    const canvas = canvasRef.current;
    canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    setSigned(false);
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs font-semibold text-slate-900 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10";
  const fieldLabel = "mb-1.5 block text-[10px] font-black uppercase tracking-wider text-slate-600";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#f5f7fa]">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="brand-mark text-white">S</div>
            <div>
              <p className="text-sm font-black">PENDAFTARAN PELETON</p>
              <p className="text-[9px] font-bold tracking-wider text-slate-400">
                LBB MU'ALLIMIN 2027
              </p>
            </div>
          </div>
          <button onClick={onClose} className="secondary-button">
            <Icon name="close" size={15} /> Tutup
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-7 sm:py-10">
        {step < 4 && (
          <>
            <div className="mb-7 text-center">
              <p className="section-kicker">FORMULIR ONLINE</p>
              <h1 className="mt-2 text-2xl font-black uppercase tracking-tight sm:text-3xl">
                Daftarkan Peleton Sekolah
              </h1>
              <p className="mx-auto mt-2 max-w-xl text-xs leading-relaxed text-slate-500">
                Lengkapi tiga tahap berikut. Data dapat ditinjau kembali sebelum dikirim ke panitia.
              </p>
            </div>
            <div className="mb-6 grid grid-cols-3 gap-2">
              {["Sekolah & Akun", "Danton & Official", "Pembayaran"].map((label, index) => {
                const number = index + 1;
                return (
                  <div
                    key={label}
                    className={`rounded-xl border p-3 text-center ${step === number ? "border-red-200 bg-red-50 text-red-700" : step > number ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-400"}`}
                  >
                    <p className="text-[9px] font-black uppercase tracking-wider">Tahap {number}</p>
                    <p className="mt-1 text-[10px] font-bold sm:text-xs">{label}</p>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {step === 1 && (
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card sm:p-8">
            <PanelHeader
              title="Identitas Sekolah, Akun & Tipe Pasukan"
              description="Lengkapi akun portal dan identitas resmi peleton."
              icon="home"
            />
            <div className="mt-6 space-y-5">
              <div>
                <label className={fieldLabel}>1. Akun Google Peleton</label>
                <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-black text-blue-600">
                    G
                  </span>
                  <input
                    value={form.email}
                    onChange={(event) => update("email", event.target.value)}
                    className="min-w-0 flex-1 bg-transparent text-xs font-bold outline-none"
                  />
                  <StatusPill>Terhubung</StatusPill>
                </div>
              </div>
              <div>
                <label className={fieldLabel}>2. Jenjang Sekolah</label>
                <div className="grid grid-cols-2 gap-3">
                  {(["SD", "SMP"] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => update("level", level)}
                      className={`rounded-2xl border p-4 text-xs font-black ${form.level === level ? (level === "SD" ? "border-red-700 bg-red-700 text-white" : "border-blue-700 bg-blue-700 text-white") : "border-slate-200 text-slate-500"}`}
                    >
                      TINGKAT {level} / {level === "SD" ? "MI" : "MTs"}
                      <span className="mt-1 block text-[9px] opacity-75">
                        Sisa {level === "SD" ? "12" : "8"} slot
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
                <label>
                  <span className={fieldLabel}>3. Nama Resmi Sekolah</span>
                  <input
                    value={form.school}
                    onChange={(event) => update("school", event.target.value.toUpperCase())}
                    className={inputClass}
                  />
                </label>
                <label>
                  <span className={fieldLabel}>Pembeda Peleton</span>
                  <select
                    value={form.unit}
                    onChange={(event) => update("unit", event.target.value)}
                    className={inputClass}
                  >
                    <option>Tunggal</option>
                    <option>Tim A</option>
                    <option>Tim B</option>
                  </select>
                </label>
              </div>
              <div className="rounded-xl border border-red-100 bg-red-50 px-3.5 py-2 text-[10px] text-red-900">
                <strong>Nama terdaftar:</strong> {form.school}
                {form.unit !== "Tunggal" ? ` • ${form.unit}` : ""}
              </div>
              <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
                <label>
                  <span className={fieldLabel}>Alamat Lengkap Sekolah</span>
                  <input
                    value={form.address}
                    onChange={(event) => update("address", event.target.value)}
                    className={inputClass}
                  />
                </label>
                <label>
                  <span className={fieldLabel}>Wilayah / Daerah</span>
                  <select
                    value={form.region}
                    onChange={(event) => update("region", event.target.value)}
                    className={inputClass}
                  >
                    <option>Kota Bandung</option>
                    <option>Kab. Bandung</option>
                    <option>Kota Yogyakarta</option>
                    <option>Kab. Bantul</option>
                  </select>
                </label>
              </div>
              <label className="block rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-5 text-center">
                <span className="text-xs font-black text-slate-700">
                  {files.logo || "Pilih Logo Sekolah"}
                </span>
                <span className="mt-1 block text-[9px] text-slate-400">PNG/JPG maksimal 3 MB</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => upload("logo", event)}
                />
              </label>
              <div>
                <label className={fieldLabel}>4. Tipe Pasukan</label>
                <div className="grid grid-cols-2 gap-3">
                  {(["Homogen", "Heterogen"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => update("teamType", type)}
                      className={`rounded-2xl border p-4 text-left ${form.teamType === type ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200"}`}
                    >
                      <span className="text-xs font-black uppercase">{type}</span>
                      <span className="mt-1 block text-[9px] opacity-70">
                        {type === "Homogen" ? "Semua personel sejenis" : "Kombinasi putra & putri"}
                      </span>
                    </button>
                  ))}
                </div>
                {form.teamType === "Homogen" && (
                  <div className="mt-3 flex gap-2">
                    {(["Putra", "Putri"] as const).map((gender) => (
                      <button
                        key={gender}
                        onClick={() => update("gender", gender)}
                        className={
                          form.gender === gender
                            ? "primary-button flex-1"
                            : "secondary-button flex-1"
                        }
                      >
                        Peleton {gender}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-7 flex justify-end border-t border-slate-100 pt-5">
              <button onClick={() => setStep(2)} className="primary-button px-6 py-3">
                Lanjut ke Danton & Official <Icon name="arrow" size={15} />
              </button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card sm:p-8">
            <PanelHeader
              title="Komandan Peleton & Official Pelatih"
              description="Lengkapi penanggung jawab resmi dan kontak koordinasi."
              icon="users"
            />
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-[10px] font-black uppercase tracking-wider text-red-700">
                  Data Komandan Peleton
                </p>
                <label className="mt-4 block">
                  <span className={fieldLabel}>Nama Lengkap Komandan</span>
                  <input
                    value={form.danton}
                    onChange={(event) => update("danton", event.target.value.toUpperCase())}
                    className={inputClass}
                  />
                </label>
                <label className="mt-3 block rounded-xl border-2 border-dashed border-slate-200 bg-white p-4 text-center">
                  <span className="text-xs font-bold">
                    {files.dantonCard || "Pilih foto / scan kartu pelajar"}
                  </span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(event) => upload("dantonCard", event)}
                  />
                </label>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-[10px] font-black uppercase tracking-wider text-blue-700">
                  Data Official / Pelatih
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label>
                    <span className={fieldLabel}>Nama Lengkap Official</span>
                    <input
                      value={form.official}
                      onChange={(event) => update("official", event.target.value.toUpperCase())}
                      className={inputClass}
                    />
                  </label>
                  <label>
                    <span className={fieldLabel}>Nomor WhatsApp Aktif</span>
                    <input
                      value={form.phone}
                      onChange={(event) => update("phone", event.target.value)}
                      className={inputClass}
                    />
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-7 flex justify-between border-t border-slate-100 pt-5">
              <button onClick={() => setStep(1)} className="secondary-button">
                Kembali
              </button>
              <button onClick={() => setStep(3)} className="primary-button px-6 py-3">
                Lanjut ke Pembayaran <Icon name="arrow" size={15} />
              </button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card sm:p-8">
            <PanelHeader
              title="Pembayaran & Pakta Integritas Online"
              description="Unggah bukti transfer dan sahkan pernyataan digital."
              icon="card"
            />
            <div className="mt-6 overflow-hidden rounded-2xl bg-slate-950 p-5 text-white sm:p-7">
              <div className="flex flex-col gap-5 border-b border-white/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-[10px] font-black tracking-wider text-amber-400">
                    REKENING RESMI PANITIA
                  </p>
                  <p className="mt-2 text-xs text-slate-400">Bank Syariah Indonesia (BSI)</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase text-slate-400">
                    Biaya Registrasi ({form.level})
                  </p>
                  <p className="mt-1 text-2xl font-black text-amber-300">Rp 500.137</p>
                </div>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-[9px] font-bold uppercase text-slate-400">Nomor Rekening</p>
                  <div className="mt-2 flex items-center rounded-xl border border-slate-700 bg-slate-900 p-3">
                    <code className="flex-1 text-lg font-black tracking-wider">7220 138 2027</code>
                    <button
                      onClick={() => copy("72201382027", "account")}
                      className="rounded-lg bg-amber-400 px-2.5 py-1.5 text-[9px] font-black text-slate-950"
                    >
                      {copied === "account" ? "Tersalin" : "Salin"}
                    </button>
                  </div>
                  <p className="mt-2 text-[10px] text-slate-400">a.n. Panitia LBB Mu'allimin</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase text-slate-400">Berita Transfer</p>
                  <div className="mt-2 flex items-center rounded-xl border border-amber-400/30 bg-slate-900 p-3">
                    <code className="flex-1 text-xs font-black text-amber-300">
                      {form.school.replaceAll(" ", "_")}_1
                    </code>
                    <button
                      onClick={() => copy(`${form.school}_1`, "note")}
                      className="rounded-lg border border-amber-400/40 px-2.5 py-1.5 text-[9px] font-black text-amber-300"
                    >
                      {copied === "note" ? "Tersalin" : "Salin"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 space-y-4">
              <label className="block rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-5 text-center">
                <span className="text-xs font-black">
                  {files.payment || "Unggah bukti transfer pembayaran"}
                </span>
                <span className="mt-1 block text-[9px] text-slate-400">
                  JPG, PNG, atau PDF maksimal 5 MB
                </span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(event) => upload("payment", event)}
                />
              </label>
              <div
                className={`rounded-2xl border p-5 ${signed ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase">Pakta Integritas Digital</p>
                    <p className="mt-1 text-[10px] text-slate-500">
                      {signed
                        ? `Sah ditandatangani oleh ${form.official}`
                        : "Baca dan bubuhkan tanda tangan langsung di layar."}
                    </p>
                  </div>
                  <button
                    onClick={() => setSignatureOpen(true)}
                    className={signed ? "secondary-button" : "primary-button"}
                  >
                    <Icon name={signed ? "edit" : "check"} size={14} />{" "}
                    {signed ? "Ubah Tanda Tangan" : "Tanda Tangani"}
                  </button>
                </div>
              </div>
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <input
                  type="checkbox"
                  checked={form.agree}
                  onChange={(event) => update("agree", event.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-red-700"
                />
                <span className="text-xs leading-relaxed text-slate-600">
                  Saya menyetujui seluruh Petunjuk Teknis LBB Mu'allimin 2027 dan menerima keputusan
                  dewan juri.
                </span>
              </label>
            </div>
            <div className="mt-7 flex justify-between border-t border-slate-100 pt-5">
              <button onClick={() => setStep(2)} className="secondary-button">
                Kembali
              </button>
              <button
                disabled={!signed || !form.agree}
                onClick={() => setStep(4)}
                className="primary-button px-6 py-3 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Kirim Pendaftaran <Icon name="check" size={15} />
              </button>
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-card sm:p-9">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-700">
              <Icon name="clock" size={26} />
            </span>
            <StatusPill muted>Menunggu Verifikasi Panitia</StatusPill>
            <h2 className="mt-4 text-2xl font-black uppercase">Pendaftaran Berhasil Dikirim</h2>
            <p className="mx-auto mt-2 max-w-lg text-xs leading-relaxed text-slate-500">
              Data <strong className="text-slate-900">{form.school}</strong> telah masuk ke antrean
              verifikasi sekretariat.
            </p>
            <div className="mx-auto mt-6 w-48 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <QrCode />
              <p className="mt-2 font-mono text-xs font-black text-red-700">
                LBB27-{form.level}-SAPEN-2027
              </p>
            </div>
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Email akun</span>
                <strong>{form.email}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 py-2">
                <span className="text-slate-500">Pakta integritas</span>
                <strong className="text-emerald-700">Sudah ditandatangani</strong>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-500">Tipe pasukan</span>
                <strong>
                  {form.teamType} • {form.level}
                </strong>
              </div>
            </div>
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-left text-[10px] leading-relaxed text-amber-900">
              Panitia akan memverifikasi pembayaran dan data pendaftaran. Portal peserta aktif
              otomatis setelah pendaftaran disetujui.
            </div>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <button onClick={onClose} className="secondary-button flex-1 py-3">
                Kembali ke Portal
              </button>
              <a
                href="https://wa.me/6281947491505"
                target="_blank"
                rel="noreferrer"
                className="primary-button flex-1 py-3"
              >
                <Icon name="phone" size={15} /> Konfirmasi WhatsApp
              </a>
            </div>
          </section>
        )}
      </main>

      {signatureOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl bg-white p-5 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <p className="section-kicker">DOKUMEN RESMI DIGITAL</p>
                <h3 className="text-lg font-black uppercase">Pakta Integritas & Keabsahan</h3>
              </div>
              <button onClick={() => setSignatureOpen(false)} className="p-2 text-slate-400">
                <Icon name="close" />
              </button>
            </div>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-[10px] leading-relaxed text-slate-600">
              <p>
                Yang bertanda tangan: <strong className="text-slate-900">{form.official}</strong>,
                official dari <strong className="text-slate-900">{form.school}</strong>, menyatakan
                seluruh personel adalah siswa aktif, data yang diberikan benar, menjunjung
                sportivitas, serta menerima seluruh ketentuan dan keputusan dewan juri.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-[10px] font-black uppercase text-slate-700">
                Tanda tangan digital
              </p>
              <button onClick={clearSignature} className="text-[10px] font-bold text-slate-500">
                Bersihkan / Ulangi
              </button>
            </div>
            <canvas
              ref={canvasRef}
              width={600}
              height={180}
              onPointerDown={startDrawing}
              onPointerMove={draw}
              onPointerUp={() => {
                drawing.current = false;
                setSigned(true);
              }}
              onPointerLeave={() => {
                drawing.current = false;
              }}
              className="mt-2 h-36 w-full touch-none cursor-crosshair rounded-2xl border-2 border-dashed border-slate-300 bg-white"
            />
            <p className="mt-2 text-center text-[9px] text-slate-400">
              Gunakan jari pada layar sentuh atau kursor mouse.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setSignatureOpen(false)} className="secondary-button">
                Batal
              </button>
              <button
                disabled={!signed}
                onClick={() => setSignatureOpen(false)}
                className="primary-button disabled:opacity-40"
              >
                <Icon name="check" size={14} /> Simpan & Sahkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ParticipantTab({
  activeTab,
  onSelectTab,
  onOpenPact,
}: {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenPact: () => void;
}) {
  switch (activeTab) {
    case "idcard":
      return <IdCardTab />;
    case "roster":
      return <RosterTab />;
    case "documents":
      return <DocumentsTab onRoster={() => onSelectTab("roster")} onPact={onOpenPact} />;
    case "scores":
    case "standings":
      return <ScoresTab />;
    case "ucl":
      return <Overview onOpenPact={onOpenPact} onSelectTab={onSelectTab} />;
    case "overview":
    default:
      return <Overview onOpenPact={onOpenPact} onSelectTab={onSelectTab} />;
  }
}

function SidebarNavGroups({
  activeTab,
  onSelect,
}: {
  activeTab: string;
  onSelect: (id: string) => void;
}) {
  const renderItems = (
    items: ReadonlyArray<{
      id: string;
      label: string;
      icon: IconName;
      badge: string;
    }>,
  ) =>
    items.map((item) => (
      <button
        key={item.id}
        onClick={() => onSelect(item.id)}
        className={`nav-item ${activeTab === item.id ? "nav-item-active" : ""}`}
      >
        <Icon name={item.icon} size={18} />
        <span>{item.label}</span>
        {item.badge && (
          <span className="ml-auto rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] font-black">
            {item.badge}
          </span>
        )}
      </button>
    ));

  return (
    <>
      <p className="flex items-center gap-2 px-3 text-[9px] font-extrabold tracking-[.18em] text-slate-500">
        <span className="h-3.5 w-1 rounded-full bg-red-600" /> PORTAL PELETON
      </p>
      <nav className="mt-3 space-y-1">{renderItems(portalNavItems)}</nav>
      <p className="mt-7 flex items-center gap-2 px-3 text-[9px] font-extrabold tracking-[.18em] text-slate-500">
        <span className="h-3.5 w-1 rounded-full bg-red-600" /> KOMPETISI & ARENA
      </p>
      <nav className="mt-3 space-y-1">{renderItems(competitionNavItems)}</nav>
    </>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileNav, setMobileNav] = useState(false);
  const [notice, setNotice] = useState(false);
  const [showPact, setShowPact] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [profile, setProfile] = useState({
    school: "SD Muhammadiyah Sapen Yogyakarta",
    city: "Kota Yogyakarta",
    danton: "M. Fadhil Arkananta",
    official: "Drs. Hendro Wibowo",
    phone: "081210000000",
  });

  const selectTab = (id: string) => {
    setActiveTab(id);
    setMobileNav(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa] text-slate-900">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[280px] flex-col border-r border-white/5 bg-[#0d1421] text-white shadow-[12px_0_35px_rgba(15,23,42,.08)] transition-transform duration-300 lg:translate-x-0 ${mobileNav ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-[88px] shrink-0 items-center gap-3 border-b border-white/[.07] px-5">
          <div className="brand-mark">
            <span>M</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-black uppercase tracking-tight">
              LBB Mu’allimin 2027
            </p>
            <p className="mt-0.5 text-[8px] font-bold tracking-[.2em] text-slate-500">
              PORTAL PELETON
            </p>
          </div>
          <button
            aria-label="Tutup sidebar"
            onClick={() => setMobileNav(false)}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white/5 hover:text-white lg:hidden"
          >
            <Icon name="close" size={16} />
          </button>
        </div>
        <div className="sidebar-scroll flex-1 overflow-y-auto px-4 py-5">
          <SidebarNavGroups activeTab={activeTab} onSelect={selectTab} />
          <button
            onClick={() => {
              setShowRegistration(true);
              setMobileNav(false);
            }}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-3 py-2.5 text-[9px] font-black uppercase tracking-[.12em] text-slate-300 transition hover:border-amber-400/40 hover:bg-amber-400/10 hover:text-amber-300"
          >
            <Icon name="edit" size={15} /> Daftar Peleton Baru
          </button>
        </div>
        <div className="shrink-0 border-t border-white/[.07] p-4">
          <div className="rounded-2xl border border-white/[.08] bg-white/[.035] p-3">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-800 text-[11px] font-black shadow-md">
                MS
                <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-[#111927] bg-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[10px] font-black">{profile.school}</p>
                <p className="mt-0.5 truncate text-[8px] font-medium text-slate-500">
                  official.sd01@lbbmuallimin.id
                </p>
              </div>
            </div>
            <button
              onClick={() => setNotice(true)}
              className="mt-3 flex w-full items-center justify-center gap-2 border-t border-white/[.07] pt-3 text-[9px] font-bold text-slate-500 transition hover:text-white"
            >
              <Icon name="logout" size={15} /> Ganti akun tim
            </button>
          </div>
        </div>
      </aside>
      {mobileNav && (
        <button
          aria-label="Tutup menu"
          className="fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileNav(false)}
        />
      )}

      <div className="lg:pl-[280px]">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-7 lg:px-9">
          <div className="flex items-center gap-3">
            <button
              aria-label="Buka menu"
              className="rounded-xl border border-slate-200 p-2 text-slate-600 lg:hidden"
              onClick={() => setMobileNav(true)}
            >
              <Icon name="menu" />
            </button>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.14em] text-slate-400">
                Selamat datang kembali
              </p>
              <h1 className="text-sm font-extrabold text-slate-900 sm:text-base">Portal Peleton</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowStatus(true)}
              className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[10px] font-bold text-slate-600 hover:border-emerald-200 hover:text-emerald-700 sm:flex"
            >
              <Icon name="shield" size={15} /> Status Pendaftaran
            </button>
            <button
              aria-label="Notifikasi"
              onClick={() => setNotice((v) => !v)}
              className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 hover:bg-slate-50"
            >
              <Icon name="bell" size={18} />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-600 ring-2 ring-white" />
            </button>
            <div className="hidden h-8 w-px bg-slate-200 sm:block" />
            <div className="hidden text-right sm:block">
              <p className="text-xs font-extrabold text-slate-800">
                {profile.school.toUpperCase()}
              </p>
              <p className="text-[10px] font-semibold text-slate-400">Tingkat Sekolah Dasar</p>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1280px] p-4 sm:p-7 lg:p-9">
          <section className="profile-banner">
            <div className="profile-pattern" />
            <div className="relative grid gap-5 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_250px] lg:items-stretch">
              <div className="flex min-w-0 flex-col justify-between">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                  <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-[22px] bg-gradient-to-br from-red-600 to-red-800 text-2xl font-black text-white shadow-[0_14px_28px_rgba(185,28,28,.24)]">
                    MS
                    <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-4 border-white bg-emerald-500">
                      <Icon name="check" size={10} />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="h-px w-5 bg-red-600" />
                      <p className="text-[9px] font-black uppercase tracking-[.18em] text-red-700">
                        Kontingen terverifikasi
                      </p>
                    </div>
                    <h2 className="mt-2 max-w-3xl text-2xl font-black uppercase leading-[1.08] tracking-[-.035em] text-slate-950 sm:text-[30px]">
                      {profile.school}
                    </h2>
                    <p className="mt-2 flex flex-wrap items-center gap-x-2 text-xs font-medium text-slate-500">
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                      <span className="font-black text-slate-700">Peleton Singo Menggolo</span>
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-2 sm:pl-[100px]">
                  <StatusPill muted>Jenjang SD</StatusPill>
                  <span className="rounded-full border border-red-100 bg-red-50 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[.08em] text-red-700">
                    Homogen Putra
                  </span>
                  <StatusPill>Kota Yogyakarta</StatusPill>
                </div>
              </div>
              <div className="relative flex min-h-[150px] flex-col justify-between overflow-hidden rounded-[20px] bg-slate-950 p-5 text-white shadow-[0_18px_38px_rgba(15,23,42,.16)]">
                <div className="absolute -right-10 -top-14 h-36 w-36 rounded-full border-[22px] border-white/[.04]" />
                <div className="relative flex items-start justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600">
                    <Icon name="shield" size={17} />
                  </span>
                  <button
                    onClick={() => setEditProfile(true)}
                    className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[.06] px-2.5 py-2 text-[8px] font-black text-slate-300 transition hover:bg-white/10 hover:text-white"
                  >
                    <Icon name="edit" size={12} /> Edit profil
                  </button>
                </div>
                <div className="relative">
                  <p className="text-[8px] font-black uppercase tracking-[.18em] text-slate-500">
                    Kode registrasi
                  </p>
                  <p className="mt-1 text-base font-black tracking-[.08em]">LBB27-SD-SAPEN</p>
                  <p className="mt-2 flex items-center gap-1.5 text-[8px] font-bold text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Registrasi aktif
                  </p>
                </div>
              </div>
            </div>
            <div className="relative grid border-t border-slate-200/80 bg-slate-50/70 sm:grid-cols-3">
              {[
                ["users", "Komandan Peleton", profile.danton],
                ["shield", "Official / Pendamping", profile.official],
                ["phone", "WhatsApp Tim", profile.phone],
              ].map(([icon, label, value], index) => (
                <div
                  key={label}
                  className={`flex items-center gap-3 px-5 py-4 sm:px-6 ${index < 2 ? "border-b border-slate-200/80 sm:border-b-0 sm:border-r" : ""}`}
                >
                  <span className="icon-well">
                    <Icon name={icon as IconName} size={15} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[8px] font-black uppercase tracking-[.12em] text-slate-400">
                      {label}
                    </p>
                    <p
                      className={`mt-1 truncate text-[11px] font-black ${index === 2 ? "text-emerald-700" : "text-slate-900"}`}
                    >
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-5">
            <ParticipantTab
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              onOpenPact={() => setShowPact(true)}
            />
          </div>
        </main>
      </div>

      {notice && (
        <div className="fixed bottom-5 right-5 z-50 flex max-w-sm items-center gap-3 rounded-2xl bg-slate-950 px-4 py-3 text-white shadow-2xl">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <Icon name="shield" size={17} />
          </span>
          <div>
            <p className="text-xs font-bold">Sesi akun tetap aman</p>
            <p className="mt-0.5 text-[10px] text-slate-400">
              Ini adalah demonstrasi tampilan portal peserta.
            </p>
          </div>
          <button
            onClick={() => setNotice(false)}
            className="ml-2 text-lg leading-none text-slate-500 hover:text-white"
          >
            ×
          </button>
        </div>
      )}
      {showPact && <PactModal onClose={() => setShowPact(false)} />}
      {showStatus && <RegistrationStatus onClose={() => setShowStatus(false)} />}
      {showRegistration && <RegistrationWizard onClose={() => setShowRegistration(false)} />}
      {editProfile && (
        <ProfileEditModal
          profile={profile}
          onClose={() => setEditProfile(false)}
          onSave={(nextProfile) => {
            setProfile(nextProfile);
            setEditProfile(false);
            setNotice(true);
          }}
        />
      )}
    </div>
  );
}
