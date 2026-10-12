'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'cs' | 'tr' | 'en';

export const languages: { code: Language; label: string; name: string }[] = [
  { code: 'cs', label: 'CS', name: 'Čeština' },
  { code: 'tr', label: 'TR', name: 'Türkçe' },
  { code: 'en', label: 'EN', name: 'English' },
];

export const defaultLanguage: Language = 'cs';

const en = {
  story: {
    back: 'Back',
    next: 'Next',
    musicLoading: 'Loading music...',
    musicError: 'Music failed to load',
    unmute: 'Unmute music',
    mute: 'Mute music',
    language: 'Language',
  },
  intro: {
    open: 'Open Invitation',
  },
  envelope: {
    title: 'Wedding Invitation',
    invited: 'You are cordially invited to celebrate',
    and: 'and',
    date: '14 August 2027',
    tapToOpen: 'Tap to open',
    welcome: 'Welcome to our story...',
    unfold: 'Let love unfold',
  },
  blessing: {
    text: 'It is with great joy and love that we invite you to witness and celebrate the beginning of our forever. As we exchange our vows and start a new chapter, your presence will mean the world to us.',
    seeYouIn: 'SEE YOU IN',
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
  },
  date: {
    heading: 'The day the heavens will smile',
    weekday: 'Saturday',
    day: '14',
    month: 'August',
    year: '2027',
    country: 'Czechia',
    openMap: 'Open in Google Maps',
    saveTheDate: 'Save the Date',
    download: 'Download',
    timeline: 'Timeline',
    schedule: [
      { time: '1:00 PM', title: 'GUEST ARRIVAL' },
      { time: '2:00 PM', title: 'CEREMONY' },
      { time: '4:00 PM', title: 'RECEPTION' },
      { time: '8:00 PM', title: 'EVENING PARTY' },
    ],
    navigateTo: 'Navigate to',
    closing: 'Join us for a day filled with love and celebration',
    moreInfo: 'For More Information',
    rsvp: 'RSVP',
    contact: 'Contact',
    calendarTitle: 'Erol & Klaudie Wedding',
    calendarDescription: 'Join us for our special day filled with love and celebration. Timeline: 1:00 PM - Guest Arrival, 2:00 PM - Ceremony, 4:00 PM - Reception, 8:00 PM - Evening Party',
  },
  dressCode: {
    heading: 'Dress Code & Theme',
    themeTitle: 'Wedding Theme',
    theme: 'Dusty Blue & White',
    themeTagline: 'Timeless Grace',
    dustyBlue: 'Dusty Blue',
    white: 'Pure White',
    silver: 'Silver',
    dressCode: 'Dress Code',
    matsela: 'Matsela',
    fabrics: 'Traditional fabrics for our families',
    bridesSide: "Bride's Family & Friends",
    forBride: "For the bride's side",
    groomsSide: "Groom's Family & Friends",
    forGroom: "For the groom's side",
    closing: 'Let us celebrate in harmony and elegance',
  },
  scripture: {
    verse: 'So then, they are no longer two but one flesh. Therefore what God has joined together, let not man separate.',
    reference: 'Matthew 19:6 NKJV',
  },
  gallery: {
    heading: 'Our Journey to Forever',
    close: 'Close',
    captions: [
      'Our story so far...',
      'Adventures together...',
      'Every moment with you...',
      'Side by side...',
      'Laughing through life...',
      'Exploring new places...',
      'Sunny days together...',
      'Dressed up and in love...',
      'Building our forever...',
      'Our hearts united...',
      'Love in every glance...',
      'Making memories...',
      'Where it all began...',
      'The moment we knew...',
    ],
  },
  rsvp: {
    heading: 'Please RSVP',
    subtitle: 'Your presence would make our special day complete',
    deadline: 'Please respond by 14 July 2027',
    loading: 'Loading…',
  },
};

export type Translations = typeof en;

const cs: Translations = {
  story: {
    back: 'Zpět',
    next: 'Další',
    musicLoading: 'Načítání hudby...',
    musicError: 'Hudbu se nepodařilo načíst',
    unmute: 'Zapnout hudbu',
    mute: 'Ztlumit hudbu',
    language: 'Jazyk',
  },
  intro: {
    open: 'Otevřít pozvánku',
  },
  envelope: {
    title: 'Svatební pozvánka',
    invited: 'Srdečně vás zveme na svatbu',
    and: 'a',
    date: '14. srpna 2027',
    tapToOpen: 'Klepnutím otevřete',
    welcome: 'Vítejte v našem příběhu...',
    unfold: 'Nechte lásku rozkvést',
  },
  blessing: {
    text: 'S velkou radostí a láskou vás zveme, abyste byli svědky počátku naší společné cesty. Až si budeme slibovat věrnost a začínat novou kapitolu, vaše přítomnost pro nás bude znamenat celý svět.',
    seeYouIn: 'UVIDÍME SE ZA',
    days: 'Dní',
    hours: 'Hodin',
    minutes: 'Minut',
    seconds: 'Sekund',
  },
  date: {
    heading: 'Den, kdy se nebesa usmějí',
    weekday: 'Sobota',
    day: '14.',
    month: 'srpna',
    year: '2027',
    country: 'Česko',
    openMap: 'Otevřít v Mapách Google',
    saveTheDate: 'Uložte si datum',
    download: 'Stáhnout',
    timeline: 'Program',
    schedule: [
      { time: '13:00', title: 'PŘÍJEZD HOSTŮ' },
      { time: '14:00', title: 'OBŘAD' },
      { time: '16:00', title: 'SVATEBNÍ HOSTINA' },
      { time: '20:00', title: 'VEČERNÍ ZÁBAVA' },
    ],
    navigateTo: 'Navigovat na',
    closing: 'Přijďte s námi oslavit den plný lásky a radosti',
    moreInfo: 'Další informace',
    rsvp: 'Potvrzení účasti',
    contact: 'Kontakt',
    calendarTitle: 'Svatba Erola a Klaudie',
    calendarDescription: 'Přijďte s námi oslavit náš velký den plný lásky a radosti. Program: 13:00 – příjezd hostů, 14:00 – obřad, 16:00 – svatební hostina, 20:00 – večerní zábava',
  },
  dressCode: {
    heading: 'Dress code a barvy',
    themeTitle: 'Barvy svatby',
    theme: 'Pudrově modrá a bílá',
    themeTagline: 'Nadčasová elegance',
    dustyBlue: 'Pudrově modrá',
    white: 'Čistě bílá',
    silver: 'Stříbrná',
    dressCode: 'Dress code',
    matsela: 'Matsela',
    fabrics: 'Tradiční látky pro naše rodiny',
    bridesSide: 'Rodina a přátelé nevěsty',
    forBride: 'Pro stranu nevěsty',
    groomsSide: 'Rodina a přátelé ženicha',
    forGroom: 'Pro stranu ženicha',
    closing: 'Oslavme to společně v harmonii a eleganci',
  },
  scripture: {
    verse: 'Takže již nejsou dva, ale jeden. Co tedy Bůh spojil, člověk nerozlučuj.',
    reference: 'Matouš 19,6',
  },
  gallery: {
    heading: 'Naše společná cesta',
    close: 'Zavřít',
    captions: [
      'Náš dosavadní příběh...',
      'Společná dobrodružství...',
      'Každá chvíle s tebou...',
      'Bok po boku...',
      'Se smíchem životem...',
      'Objevujeme nová místa...',
      'Slunečné dny spolu...',
      'Nastrojení a zamilovaní...',
      'Stavíme naše navždy...',
      'Naše spojená srdce...',
      'Láska v každém pohledu...',
      'Vytváříme vzpomínky...',
      'Kde to všechno začalo...',
      'Chvíle, kdy jsme to věděli...',
    ],
  },
  rsvp: {
    heading: 'Potvrďte prosím účast',
    subtitle: 'Vaše přítomnost udělá náš velký den dokonalým',
    deadline: 'Prosíme o odpověď do 14. července 2027',
    loading: 'Načítání…',
  },
};

const tr: Translations = {
  story: {
    back: 'Geri',
    next: 'İleri',
    musicLoading: 'Müzik yükleniyor...',
    musicError: 'Müzik yüklenemedi',
    unmute: 'Müziği aç',
    mute: 'Müziği kapat',
    language: 'Dil',
  },
  intro: {
    open: 'Davetiyeyi Aç',
  },
  envelope: {
    title: 'Düğün Davetiyesi',
    invited: 'Düğünümüze davetlisiniz',
    and: 've',
    date: '14 Ağustos 2027',
    tapToOpen: 'Açmak için dokunun',
    welcome: 'Hikayemize hoş geldiniz...',
    unfold: 'Aşkın hikayesi başlıyor',
  },
  blessing: {
    text: 'Büyük bir sevinç ve sevgiyle, sonsuzluğumuzun başlangıcına tanıklık etmeye ve bu mutluluğu bizimle kutlamaya sizi davet ediyoruz. Yeminlerimizi edip yeni bir sayfa açarken, varlığınız bizim için dünyalara bedel olacak.',
    seeYouIn: 'BÜYÜK GÜNE KALAN',
    days: 'Gün',
    hours: 'Saat',
    minutes: 'Dakika',
    seconds: 'Saniye',
  },
  date: {
    heading: 'Göklerin gülümseyeceği gün',
    weekday: 'Cumartesi',
    day: '14',
    month: 'Ağustos',
    year: '2027',
    country: 'Çekya',
    openMap: "Google Haritalar'da aç",
    saveTheDate: 'Tarihi Kaydedin',
    download: 'İndir',
    timeline: 'Günün Akışı',
    schedule: [
      { time: '13:00', title: 'MİSAFİRLERİN KARŞILANMASI' },
      { time: '14:00', title: 'NİKAH TÖRENİ' },
      { time: '16:00', title: 'DÜĞÜN YEMEĞİ' },
      { time: '20:00', title: 'GECE EĞLENCESİ' },
    ],
    navigateTo: 'Yol tarifi:',
    closing: 'Sevgi ve neşe dolu bu günde bizimle olun',
    moreInfo: 'Daha Fazla Bilgi',
    rsvp: 'LCV',
    contact: 'İletişim',
    calendarTitle: "Erol & Klaudie'nin Düğünü",
    calendarDescription: 'Sevgi ve neşe dolu özel günümüzde bizimle olun. Günün akışı: 13:00 - Misafirlerin karşılanması, 14:00 - Nikah töreni, 16:00 - Düğün yemeği, 20:00 - Gece eğlencesi',
  },
  dressCode: {
    heading: 'Kıyafet ve Tema',
    themeTitle: 'Düğün Teması',
    theme: 'Toz Mavisi ve Beyaz',
    themeTagline: 'Zamansız Zarafet',
    dustyBlue: 'Toz Mavisi',
    white: 'Saf Beyaz',
    silver: 'Gümüş',
    dressCode: 'Kıyafet Kuralı',
    matsela: 'Matsela',
    fabrics: 'Ailelerimiz için geleneksel kumaşlar',
    bridesSide: 'Gelin Tarafı Aile ve Dostları',
    forBride: 'Gelin tarafı için',
    groomsSide: 'Damat Tarafı Aile ve Dostları',
    forGroom: 'Damat tarafı için',
    closing: 'Uyum ve zarafet içinde birlikte kutlayalım',
  },
  scripture: {
    verse: "Böylece onlar artık iki değil, tek bedendir. Bu nedenle Tanrı'nın birleştirdiğini insan ayırmasın.",
    reference: 'Matta 19:6',
  },
  gallery: {
    heading: 'Sonsuzluğa Yolculuğumuz',
    close: 'Kapat',
    captions: [
      'Bugüne kadarki hikayemiz...',
      'Birlikte maceralar...',
      'Seninle her an...',
      'Yan yana...',
      'Kahkahalarla dolu bir hayat...',
      'Yeni yerler keşfederken...',
      'Birlikte güneşli günler...',
      'Şık ve aşık...',
      'Sonsuzluğumuzu inşa ederken...',
      'Kalplerimiz bir...',
      'Her bakışta aşk...',
      'Anılar biriktirirken...',
      'Her şeyin başladığı yer...',
      'Bildiğimiz o an...',
    ],
  },
  rsvp: {
    heading: 'Lütfen Katılımınızı Bildirin',
    subtitle: 'Varlığınız özel günümüzü tamamlayacak',
    deadline: "Lütfen 14 Temmuz 2027'ye kadar yanıt verin",
    loading: 'Yükleniyor…',
  },
};

const translations: Record<Language, Translations> = { cs, tr, en };

// The invitation line shown in the other languages, as a bilingual touch
export const greetings: Record<Language, string> = {
  cs: 'Srdečně vás zveme na naši svatbu.',
  tr: 'Sizi düğünümüze içtenlikle davet ediyoruz.',
  en: 'You are warmly invited to our wedding.',
};

const STORAGE_KEY = 'wedding-language';

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);

  // Restore the guest's previous choice
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (saved && saved in translations) setLanguageState(saved);
    } catch {
      // Storage unavailable (private mode etc.) - keep the default
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (next: Language) => {
    setLanguageState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore - the choice just won't be remembered
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
}
