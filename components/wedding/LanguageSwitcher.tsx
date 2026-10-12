'use client';

import { useLanguage, languages } from '@/lib/i18n';

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div
      className={`flex bg-black/50 rounded-full p-0.5 ${className}`}
      role="group"
      aria-label={t.story.language}
      onClick={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
    >
      {languages.map(({ code, label, name }) => (
        <button
          key={code}
          onClick={() => setLanguage(code)}
          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
            language === code ? 'bg-white text-gray-900' : 'text-white hover:bg-white/20'
          }`}
          title={name}
          lang={code}
          aria-pressed={language === code}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
