import React, { useState } from 'react';
import {
  BookOpen,
  FileText,
  FileEdit,
  FileCheck,
  Map,
  ShieldAlert,
  ArrowDownToLine,
  Download as DownloadIcon,
  Info
} from 'lucide-react';
import { DOWNLOADS } from '../config.js';

const ICON_MAP = {
  BookOpen: BookOpen,
  FileText: FileText,
  FileEdit: FileEdit,
  FileCheck: FileCheck,
  Map: Map,
  ShieldAlert: ShieldAlert,
};

const COLOR_MAP = {
  blue: {
    accent: 'bg-blue-600',
    icon: 'bg-blue-50 text-blue-600',
    hover: 'hover:border-blue-300',
    btn: 'text-blue-600 hover:bg-blue-50',
  },
  red: {
    accent: 'bg-red-700',
    icon: 'bg-red-50 text-red-700',
    hover: 'hover:border-red-300',
    btn: 'text-red-700 hover:bg-red-50',
  },
  orange: {
    accent: 'bg-amber-500',
    icon: 'bg-amber-50 text-amber-700',
    hover: 'hover:border-amber-300',
    btn: 'text-amber-700 hover:bg-amber-50',
  },
};

export default function Downloads() {
  const [toastMessage, setToastMessage] = useState('');

  function handleDownload(e, item) {
    if (!item.url || item.url === '#') {
      e.preventDefault();
      setToastMessage(`Dokumen "${item.title}" akan segera dirilis oleh panitia.`);
      setTimeout(() => setToastMessage(''), 4000);
    }
  }
  return (
    <section id="downloads" className="py-24 lg:py-32 bg-slate-50 relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-100 skew-x-12 transform origin-top-right -z-10"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-100/50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter mb-4 inline-block leading-tight py-1">
            Pusat{' '}
            <span className="inline-block pr-3 sm:pr-4 pb-1 text-transparent bg-clip-text bg-gradient-to-r from-red-700 via-red-600 to-amber-600">
              Unduhan
            </span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg font-medium">
            Akses seluruh dokumen resmi dan kelengkapan administrasi lomba.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DOWNLOADS.map(item => {
            const Icon = ICON_MAP[item.icon] || FileText;
            const c = COLOR_MAP[item.colorScheme] || COLOR_MAP.red;

            if (item.featured) {
              return (
                <div
                  key={item.id}
                  className="group bg-slate-900 rounded-2xl p-8 shadow-2xl hover:shadow-slate-900/40 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden flex flex-col border border-slate-700 md:col-span-2 lg:col-span-1 lg:row-span-2"
                >
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-600/30 rounded-full blur-3xl group-hover:bg-red-500/40 transition-all duration-500"></div>

                  <div className="flex items-start justify-between mb-8">
                    <div className="p-4 bg-white/10 text-white rounded-2xl border border-white/10 group-hover:bg-red-700 group-hover:border-red-600 transition-colors shadow-lg">
                      <Icon className="w-10 h-10" />
                    </div>
                    {item.badge && (
                      <span className="px-3 py-1 bg-red-700 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-lg shadow-red-950/50">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-black text-2xl text-white mb-3 leading-tight group-hover:text-amber-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-400 mb-8 flex-grow leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Ukuran File</span>
                      <span className="text-sm font-bold text-white">{item.size}</span>
                    </div>
                    <a
                      href={item.url}
                      onClick={e => handleDownload(e, item)}
                      download={item.url !== '#'}
                      className="flex items-center gap-2 px-6 py-3 bg-red-700 text-white rounded-xl text-sm font-bold hover:bg-red-800 hover:shadow-lg hover:shadow-red-700/30 transition-all active:scale-95"
                    >
                      Download <ArrowDownToLine className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={item.id}
                className={`group bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-xl ${c.hover} hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col`}
              >
                <div className={`absolute top-0 left-0 w-1.5 h-full ${c.accent}`}></div>

                <div className="flex items-start justify-between mb-4 pl-4">
                  <div className={`p-3 ${c.icon} rounded-xl group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase tracking-wider border border-slate-200">
                    {item.type}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-slate-800 mb-2 pl-4 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500 mb-6 flex-grow pl-4">
                  {item.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 pl-4">
                  <span className="text-xs font-semibold text-slate-500">{item.size}</span>
                  <a
                    href={item.url}
                    onClick={e => handleDownload(e, item)}
                    download={item.url !== '#'}
                    className={`${c.btn} p-2 rounded-lg transition-colors`}
                    aria-label={`Unduh ${item.title}`}
                  >
                    <DownloadIcon className="w-5 h-5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {toastMessage && (
        <div className="fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-5 py-3 rounded-xl shadow-2xl border border-yellow-500/40 backdrop-blur-md flex items-center gap-3 animate-fade max-w-md text-xs sm:text-sm">
          <Info className="w-5 h-5 text-yellow-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </section>
  );
}
