import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  ShadingType,
  VerticalAlign,
  Header,
  ImageRun,
  HorizontalPositionRelativeFrom,
  VerticalPositionRelativeFrom,
  TextWrappingType,
  PageBreak,
  TableLayoutType,
} from 'docx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const TEMPLATES_DIR = path.join(PUBLIC_DIR, 'templates');

fs.mkdirSync(TEMPLATES_DIR, { recursive: true });

const KOP_FULL_BUFFER = fs.readFileSync(path.join(PUBLIC_DIR, 'kop-lbb-a4.png'));
const KOP_HEADER_BUFFER = fs.readFileSync(path.join(PUBLIC_DIR, 'kop-lbb-header.png'));

const FONT = 'Arial Narrow';

// A4 = 210mm x 297mm = 11906 x 16838 twips
const A4_WIDTH_TWIPS = 11906;
const A4_HEIGHT_TWIPS = 16838;
// 210mm x 297mm in CSS px at 96dpi (docx ImageRun uses 96dpi -> 1px = 9525 EMU)
// 210mm = 8.2677in * 96 = 793.7px; 297mm = 11.6929in * 96 = 1122.5px
const A4_IMG_W = 794;
const A4_IMG_H = 1123;

const CELL_BORDER = { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' };
const TABLE_BORDERS = {
  top: CELL_BORDER,
  bottom: CELL_BORDER,
  left: CELL_BORDER,
  right: CELL_BORDER,
  insideHorizontal: CELL_BORDER,
  insideVertical: CELL_BORDER,
};
const NO_BORDERS = {
  top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  insideVertical: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
};

function makeKopHeader(kopBuffer) {
  return new Header({
    children: [
      new Paragraph({
        spacing: { before: 0, after: 0 },
        children: [
          new ImageRun({
            data: kopBuffer,
            transformation: { width: A4_IMG_W, height: A4_IMG_H },
            floating: {
              horizontalPosition: {
                relative: HorizontalPositionRelativeFrom.PAGE,
                offset: 0,
              },
              verticalPosition: {
                relative: VerticalPositionRelativeFrom.PAGE,
                offset: 0,
              },
              behindDocument: true,
              allowOverlap: true,
              wrap: {
                type: TextWrappingType.NONE,
              },
            },
          }),
        ],
      }),
    ],
  });
}

function run(text, opts = {}) {
  return new TextRun({
    text: String(text ?? ''),
    font: FONT,
    size: opts.size ?? 20, // 10pt = 20 half-points
    bold: Boolean(opts.bold),
    italics: Boolean(opts.italics),
    color: opts.color ?? '0F172A',
    underline: opts.underline ? {} : undefined,
  });
}

function p(children, opts = {}) {
  const arr = Array.isArray(children) ? children : [run(children, opts)];
  return new Paragraph({
    alignment: opts.align ?? AlignmentType.LEFT,
    spacing: {
      before: opts.before ?? 0,
      after: opts.after ?? 80,
      line: opts.line ?? 260,
    },
    children: arr,
  });
}

function sectionHeading(text, before = 160) {
  return new Paragraph({
    spacing: { before, after: 60 },
    children: [run(text, { bold: true, size: 22, color: '0F172A' })],
  });
}

function headerCell(text, widthDxa, align = AlignmentType.CENTER) {
  return new TableCell({
    width: { size: widthDxa, type: WidthType.DXA },
    shading: { type: ShadingType.CLEAR, fill: '0F172A', color: 'auto' },
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 70, bottom: 70, left: 80, right: 80 },
    children: [
      new Paragraph({
        alignment: align,
        spacing: { before: 0, after: 0 },
        children: [run(text, { bold: true, size: 18, color: 'FFFFFF' })],
      }),
    ],
  });
}

function dataCell(text, widthDxa, opts = {}) {
  return new TableCell({
    width: { size: widthDxa, type: WidthType.DXA },
    shading: opts.fill ? { type: ShadingType.CLEAR, fill: opts.fill, color: 'auto' } : undefined,
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 55, bottom: 55, left: 80, right: 80 },
    children: [
      new Paragraph({
        alignment: opts.align ?? AlignmentType.LEFT,
        spacing: { before: 0, after: 0 },
        children: [
          run(text, {
            bold: Boolean(opts.bold),
            size: opts.size ?? 19,
            color: opts.color ?? '0F172A',
          }),
        ],
      }),
    ],
  });
}

/**
 * Buat tabel berulang docxtemplater:
 * Baris data diawali tag {#loopKey} pada sel pertama dan diakhiri {/loopKey} pada sel terakhir
 * agar docxtemplater otomatis menduplikasi seluruh baris tabel secara rapi.
 */
function buildLoopTable({ columns, loopKey, totalWidthDxa }) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: columns.map((c) => headerCell(c.header, c.width, c.headerAlign ?? AlignmentType.CENTER)),
  });

  const loopRow = new TableRow({
    children: columns.map((c, idx) => {
      let expr = `{${c.field}}`;
      if (idx === 0) expr = `{#${loopKey}}${expr}`;
      if (idx === columns.length - 1) expr = `${expr}{/${loopKey}}`;
      return dataCell(expr, c.width, {
        align: c.align ?? AlignmentType.LEFT,
        bold: Boolean(c.bold),
        fill: c.fill,
        size: c.size ?? 19,
      });
    }),
  });

  return new Table({
    width: { size: totalWidthDxa, type: WidthType.DXA },
    layout: TableLayoutType.FIXED,
    borders: TABLE_BORDERS,
    rows: [headerRow, loopRow],
  });
}

function buildSignatureTable(totalWidthDxa) {
  const colW = Math.floor(totalWidthDxa / 3);
  const sigCell = (line1, line2) =>
    new TableCell({
      width: { size: colW, type: WidthType.DXA },
      borders: NO_BORDERS,
      margins: { top: 40, bottom: 40, left: 60, right: 60 },
      children: [
        p(line1, { align: AlignmentType.CENTER, after: 20, size: 19, color: '334155' }),
        p(line2, { align: AlignmentType.CENTER, after: 680, size: 19, bold: true }),
        p('( ........................................ )', {
          align: AlignmentType.CENTER,
          after: 0,
          size: 19,
          bold: true,
          color: '334155',
        }),
      ],
    });

  return new Table({
    width: { size: totalWidthDxa, type: WidthType.DXA },
    layout: TableLayoutType.FIXED,
    borders: NO_BORDERS,
    rows: [
      new TableRow({
        children: [
          sigCell('Mengetahui,', 'Koordinator Panitia LBB'),
          sigCell('Diperiksa Oleh,', 'Koordinator Bid. Juri dan Penilaian'),
          sigCell('Disahkan Oleh,', 'Koordinator Dewan Juri'),
        ],
      }),
    ],
  });
}

function createDoc({ kopBuffer, marginLeft = 1440, marginRight = 1440, marginTop = 1760, marginBottom = 2900, children }) {
  return new Document({
    styles: {
      default: {
        document: {
          run: {
            font: FONT,
            size: 20,
            color: '0F172A',
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: A4_WIDTH_TWIPS, height: A4_HEIGHT_TWIPS },
            margin: {
              top: marginTop,
              right: marginRight,
              bottom: marginBottom,
              left: marginLeft,
              header: 360,
              footer: 360,
            },
          },
        },
        headers: {
          default: makeKopHeader(kopBuffer),
        },
        children,
      },
    ],
  });
}

async function saveDoc(fileName, doc) {
  const buf = await Packer.toBuffer(doc);
  const target = path.join(TEMPLATES_DIR, fileName);
  fs.writeFileSync(target, buf);
  console.log(`✓ Generated ${path.relative(ROOT_DIR, target)} (${(buf.length / 1024).toFixed(1)} KB)`);
}

// =========================================================================
// 1. DAFTAR LOKASI BASECAMP (margin normal 2,54 cm -> lebar konten 9026 dxa)
// =========================================================================
async function genBasecampTemplate() {
  const W = 9026;
  const cols = [
    { header: 'NO', field: 'no', width: 620, align: AlignmentType.CENTER, bold: true },
    { header: 'NO. DADA', field: 'noDada', width: 1050, align: AlignmentType.CENTER, bold: true },
    { header: 'PELETON / SEKOLAH', field: 'sekolah', width: 4156, align: AlignmentType.LEFT, bold: true },
    { header: 'RUANG BASECAMP', field: 'ruang', width: 1650, align: AlignmentType.CENTER, bold: true },
    { header: 'LANTAI', field: 'lantai', width: 1550, align: AlignmentType.CENTER },
  ];

  const doc = createDoc({
    kopBuffer: KOP_FULL_BUFFER,
    children: [
      p([run('DAFTAR LOKASI BASECAMP PESERTA', { bold: true, size: 28 })], {
        align: AlignmentType.CENTER,
        after: 20,
      }),
      p([run("LOMBA BARIS-BERBARIS MU'ALLIMIN TAHUN 2027", { bold: true, size: 21, color: '334155' })], {
        align: AlignmentType.CENTER,
        after: 180,
      }),
      sectionHeading('A. JENJANG SD / MI', 60),
      buildLoopTable({ columns: cols, loopKey: 'sdRows', totalWidthDxa: W }),
      sectionHeading('B. JENJANG SMP / MTs', 220),
      buildLoopTable({ columns: cols, loopKey: 'smpRows', totalWidthDxa: W }),
    ],
  });

  await saveDoc('01_Daftar_Basecamp.docx', doc);
}

// =========================================================================
// 2. HASIL UNDIAN NO. URUT TAMPIL & NO. DADA (margin 1,5 cm -> 10206 dxa)
// =========================================================================
async function genLotteryTemplate() {
  const W = 10206;
  const cols = [
    { header: 'NO. URUT', field: 'noUrut', width: 950, align: AlignmentType.CENTER, bold: true },
    { header: 'NO. DADA', field: 'noDada', width: 1050, align: AlignmentType.CENTER, bold: true },
    { header: 'PELETON / SEKOLAH', field: 'sekolah', width: 4106, align: AlignmentType.LEFT, bold: true },
    { header: 'BASECAMP', field: 'basecamp', width: 1150, align: AlignmentType.CENTER },
    { header: 'MASUK DP 1', field: 'masukDp1', width: 1475, align: AlignmentType.CENTER },
    { header: 'TAMPIL', field: 'jamTampil', width: 1475, align: AlignmentType.CENTER, bold: true },
  ];

  const doc = createDoc({
    kopBuffer: KOP_FULL_BUFFER,
    marginLeft: 850,
    marginRight: 850,
    children: [
      p([run('HASIL UNDIAN NOMOR URUT TAMPIL & NOMOR DADA', { bold: true, size: 28 })], {
        align: AlignmentType.CENTER,
        after: 20,
      }),
      p([run("LOMBA BARIS-BERBARIS MU'ALLIMIN TAHUN 2027", { bold: true, size: 21, color: '334155' })], {
        align: AlignmentType.CENTER,
        after: 180,
      }),
      sectionHeading('A. JENJANG SD / MI', 60),
      buildLoopTable({ columns: cols, loopKey: 'sdRows', totalWidthDxa: W }),
      sectionHeading('B. JENJANG SMP / MTs', 220),
      buildLoopTable({ columns: cols, loopKey: 'smpRows', totalWidthDxa: W }),
    ],
  });

  await saveDoc('02_Hasil_Undian_No_Dada.docx', doc);
}

// =========================================================================
// 3. JADWAL UJI COBA LAPANGAN (UCL) (margin 2,54 cm -> 9026 dxa)
// =========================================================================
async function genTrialScheduleTemplate() {
  const W = 9026;
  const cols = [
    { header: 'SLOT', field: 'slot', width: 850, align: AlignmentType.CENTER, bold: true },
    { header: 'WAKTU', field: 'waktu', width: 1850, align: AlignmentType.CENTER, bold: true },
    { header: 'NO. DADA', field: 'noDada', width: 1050, align: AlignmentType.CENTER, bold: true },
    { header: 'PELETON / SEKOLAH', field: 'sekolah', width: 3926, align: AlignmentType.LEFT, bold: true },
    { header: 'LAPANGAN', field: 'lapangan', width: 1350, align: AlignmentType.CENTER },
  ];

  const doc = createDoc({
    kopBuffer: KOP_FULL_BUFFER,
    children: [
      p([run('JADWAL UJI COBA LAPANGAN (UCL)', { bold: true, size: 28 })], {
        align: AlignmentType.CENTER,
        after: 20,
      }),
      p([run("LOMBA BARIS-BERBARIS MU'ALLIMIN TAHUN 2027", { bold: true, size: 21, color: '334155' })], {
        align: AlignmentType.CENTER,
        after: 40,
      }),
      p([run('{tanggalUcl}', { size: 19, color: '475569' })], {
        align: AlignmentType.CENTER,
        after: 160,
      }),
      sectionHeading('A. JENJANG SD / MI', 60),
      buildLoopTable({ columns: cols, loopKey: 'sdRows', totalWidthDxa: W }),
      sectionHeading('B. JENJANG SMP / MTs', 220),
      buildLoopTable({ columns: cols, loopKey: 'smpRows', totalWidthDxa: W }),
    ],
  });

  await saveDoc('03_Jadwal_Uji_Coba_Lapangan.docx', doc);
}

// =========================================================================
// 4. LEMBAR INSPEKSI DAERAH PERSIAPAN 1 (Kop header-only, tanpa footer)
// =========================================================================
async function genDP1Template() {
  const W = 10466; // margin kiri-kanan 1,27 cm (720 twips)
  const cols = [
    { header: 'NO', field: 'no', width: 700, align: AlignmentType.CENTER, bold: true },
    { header: 'POSISI', field: 'posisi', width: 1700, align: AlignmentType.CENTER, bold: true },
    { header: 'NAMA LENGKAP PERSONEL', field: 'nama', width: 4766, align: AlignmentType.LEFT, bold: true },
    { header: 'COCOK', field: 'cekCocok', width: 1100, align: AlignmentType.CENTER },
    { header: 'IZIN', field: 'cekIzin', width: 1100, align: AlignmentType.CENTER },
    { header: 'TIDAK', field: 'cekTidak', width: 1100, align: AlignmentType.CENTER },
  ];

  const doc = createDoc({
    kopBuffer: KOP_HEADER_BUFFER,
    marginLeft: 720,
    marginRight: 720,
    marginTop: 1820,
    marginBottom: 720,
    children: [
      p([run('LEMBAR INSPEKSI DAERAH PERSIAPAN 1', { bold: true, size: 28 })], {
        align: AlignmentType.CENTER,
        after: 20,
      }),
      p([run("LOMBA BARIS-BERBARIS MU'ALLIMIN TAHUN 2027", { bold: true, size: 20, color: '334155' })], {
        align: AlignmentType.CENTER,
        after: 140,
      }),
      new Table({
        width: { size: W, type: WidthType.DXA },
        layout: TableLayoutType.FIXED,
        borders: NO_BORDERS,
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 7866, type: WidthType.DXA },
                borders: NO_BORDERS,
                verticalAlign: VerticalAlign.CENTER,
                children: [
                  p([run('{sekolah}', { bold: true, size: 32 })], { after: 40 }),
                  p([run('Jenjang: {jenjang}  |  Basecamp: {basecamp}  |  Total Personel: {totalPersonel}', { size: 19, color: '475569' })], { after: 0 }),
                ],
              }),
              new TableCell({
                width: { size: 2600, type: WidthType.DXA },
                shading: { type: ShadingType.CLEAR, fill: '0F172A', color: 'auto' },
                verticalAlign: VerticalAlign.CENTER,
                margins: { top: 80, bottom: 80, left: 100, right: 100 },
                children: [
                  p([run('NO. DADA', { bold: true, size: 16, color: 'CBD5E1' })], { align: AlignmentType.CENTER, after: 0 }),
                  p([run('{noDada}', { bold: true, size: 42, color: 'FFFFFF' })], { align: AlignmentType.CENTER, after: 0 }),
                ],
              }),
            ],
          }),
        ],
      }),
      p('', { after: 80 }),
      buildLoopTable({ columns: cols, loopKey: 'personelRows', totalWidthDxa: W }),
      p([run('Catatan Petugas DP 1: .............................................................................................................................', { size: 19, color: '334155' })], {
        before: 160,
        after: 120,
      }),
    ],
  });

  await saveDoc('04_Lembar_Inspeksi_DP1.docx', doc);
}

// =========================================================================
// 5. BERITA ACARA REKAPITULASI NILAI (BA.001) - margin 1,27 cm (10466 dxa)
// =========================================================================
async function genBARekapNilaiTemplate() {
  const W = 10466;
  const peletonCols = [
    { header: 'RANK', field: 'rank', width: 650, align: AlignmentType.CENTER, bold: true },
    { header: 'NO. DADA', field: 'noDada', width: 850, align: AlignmentType.CENTER, bold: true },
    { header: 'PELETON / SEKOLAH', field: 'sekolah', width: 3566, align: AlignmentType.LEFT, bold: true },
    { header: 'JURI 1', field: 'juri1', width: 850, align: AlignmentType.CENTER },
    { header: 'JURI 2', field: 'juri2', width: 850, align: AlignmentType.CENTER },
    { header: 'JURI 3', field: 'juri3', width: 850, align: AlignmentType.CENTER },
    { header: 'NILAI MURNI', field: 'nilaiMurni', width: 950, align: AlignmentType.CENTER },
    { header: 'PENALTI', field: 'penalti', width: 900, align: AlignmentType.CENTER },
    { header: 'NILAI AKHIR', field: 'nilaiAkhir', width: 1000, align: AlignmentType.CENTER, bold: true, fill: 'F1F5F9' },
  ];

  const dantonCols = [
    { header: 'RANK', field: 'rank', width: 600, align: AlignmentType.CENTER, bold: true },
    { header: 'NO. DADA', field: 'noDada', width: 780, align: AlignmentType.CENTER, bold: true },
    { header: 'KOMANDAN PELETON', field: 'danton', width: 2050, align: AlignmentType.LEFT, bold: true },
    { header: 'PELETON / SEKOLAH', field: 'sekolah', width: 2236, align: AlignmentType.LEFT },
    { header: 'JURI 1', field: 'juri1', width: 760, align: AlignmentType.CENTER },
    { header: 'JURI 2', field: 'juri2', width: 760, align: AlignmentType.CENTER },
    { header: 'JURI 3', field: 'juri3', width: 760, align: AlignmentType.CENTER },
    { header: 'MURNI', field: 'nilaiMurni', width: 840, align: AlignmentType.CENTER },
    { header: 'PENALTI', field: 'penalti', width: 780, align: AlignmentType.CENTER },
    { header: 'AKHIR', field: 'nilaiAkhir', width: 900, align: AlignmentType.CENTER, bold: true, fill: 'F1F5F9' },
  ];

  const doc = createDoc({
    kopBuffer: KOP_FULL_BUFFER,
    marginLeft: 720,
    marginRight: 720,
    children: [
      p([run('BERITA ACARA REKAPITULASI NILAI', { bold: true, size: 26, underline: true })], {
        align: AlignmentType.CENTER,
        after: 20,
      }),
      p([run('Nomor : {nomorBA}', { bold: true, size: 20 })], {
        align: AlignmentType.CENTER,
        after: 160,
      }),
      p(
        [
          run('Pada hari ini, '),
          run('{hariTanggal}', { bold: true }),
          run(' ('),
          run('{tanggalTerbilang}', { italics: true }),
          run('), bertempat di '),
          run('{tempat}', { bold: true }),
          run(', Dewan Juri bersama Panitia Bidang Juri dan Penilaian telah melaksanakan rekapitulasi hasil penilaian '),
          run("Lomba Baris-Berbaris Mu'allimin Tahun 2027", { bold: true }),
          run('.'),
        ],
        { align: AlignmentType.JUSTIFIED, after: 100 }
      ),
      p(
        [
          run(
            "Proses penilaian dan tabulasi nilai dilaksanakan secara terbuka, objektif, dan berjenjang berdasarkan hasil penilaian 3 (tiga) Dewan Juri, validasi penalti, serta verifikasi durasi tampil sesuai Petunjuk Teknis LBB Mu'allimin Tahun 2027. Adapun rincian rekapitulasi nilai yang menjadi dasar penerbitan Surat Keputusan Penetapan Pemenang adalah sebagai berikut:"
          ),
        ],
        { align: AlignmentType.JUSTIFIED, after: 140 }
      ),

      sectionHeading('BAGIAN I : REKAPITULASI NILAI PELETON', 80),
      sectionHeading('A. JENJANG SD / MI', 60),
      buildLoopTable({ columns: peletonCols, loopKey: 'peletonSdRows', totalWidthDxa: W }),
      sectionHeading('B. JENJANG SMP / MTs', 180),
      buildLoopTable({ columns: peletonCols, loopKey: 'peletonSmpRows', totalWidthDxa: W }),

      new Paragraph({ children: [new PageBreak()] }),

      sectionHeading('BAGIAN II : REKAPITULASI NILAI KOMANDAN PELETON (DANTON)', 0),
      sectionHeading('A. JENJANG SD / MI', 60),
      buildLoopTable({ columns: dantonCols, loopKey: 'dantonSdRows', totalWidthDxa: W }),
      sectionHeading('B. JENJANG SMP / MTs', 180),
      buildLoopTable({ columns: dantonCols, loopKey: 'dantonSmpRows', totalWidthDxa: W }),

      p(
        [
          run(
            "Demikian Berita Acara Rekapitulasi Nilai ini dibuat dengan sebenar-benarnya untuk dipergunakan sebagai dasar penerbitan Surat Keputusan Penetapan Pemenang Lomba Baris-Berbaris Mu'allimin Tahun 2027 serta kelengkapan administrasi kepanitiaan."
          ),
        ],
        { align: AlignmentType.JUSTIFIED, before: 180, after: 120 }
      ),
      p([run('Yogyakarta, {tanggalPendek}')], { align: AlignmentType.RIGHT, after: 100 }),
      buildSignatureTable(W),
    ],
  });

  await saveDoc('05_BA_Rekapitulasi_Nilai.docx', doc);
}

// =========================================================================
// 6. SURAT KEPUTUSAN PENETAPAN PEMENANG (SK.001) - margin normal 2,54 cm (9026 dxa)
// =========================================================================
async function genSKPemenangTemplate() {
  const W = 9026;

  const diktumRow = (label, bodyRuns, boldBody = false) =>
    new TableRow({
      children: [
        new TableCell({
          width: { size: 1700, type: WidthType.DXA },
          borders: NO_BORDERS,
          margins: { top: 30, bottom: 40, left: 0, right: 40 },
          children: [p([run(label, { bold: true, size: 19 })], { after: 0 })],
        }),
        new TableCell({
          width: { size: 220, type: WidthType.DXA },
          borders: NO_BORDERS,
          margins: { top: 30, bottom: 40, left: 0, right: 0 },
          children: [p([run(':', { size: 19 })], { after: 0 })],
        }),
        new TableCell({
          width: { size: W - 1920, type: WidthType.DXA },
          borders: NO_BORDERS,
          margins: { top: 30, bottom: 40, left: 0, right: 0 },
          children: Array.isArray(bodyRuns)
            ? bodyRuns
            : [p([run(bodyRuns, { bold: boldBody, size: 19 })], { align: AlignmentType.JUSTIFIED, after: 0 })],
        }),
      ],
    });

  const peletonCols = [
    { header: 'PREDIKAT', field: 'predikat', width: 1320, align: AlignmentType.LEFT, bold: true },
    { header: 'NO. DADA', field: 'noDada', width: 820, align: AlignmentType.CENTER, bold: true },
    { header: 'PELETON / SEKOLAH', field: 'sekolah', width: 3936, align: AlignmentType.LEFT, bold: true },
    { header: 'NILAI MURNI', field: 'nilaiMurni', width: 1000, align: AlignmentType.CENTER },
    { header: 'PENALTI', field: 'penalti', width: 900, align: AlignmentType.CENTER },
    { header: 'NILAI AKHIR', field: 'nilaiAkhir', width: 1050, align: AlignmentType.CENTER, bold: true, fill: 'F1F5F9' },
  ];

  const dantonCols = [
    { header: 'PREDIKAT', field: 'predikat', width: 1220, align: AlignmentType.LEFT, bold: true },
    { header: 'NO. DADA', field: 'noDada', width: 780, align: AlignmentType.CENTER, bold: true },
    { header: 'KOMANDAN PELETON', field: 'danton', width: 2426, align: AlignmentType.LEFT, bold: true },
    { header: 'PELETON / SEKOLAH', field: 'sekolah', width: 2650, align: AlignmentType.LEFT },
    { header: 'PENALTI', field: 'penalti', width: 900, align: AlignmentType.CENTER },
    { header: 'NILAI AKHIR', field: 'nilaiAkhir', width: 1050, align: AlignmentType.CENTER, bold: true, fill: 'F1F5F9' },
  ];

  const umumCols = [
    { header: 'PREDIKAT', field: 'predikat', width: 1800, align: AlignmentType.LEFT, bold: true },
    { header: 'SEKOLAH / INSTANSI', field: 'sekolah', width: 2700, align: AlignmentType.LEFT, bold: true },
    { header: 'RINCIAN PEROLEHAN POIN', field: 'rincian', width: 3426, align: AlignmentType.LEFT },
    { header: 'TOTAL POIN', field: 'totalPoin', width: 1100, align: AlignmentType.CENTER, bold: true, fill: 'F1F5F9' },
  ];

  const doc = createDoc({
    kopBuffer: KOP_FULL_BUFFER,
    children: [
      // HALAMAN 1: NASKAH SK
      p([run('SURAT KEPUTUSAN', { bold: true, size: 26, underline: true })], { align: AlignmentType.CENTER, after: 20 }),
      p([run('Nomor : {nomorSK}', { bold: true, size: 20 })], { align: AlignmentType.CENTER, after: 40 }),
      p([run('TENTANG', { bold: true, size: 20 })], { align: AlignmentType.CENTER, after: 20 }),
      p([run("PENETAPAN PEMENANG LOMBA BARIS-BERBARIS MU'ALLIMIN", { bold: true, size: 21 })], { align: AlignmentType.CENTER, after: 10 }),
      p([run('TAHUN 2027', { bold: true, size: 21 })], { align: AlignmentType.CENTER, after: 80 }),
      p([run("DEWAN JURI DAN PANITIA LOMBA BARIS-BERBARIS MU'ALLIMIN TAHUN 2027", { bold: true, size: 19 })], { align: AlignmentType.CENTER, after: 120 }),

      new Table({
        width: { size: W, type: WidthType.DXA },
        layout: TableLayoutType.FIXED,
        borders: NO_BORDERS,
        rows: [
          diktumRow('MENIMBANG', [
            p([run("a. bahwa dalam rangka pelaksanaan Lomba Baris-Berbaris Mu'allimin Tahun 2027 tingkat SD/MI ({jumlahSd} peleton) dan SMP/MTs ({jumlahSmp} peleton) dengan total {totalPeleton} peleton se-Daerah Istimewa Yogyakarta, telah dilaksanakan penilaian secara objektif dan transparan oleh Dewan Juri;", { size: 19 })], { align: AlignmentType.JUSTIFIED, after: 40 }),
            p([run('b. bahwa berdasarkan hasil rekapitulasi penilaian Dewan Juri pada hari {hariTanggal} bertempat di {tempat}, telah diperoleh peringkat resmi peserta pada seluruh kategori kejuaraan;', { size: 19 })], { align: AlignmentType.JUSTIFIED, after: 40 }),
            p([run("c. bahwa berdasarkan pertimbangan sebagaimana dimaksud pada huruf a dan huruf b di atas, perlu ditetapkan Surat Keputusan tentang Penetapan Pemenang Lomba Baris-Berbaris Mu'allimin Tahun 2027;", { size: 19 })], { align: AlignmentType.JUSTIFIED, after: 0 }),
          ]),
          diktumRow('MENGINGAT', [
            p([run("1. Petunjuk Pelaksanaan dan Petunjuk Teknis (Juknis) Lomba Baris-Berbaris Mu'allimin Tahun 2027;", { size: 19 })], { align: AlignmentType.JUSTIFIED, after: 30 }),
            p([run('2. Peraturan Panglima TNI Nomor 58 Tahun 2018 tentang Peraturan Baris-Berbaris (PBB);', { size: 19 })], { align: AlignmentType.JUSTIFIED, after: 30 }),
            p([run("3. Hasil Technical Meeting Peserta Lomba Baris-Berbaris Mu'allimin Tahun 2027 tanggal {tanggalTM}.", { size: 19 })], { align: AlignmentType.JUSTIFIED, after: 0 }),
          ]),
          diktumRow('MEMPERHATIKAN', [
            p([run("1. Berita Acara Rekapitulasi Nilai Lomba Baris-Berbaris Mu'allimin Tahun 2027 Nomor: {nomorBA} tanggal {tanggalPendek};", { size: 19 })], { align: AlignmentType.JUSTIFIED, after: 30 }),
            p([run("2. Hasil Sidang Pleno Dewan Juri dan Panitia Bidang Juri dan Penilaian Lomba Baris-Berbaris Mu'allimin Tahun 2027.", { size: 19 })], { align: AlignmentType.JUSTIFIED, after: 0 }),
          ]),
        ],
      }),

      p([run('MEMUTUSKAN', { bold: true, size: 20 })], { align: AlignmentType.CENTER, before: 80, after: 60 }),

      new Table({
        width: { size: W, type: WidthType.DXA },
        layout: TableLayoutType.FIXED,
        borders: NO_BORDERS,
        rows: [
          diktumRow(
            'MENETAPKAN',
            "KEPUTUSAN DEWAN JURI DAN PANITIA LOMBA BARIS-BERBARIS MU'ALLIMIN TAHUN 2027 TENTANG PENETAPAN PEMENANG LOMBA BARIS-BERBARIS MU'ALLIMIN TAHUN 2027;",
            true
          ),
          diktumRow(
            'KESATU',
            "Mengesahkan dan menetapkan para pemenang Lomba Baris-Berbaris Mu'allimin Tahun 2027 tingkat SD/MI dan SMP/MTs sebagaimana tercantum dalam Lampiran yang merupakan bagian tidak terpisahkan dari Surat Keputusan ini;"
          ),
          diktumRow(
            'KEDUA',
            "Keputusan Dewan Juri dan Panitia Lomba Baris-Berbaris Mu'allimin Tahun 2027 ini bersifat mutlak dan tidak dapat diganggu gugat;"
          ),
          diktumRow(
            'KETIGA',
            'Keputusan ini mulai berlaku sejak tanggal ditetapkan, dan apabila di kemudian hari diketahui terdapat kekeliruan pada Surat Keputusan ini, maka akan dilaksanakan perbaikan sebagaimana mestinya.'
          ),
        ],
      }),

      p([run('Ditetapkan di : Yogyakarta')], { align: AlignmentType.RIGHT, before: 120, after: 20, size: 19 }),
      p([run('Pada tanggal  : {tanggalPendek}', { bold: true })], { align: AlignmentType.RIGHT, after: 100, size: 19 }),
      buildSignatureTable(W),

      // HALAMAN 2: LAMPIRAN SK (A - D)
      new Paragraph({ children: [new PageBreak()] }),
      p([run("LAMPIRAN : SURAT KEPUTUSAN DEWAN JURI DAN PANITIA LBB MU'ALLIMIN TAHUN 2027", { bold: true, size: 18 })], { after: 20 }),
      p([run('Nomor     : {nomorSK}', { size: 18 })], { after: 20 }),
      p([run('Tanggal   : {tanggalPendek}', { size: 18 })], { after: 20 }),
      p([run("Tentang   : Penetapan Pemenang Lomba Baris-Berbaris Mu'allimin Tahun 2027", { size: 18 })], { after: 120 }),
      p([run("DAFTAR PEMENANG LOMBA BARIS-BERBARIS MU'ALLIMIN TAHUN 2027", { bold: true, size: 22 })], { align: AlignmentType.CENTER, after: 120 }),

      sectionHeading('A. JUARA HARAPAN PELETON SD / MI', 40),
      buildLoopTable({ columns: peletonCols, loopKey: 'harapanSdRows', totalWidthDxa: W }),
      sectionHeading('B. JUARA HARAPAN PELETON SMP / MTs', 140),
      buildLoopTable({ columns: peletonCols, loopKey: 'harapanSmpRows', totalWidthDxa: W }),
      sectionHeading('C. JUARA UTAMA PELETON SD / MI', 140),
      buildLoopTable({ columns: peletonCols, loopKey: 'utamaSdRows', totalWidthDxa: W }),
      sectionHeading('D. JUARA UTAMA PELETON SMP / MTs', 140),
      buildLoopTable({ columns: peletonCols, loopKey: 'utamaSmpRows', totalWidthDxa: W }),

      // HALAMAN 3: LAMPIRAN SK (E - G + TTD)
      new Paragraph({ children: [new PageBreak()] }),
      sectionHeading('E. JUARA KOMANDAN PELETON (DANTON) SD / MI', 0),
      buildLoopTable({ columns: dantonCols, loopKey: 'dantonSdRows', totalWidthDxa: W }),
      sectionHeading('F. JUARA KOMANDAN PELETON (DANTON) SMP / MTs', 140),
      buildLoopTable({ columns: dantonCols, loopKey: 'dantonSmpRows', totalWidthDxa: W }),
      sectionHeading('G. JUARA UMUM (PIALA BERGILIR)', 140),
      buildLoopTable({ columns: umumCols, loopKey: 'juaraUmumRows', totalWidthDxa: W }),
      p('', { after: 120 }),
      buildSignatureTable(W),
    ],
  });

  await saveDoc('06_SK_Penetapan_Pemenang.docx', doc);
}

async function main() {
  console.log('Membuat 6 template Word (.docx) di public/templates/ ...');
  await genBasecampTemplate();
  await genLotteryTemplate();
  await genTrialScheduleTemplate();
  await genDP1Template();
  await genBARekapNilaiTemplate();
  await genSKPemenangTemplate();
  console.log('Selesai! Semua template siap diedit di Microsoft Word.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
