"""
Generator Dokumen Resmi Dewan Juri LBB Mu'allimin Tahun 2027
Menghasilkan 4 file Microsoft Word (.docx) siap cetak & siap isi di folder dokumen-juri/:
  1. 01_Rubrik_Form_Penilaian_Juri_SD_LBB_Muallimin_2027.docx
  2. 02_Rubrik_Form_Penilaian_Juri_SMP_LBB_Muallimin_2027.docx
  3. 03_Formulir_CV_Dewan_Juri_LBB_Muallimin_2027.docx
  4. 04_Pakta_Integritas_Dewan_Juri_LBB_Muallimin_2027.docx

Sumber data resmi: src/config.js & src/data/juknisDocsData.js
"""

import os
import re
from PIL import Image
import docx
from docx import Document
from docx.shared import Inches, Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls

# ---------------------------------------------------------------------------
# KONFIGURASI PATH & BRANDING WARNA
# ---------------------------------------------------------------------------
ROOT_DIR = r"D:\lbbmuallimin"
KOP_PATH = os.path.join(ROOT_DIR, "public", "kop-lbb.png")
OUT_DIR = os.path.join(ROOT_DIR, "dokumen-juri")
TMP_DIR = os.path.join(OUT_DIR, "_tmp_assets")

os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs(TMP_DIR, exist_ok=True)

# Palet warna resmi LBB Mu'allimin 2027
HEX_NAVY = "1B2A4A"
HEX_MAROON = "991B1B"
HEX_GOLD = "B45309"
HEX_SLATE_DARK = "334155"
HEX_SLATE_LIGHT = "F1F5F9"
HEX_SLATE_ZEBRA = "F8FAFC"
HEX_BORDER = "94A3B8"
HEX_BORDER_LIGHT = "CBD5E1"

# Warna header predikat
HEX_TL_BG = "FFE4E6"
HEX_KS_BG = "E2E8F0"
HEX_K_BG = "FEE2E2"
HEX_C_BG = "FEF3C7"
HEX_B_BG = "D1FAE5"
HEX_BS_BG = "DBEAFE"

RGB_NAVY = RGBColor(0x1B, 0x2A, 0x4A)
RGB_MAROON = RGBColor(0x99, 0x1B, 0x1B)
RGB_DARK = RGBColor(0x1E, 0x29, 0x3B)
RGB_MUTED = RGBColor(0x47, 0x55, 0x69)
RGB_WHITE = RGBColor(0xFF, 0xFF, 0xFF)
RGB_ROSE = RGBColor(0xBE, 0x12, 0x3C)


# ---------------------------------------------------------------------------
# PERSIAPAN ASET KOP SURAT (CROP HEADER & FOOTER DARI kop-lbb.png)
# ---------------------------------------------------------------------------
def prepare_kop_assets():
    im = Image.open(KOP_PATH).convert("RGB")
    w, h = im.size
    header_crop = im.crop((0, 45, w, 325))
    footer_crop = im.crop((0, 3045, w, h))

    header_path = os.path.join(TMP_DIR, "kop_header.png")
    footer_path = os.path.join(TMP_DIR, "kop_footer.png")
    header_crop.save(header_path, "PNG")
    footer_crop.save(footer_path, "PNG")
    return header_path, footer_path


# ---------------------------------------------------------------------------
# DATA RESMI MATERI & SKALA RUBRIK (100% SINKRON DENGAN src/config.js)
# ---------------------------------------------------------------------------
MATERIALS_SD = [
    "Penghormatan Dewan Juri(Aba-aba Pelaksanaan Waktu Dimulai) – Laporan Pembuka",
    "Istirahat Di Tempat",
    "Periksa Kerapian(Parade) – Sikap Sempurna",
    "Setengah Lengan Lencang Kanan",
    "Balik Kanan",
    "Lencang Kiri",
    "Hitung(Bersaf) – Hadap Kiri",
    "Buka Barisan",
    "Hadap Serong Kiri – Balik Kanan",
    "3 Langkah Ke Depan – Hadap Kanan",
    "4 Langkah Ke Belakang – Hadap Serong Kiri",
    "Tutup Barisan",
    "Lencang Depan",
    "Hitung(Berbanjar)",
    "Hadap Kanan",
    "Bubar",
    "Berkumpul(Berbanjar) – Sikap Sempurna",
    "Langkah Biasa(Dari Posisi Berhenti)",
    "Tiap-tiap Banjar 2X Belok Kiri",
    "Langkah Tegap(Dari Posisi Langkah Biasa)",
    "Hormat Kanan – Jalan Di Tempat – Henti",
    "Tiap-tiap Banjar 2X Belok Kanan(Dari Posisi Berhenti)",
    "Melintang Kanan(Berjalan ke Berjalan) – Maju Jalan – Henti",
    "Balik Kanan Maju – Haluan Kanan(Berjalan ke Berhenti) – Henti",
    "Untuk Perhatian, Istirahat di Tempat** – Sikap Sempurna",
    "Laporan Penutup – Penghormatan Dewan Juri(Aba-aba Pelaksanaan Waktu Berakhir)",
]

MATERIALS_SMP = [
    "Penghormatan Dewan Juri(Aba-aba Pelaksanaan Waktu Dimulai) – Laporan Pembuka",
    "Hadap Kanan Maju(Dari Posisi Berhenti)",
    "Melintang Kanan(Berjalan ke Berhenti) – Henti – Balik Kanan",
    "Langkah Tegap – Haluan Kanan(Berjalan ke Berhenti) – Henti",
    "Hadap Kiri Maju(Dari Posisi Berhenti) – Tiap-tiap Banjar 2X Belok Kanan",
    "Balik Kanan Maju(Dari Posisi Berjalan) – Ganti Langkah",
    "2X Belok Kiri",
    "Lari(Dari Langkah Biasa)",
    "Tiap-tiap Banjar 2X Belok Kanan(Berlari ke Berlari)",
    "Langkah Biasa",
    "Tiap-tiap Banjar 2X Belok Kiri – Hadap Serong Kiri Henti",
    "Lari(Dari Posisi Berhenti)",
    "Balik Kanan Lari Maju – Hadap Kiri Henti",
    "Hadap Serong Kiri Maju – 2X Belok Kiri",
    "Langkah Tegap",
    "Hormat Kanan – Jalan di Tempat",
    "Tiap-tiap Banjar 2X Belok Kiri(Dari Jalan di Tempat)",
    "Langkah Perlahan(Dari Langkah Biasa) – Henti",
    "Hadap Kiri – Bubar",
    "Berhimpun** – Selesai",
    "Berkumpul(Bersaf) – Sikap Sempurna",
    "Setengah Lengan Lencang Kanan – Balik Kanan",
    "Lencang Kiri – Hitung",
    "Hadap Serong Kiri – 3 Langkah Ke Depan",
    "Hadap Kanan – 4 Langkah Ke Belakang",
    "Balik Kanan – Hadap Serong Kanan – Hadap Kiri",
    "Istirahat Di Tempat(Parade) – Periksa Kerapian(Parade) – Sikap Sempurna",
    "Laporan Penutup – Penghormatan Dewan Juri(Aba-aba Pelaksanaan Waktu Berakhir)",
]

RUBRIC_SCALES = {
    "SEDERHANA": {
        "KS": "50",
        "K": "53  56  59",
        "C": "62  65  68",
        "B": "71  74  77",
        "BS": "80",
    },
    "MENENGAH": {
        "KS": "50",
        "K": "53  57  60",
        "C": "64  67  71",
        "B": "74  78  81",
        "BS": "85",
    },
    "KOMPLEKS": {
        "KS": "50",
        "K": "54  58  62",
        "C": "66  70  74",
        "B": "78  82  86",
        "BS": "90",
    },
}

DANTON_CRITERIA = [
    (
        "Penguasaan Materi Lomba",
        "35%",
        "Urutan gerakan sesuai juknis, kelengkapan materi, kesinambungan gerakan berangkai",
    ),
    (
        "Kualitas Suara / Vokal",
        "25%",
        "Kejelasan, ketegasan, intonasi, volume, serta ketepatan jeda aba-aba peringatan & pelaksanaan",
    ),
    (
        "Sikap & Pelaporan",
        "20%",
        "Sikap sempurna, ketegasan penghormatan, kelancaran & ketepatan kalimat laporan pembuka/penutup",
    ),
    (
        "Penguasaan Lapangan",
        "20%",
        "Posisi di kotak danton 1,5×1,5 m, efektivitas gerakan penyesuaian, pengaturan ruang & waktu",
    ),
]

PENALTY_REF = [
    ("Keluar / Menginjak Garis Batas Arena Luar", "-50 Poin / kejadian", "Nilai Peleton", "Dicatat Hakim Garis"),
    ("Kelebihan Durasi Waktu Tampil (SD > 8 mnt / SMP > 12 mnt)", "-20 Poin / 1–30 dtk", "Nilai Peleton", "Dicatat Timer Lapangan"),
    ("Jumlah Personel Kurang (< 22 orang tampil)", "-75 Poin (tetap)", "Nilai Peleton", "Kecuali evakuasi medis"),
    ("Terlambat Masuk DP 1 (3× panggilan interval 2 mnt)", "-100 Poin & geser akhir", "Nilai Peleton", "Tanpa konfirmasi = Diskualifikasi"),
    ("Tidak Mengikuti Upacara Pembukaan (Urutan 6–10)", "-150 Poin", "Nilai Peleton", "Wajib 1 Danton + 15 Anggota"),
    ("Terlambat Upacara Pembukaan", "-50 Poin / 5 menit", "Nilai Peleton", "Maks. toleransi 15 menit"),
    ("Basecamp Kotor / Sampah Tidak Diserahkan", "-150 Poin", "Nilai Peleton", "Pasal 14 Tatib & Bab C.8"),
    ("Pelanggaran Kawasan Tanpa Rokok & Vape", "-75 Poin / kejadian", "Nilai Peleton", "Setelah teguran panitia"),
    ("Yel-Yel / Teriakan Mengganggu Jalannya Lomba", "-50 Poin (ke-3 dst)", "Nilai Peleton", "Pelanggaran 1–2 peringatan lisan"),
    ("Danton Menginjak / Keluar Kotak Danton (1,5 × 1,5 m)", "-10 Poin / kejadian", "Nilai Danton", "Dicatat Hakim Garis"),
    ("Gerakan Terlewat tapi Dilakukan di Luar Urutan / Berangkai Terputus", "Nilai Minimal (50)", "Peleton & Danton", "Mengurangi Penguasaan Materi Danton"),
    ("Gerakan Terlewat & Tidak Dilaksanakan Sama Sekali", "Nilai 0 (Nol)", "Peleton & Danton", "Mengurangi Penguasaan Materi Danton"),
    ("Gerakan Penyesuaian / Atribut Terjatuh di Arena", "0 Poin (Bebas Penalti)", "—", "Penyesuaian dinilai kualitatif pd Danton"),
]


def get_scale_template(materi_text: str) -> str:
    lower = (materi_text or "").lower()
    if any(
        kw in lower
        for kw in [
            "periksa kerapian",
            "langkah tegap",
            "hormat kanan",
            "melintang",
            "haluan",
            "2x belok",
            "lari",
            "ganti langkah",
        ]
    ):
        return "KOMPLEKS"
    if any(
        kw in lower
        for kw in [
            "langkah biasa",
            "langkah ke",
            "buka barisan",
            "tutup barisan",
            "bubar",
            "berkumpul",
            "berhimpun",
            "langkah perlahan",
            "maju",
            "– hadap",
            "– balik",
        ]
    ):
        return "MENENGAH"
    return "SEDERHANA"


def split_material_movements(materi_text: str):
    trimmed = (materi_text or "").strip()
    if not trimmed:
        return []
    if re.search(r"penghormatan.*laporan|laporan.*penghormatan", trimmed, re.I) or re.search(
        r"berhimpun.*selesai", trimmed, re.I
    ):
        return [trimmed]

    raw_parts = [s.strip() for s in re.split(r"\s*[\u2013\u2014]\s*|\s+-\s+", trimmed) if s.strip()]
    merged = []
    for part in raw_parts:
        if re.match(r"^henti$", part, re.I) and merged:
            merged[-1] = f"{merged[-1]} – {part}"
        else:
            merged.append(part)
    return merged if merged else [trimmed]


def parse_materials_list(materials_list):
    result = []
    for idx, text in enumerate(materials_list):
        parts = split_material_movements(text)
        movements = []
        for sub_idx, name in enumerate(parts):
            t_key = get_scale_template(name)
            movements.append({"name": name, "template_key": t_key, "scale": RUBRIC_SCALES[t_key]})
        result.append({"number": idx + 1, "raw_text": text, "movements": movements})
    return result


# ---------------------------------------------------------------------------
# XML HELPER FUNCTIONS UNTUK PYTHON-DOCX
# ---------------------------------------------------------------------------
def set_cell_shading(cell, fill_hex: str):
    shading = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    cell._tc.get_or_add_tcPr().append(shading)


def set_cell_margins(cell, top=40, bottom=40, left=70, right=70):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement("w:tcMar")
    for m, val in [("top", top), ("bottom", bottom), ("left", left), ("right", right)]:
        node = OxmlElement(f"w:{m}")
        node.set(qn("w:w"), str(val))
        node.set(qn("w:type"), "dxa")
        tcMar.append(node)
    tcPr.append(tcMar)


def set_table_borders(table, color=HEX_BORDER, sz="4", val="single"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:left w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:right w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideV w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f"</w:tblBorders>"
    )
    tblPr.append(borders)


def set_table_no_borders(table):
    set_table_borders(table, color="FFFFFF", sz="0", val="none")


def set_cell_borders(cell, top=None, bottom=None, left=None, right=None):
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = OxmlElement("w:tcBorders")
    for side, cfg in [("top", top), ("bottom", bottom), ("left", left), ("right", right)]:
        if cfg is not None:
            el = OxmlElement(f"w:{side}")
            el.set(qn("w:val"), cfg.get("val", "single"))
            el.set(qn("w:sz"), str(cfg.get("sz", 4)))
            el.set(qn("w:space"), "0")
            el.set(qn("w:color"), cfg.get("color", HEX_BORDER))
            tcBorders.append(el)
    tcPr.append(tcBorders)


def set_row_repeat_header(row):
    trPr = row._tr.get_or_add_trPr()
    trPr.append(OxmlElement("w:tblHeader"))


def set_row_cant_split(row):
    trPr = row._tr.get_or_add_trPr()
    trPr.append(OxmlElement("w:cantSplit"))


def set_row_height(row, cm_height, rule="atLeast"):
    trPr = row._tr.get_or_add_trPr()
    trHeight = OxmlElement("w:trHeight")
    trHeight.set(qn("w:val"), str(int(cm_height * 567)))  # 1 cm ≈ 567 twips
    trHeight.set(qn("w:hRule"), rule)
    trPr.append(trHeight)


def add_bottom_border_to_paragraph(paragraph, color=HEX_NAVY, sz="12"):
    pPr = paragraph._p.get_or_add_pPr()
    pBdr = parse_xml(
        f'<w:pBdr {nsdecls("w")}>'
        f'<w:bottom w:val="single" w:sz="{sz}" w:space="3" w:color="{color}"/>'
        f"</w:pBdr>"
    )
    pPr.append(pBdr)


def add_page_number_field(run):
    fldChar1 = parse_xml(r'<w:fldChar %s w:fldCharType="begin"/>' % nsdecls("w"))
    instrText = parse_xml(r'<w:instrText %s xml:space="preserve"> PAGE </w:instrText>' % nsdecls("w"))
    fldChar2 = parse_xml(r'<w:fldChar %s w:fldCharType="separate"/>' % nsdecls("w"))
    fldChar3 = parse_xml(r'<w:fldChar %s w:fldCharType="end"/>' % nsdecls("w"))
    run._r.append(fldChar1)
    run._r.append(instrText)
    run._r.append(fldChar2)
    run._r.append(fldChar3)


def add_numpages_field(run):
    fldChar1 = parse_xml(r'<w:fldChar %s w:fldCharType="begin"/>' % nsdecls("w"))
    instrText = parse_xml(r'<w:instrText %s xml:space="preserve"> NUMPAGES </w:instrText>' % nsdecls("w"))
    fldChar2 = parse_xml(r'<w:fldChar %s w:fldCharType="separate"/>' % nsdecls("w"))
    fldChar3 = parse_xml(r'<w:fldChar %s w:fldCharType="end"/>' % nsdecls("w"))
    run._r.append(fldChar1)
    run._r.append(instrText)
    run._r.append(fldChar2)
    run._r.append(fldChar3)


def configure_base_doc(
    header_img_path,
    footer_img_path=None,
    top_cm=2.5,
    bottom_cm=1.5,
    left_cm=1.2,
    right_cm=1.2,
    compact_footer_text=None,
):
    doc = Document()
    section = doc.sections[0]
    section.page_width = Cm(21.0)
    section.page_height = Cm(29.7)
    section.top_margin = Cm(top_cm)
    section.bottom_margin = Cm(bottom_cm)
    section.left_margin = Cm(left_cm)
    section.right_margin = Cm(right_cm)
    section.header_distance = Cm(0.4)
    section.footer_distance = Cm(0.3 if footer_img_path else 0.5)

    # Default style
    normal = doc.styles["Normal"]
    normal.font.name = "Calibri"
    normal.font.size = Pt(10)
    normal.font.color.rgb = RGB_DARK

    # Header dengan Kop Resmi LBB Mu'allimin 2027
    header = section.header
    hp = header.paragraphs[0]
    hp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    hp.paragraph_format.space_before = Pt(0)
    hp.paragraph_format.space_after = Pt(2)
    hrun = hp.add_run()
    usable_w = 21.0 - left_cm - right_cm
    hrun.add_picture(header_img_path, width=Cm(min(usable_w + 0.6, 19.6)))
    add_bottom_border_to_paragraph(hp, color=HEX_NAVY, sz="12")

    # Footer
    footer = section.footer
    fp = footer.paragraphs[0]
    fp.paragraph_format.space_before = Pt(0)
    fp.paragraph_format.space_after = Pt(0)
    if footer_img_path:
        fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        frun = fp.add_run()
        frun.add_picture(footer_img_path, width=Cm(19.6))
    elif compact_footer_text:
        fp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        r1 = fp.add_run(compact_footer_text + "   |   Halaman ")
        r1.font.name = "Calibri"
        r1.font.size = Pt(7.5)
        r1.font.color.rgb = RGB_MUTED
        r_pg = fp.add_run()
        r_pg.font.name = "Calibri"
        r_pg.font.size = Pt(7.5)
        r_pg.font.color.rgb = RGB_MUTED
        add_page_number_field(r_pg)
        r_of = fp.add_run(" dari ")
        r_of.font.name = "Calibri"
        r_of.font.size = Pt(7.5)
        r_of.font.color.rgb = RGB_MUTED
        r_tot = fp.add_run()
        r_tot.font.name = "Calibri"
        r_tot.font.size = Pt(7.5)
        r_tot.font.color.rgb = RGB_MUTED
        add_numpages_field(r_tot)

    return doc


def write_cell_text(
    cell,
    text,
    bold=False,
    italic=False,
    size=9,
    color=RGB_DARK,
    align=WD_ALIGN_PARAGRAPH.LEFT,
    font_name="Calibri",
    space_before=0,
    space_after=0,
):
    p = cell.paragraphs[0]
    p.alignment = align
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.05
    run = p.add_run(text)
    run.font.name = font_name
    run.font.size = Pt(size)
    run.bold = bold
    run.italic = italic
    run.font.color.rgb = color
    cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
    return p


def add_section_heading(doc, text, space_before=8, space_after=4):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    cell = tbl.cell(0, 0)
    cell.width = Cm(18.6)
    set_cell_shading(cell, HEX_NAVY)
    set_cell_margins(cell, top=55, bottom=55, left=110, right=110)
    set_table_no_borders(tbl)
    write_cell_text(cell, text, bold=True, size=9.5, color=RGB_WHITE, align=WD_ALIGN_PARAGRAPH.LEFT)
    p_spacer = doc.add_paragraph()
    p_spacer.paragraph_format.space_before = Pt(0)
    p_spacer.paragraph_format.space_after = Pt(space_after)
    return tbl


# ---------------------------------------------------------------------------
# 1 & 2. GENERATOR RUBRIK / FORM PENILAIAN DEWAN JURI (SD & SMP)
# ---------------------------------------------------------------------------
def build_scoring_form(jenjang: str, header_path: str):
    is_sd = jenjang == "SD"
    materials_raw = MATERIALS_SD if is_sd else MATERIALS_SMP
    parsed = parse_materials_list(materials_raw)
    total_sub = sum(len(it["movements"]) for it in parsed)

    level_title = "TINGKAT SD / MI SEDERAJAT" if is_sd else "TINGKAT SMP / MTs SEDERAJAT"
    arena_info = (
        "ARENA 1 (LAPANGAN BASKET • 25 × 14 M)  |  DURASI MAKS. 8 MENIT"
        if is_sd
        else "ARENA 2 (PELATARAN EMBUNG • 26 × 15 M)  |  DURASI MAKS. 12 MENIT"
    )
    footer_label = f"LBB Mu'allimin 2027 • Formulir & Rubrik Penilaian Dewan Juri ({jenjang}) • lbb.tontimuallimin.com"

    doc = configure_base_doc(
        header_img_path=header_path,
        footer_img_path=None,
        top_cm=2.6,
        bottom_cm=1.3,
        left_cm=1.1,
        right_cm=1.1,
        compact_footer_text=footer_label,
    )

    # Judul Dokumen
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(2)
    p_title.paragraph_format.space_after = Pt(1)
    r = p_title.add_run("FORMULIR & RUBRIK PENILAIAN DEWAN JURI")
    r.bold = True
    r.font.size = Pt(13)
    r.font.color.rgb = RGB_NAVY

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(5)
    r1 = p_sub.add_run(f"{level_title}\n")
    r1.bold = True
    r1.font.size = Pt(10.5)
    r1.font.color.rgb = RGB_MAROON
    r2 = p_sub.add_run(arena_info)
    r2.bold = True
    r2.font.size = Pt(8.5)
    r2.font.color.rgb = RGB_MUTED

    # Tabel Identitas Peleton & Dewan Juri
    id_tbl = doc.add_table(rows=4, cols=4)
    id_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    id_tbl.autofit = False
    set_table_borders(id_tbl, color=HEX_BORDER_LIGHT, sz="4")
    id_widths = [Cm(3.3), Cm(6.1), Cm(3.2), Cm(6.2)]
    id_rows_data = [
        ("Nomor Dada / Urut", ": ...............................................", "Pos Dewan Juri", ":  [  ] Juri 1    [  ] Juri 2    [  ] Juri 3"),
        ("Nama Sekolah", ": ...............................................", "Nama Dewan Juri", ": ..............................................."),
        ("Kategori Peleton", ":  [  ] Putra   [  ] Putri   [  ] Campuran", "Unsur Dewan Juri", ":  [  ] TNI    [  ] POLRI    [  ] Profesional"),
        ("Durasi Tampil (Timer)", ": ........ menit ........ detik", "Hari / Tanggal", ":  Ahad, 24 Januari 2027"),
    ]
    for r_idx, row_vals in enumerate(id_rows_data):
        row = id_tbl.rows[r_idx]
        set_row_cant_split(row)
        for c_idx, val in enumerate(row_vals):
            cell = row.cells[c_idx]
            cell.width = id_widths[c_idx]
            set_cell_margins(cell, top=32, bottom=32, left=65, right=65)
            is_label = c_idx in (0, 2)
            if is_label:
                set_cell_shading(cell, HEX_SLATE_LIGHT)
            write_cell_text(cell, val, bold=is_label, size=8.5, color=RGB_NAVY if is_label else RGB_DARK)

    # Box Panduan Sistem Coret 5 Predikat Baku
    p_sp = doc.add_paragraph()
    p_sp.paragraph_format.space_before = Pt(3)
    p_sp.paragraph_format.space_after = Pt(0)

    guide_tbl = doc.add_table(rows=1, cols=1)
    guide_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    guide_tbl.autofit = False
    g_cell = guide_tbl.cell(0, 0)
    g_cell.width = Cm(18.8)
    set_cell_shading(g_cell, "FFFBEB")
    set_table_borders(guide_tbl, color="F59E0B", sz="6")
    set_cell_margins(g_cell, top=45, bottom=45, left=90, right=90)
    gp = g_cell.paragraphs[0]
    gp.paragraph_format.space_before = Pt(0)
    gp.paragraph_format.space_after = Pt(0)
    gp.paragraph_format.line_spacing = 1.12
    for txt, bld, clr in [
        ("PETUNJUK PENILAIAN (SISTEM CORET 5 PREDIKAT BAKU): ", True, RGB_MAROON),
        ("Coret atau lingkari langsung 1 (satu) nominal angka pada setiap baris gerakan, lalu tuliskan angkanya di kolom Skor. ", False, RGB_DARK),
        ("0/TL", True, RGB_ROSE),
        (" = Terlewat & tidak dilakukan (0 poin). ", False, RGB_DARK),
        ("KS", True, RGB_NAVY),
        (" = Kurang Sekali / Minimal 50 (termasuk gerakan terlewat yang dilakukan di luar urutan atau gerakan berangkai terputus). ", False, RGB_DARK),
        ("K", True, RGB_MAROON),
        (" = Kurang (Teknik Salah & Tidak Kompak) • ", False, RGB_DARK),
        ("C", True, RGB_NAVY),
        (" = Cukup (Teknik Salah & Kompak) • ", False, RGB_DARK),
        ("B", True, RGB_NAVY),
        (" = Baik (Teknik Benar & Tidak Kompak) • ", False, RGB_DARK),
        ("BS", True, RGB_NAVY),
        (" = Baik Sekali (Teknik Benar & Kompak). ", False, RGB_DARK),
        ("Acuan: Perpang TNI No. 57 & 58 Tahun 2018; khusus Hormat Kanan mengacu Perpang TNI No. 45 Tahun 2014.", True, RGB_MUTED),
    ]:
        rr = gp.add_run(txt)
        rr.font.name = "Calibri"
        rr.font.size = Pt(7.8)
        rr.bold = bld
        rr.font.color.rgb = clr

    # Bagian A: Tabel Penilaian PBB Peleton
    p_sec_a = doc.add_paragraph()
    p_sec_a.paragraph_format.space_before = Pt(6)
    p_sec_a.paragraph_format.space_after = Pt(2)
    ra = p_sec_a.add_run(
        f"A. PENILAIAN MATERI PBB PELETON ({len(materials_raw)} Nomor Materi / {total_sub} Baris Penilaian)"
    )
    ra.bold = True
    ra.font.size = Pt(9.5)
    ra.font.color.rgb = RGB_NAVY

    # Kolom: No | Materi Gerakan | 0/TL | KS | Kurang (K) | Cukup (C) | Baik (B) | BS | Skor
    col_widths = [
        Cm(0.8),   # No
        Cm(6.7),   # Materi Gerakan
        Cm(0.95),  # 0/TL
        Cm(0.95),  # KS
        Cm(2.25),  # K
        Cm(2.25),  # C
        Cm(2.25),  # B
        Cm(1.0),   # BS
        Cm(1.65),  # Skor
    ]
    # Total width = 18.8 cm (A4 21.0 - 2*1.1 = 18.8 cm)

    pbb_tbl = doc.add_table(rows=1, cols=9)
    pbb_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    pbb_tbl.autofit = False
    set_table_borders(pbb_tbl, color=HEX_BORDER, sz="4")

    hdr_row = pbb_tbl.rows[0]
    set_row_repeat_header(hdr_row)
    set_row_cant_split(hdr_row)
    headers = [
        ("No", HEX_NAVY, RGB_WHITE),
        ("Materi Gerakan PBB", HEX_NAVY, RGB_WHITE),
        ("0/TL", HEX_TL_BG, RGB_ROSE),
        ("KS", HEX_KS_BG, RGB_DARK),
        ("Kurang (K)", HEX_K_BG, RGB_MAROON),
        ("Cukup (C)", HEX_C_BG, RGBColor(0x92, 0x40, 0x0E)),
        ("Baik (B)", HEX_B_BG, RGBColor(0x06, 0x5F, 0x46)),
        ("BS", HEX_BS_BG, RGBColor(0x1E, 0x40, 0xAF)),
        ("Skor", HEX_NAVY, RGB_WHITE),
    ]
    for c_idx, (h_text, bg, fg) in enumerate(headers):
        cell = hdr_row.cells[c_idx]
        cell.width = col_widths[c_idx]
        set_cell_shading(cell, bg)
        set_cell_margins(cell, top=40, bottom=40, left=35, right=35)
        write_cell_text(
            cell,
            h_text,
            bold=True,
            size=8,
            color=fg,
            align=WD_ALIGN_PARAGRAPH.LEFT if c_idx == 1 else WD_ALIGN_PARAGRAPH.CENTER,
        )

    for item_idx, item in enumerate(parsed):
        zebra = item_idx % 2 == 1
        start_row_idx = len(pbb_tbl.rows)
        for sub_idx, mov in enumerate(item["movements"]):
            row = pbb_tbl.add_row()
            set_row_cant_split(row)
            sc = mov["scale"]
            vals = [
                str(item["number"]) if sub_idx == 0 else "",
                mov["name"],
                "0",
                sc["KS"],
                sc["K"],
                sc["C"],
                sc["B"],
                sc["BS"],
                "",
            ]
            for c_idx, val in enumerate(vals):
                cell = row.cells[c_idx]
                cell.width = col_widths[c_idx]
                set_cell_margins(cell, top=26, bottom=26, left=35 if c_idx != 1 else 55, right=35)
                if zebra and c_idx not in (8,):
                    set_cell_shading(cell, HEX_SLATE_ZEBRA)
                elif c_idx == 8:
                    set_cell_shading(cell, "F8FAFC")
                write_cell_text(
                    cell,
                    val,
                    bold=(c_idx == 0),
                    size=8 if c_idx == 1 else 8.2,
                    color=RGB_ROSE if c_idx == 2 else RGB_DARK,
                    align=WD_ALIGN_PARAGRAPH.LEFT if c_idx == 1 else WD_ALIGN_PARAGRAPH.CENTER,
                    font_name="Consolas" if c_idx in (2, 3, 4, 5, 6, 7) else "Calibri",
                )
        # Merge kolom No jika item memiliki > 1 sub-gerakan
        if len(item["movements"]) > 1:
            end_row_idx = len(pbb_tbl.rows) - 1
            top_cell = pbb_tbl.cell(start_row_idx, 0)
            bot_cell = pbb_tbl.cell(end_row_idx, 0)
            top_cell.merge(bot_cell)
            top_cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER

    # Baris Total PBB
    tot_row = pbb_tbl.add_row()
    set_row_cant_split(tot_row)
    set_row_height(tot_row, 0.72)
    merged_lbl = tot_row.cells[0].merge(tot_row.cells[7])
    set_cell_shading(merged_lbl, HEX_SLATE_LIGHT)
    set_cell_margins(merged_lbl, top=45, bottom=45, left=80, right=80)
    write_cell_text(
        merged_lbl,
        "JUMLAH SKOR MATERI PBB PELETON (DEWAN JURI INI)",
        bold=True,
        size=8.8,
        color=RGB_NAVY,
        align=WD_ALIGN_PARAGRAPH.RIGHT,
    )
    tot_val_cell = tot_row.cells[8]
    tot_val_cell.width = col_widths[8]
    set_cell_shading(tot_val_cell, "FFFBEB")
    write_cell_text(tot_val_cell, "", bold=True, size=9.5, align=WD_ALIGN_PARAGRAPH.CENTER)

    # Bagian B: Tabel Penilaian Komandan Peleton (Danton)
    p_sec_b = doc.add_paragraph()
    p_sec_b.paragraph_format.space_before = Pt(8)
    p_sec_b.paragraph_format.space_after = Pt(2)
    rb = p_sec_b.add_run("B. PENILAIAN KOMANDAN PELETON (DANTON) — SKALA MAKSIMAL 90")
    rb.bold = True
    rb.font.size = Pt(9.5)
    rb.font.color.rgb = RGB_NAVY

    d_widths = [
        Cm(0.75),  # No
        Cm(5.75),  # Aspek
        Cm(1.15),  # Bobot
        Cm(0.9),   # KS
        Cm(2.15),  # K
        Cm(2.15),  # C
        Cm(2.15),  # B
        Cm(0.95),  # BS
        Cm(1.3),   # Skor
        Cm(1.55),  # Skor x Bobot
    ]
    d_tbl = doc.add_table(rows=1, cols=10)
    d_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    d_tbl.autofit = False
    set_table_borders(d_tbl, color=HEX_BORDER, sz="4")

    dh_row = d_tbl.rows[0]
    set_row_repeat_header(dh_row)
    set_row_cant_split(dh_row)
    d_headers = [
        ("No", HEX_NAVY, RGB_WHITE),
        ("Aspek Penilaian Komandan (Danton)", HEX_NAVY, RGB_WHITE),
        ("Bobot", HEX_NAVY, RGB_WHITE),
        ("KS", HEX_KS_BG, RGB_DARK),
        ("Kurang (K)", HEX_K_BG, RGB_MAROON),
        ("Cukup (C)", HEX_C_BG, RGBColor(0x92, 0x40, 0x0E)),
        ("Baik (B)", HEX_B_BG, RGBColor(0x06, 0x5F, 0x46)),
        ("BS", HEX_BS_BG, RGBColor(0x1E, 0x40, 0xAF)),
        ("Skor", HEX_NAVY, RGB_WHITE),
        ("Terbobot", HEX_NAVY, RGB_WHITE),
    ]
    for c_idx, (h_text, bg, fg) in enumerate(d_headers):
        cell = dh_row.cells[c_idx]
        cell.width = d_widths[c_idx]
        set_cell_shading(cell, bg)
        set_cell_margins(cell, top=40, bottom=40, left=30, right=30)
        write_cell_text(
            cell,
            h_text,
            bold=True,
            size=7.8,
            color=fg,
            align=WD_ALIGN_PARAGRAPH.LEFT if c_idx == 1 else WD_ALIGN_PARAGRAPH.CENTER,
        )

    d_scale = RUBRIC_SCALES["KOMPLEKS"]
    for idx, (cname, weight, desc) in enumerate(DANTON_CRITERIA):
        row = d_tbl.add_row()
        set_row_cant_split(row)
        vals = [
            str(idx + 1),
            None,  # custom rich text
            weight,
            d_scale["KS"],
            d_scale["K"],
            d_scale["C"],
            d_scale["B"],
            d_scale["BS"],
            "",
            "",
        ]
        for c_idx, val in enumerate(vals):
            cell = row.cells[c_idx]
            cell.width = d_widths[c_idx]
            set_cell_margins(cell, top=32, bottom=32, left=30 if c_idx != 1 else 55, right=30)
            if idx % 2 == 1 and c_idx not in (8, 9):
                set_cell_shading(cell, HEX_SLATE_ZEBRA)
            elif c_idx in (8, 9):
                set_cell_shading(cell, "F8FAFC")

            if c_idx == 1:
                p = cell.paragraphs[0]
                p.paragraph_format.space_before = Pt(0)
                p.paragraph_format.space_after = Pt(0)
                p.paragraph_format.line_spacing = 1.05
                r_n = p.add_run(cname + "\n")
                r_n.bold = True
                r_n.font.size = Pt(8.2)
                r_n.font.color.rgb = RGB_DARK
                r_d = p.add_run(desc)
                r_d.italic = True
                r_d.font.size = Pt(7.0)
                r_d.font.color.rgb = RGB_MUTED
                cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
            else:
                write_cell_text(
                    cell,
                    val,
                    bold=(c_idx in (0, 2)),
                    size=8.2,
                    color=RGB_NAVY if c_idx == 2 else RGB_DARK,
                    align=WD_ALIGN_PARAGRAPH.CENTER,
                    font_name="Consolas" if c_idx in (3, 4, 5, 6, 7) else "Calibri",
                )

    dt_row = d_tbl.add_row()
    set_row_cant_split(dt_row)
    set_row_height(dt_row, 0.72)
    dm_lbl = dt_row.cells[0].merge(dt_row.cells[8])
    set_cell_shading(dm_lbl, HEX_SLATE_LIGHT)
    set_cell_margins(dm_lbl, top=40, bottom=40, left=75, right=75)
    write_cell_text(
        dm_lbl,
        "TOTAL SKOR KOMANDAN PELETON  =  (Materi×35%) + (Vokal×25%) + (Sikap×20%) + (Lapangan×20%)",
        bold=True,
        size=8.2,
        color=RGB_NAVY,
        align=WD_ALIGN_PARAGRAPH.RIGHT,
    )
    dt_val = dt_row.cells[9]
    dt_val.width = d_widths[9]
    set_cell_shading(dt_val, "FFFBEB")
    write_cell_text(dt_val, "", bold=True, size=9.5, align=WD_ALIGN_PARAGRAPH.CENTER)

    # Bagian C: Catatan Evaluasi & Pengesahan Tanda Tangan
    p_sec_c = doc.add_paragraph()
    p_sec_c.paragraph_format.space_before = Pt(8)
    p_sec_c.paragraph_format.space_after = Pt(2)
    rc = p_sec_c.add_run("C. CATATAN EVALUASI DEWAN JURI & PENGESAHAN LEMBAR PENILAIAN")
    rc.bold = True
    rc.font.size = Pt(9.5)
    rc.font.color.rgb = RGB_NAVY

    note_tbl = doc.add_table(rows=1, cols=1)
    note_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    note_tbl.autofit = False
    nc = note_tbl.cell(0, 0)
    nc.width = Cm(18.8)
    set_table_borders(note_tbl, color=HEX_BORDER_LIGHT, sz="4")
    set_cell_margins(nc, top=50, bottom=50, left=80, right=80)
    set_row_height(note_tbl.rows[0], 1.8)
    write_cell_text(
        nc,
        "Catatan khusus (gerakan terlewat, gerakan berangkai terputus, atau catatan pembinaan untuk peleton):\n\n",
        italic=True,
        size=8.0,
        color=RGB_MUTED,
    )

    p_sp2 = doc.add_paragraph()
    p_sp2.paragraph_format.space_before = Pt(4)
    p_sp2.paragraph_format.space_after = Pt(0)

    sig_tbl = doc.add_table(rows=1, cols=2)
    sig_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    sig_tbl.autofit = False
    set_table_no_borders(sig_tbl)
    sig_row = sig_tbl.rows[0]
    set_row_cant_split(sig_row)

    c_left = sig_row.cells[0]
    c_right = sig_row.cells[1]
    c_left.width = Cm(9.4)
    c_right.width = Cm(9.4)
    write_cell_text(
        c_left,
        "Verifikasi Input E-Scoring,\nAsisten Juri / Operator Penilaian\n\n\n\n( ........................................................ )\nParaf & Jam Input: .......... WIB",
        size=8.5,
        align=WD_ALIGN_PARAGRAPH.CENTER,
    )
    write_cell_text(
        c_right,
        "Yogyakarta, 24 Januari 2027\nDewan Juri LBB Mu'allimin 2027\n\n\n\n( ........................................................ )\nNama Terang & Tanda Tangan",
        bold=False,
        size=8.5,
        align=WD_ALIGN_PARAGRAPH.CENTER,
    )

    # Halaman Lampiran Referensi Penalti & Formula Rekapitulasi
    doc.add_page_break()
    p_ref = doc.add_paragraph()
    p_ref.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_ref.paragraph_format.space_before = Pt(2)
    p_ref.paragraph_format.space_after = Pt(6)
    rr1 = p_ref.add_run("LAMPIRAN PEDOMAN CEPAT DEWAN JURI\n")
    rr1.bold = True
    rr1.font.size = Pt(11.5)
    rr1.font.color.rgb = RGB_NAVY
    rr2 = p_ref.add_run("TABEL PENALTI LAPANGAN, FORMULA REKAPITULASI & TIE-BREAKER RESMI")
    rr2.bold = True
    rr2.font.size = Pt(9)
    rr2.font.color.rgb = RGB_MAROON

    p_r1 = doc.add_paragraph()
    p_r1.paragraph_format.space_before = Pt(2)
    p_r1.paragraph_format.space_after = Pt(3)
    r_p1 = p_r1.add_run("1. Daftar Penalti Lapangan & Tata Tertib (Dicatat oleh Hakim Garis, Timer, & Panitia)")
    r_p1.bold = True
    r_p1.font.size = Pt(9)
    r_p1.font.color.rgb = RGB_NAVY

    pen_tbl = doc.add_table(rows=1, cols=4)
    pen_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    pen_tbl.autofit = False
    set_table_borders(pen_tbl, color=HEX_BORDER_LIGHT, sz="4")
    pen_w = [Cm(7.5), Cm(3.5), Cm(2.8), Cm(5.0)]
    ph_row = pen_tbl.rows[0]
    set_row_repeat_header(ph_row)
    for c_idx, h_txt in enumerate(["Jenis Pelanggaran", "Pengurangan", "Sasaran", "Keterangan"]):
        cell = ph_row.cells[c_idx]
        cell.width = pen_w[c_idx]
        set_cell_shading(cell, HEX_NAVY)
        set_cell_margins(cell, top=38, bottom=38, left=55, right=55)
        write_cell_text(cell, h_txt, bold=True, size=8.2, color=RGB_WHITE, align=WD_ALIGN_PARAGRAPH.CENTER if c_idx in (1, 2) else WD_ALIGN_PARAGRAPH.LEFT)

    for idx, (jenis, pot, sasaran, ket) in enumerate(PENALTY_REF):
        row = pen_tbl.add_row()
        set_row_cant_split(row)
        for c_idx, val in enumerate([jenis, pot, sasaran, ket]):
            cell = row.cells[c_idx]
            cell.width = pen_w[c_idx]
            set_cell_margins(cell, top=28, bottom=28, left=55, right=55)
            if idx % 2 == 1:
                set_cell_shading(cell, HEX_SLATE_ZEBRA)
            write_cell_text(
                cell,
                val,
                bold=(c_idx == 1),
                size=8.0,
                color=RGB_MAROON if c_idx == 1 else RGB_DARK,
                align=WD_ALIGN_PARAGRAPH.CENTER if c_idx in (1, 2) else WD_ALIGN_PARAGRAPH.LEFT,
            )

    p_r2 = doc.add_paragraph()
    p_r2.paragraph_format.space_before = Pt(8)
    p_r2.paragraph_format.space_after = Pt(3)
    r_p2 = p_r2.add_run("2. Formula Rekapitulasi Nilai Akhir (Akumulasi 3 Dewan Juri) & Aturan Tie-Breaker")
    r_p2.bold = True
    r_p2.font.size = Pt(9)
    r_p2.font.color.rgb = RGB_NAVY

    formulas = [
        "• Nilai Murni Peleton = Skor PBB Juri 1 + Skor PBB Juri 2 + Skor PBB Juri 3.",
        "• Nilai Akhir Peleton = Nilai Murni Peleton – Total Akumulasi Penalti Peleton.",
        "• Nilai Murni Danton = Skor Terbobot Danton Juri 1 + Skor Terbobot Danton Juri 2 + Skor Terbobot Danton Juri 3.",
        "• Nilai Akhir Danton = Nilai Murni Danton – Total Akumulasi Penalti Danton.",
        "• Tie-Breaker Juara Peleton: (1) Nilai Murni Peleton tertinggi; (2) Nilai Murni Danton tertinggi; (3) Musyawarah Sidang Pleno Dewan Juri.",
        "• Tie-Breaker Juara Danton: (1) Nilai Murni Danton tertinggi; (2) Akumulasi Aspek Penguasaan Materi (35%) tertinggi; (3) Akumulasi Aspek Vokal (25%) tertinggi; (4) Sidang Pleno Dewan Juri.",
        "• Poin Juara Umum (terpisah SD & SMP): Juara 1 Peleton (10), Juara 2 (3), Juara 3 (1); Juara 1 Danton (5), Juara 2 (2), Juara 3 (1). Harapan 1–3 tidak dihitung dalam poin Juara Umum.",
    ]
    for f_txt in formulas:
        pf = doc.add_paragraph()
        pf.paragraph_format.space_before = Pt(1)
        pf.paragraph_format.space_after = Pt(2)
        pf.paragraph_format.left_indent = Cm(0.3)
        rf = pf.add_run(f_txt)
        rf.font.size = Pt(8.2)
        rf.font.color.rgb = RGB_DARK

    out_name = f"01_Rubrik_Form_Penilaian_Juri_SD_LBB_Muallimin_2027.docx" if is_sd else f"02_Rubrik_Form_Penilaian_Juri_SMP_LBB_Muallimin_2027.docx"
    out_path = os.path.join(OUT_DIR, out_name)
    doc.save(out_path)
    return out_path, len(materials_raw), total_sub


# ---------------------------------------------------------------------------
# 3. GENERATOR FORMULIR CV (DAFTAR RIWAYAT HIDUP) DEWAN JURI
# ---------------------------------------------------------------------------
def build_cv_form(header_path: str, footer_path: str):
    doc = configure_base_doc(
        header_img_path=header_path,
        footer_img_path=footer_path,
        top_cm=2.45,
        bottom_cm=3.75,
        left_cm=1.4,
        right_cm=1.4,
    )

    # Judul
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(1)
    p_title.paragraph_format.space_after = Pt(1)
    r = p_title.add_run("DAFTAR RIWAYAT HIDUP (CURRICULUM VITAE)")
    r.bold = True
    r.font.size = Pt(12.5)
    r.font.color.rgb = RGB_NAVY

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(5)
    r1 = p_sub.add_run("DEWAN JURI LOMBA BARIS-BERBARIS (LBB) MU'ALLIMIN TAHUN 2027\n")
    r1.bold = True
    r1.font.size = Pt(9.8)
    r1.font.color.rgb = RGB_MAROON
    r2 = p_sub.add_run("Madrasah Mu'allimin Muhammadiyah Yogyakarta • Ahad, 24 Januari 2027")
    r2.italic = True
    r2.font.size = Pt(8.2)
    r2.font.color.rgb = RGB_MUTED

    # Helper Heading Bagian
    def cv_section_bar(title_text):
        t = doc.add_table(rows=1, cols=1)
        t.alignment = WD_TABLE_ALIGNMENT.CENTER
        t.autofit = False
        c = t.cell(0, 0)
        c.width = Cm(18.2)
        set_cell_shading(c, HEX_NAVY)
        set_cell_margins(c, top=35, bottom=35, left=90, right=90)
        set_table_no_borders(t)
        write_cell_text(c, title_text, bold=True, size=8.8, color=RGB_WHITE)
        sp = doc.add_paragraph()
        sp.paragraph_format.space_before = Pt(0)
        sp.paragraph_format.space_after = Pt(1.5)

    # A. Identitas Pribadi + Kotak Pasfoto
    cv_section_bar("A. IDENTITAS PRIBADI & KEDINASAN / INSTANSI")

    # Layout 2 kolom atas (Kiri: 6 baris identitas utama, Kanan: Kotak Pasfoto 3x4)
    top_tbl = doc.add_table(rows=6, cols=3)
    top_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    top_tbl.autofit = False
    set_table_borders(top_tbl, color=HEX_BORDER_LIGHT, sz="4")
    t_widths = [Cm(4.8), Cm(9.8), Cm(3.6)]
    top_fields = [
        ("Nama Lengkap & Gelar", ": "),
        ("Nama Panggilan", ": "),
        ("Tempat, Tanggal Lahir", ": "),
        ("Jenis Kelamin", ":   [  ] Laki-laki      [  ] Perempuan"),
        ("Unsur Dewan Juri", ":   [  ] TNI     [  ] POLRI     [  ] Praktisi Profesional / Sipil"),
        ("Penugasan Arena", ":   [  ] Arena 1 (SD/MI)      [  ] Arena 2 (SMP/MTs)"),
    ]
    for r_idx, (lbl, val) in enumerate(top_fields):
        row = top_tbl.rows[r_idx]
        set_row_cant_split(row)
        set_row_height(row, 0.58)
        c0, c1, c2 = row.cells[0], row.cells[1], row.cells[2]
        c0.width, c1.width, c2.width = t_widths
        set_cell_shading(c0, HEX_SLATE_LIGHT)
        set_cell_margins(c0, top=25, bottom=25, left=65, right=55)
        set_cell_margins(c1, top=25, bottom=25, left=65, right=55)
        write_cell_text(c0, lbl, bold=True, size=8.5, color=RGB_NAVY)
        write_cell_text(c1, val, size=8.5, color=RGB_DARK)

    # Merge kolom kanan untuk kotak Pasfoto
    photo_cell = top_tbl.cell(0, 2).merge(top_tbl.cell(5, 2))
    set_cell_shading(photo_cell, HEX_SLATE_ZEBRA)
    set_cell_margins(photo_cell, top=40, bottom=40, left=45, right=45)
    write_cell_text(
        photo_cell,
        "PASFOTO\nTERBARU\n\n3 × 4 cm\n\n(Tempel / Sisipkan\nFoto Resmi)",
        bold=True,
        size=8.0,
        color=RGB_MUTED,
        align=WD_ALIGN_PARAGRAPH.CENTER,
    )

    # Lanjutan Identitas (full width)
    id2_fields = [
        ("Pangkat / Golongan & NRP / NIP", ":   ................................................................................  *(khusus TNI / POLRI / ASN)*"),
        ("Kesatuan / Instansi / Lembaga Asal", ": "),
        ("Jabatan Saat Ini", ": "),
        ("Alamat Domisili Lengkap", ": \n"),
        ("Nomor HP / WhatsApp Aktif", ": "),
        ("Alamat Email Aktif", ": "),
        ("Akun Media Sosial (Opsional)", ":   Instagram: @.................................   |   Lainnya: ................................."),
        ("Rekening Bank (Untuk Honorarium)", ":   Bank: .......................  No. Rek: ...............................  a.n.: ..............................."),
    ]
    id2_tbl = doc.add_table(rows=len(id2_fields), cols=2)
    id2_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    id2_tbl.autofit = False
    set_table_borders(id2_tbl, color=HEX_BORDER_LIGHT, sz="4")
    for r_idx, (lbl, val) in enumerate(id2_fields):
        row = id2_tbl.rows[r_idx]
        set_row_cant_split(row)
        set_row_height(row, 0.56 if r_idx != 3 else 0.92)
        c0, c1 = row.cells[0], row.cells[1]
        c0.width, c1.width = Cm(4.8), Cm(13.4)
        set_cell_shading(c0, HEX_SLATE_LIGHT)
        set_cell_margins(c0, top=24, bottom=24, left=65, right=55)
        set_cell_margins(c1, top=24, bottom=24, left=65, right=55)
        write_cell_text(c0, lbl, bold=True, size=8.5, color=RGB_NAVY)
        write_cell_text(c1, val, size=8.4, color=RGB_DARK)

    # B. Riwayat Pendidikan Formal
    p_sp = doc.add_paragraph()
    p_sp.paragraph_format.space_before = Pt(4)
    p_sp.paragraph_format.space_after = Pt(0)
    cv_section_bar("B. RIWAYAT PENDIDIKAN FORMAL")

    edu_tbl = doc.add_table(rows=5, cols=4)
    edu_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    edu_tbl.autofit = False
    set_table_borders(edu_tbl, color=HEX_BORDER_LIGHT, sz="4")
    edu_w = [Cm(2.5), Cm(7.7), Cm(5.2), Cm(2.8)]
    set_row_repeat_header(edu_tbl.rows[0])
    for c_idx, h_txt in enumerate(["Jenjang", "Nama Institusi / Sekolah / Perguruan Tinggi", "Jurusan / Program Studi", "Tahun Lulus"]):
        c = edu_tbl.rows[0].cells[c_idx]
        c.width = edu_w[c_idx]
        set_cell_shading(c, HEX_SLATE_LIGHT)
        set_cell_margins(c, top=30, bottom=30, left=55, right=55)
        write_cell_text(c, h_txt, bold=True, size=8.3, color=RGB_NAVY, align=WD_ALIGN_PARAGRAPH.CENTER if c_idx in (0, 3) else WD_ALIGN_PARAGRAPH.LEFT)
    for r_idx in range(1, 5):
        row = edu_tbl.rows[r_idx]
        set_row_cant_split(row)
        set_row_height(row, 0.56)
        for c_idx in range(4):
            c = row.cells[c_idx]
            c.width = edu_w[c_idx]
            set_cell_margins(c, top=22, bottom=22, left=55, right=55)
            write_cell_text(c, "", size=8.3)

    # C. Pendidikan Militer / Kepolisian / Pelatihan & Sertifikasi PBB
    p_sp2 = doc.add_paragraph()
    p_sp2.paragraph_format.space_before = Pt(4)
    p_sp2.paragraph_format.space_after = Pt(0)
    cv_section_bar("C. PENDIDIKAN KEDINASAN / PELATIHAN / SERTIFIKASI PBB & KEPELATIHAN")

    cert_tbl = doc.add_table(rows=5, cols=4)
    cert_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cert_tbl.autofit = False
    set_table_borders(cert_tbl, color=HEX_BORDER_LIGHT, sz="4")
    cert_w = [Cm(1.0), Cm(8.4), Cm(6.0), Cm(2.8)]
    set_row_repeat_header(cert_tbl.rows[0])
    for c_idx, h_txt in enumerate(["No", "Nama Pendidikan / Pelatihan / Sertifikasi", "Lembaga Penyelenggara", "Tahun"]):
        c = cert_tbl.rows[0].cells[c_idx]
        c.width = cert_w[c_idx]
        set_cell_shading(c, HEX_SLATE_LIGHT)
        set_cell_margins(c, top=30, bottom=30, left=55, right=55)
        write_cell_text(c, h_txt, bold=True, size=8.3, color=RGB_NAVY, align=WD_ALIGN_PARAGRAPH.CENTER if c_idx in (0, 3) else WD_ALIGN_PARAGRAPH.LEFT)
    for r_idx in range(1, 5):
        row = cert_tbl.rows[r_idx]
        set_row_cant_split(row)
        set_row_height(row, 0.56)
        for c_idx in range(4):
            c = row.cells[c_idx]
            c.width = cert_w[c_idx]
            set_cell_margins(c, top=22, bottom=22, left=55, right=55)
            write_cell_text(c, str(r_idx) if c_idx == 0 else "", size=8.3, align=WD_ALIGN_PARAGRAPH.CENTER if c_idx == 0 else WD_ALIGN_PARAGRAPH.LEFT)

    # Page 2 untuk Pengalaman Penjurian, Organisasi, & Pernyataan
    doc.add_page_break()

    # D. Pengalaman Menjadi Dewan Juri LBB / LKBB / Paskibra
    cv_section_bar("D. PENGALAMAN MENJADI DEWAN JURI LBB / LKBB / PASKIBRA")

    exp_tbl = doc.add_table(rows=8, cols=5)
    exp_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    exp_tbl.autofit = False
    set_table_borders(exp_tbl, color=HEX_BORDER_LIGHT, sz="4")
    exp_w = [Cm(1.0), Cm(6.4), Cm(3.2), Cm(5.0), Cm(2.4)]
    set_row_repeat_header(exp_tbl.rows[0])
    for c_idx, h_txt in enumerate(["No", "Nama Kegiatan / Perlombaan", "Tingkat (Kota/DIY/Nas)", "Penyelenggara", "Tahun"]):
        c = exp_tbl.rows[0].cells[c_idx]
        c.width = exp_w[c_idx]
        set_cell_shading(c, HEX_SLATE_LIGHT)
        set_cell_margins(c, top=38, bottom=38, left=50, right=50)
        write_cell_text(c, h_txt, bold=True, size=8.3, color=RGB_NAVY, align=WD_ALIGN_PARAGRAPH.CENTER if c_idx in (0, 2, 4) else WD_ALIGN_PARAGRAPH.LEFT)
    for r_idx in range(1, 8):
        row = exp_tbl.rows[r_idx]
        set_row_cant_split(row)
        set_row_height(row, 0.72)
        for c_idx in range(5):
            c = row.cells[c_idx]
            c.width = exp_w[c_idx]
            set_cell_margins(c, top=30, bottom=30, left=50, right=50)
            write_cell_text(c, str(r_idx) if c_idx == 0 else "", size=8.5, align=WD_ALIGN_PARAGRAPH.CENTER if c_idx == 0 else WD_ALIGN_PARAGRAPH.LEFT)

    # E. Pengalaman Kepelatihan / Organisasi & Prestasi Relevan
    p_sp3 = doc.add_paragraph()
    p_sp3.paragraph_format.space_before = Pt(8)
    p_sp3.paragraph_format.space_after = Pt(0)
    cv_section_bar("E. PENGALAMAN KEPELATIHAN / ORGANISASI PBB & PRESTASI RELEVAN")

    org_tbl = doc.add_table(rows=6, cols=4)
    org_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    org_tbl.autofit = False
    set_table_borders(org_tbl, color=HEX_BORDER_LIGHT, sz="4")
    org_w = [Cm(1.0), Cm(7.5), Cm(6.7), Cm(2.8)]
    set_row_repeat_header(org_tbl.rows[0])
    for c_idx, h_txt in enumerate(["No", "Peran / Jabatan / Prestasi", "Organisasi / Instansi / Kegiatan", "Tahun"]):
        c = org_tbl.rows[0].cells[c_idx]
        c.width = org_w[c_idx]
        set_cell_shading(c, HEX_SLATE_LIGHT)
        set_cell_margins(c, top=38, bottom=38, left=55, right=55)
        write_cell_text(c, h_txt, bold=True, size=8.3, color=RGB_NAVY, align=WD_ALIGN_PARAGRAPH.CENTER if c_idx in (0, 3) else WD_ALIGN_PARAGRAPH.LEFT)
    for r_idx in range(1, 6):
        row = org_tbl.rows[r_idx]
        set_row_cant_split(row)
        set_row_height(row, 0.72)
        for c_idx in range(4):
            c = row.cells[c_idx]
            c.width = org_w[c_idx]
            set_cell_margins(c, top=30, bottom=30, left=55, right=55)
            write_cell_text(c, str(r_idx) if c_idx == 0 else "", size=8.5, align=WD_ALIGN_PARAGRAPH.CENTER if c_idx == 0 else WD_ALIGN_PARAGRAPH.LEFT)

    # F. Pernyataan & Tanda Tangan
    p_decl = doc.add_paragraph()
    p_decl.paragraph_format.space_before = Pt(12)
    p_decl.paragraph_format.space_after = Pt(10)
    p_decl.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    r_decl = p_decl.add_run(
        "Demikian Daftar Riwayat Hidup ini saya isi dengan sebenar-benarnya dan dapat dipertanggungjawabkan "
        "untuk keperluan administrasi, verifikasi kompetensi, serta publikasi profil Dewan Juri "
        "Lomba Baris-Berbaris (LBB) Mu'allimin Tahun 2027."
    )
    r_decl.font.size = Pt(9.2)
    r_decl.font.color.rgb = RGB_DARK

    sig_tbl = doc.add_table(rows=1, cols=2)
    sig_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    sig_tbl.autofit = False
    set_table_no_borders(sig_tbl)
    sig_row = sig_tbl.rows[0]
    set_row_cant_split(sig_row)
    sig_row.cells[0].width = Cm(10.0)
    sig_row.cells[1].width = Cm(8.0)
    write_cell_text(sig_row.cells[0], "", size=9)
    write_cell_text(
        sig_row.cells[1],
        "Yogyakarta, .................................... 2026 / 2027\nHormat saya,\n\n\n\n\n( ................................................................ )\nNama Terang & Pangkat/NRP (bila ada)",
        size=9,
        align=WD_ALIGN_PARAGRAPH.CENTER,
    )

    out_path = os.path.join(OUT_DIR, "03_Formulir_CV_Dewan_Juri_LBB_Muallimin_2027.docx")
    doc.save(out_path)
    return out_path


# ---------------------------------------------------------------------------
# 4. GENERATOR PAKTA INTEGRITAS DEWAN JURI
# ---------------------------------------------------------------------------
def build_pakta_integritas(header_path: str, footer_path: str):
    doc = configure_base_doc(
        header_img_path=header_path,
        footer_img_path=footer_path,
        top_cm=2.45,
        bottom_cm=3.7,
        left_cm=1.5,
        right_cm=1.5,
    )

    # Judul
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(1)
    r = p_title.add_run("PAKTA INTEGRITAS DEWAN JURI")
    r.bold = True
    r.font.size = Pt(13)
    r.font.color.rgb = RGB_NAVY

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(5)
    r1 = p_sub.add_run("LOMBA BARIS-BERBARIS (LBB) MU'ALLIMIN TAHUN 2027\n")
    r1.bold = True
    r1.font.size = Pt(9.8)
    r1.font.color.rgb = RGB_MAROON
    r2 = p_sub.add_run('Tema: "Semangat Sebagai Ksatria, Berjuang Dengan Gembira"')
    r2.italic = True
    r2.font.size = Pt(8.5)
    r2.font.color.rgb = RGB_MUTED

    p_intro = doc.add_paragraph()
    p_intro.paragraph_format.space_before = Pt(1)
    p_intro.paragraph_format.space_after = Pt(2)
    r_in = p_intro.add_run("Saya yang bertanda tangan di bawah ini:")
    r_in.font.size = Pt(8.8)

    # Blok Identitas Penandatangan
    id_tbl = doc.add_table(rows=6, cols=2)
    id_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    id_tbl.autofit = False
    set_table_no_borders(id_tbl)
    id_data = [
        ("Nama Lengkap & Gelar", ":  ...................................................................................................................."),
        ("Pangkat / NRP / NIP (bila ada)", ":  ...................................................................................................................."),
        ("Kesatuan / Instansi / Lembaga", ":  ...................................................................................................................."),
        ("Unsur Dewan Juri", ":  [  ] TNI       [  ] POLRI       [  ] Praktisi Profesional / Sipil"),
        ("Penugasan Arena", ":  [  ] Arena 1 (Tingkat SD/MI)       [  ] Arena 2 (Tingkat SMP/MTs)"),
        ("Nomor HP / WhatsApp", ":  ...................................................................................................................."),
    ]
    for r_idx, (lbl, val) in enumerate(id_data):
        row = id_tbl.rows[r_idx]
        set_row_cant_split(row)
        set_row_height(row, 0.45)
        c0, c1 = row.cells[0], row.cells[1]
        c0.width, c1.width = Cm(4.8), Cm(13.2)
        set_cell_margins(c0, top=12, bottom=12, left=35, right=35)
        set_cell_margins(c1, top=12, bottom=12, left=35, right=35)
        write_cell_text(c0, lbl, bold=True, size=8.6, color=RGB_NAVY)
        write_cell_text(c1, val, size=8.6, color=RGB_DARK)

    p_stmt = doc.add_paragraph()
    p_stmt.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_stmt.paragraph_format.space_before = Pt(4)
    p_stmt.paragraph_format.space_after = Pt(3)
    p_stmt.paragraph_format.line_spacing = 1.08
    r_st = p_stmt.add_run(
        "Dalam rangka menjalankan amanah sebagai Dewan Juri pada kegiatan Lomba Baris-Berbaris (LBB) Mu'allimin "
        "Tahun 2027 yang diselenggarakan oleh Panitia Milad ke-108 Madrasah Mu'allimin Muhammadiyah Yogyakarta, "
        "dengan penuh kesadaran dan tanggung jawab menyatakan berjanji untuk:"
    )
    r_st.font.size = Pt(8.6)

    points = [
        (
            "Menjunjung Tinggi Objektivitas dan Independensi: ",
            "Melaksanakan penilaian secara jujur, adil, objektif, profesional, dan independen terhadap seluruh "
            "peleton peserta tanpa membeda-bedakan asal sekolah/madrasah, daerah, maupun hubungan pribadi.",
        ),
        (
            "Mematuhi Regulasi dan Acuan Penilaian Resmi: ",
            "Berpedoman sepenuhnya pada Perpang TNI No. 57 Tahun 2018 (Peraturan Penghormatan Militer), "
            "Perpang TNI No. 58 Tahun 2018 (Peraturan Baris-Berbaris), Perpang TNI No. 45 Tahun 2014 "
            "(khusus Hormat Kanan), serta Juknis Lapangan & Penilaian LBB Mu'allimin Tahun 2027 beserta hasil "
            "kesepakatan Technical Meeting Dewan Juri.",
        ),
        (
            "Bebas dari Benturan Kepentingan (Conflict of Interest): ",
            "Menyatakan tidak sedang menjadi pelatih aktif, pembina, maupun memiliki keterkaitan kepentingan "
            "langsung dengan sekolah/peleton peserta pada arena yang saya nilai, serta bersedia melaporkan secara "
            "terbuka kepada Panitia Pelaksana apabila terdapat potensi benturan kepentingan.",
        ),
        (
            "Menolak Suap, Gratifikasi, dan Intervensi: ",
            "Tidak menerima, meminta, ataupun menjanjikan imbalan, suap, gratifikasi dalam bentuk apa pun, serta "
            "menolak segala bentuk tekanan atau intervensi dari peserta, official, pelatih, orang tua, maupun pihak lain.",
        ),
        (
            "Melaksanakan Prosedur Penilaian Secara Akuntabel: ",
            "Menerapkan sistem coret 5 predikat baku (KS, K, C, B, BS) secara konsisten pada formulir penilaian resmi, "
            "menandatangani setiap lembar penilaian fisik yang telah diisi, dan mendukung proses verifikasi e-scoring.",
        ),
        (
            "Menjaga Kerahasiaan Data Penilaian: ",
            "Menjaga kerahasiaan seluruh skor, catatan evaluasi, dan hasil pembahasan Sidang Pleno Dewan Juri "
            "hingga diumumkan secara resmi oleh Panitia Pelaksana LBB Mu'allimin Tahun 2027.",
        ),
        (
            "Berkomitmen Penuh terhadap Kehadiran dan Kedisiplinan: ",
            "Hadir tepat waktu dan mengikuti seluruh rangkaian penjurian, mulai dari Technical Meeting Dewan Juri, "
            "pelaksanaan Hari-H (Ahad, 24 Januari 2027 di Kampus Terpadu Madrasah Mu'allimin Sedayu), hingga "
            "Sidang Pleno Pengesahan Juara.",
        ),
        (
            "Menjaga Marwah Kegiatan dan Bersedia Menerima Sanksi: ",
            "Menjaga sikap keteladanan, etika, serta nama baik institusi asal dan Madrasah Mu'allimin Muhammadiyah "
            "Yogyakarta. Apabila di kemudian hari saya terbukti melanggar Pakta Integritas ini, saya bersedia "
            "menerima sanksi sesuai ketentuan Panitia Pelaksana termasuk pembatalan penugasan sebagai Dewan Juri.",
        ),
    ]

    for idx, (lead, body) in enumerate(points, start=1):
        pp = doc.add_paragraph()
        pp.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        pp.paragraph_format.space_before = Pt(1)
        pp.paragraph_format.space_after = Pt(1.8)
        pp.paragraph_format.left_indent = Cm(0.55)
        pp.paragraph_format.first_line_indent = Cm(-0.55)
        pp.paragraph_format.line_spacing = 1.06

        r_num = pp.add_run(f"{idx}.\t")
        r_num.bold = True
        r_num.font.size = Pt(8.4)
        r_num.font.color.rgb = RGB_NAVY

        r_lead = pp.add_run(lead)
        r_lead.bold = True
        r_lead.font.size = Pt(8.4)
        r_lead.font.color.rgb = RGB_DARK

        r_body = pp.add_run(body)
        r_body.font.size = Pt(8.4)
        r_body.font.color.rgb = RGB_DARK

    p_close = doc.add_paragraph()
    p_close.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_close.paragraph_format.space_before = Pt(4)
    p_close.paragraph_format.space_after = Pt(6)
    r_cl = p_close.add_run(
        "Demikian Pakta Integritas ini saya buat dan tandatangani dalam keadaan sadar, tanpa paksaan dari pihak "
        "mana pun, untuk dipergunakan sebagaimana mestinya."
    )
    r_cl.font.size = Pt(8.6)

    # Blok Tanda Tangan + Kotak Meterai 10.000
    sig_tbl = doc.add_table(rows=1, cols=2)
    sig_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    sig_tbl.autofit = False
    set_table_no_borders(sig_tbl)
    sig_row = sig_tbl.rows[0]
    set_row_cant_split(sig_row)
    c_l, c_r = sig_row.cells[0], sig_row.cells[1]
    c_l.width, c_r.width = Cm(9.0), Cm(9.0)

    write_cell_text(
        c_l,
        "\nMengetahui,\nKetua Panitia Pelaksana\nLBB Mu'allimin Tahun 2027\n\n\n\n( ........................................................ )\nPanitia Milad ke-108 Mu'allimin",
        size=8.5,
        align=WD_ALIGN_PARAGRAPH.CENTER,
    )

    # Kanan dengan kotak meterai inline
    pr = c_r.paragraphs[0]
    pr.alignment = WD_ALIGN_PARAGRAPH.CENTER
    pr.paragraph_format.space_before = Pt(0)
    pr.paragraph_format.space_after = Pt(1)
    pr.paragraph_format.line_spacing = 1.08
    for txt, bld, clr, sz in [
        ("Yogyakarta, ............................ 2026 / 2027\n", False, RGB_DARK, 8.5),
        ("Yang Menyatakan,\n", False, RGB_DARK, 8.5),
        ("Dewan Juri LBB Mu'allimin Tahun 2027\n\n", True, RGB_NAVY, 8.5),
        ("[  Meterai Rp 10.000  ]\n\n", True, RGB_MUTED, 7.8),
        ("( ........................................................ )\n", False, RGB_DARK, 8.5),
        ("Nama Terang & Pangkat/NRP (bila ada)", False, RGB_MUTED, 7.8),
    ]:
        rr = pr.add_run(txt)
        rr.bold = bld
        rr.font.size = Pt(sz)
        rr.font.color.rgb = clr

    out_path = os.path.join(OUT_DIR, "04_Pakta_Integritas_Dewan_Juri_LBB_Muallimin_2027.docx")
    doc.save(out_path)
    return out_path


def main():
    header_path, footer_path = prepare_kop_assets()
    p1, n1, s1 = build_scoring_form("SD", header_path)
    p2, n2, s2 = build_scoring_form("SMP", header_path)
    p3 = build_cv_form(header_path, footer_path)
    p4 = build_pakta_integritas(header_path, footer_path)

    print("BERHASIL MEMBUAT 4 DOKUMEN WORD:")
    print(f"  1. {p1} ({n1} nomor materi, {s1} baris penilaian)")
    print(f"  2. {p2} ({n2} nomor materi, {s2} baris penilaian)")
    print(f"  3. {p3}")
    print(f"  4. {p4}")


if __name__ == "__main__":
    main()
