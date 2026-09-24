import React from 'react';
import { Scale } from 'lucide-react';
import { EVENT } from '../config.js';

export default function TataTertib() {
  return (
    <section id="tata-tertib" className="py-24 lg:py-32 bg-slate-100 relative overflow-hidden font-sans border-t border-slate-200">
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none overflow-hidden">
        <span className="text-[20vw] font-black text-slate-900 -rotate-12 whitespace-nowrap select-none">
          TATA TERTIB
        </span>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest mb-6 rounded-sm shadow-xl">
            <Scale className="w-4 h-4" /> Dokumen Resmi
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight mb-4 leading-tight">
            Tata Tertib <span className="text-red-700 decoration-4 decoration-slate-900 underline-offset-4">Peserta</span>
          </h2>
          <p className="text-slate-500 font-mono text-sm uppercase tracking-wide">
            LOMBA BARIS – BERBARIS MUALLIMIN TAHUN 2027
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Pasal 1 */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
              <h3 className="font-black text-xl text-slate-900">PASAL 1</h3>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ketentuan Umum</span>
            </div>
            <ol className="list-decimal list-outside pl-5 space-y-3 text-sm text-slate-600 leading-relaxed marker:font-bold marker:text-slate-900">
              <li>Lomba Baris – Berbaris Mu’allimin Tahun 2027 (selanjutnya disingkat LBB MU’ALLIMIN 2027) merupakan lomba baris-berbaris tingkat Daerah Istimewa Yogyakarta yang diselenggarakan oleh Madrasah Mu’allimin Muhammadiyah Yogyakarta.</li>
              <li>LBB MU’ALLIMIN 2027 dilaksanakan pada tanggal {EVENT.COMPETITION_DATE} di Kampus Terpadu Madrasah Muallimin Muhammadiyah Yogyakarta.</li>
              <li>Peserta LBB MU’ALLIMIN 2027 merupakan siswa SD/MI sederajat dan SMP/MTs sederajat dalam lingkup Daerah Istimewa Yogyakarta, sesuai yang tertera pada formulir pendaftaran.</li>
              <li>Tata tertib ini berlaku selama pelaksanaan lomba berlangsung.</li>
              <li>Seragam SD menggunakan seragam tonti sekolah atau seragam nasional merah putih lengkap beserta atributnya dan Seragam SMP menggunakan seragam tonti sekolah atau seragam OSIS lengkap beserta atributnya.</li>
            </ol>
          </div>

          {/* Pasal 2 */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
              <h3 className="font-black text-xl text-slate-900">PASAL 2</h3>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Technical Meeting</span>
            </div>
            <ol className="list-decimal list-outside pl-5 space-y-3 text-sm text-slate-600 leading-relaxed marker:font-bold marker:text-slate-900">
              <li>Tata tertib dan penilaian perlombaan disampaikan ketika Technical Meeting Peserta. Hasil technical meeting wajib dipatuhi dan dilaksanakan selama perlombaan berlangsung.</li>
              <li>Pada hari pelaksanaan perlombaan, panitia tidak menerima protes tentang ketentuan-ketentuan yang sudah disepakati pada saat technical meeting, baik yang berupa ketentuan tertulis maupun yang tidak tertulis.</li>
              <li>Penukaran nomor urut dan nomor dada antar peserta hanya dapat dilakukan saat technical meeting dengan sepengetahuan panitia dan peserta lomba.</li>
            </ol>
          </div>

          {/* Pasal 3 */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
              <h3 className="font-black text-xl text-slate-900">PASAL 3</h3>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Daftar Ulang Peserta</span>
            </div>
            <ol className="list-decimal list-outside pl-5 space-y-3 text-sm text-slate-600 leading-relaxed marker:font-bold marker:text-slate-900">
              <li>Daftar ulang peserta, pengambilan nomor dada, tanda pengenal resmi pendamping, serta kantong sampah akan dilayani pada pukul 06.00-10.00 WIB dengan menyerahkan kartu identitas (KTP/SIM) sebagai jaminan terjaganya kebersihan di area lomba.</li>
              <li>Peleton atas nama sekolah yang sama hanya perlu menyerahkan satu kartu identitas (satu sekolah, satu KTP/SIM).</li>
              <li>Peserta diimbau melakukan daftar ulang per sekolah, sehingga dapat mengefektifkan waktu dan jumlah orang yang melakukan pendaftaran ulang.</li>
              <li>Daftar ulang lebih dari pukul 10.00 tidak akan dilayani oleh panitia. Bagi peleton yang tidak melakukan daftar ulang akan dikenakan sanksi tidak dapat mengikuti perlombaan pada hari itu.</li>
              <li>Pengembalian nomor dada akan langsung dilakukan di pos terakhir kepada petugas pos yang ada.</li>
            </ol>
          </div>

          {/* Pasal 4 */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
              <h3 className="font-black text-xl text-slate-900">PASAL 4</h3>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Upacara & Apel</span>
            </div>
            <ol className="list-decimal list-outside pl-5 space-y-3 text-sm text-slate-600 leading-relaxed marker:font-bold marker:text-slate-900">
              <li>Upacara pembukaan wajib diikuti oleh peserta dengan nomor urut lomba 1-5 dengan ketentuan 5 trio lengkap dan 1 komandan.</li>
              <li>Area perlombaan ditutup pukul 07.30 WIB. Peserta diperbolehkan masuk kembali setelah upacara pembukaan selesai.</li>
              <li>Apel Penutupan wajib diikuti oleh seluruh peserta dengan ketentuan 1 komandan dan 4 anggota peleton. Peserta Apel Penutupan berpakaian rapi, sopan, dan bersepatu.</li>
              <li>Pengumuman lomba dilaksanakan setelah Apel Penutupan selesai dengan ketentuan, yang diperbolehkan masuk ke area pengumuman (lapangan mini soccer) yakni peserta apel penutupan.</li>
            </ol>
          </div>

          {/* Pasal 5 & 6 */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow space-y-8">
            <div>
              <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                <h3 className="font-black text-xl text-slate-900">PASAL 5</h3>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Area Lomba & Basecamp</span>
              </div>
              <ol className="list-decimal list-outside pl-5 space-y-3 text-sm text-slate-600 leading-relaxed marker:font-bold marker:text-slate-900">
                <li>Lokasi lomba dibagi menjadi beberapa area utama: Area Lomba, Area Basecamp, Area Transit, dan Area Penonton.</li>
                <li>Setiap peleton akan mendapatkan satu lokasi basecamp yang telah ditentukan oleh panitia.</li>
                <li>Area Lomba bersifat steril dan hanya dapat diakses oleh peleton yang akan tampil, official terkait, dan panitia (Clear Area).</li>
                <li>Pendukung dan penonton diwajibkan untuk berada di Area Penonton yang telah disediakan.</li>
                <li>Area stan tenant dan kuliner dipusatkan di Kompleks Math'am, 1918 Foodcourt, dan 1918 Mart.</li>
                <li className="font-semibold text-red-700">Seluruh peserta, pendamping, official, dan suporter DILARANG KERAS memasuki area Asrama Santri.</li>
              </ol>
            </div>

            <div>
              <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                <h3 className="font-black text-xl text-slate-900">PASAL 6</h3>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kesehatan & Keamanan</span>
              </div>
              <ol className="list-decimal list-outside pl-5 space-y-3 text-sm text-slate-600 leading-relaxed marker:font-bold marker:text-slate-900">
                <li>Seluruh peserta yang mengikuti lomba diasumsikan berada dalam kondisi sehat jasmani dan rohani.</li>
                <li>Panitia menyediakan pos pertolongan pertama pada kecelakaan (P3K) atau tim medis untuk penanganan insiden darurat.</li>
                <li>Panitia hanya memberikan pertolongan pertama dasar. Rujukan lanjutan menjadi tanggung jawab sekolah masing-masing.</li>
                <li>Panitia tidak bertanggung jawab atas kondisi bawaan riwayat medis peserta sebelumnya.</li>
                <li>Setiap insiden keamanan harap segera dilaporkan kepada panitia terdekat.</li>
              </ol>
            </div>
          </div>

          {/* Pasal 7 */}
          <div className="bg-slate-900 text-slate-300 p-8 rounded-xl shadow-lg border border-slate-800">
            <div className="flex items-center justify-between mb-8 border-b border-slate-700 pb-4">
              <h3 className="font-black text-2xl text-white">PASAL 7</h3>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori & Penghargaan Juara</span>
            </div>

            <ol className="list-decimal list-outside pl-5 space-y-4 text-sm leading-relaxed marker:font-bold marker:text-white">
              <li>
                Sebagai bentuk apresiasi, panitia menyediakan piala dan penghargaan:
                <div className="mt-4 space-y-3">
                  <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                    <span className="block font-bold text-white mb-1">a. Piala Bergilir Juara Umum:</span>
                    <span className="text-xs text-slate-400">Piala Bergilir Juara Umum SD/MI & SMP/MTs.</span>
                  </div>

                  <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                    <span className="block font-bold text-white mb-1">b. Kategori Peleton SD/MI & SMP/MTs:</span>
                    <span className="text-xs text-slate-400">Juara I, II, III (Piala Tetap + Uang Pembinaan) serta Harapan I, II, III (Piala Tetap).</span>
                  </div>

                  <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                    <span className="block font-bold text-white mb-1">c. Komandan Peleton Terbaik:</span>
                    <span className="text-xs text-slate-400">Terbaik I (Piala Tetap + Uang Pembinaan), Terbaik II & III (Piala Tetap).</span>
                  </div>
                </div>
              </li>
              <li>
                Seluruh pemenang akan mendapatkan E-Sertifikat Piagam Penghargaan resmi.
              </li>
            </ol>
          </div>

          {/* Pasal 8 & 9 */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow md:col-span-2">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                  <h3 className="font-black text-xl text-slate-900">PASAL 8</h3>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Penentuan Juara Per Kategori</span>
                </div>
                <ol className="list-decimal list-outside pl-5 space-y-4 text-sm text-slate-600 leading-relaxed marker:font-bold marker:text-slate-900">
                  <li>
                    Kategori Juara Peleton: Ditentukan berdasarkan akumulasi total skor tertinggi. Jika seri (tie):
                    <ol className="list-[lower-roman] list-inside pl-4 mt-2 space-y-1 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <li>Total nilai Kebenaran Teknik Gerakan PBB lebih tinggi.</li>
                      <li>Kekompakan lebih tinggi.</li>
                      <li>Poin penalti paling sedikit.</li>
                    </ol>
                  </li>
                  <li>
                    Kategori Komandan Terbaik: Ditentukan berdasarkan akumulasi total skor tertinggi. Jika seri:
                    <ol className="list-[lower-roman] list-inside pl-4 mt-2 space-y-1 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <li>Nilai Penguasaan Materi lebih tinggi.</li>
                      <li>Nilai Kualitas Suara lebih tinggi.</li>
                    </ol>
                  </li>
                </ol>
              </div>

              <div>
                <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                  <h3 className="font-black text-xl text-slate-900">PASAL 9</h3>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Penentuan Juara Umum</span>
                </div>
                <ol className="list-decimal list-outside pl-5 space-y-4 text-sm text-slate-600 leading-relaxed marker:font-bold marker:text-slate-900">
                  <li>Ditentukan berdasarkan akumulasi poin tertinggi sekolah dari seluruh kategori Peleton dan Danton.</li>
                  <li>
                    Tabel sistem poin prestasi:
                    <div className="overflow-x-auto mt-2">
                      <table className="w-full text-xs border border-slate-200 rounded-lg overflow-hidden">
                        <thead className="bg-slate-900 text-white">
                          <tr>
                            <th className="p-2 text-left">Prestasi yang Diraih</th>
                            <th className="p-2 text-center">Poin</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-slate-50">
                          <tr><td className="p-2">Juara 1 Peleton</td><td className="p-2 text-center font-bold">6</td></tr>
                          <tr><td className="p-2">Juara 2 Peleton</td><td className="p-2 text-center font-bold">5</td></tr>
                          <tr><td className="p-2">Juara 3 Peleton</td><td className="p-2 text-center font-bold">4</td></tr>
                          <tr><td className="p-2">Juara Harapan 1 Peleton</td><td className="p-2 text-center font-bold">3</td></tr>
                          <tr><td className="p-2">Juara Harapan 2 Peleton</td><td className="p-2 text-center font-bold">2</td></tr>
                          <tr><td className="p-2">Juara Harapan 3 Peleton</td><td className="p-2 text-center font-bold">1</td></tr>
                          <tr><td className="p-2">Juara 1 Komandan Terbaik</td><td className="p-2 text-center font-bold">3</td></tr>
                          <tr><td className="p-2">Juara 2 Komandan Terbaik</td><td className="p-2 text-center font-bold">2</td></tr>
                          <tr><td className="p-2">Juara 3 Komandan Terbaik</td><td className="p-2 text-center font-bold">1</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>

          {/* Pasal 10 */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
              <h3 className="font-black text-xl text-slate-900">PASAL 10</h3>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kebersihan Lingkungan</span>
            </div>
            <ol className="list-decimal list-outside pl-5 space-y-3 text-sm text-slate-600 leading-relaxed marker:font-bold marker:text-slate-900">
              <li>Seluruh partisipan DIWAJIBKAN menjaga kebersihan di area Kampus Terpadu Madrasah Muallimin.</li>
              <li>Sebelum meninggalkan basecamp, peserta wajib membersihkan sampah di area basecamp dengan kantong sampah yang disediakan panitia.</li>
              <li>Sampah DIWAJIBKAN dipilah antara sampah organik/plastik dan non-plastik.</li>
              <li>Kartu identitas jaminan kebersihan akan dikembalikan setelah basecamp diverifikasi bersih oleh panitia.</li>
            </ol>
          </div>

          {/* Pasal 11 & 12 */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                <h3 className="font-black text-xl text-slate-900">PASAL 11</h3>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ketentuan Tambahan</span>
              </div>
              <ol className="list-decimal list-outside pl-5 space-y-3 text-sm text-slate-600 leading-relaxed marker:font-bold marker:text-slate-900">
                <li>Dilarang membawa senjata tajam, senjata api, atau miras dalam bentuk apa pun (Sanksi DISKUALIFIKASI).</li>
                <li>Dilarang terlibat tindakan kekerasan dalam bentuk apa pun (Sanksi DISKUALIFIKASI).</li>
                <li>Dilarang merusak fasilitas area lomba atau kampus (Sanksi DISKUALIFIKASI).</li>
                <li>Keputusan dewan juri bersifat mutlak dan tidak dapat diganggu gugat.</li>
              </ol>
            </div>

            <div className="bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-800 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4">
                <h3 className="font-black text-xl text-white">PASAL 12</h3>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Penutup</span>
              </div>
              <ol className="list-decimal list-outside pl-5 space-y-3 text-sm text-slate-300 leading-relaxed marker:font-bold marker:text-white">
                <li>Tata tertib ini menjadi pedoman resmi bagi seluruh pihak yang terlibat.</li>
                <li>Dengan keikutsertaannya, seluruh peserta dianggap telah memahami dan bersedia mematuhi seluruh isi tata tertib ini tanpa terkecuali.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
