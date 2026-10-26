import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Utilitas untuk langsung mengunduh Pakta Integritas A4 LBB Mu'allimin 2027
 * tanpa membuka modal preview.
 */
export async function downloadIntegrityPactPDF(team) {
  if (!team) return;

  const schoolName = team.schoolName || team.schoolBaseName || '-';
  const jenjang = team.jenjang || 'SMP';
  const officialName = team.officialName || team.roster?.officials?.[0]?.name || team.coachName || '-';
  const dantonName = team.roster?.danton?.name || team.dantonName || '-';
  const regCode = team.regCode || '-';
  const category = team.category || team.teamType || 'Putra';
  const unit = team.teamUnit || 'Tunggal';

  const rawWa = String(team.waNumber || team.roster?.officials?.[0]?.phone || '').trim();
  const formatWa = (num) => {
    if (!num) return '-';
    const cleaned = num.replace(/\D/g, '');
    if (!cleaned) return num;
    if (cleaned.startsWith('62')) return '0' + cleaned.slice(2);
    if (!cleaned.startsWith('0')) return '0' + cleaned;
    return cleaned;
  };
  const waNumber = formatWa(rawWa);

  // Buat container HTML tersembunyi berukuran tepat 210mm x 297mm (A4 standar 794px x 1123px pada 96 DPI)
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.width = '794px';
  container.style.height = '1123px';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#000000';
  container.style.fontFamily = '"Times New Roman", Times, serif';
  container.style.boxSizing = 'border-box';
  container.style.overflow = 'hidden';
  container.style.zIndex = '-9999';

  container.innerHTML = `
    <div style="position: relative; width: 794px; height: 1123px; box-sizing: border-box; overflow: hidden; background-color: #ffffff;">
      <!-- Background Kop Utuh A4 -->
      <img 
        src="/kop-lbb.png" 
        alt="Kop Background" 
        style="position: absolute; left: 0; top: 0; width: 794px; height: 1123px; object-fit: fill; z-index: 1;" 
      />

      <!-- Area Teks Dokumen -->
      <div style="position: relative; z-index: 2; padding-top: 130px; padding-bottom: 95px; padding-left: 76px; padding-right: 76px; font-size: 14.5px; line-height: 1.5; color: #000000;">
        
        <!-- Judul Surat Rata Tengah (Tanpa Garis Bawah) -->
        <div style="text-align: center; margin-bottom: 16px;">
          <h4 style="font-size: 19px; font-weight: bold; text-transform: uppercase; margin: 0; letter-spacing: 0.5px;">
            SURAT PERNYATAAN & PAKTA INTEGRITAS PESERTA
          </h4>
          <p style="font-size: 13.5px; margin-top: 4px; margin-bottom: 0;">
            Nomor Registrasi: <strong>${regCode}</strong>
          </p>
        </div>

        <!-- Paragraf Pembuka Rata Kiri -->
        <p style="text-align: left; margin: 0 0 10px 0;">
          Yang bertanda tangan di bawah ini secara sah, sadar, dan bertindak atas nama kontingen sekolah/madrasah:
        </p>

        <!-- Tabel Biodata Formal Rata Kiri Penuh -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 14.5px;">
          <tbody>
            <tr>
              <td style="width: 230px; padding: 2px 0; vertical-align: top;">Nama Official / Pelatih</td>
              <td style="width: 15px; padding: 2px 0; vertical-align: top;">:</td>
              <td style="padding: 2px 0; vertical-align: top; font-weight: bold;">${officialName}</td>
            </tr>
            <tr>
              <td style="padding: 2px 0; vertical-align: top;">Nomor WhatsApp Aktif</td>
              <td style="padding: 2px 0; vertical-align: top;">:</td>
              <td style="padding: 2px 0; vertical-align: top;">${waNumber}</td>
            </tr>
            <tr>
              <td style="padding: 2px 0; vertical-align: top;">Sekolah / Madrasah</td>
              <td style="padding: 2px 0; vertical-align: top;">:</td>
              <td style="padding: 2px 0; vertical-align: top; font-weight: bold;">${schoolName} (${jenjang})</td>
            </tr>
            <tr>
              <td style="padding: 2px 0; vertical-align: top;">Nama Komandan Peleton</td>
              <td style="padding: 2px 0; vertical-align: top;">:</td>
              <td style="padding: 2px 0; vertical-align: top; font-weight: bold;">${dantonName}</td>
            </tr>
            <tr>
              <td style="padding: 2px 0; vertical-align: top;">Kategori & Satuan Peleton</td>
              <td style="padding: 2px 0; vertical-align: top;">:</td>
              <td style="padding: 2px 0; vertical-align: top;">${category} - ${unit}</td>
            </tr>
          </tbody>
        </table>

        <!-- Paragraf Pernyataan Rata Kiri -->
        <p style="text-align: left; margin: 0 0 8px 0;">
          Dengan ini menyatakan dengan penuh rasa tanggung jawab dan sungguh-sungguh bahwa:
        </p>

        <!-- Butir-Butir Pakta Integritas dengan Nomor Eksplisit Pasti Muncul di PDF -->
        <table style="width: 100%; border-collapse: collapse; margin: 0; line-height: 1.45; font-size: 14px;">
          <tbody>
            <tr>
              <td style="width: 22px; vertical-align: top; font-weight: bold; padding: 2px 0;">1.</td>
              <td style="vertical-align: top; text-align: justify; padding: 2px 0;">
                <strong>Keabsahan Siswa:</strong> Seluruh anggota peleton yang didaftarkan (1 Komandan, 21 Anggota Inti, dan 3 Cadangan) adalah <strong>siswa/siswi aktif</strong> yang sah dari sekolah/madrasah yang bersangkutan, dibuktikan dengan Kartu Pelajar sah dan Surat Tugas Kepala Sekolah.
              </td>
            </tr>
            <tr>
              <td style="vertical-align: top; font-weight: bold; padding: 2px 0;">2.</td>
              <td style="vertical-align: top; text-align: justify; padding: 2px 0;">
                <strong>Kejujuran Administrasi:</strong> Tidak memanipulasi data identitas siswa, NISN, pemalsuan stempel/tanda tangan surat rekomendasi kepala sekolah, maupun menyertakan peserta dari luar sekolah/madrasah.
              </td>
            </tr>
            <tr>
              <td style="vertical-align: top; font-weight: bold; padding: 2px 0;">3.</td>
              <td style="vertical-align: top; text-align: justify; padding: 2px 0;">
                <strong>Kepatuhan Petunjuk Teknis:</strong> Bersedia mematuhi seluruh ketentuan Petunjuk Teknis Pendaftaran, Lapangan, Penilaian & Kejuaraan, serta Tata Tertib Peserta LBB Mu'allimin 2027.
              </td>
            </tr>
            <tr>
              <td style="vertical-align: top; font-weight: bold; padding: 2px 0;">4.</td>
              <td style="vertical-align: top; text-align: justify; padding: 2px 0;">
                <strong>Sportivitas & Keputusan Juri:</strong> Menjunjung tinggi sportivitas, etika madrasah, dan menerima seluruh hasil penilaian serta keputusan Sidang Dewan Juri secara mutlak dan tidak dapat diganggu gugat.
              </td>
            </tr>
            <tr>
              <td style="vertical-align: top; font-weight: bold; padding: 2px 0;">5.</td>
              <td style="vertical-align: top; text-align: justify; padding: 2px 0;">
                <strong>Sanksi Mutlak:</strong> Apabila melanggar ketentuan di atas, kami bersedia menerima sanksi pembatalan kejuaraan, pemotongan nilai, hingga <strong>DISKUALIFIKASI MUTLAK</strong> dan pemblokiran (blacklist).
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Penutup Surat -->
        <p style="text-align: justify; font-style: italic; margin-top: 10px; margin-bottom: 18px;">
          Demikian Surat Pernyataan dan Pakta Integritas ini dibuat dengan sebenar-benarnya tanpa adanya paksaan dari pihak manapun untuk diserahkan sebagai syarat sah registrasi berkas fisik Technical Meeting LBB Mu'allimin 2027.
        </p>

        <!-- Kolom Tanda Tangan & Kotak Materai (Jarak Seimbang & Materai Geser ke Kiri) -->
        <table style="width: 100%; border-collapse: collapse; text-align: center; margin-top: 14px;">
          <tbody>
            <tr>
              <td style="width: 50%; vertical-align: top; padding: 0 15px;">
                <p style="font-size: 13.5px; margin: 0 0 2px 0;">Mengetahui,</p>
                <p style="font-weight: bold; margin: 0 0 4px 0;">Komandan Peleton</p>
                <!-- Ruang tanda tangan yang seimbang -->
                <div style="height: 60px;"></div>
                <p style="font-weight: bold; text-transform: uppercase; margin: 0; font-size: 14.5px;">
                  ${dantonName}
                </p>
              </td>

              <td style="width: 50%; vertical-align: top; padding: 0 15px;">
                <p style="font-size: 13.5px; margin: 0 0 2px 0;">Yogyakarta, 9 Januari 2027</p>
                <p style="font-weight: bold; margin: 0 0 4px 0;">Official / Pelatih Pendamping</p>
                
                <!-- Ruang tanda tangan basah yang seimbang -->
                <div style="height: 60px;"></div>

                <p style="font-weight: bold; text-transform: uppercase; margin: 0; font-size: 14.5px;">
                  ${officialName}
                </p>
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    // Tunggu gambar background kop termuat sempurna
    const bgImg = container.querySelector('img');
    if (bgImg && !bgImg.complete) {
      await new Promise((resolve) => {
        bgImg.onload = resolve;
        bgImg.onerror = resolve;
      });
    }

    const canvas = await html2canvas(container, {
      scale: 2, // Kualitas cetak jernih HD
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
    const sanitizedSchool = schoolName.replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `Pakta_Integritas_TM_LBB2027_${sanitizedSchool}_${regCode}.pdf`;
    pdf.save(fileName);
  } finally {
    document.body.removeChild(container);
  }
}
