import WeddingStory from '@/components/wedding/WeddingStory';
import ClientOnly from '@/components/ClientOnly';
import { LanguageProvider } from '@/lib/i18n';

export default function Home() {
  return (
    <main className="w-full h-screen">
      <LanguageProvider>
      <ClientOnly fallback={
        <div className="w-full h-screen bg-gradient-to-br from-blush to-pink-300 flex items-center justify-center">
          <div className="text-white text-center">
            <h1 className="text-4xl font-script mb-4">Erol 💙 Klaudie</h1>
            <p className="text-lg font-body">Načítáme náš příběh...</p>
          </div>
        </div>
      }>
        <WeddingStory />
      </ClientOnly>
      </LanguageProvider>
    </main>
  );
}
