'use client';

import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Cookies from 'js-cookie';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const router = useRouter();
  const locale = useLocale();

  const handleLocaleChange = () => {
    const nextLocale = locale === 'id' ? 'en' : 'id';
    Cookies.set('NEXT_LOCALE', nextLocale, { expires: 365, path: '/' });
    router.refresh();
  };

  return (
    <button 
      onClick={handleLocaleChange}
      className="flex items-center gap-1.5 p-2 text-sm font-medium hover:bg-slate-100 rounded-md transition-colors h-10 w-10 justify-center [header[data-scroll=up]_&]:text-slate-700 text-white hover:[header[data-scroll=up]_&]:bg-slate-100/50 hover:bg-white/10"
      title={locale === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
    >
      <Globe size={18} />
      <span className="hidden lg:inline">{locale === 'id' ? 'ID' : 'EN'}</span>
    </button>
  );
}
