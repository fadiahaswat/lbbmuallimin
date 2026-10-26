import React from 'react';

/**
 * Komponen Tabel Sebaran Nilai LBB Mu'allimin 2027
 * Sesuai Dokumen Petunjuk Teknis Penilaian & Kejuaraan Bab A Angka 3
 * (Materi Peleton & Komandan Peleton: K, C, B masing-masing 3 poin)
 */
export default function SebaranNilaiTable({ className = '', showSectionHeader = true }) {
  return (
    <div className={`space-y-6 font-sans text-slate-900 w-full ${className}`}>
      {showSectionHeader && (
        <div>
          <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
            3. Kriteria Penilaian dan Sebaran Nilai:
          </h4>
        </div>
      )}

      {/* Bagian a: Sebaran Nilai Materi Peleton */}
      <div className="space-y-2">
        <h5 className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
          a. Sebaran Nilai Materi Peleton:
        </h5>

        <div className="overflow-x-auto rounded-xl border border-black shadow-xs bg-white">
          <table className="w-full border-collapse text-[11px] sm:text-xs text-center min-w-[620px]">
            <thead>
              <tr className="border-b border-black font-black text-black">
                <th className="py-2.5 px-3 text-left border-r border-black bg-white w-32 sm:w-36">
                  Kesulitan Gerakan
                </th>
                <th className="py-2.5 px-2 border-r border-black bg-[#7f7f7f] text-black w-10 sm:w-11">
                  KS
                </th>
                <th colSpan={3} className="py-2.5 px-2 border-r border-black bg-[#ff0000] text-black">
                  K
                </th>
                <th colSpan={3} className="py-2.5 px-2 border-r border-black bg-[#ffc000] text-black">
                  C
                </th>
                <th colSpan={3} className="py-2.5 px-2 border-r border-black bg-[#92d050] text-black">
                  B
                </th>
                <th className="py-2.5 px-2 bg-[#00b0f0] text-black w-10 sm:w-11">
                  BS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black text-black">
              {/* Sederhana (50 - 80, Step +3) */}
              <tr className="border-b border-black">
                <td className="py-2.5 px-3 text-left font-semibold border-r border-black bg-white">
                  Sederhana
                </td>
                <td className="py-2.5 px-2 border-r border-black bg-[#d9d9d9]">50</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#fce4d6]">53</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#fce4d6]">56</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#fce4d6]">59</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#fff2cc]">62</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#fff2cc]">65</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#fff2cc]">68</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#e2efda]">71</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#e2efda]">74</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#e2efda]">77</td>
                <td className="py-2.5 px-2 bg-[#deebf7]">80</td>
              </tr>

              {/* Menengah (50 - 85, Alternating Step +3 / +4) */}
              <tr className="border-b border-black">
                <td className="py-2.5 px-3 text-left font-semibold border-r border-black bg-white">
                  Menengah
                </td>
                <td className="py-2.5 px-2 border-r border-black bg-[#d9d9d9]">50</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#fce4d6]">53</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#fce4d6]">57</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#fce4d6]">60</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#fff2cc]">64</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#fff2cc]">67</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#fff2cc]">71</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#e2efda]">74</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#e2efda]">78</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#e2efda]">81</td>
                <td className="py-2.5 px-2 bg-[#deebf7]">85</td>
              </tr>

              {/* Kompleks (50 - 90, Step +4) */}
              <tr>
                <td className="py-2.5 px-3 text-left font-semibold border-r border-black bg-white">
                  Kompleks
                </td>
                <td className="py-2.5 px-2 border-r border-black bg-[#d9d9d9]">50</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#fce4d6]">54</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#fce4d6]">58</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#fce4d6]">62</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#fff2cc]">66</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#fff2cc]">70</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#fff2cc]">74</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#e2efda]">78</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#e2efda]">82</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#e2efda]">86</td>
                <td className="py-2.5 px-2 bg-[#deebf7]">90</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 italic pt-0.5">
          Gerakan yang terlewat atau tidak dilaksanakan sama sekali diberi nilai 0 (nol).
        </p>
      </div>

      {/* Bagian b: Sebaran Nilai Komandan Peleton (Danton) */}
      <div className="space-y-2 pt-1">
        <h5 className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
          b. Sebaran Nilai Komandan Peleton (Danton):
        </h5>

        <div className="overflow-x-auto rounded-xl border border-black shadow-xs bg-white">
          <table className="w-full border-collapse text-[11px] sm:text-xs text-center min-w-[650px]">
            <thead>
              <tr className="border-b border-black font-black text-black">
                <th className="py-2.5 px-3 text-left border-r border-black bg-white w-48 sm:w-52">
                  Aspek Penilaian
                </th>
                <th className="py-2.5 px-2 border-r border-black bg-white w-14 sm:w-16">
                  Bobot
                </th>
                <th className="py-2.5 px-2 border-r border-black bg-[#7f7f7f] text-black w-10 sm:w-11">
                  KS
                </th>
                <th colSpan={3} className="py-2.5 px-2 border-r border-black bg-[#ff0000] text-black">
                  K
                </th>
                <th colSpan={3} className="py-2.5 px-2 border-r border-black bg-[#ffc000] text-black">
                  C
                </th>
                <th colSpan={3} className="py-2.5 px-2 border-r border-black bg-[#92d050] text-black">
                  B
                </th>
                <th className="py-2.5 px-2 bg-[#00b0f0] text-black w-10 sm:w-11">
                  BS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black text-black">
              {/* Aspek 1: Penguasaan Materi Lomba */}
              <tr className="border-b border-black">
                <td className="py-2.5 px-3 text-left font-semibold border-r border-black bg-white">
                  Penguasaan Materi Lomba
                </td>
                <td className="py-2.5 px-2 text-center font-bold border-r border-black bg-white">
                  35%
                </td>
                <td className="py-2.5 px-2 border-r border-black bg-[#d9d9d9]">50</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#fce4d6]">54</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#fce4d6]">58</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#fce4d6]">62</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#fff2cc]">66</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#fff2cc]">70</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#fff2cc]">74</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#e2efda]">78</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#e2efda]">82</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#e2efda]">86</td>
                <td className="py-2.5 px-2 bg-[#deebf7]">90</td>
              </tr>

              {/* Aspek 2: Kualitas Suara / Vokal */}
              <tr className="border-b border-black">
                <td className="py-2.5 px-3 text-left font-semibold border-r border-black bg-white">
                  Kualitas Suara / Vokal
                </td>
                <td className="py-2.5 px-2 text-center font-bold border-r border-black bg-white">
                  25%
                </td>
                <td className="py-2.5 px-2 border-r border-black bg-[#d9d9d9]">50</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#fce4d6]">54</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#fce4d6]">58</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#fce4d6]">62</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#fff2cc]">66</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#fff2cc]">70</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#fff2cc]">74</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#e2efda]">78</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#e2efda]">82</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#e2efda]">86</td>
                <td className="py-2.5 px-2 bg-[#deebf7]">90</td>
              </tr>

              {/* Aspek 3: Sikap & Pelaporan */}
              <tr className="border-b border-black">
                <td className="py-2.5 px-3 text-left font-semibold border-r border-black bg-white">
                  Sikap & Pelaporan
                </td>
                <td className="py-2.5 px-2 text-center font-bold border-r border-black bg-white">
                  20%
                </td>
                <td className="py-2.5 px-2 border-r border-black bg-[#d9d9d9]">50</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#fce4d6]">54</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#fce4d6]">58</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#fce4d6]">62</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#fff2cc]">66</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#fff2cc]">70</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#fff2cc]">74</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#e2efda]">78</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#e2efda]">82</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#e2efda]">86</td>
                <td className="py-2.5 px-2 bg-[#deebf7]">90</td>
              </tr>

              {/* Aspek 4: Penguasaan Lapangan */}
              <tr>
                <td className="py-2.5 px-3 text-left font-semibold border-r border-black bg-white">
                  Penguasaan Lapangan
                </td>
                <td className="py-2.5 px-2 text-center font-bold border-r border-black bg-white">
                  20%
                </td>
                <td className="py-2.5 px-2 border-r border-black bg-[#d9d9d9]">50</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#fce4d6]">54</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#fce4d6]">58</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#fce4d6]">62</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#fff2cc]">66</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#fff2cc]">70</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#fff2cc]">74</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#e2efda]">78</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#e2efda]">82</td>
                <td className="py-2.5 px-2 border-r border-black bg-[#e2efda]">86</td>
                <td className="py-2.5 px-2 bg-[#deebf7]">90</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
