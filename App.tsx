import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { AdminProvider } from '@/context/AdminContext';
import { I18nProvider } from '@/lib/i18n';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ContentGrid, { invalidateContentCache } from '@/components/ContentGrid';
import ContentDetail from '@/components/ContentDetail';
import AuthModal from '@/components/AuthModal';
import Footer from '@/components/Footer';
import AdSlot from '@/components/AdSlot';
import SocialLinks from '@/components/SocialLinks';
import SEO from '@/components/SEO';
import CinematicIntro from '@/components/CinematicIntro';
import CosmicBackground from '@/components/CosmicBackground';
import GamesHub from '@/components/GamesHub';
import YadiJaran from '@/components/YadiJaran';
import BookStore from '@/components/BookStore';
import KurdishChannels from '@/components/KurdishChannels';
import { isNativeApp } from '@/lib/platform';
import { initLocalNotifications, subscribeToPushNotifications } from '@/lib/pushNotifications';
import type { ContentItem, ContentCategory } from '@/lib/supabase';

// Code-split heavy pages that most users won't visit in a single session
const AdminPanel = lazy(() => import('@/components/AdminPanel'));
const SettingsPage = lazy(() => import('@/components/SettingsPage'));
const AboutPage = lazy(() => import('@/components/AboutPage'));
const ProfilePage = lazy(() => import('@/components/ProfilePage'));
const VipPage = lazy(() => import('@/components/VipPage'));
const ChatComponent = lazy(() => import('@/components/ChatComponent'));
const NotificationsPanel = lazy(() => import('@/components/NotificationsPanel'));
const AIChat = lazy(() => import('@/components/AIChat'));

type Page = 'home' | 'settings' | 'about' | 'profile' | 'admin' | 'vip' | 'chat' | 'notifications' | 'games' | 'yadi' | 'books' | 'aichat' | 'channels';

function AppContent() {
  const [showIntro, setShowIntro] = useState(() => !sessionStorage.getItem('bs_intro_played'));
  const [page, setPage] = useState<Page>('home');
  const [activeCategory, setActiveCategory] = useState<ContentCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showGames, setShowGames] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleCategoryChange = (cat: ContentCategory | 'all') => {
    setActiveCategory(cat);
    setPage('home');
    setTimeout(() => { contentRef.current?.scrollIntoView({ behavior: 'smooth' }); }, 100);
  };

  const handleExplore = () => { contentRef.current?.scrollIntoView({ behavior: 'smooth' }); };

  const closeOverlay = () => { setPage('home'); setSelectedItem(null); setShowAuth(false); };

  const handleIntroFinish = () => {
    sessionStorage.setItem('bs_intro_played', '1');
    setShowIntro(false);
  };

  const refreshContent = () => invalidateContentCache();

  const { user } = useAuth();

  // Initialize local notifications and subscribe to push on native apps
  useEffect(() => {
    if (!isNativeApp()) return;
    initLocalNotifications();
    if (!user) return;
    const unsubscribe = subscribeToPushNotifications(user.id);
    return unsubscribe;
  }, [user]);

  return (
    <div className="min-h-screen bg-primary text-primary relative" dir="rtl">
      <CosmicBackground />
      {showIntro && <CinematicIntro onFinish={handleIntroFinish} />}
      <SEO item={selectedItem} />
      <Navbar
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAuth={() => setShowAuth(true)}
        onOpenProfile={() => setPage('profile')}
        onOpenSettings={() => setPage('settings')}
        onOpenAbout={() => setPage('about')}
        onOpenVip={() => setPage('vip')}
        onOpenChat={() => setShowChat(true)}
        onOpenNotifications={() => setShowNotifications(true)}
        onOpenGames={() => setShowGames(true)}
        onOpenYadiJaran={() => setPage('yadi')}
        onOpenBookStore={() => setPage('books')}
        onOpenAIChat={() => setShowAIChat(true)}
        onOpenChannels={() => setPage('channels')}
      />

      {page === 'home' && (
        <>
          {activeCategory === 'all' && !searchQuery && <Hero onExplore={handleExplore} />}

          <main ref={contentRef} className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 md:py-10">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-base sm:text-xl md:text-3xl font-black text-primary tracking-tight flex items-center gap-2.5">
                <span className="w-1 h-5 md:h-8 rounded-full bg-accent" style={{ boxShadow: '0 0 10px var(--shadow-glow)' }} />
                {searchQuery
                  ? `گەڕان: ${searchQuery}`
                  : activeCategory === 'all'
                  ? 'بەرزترین ناوەڕۆک'
                  : activeCategory === 'comic'
                  ? 'کۆمیک'
                  : activeCategory === 'series'
                  ? 'زنجیرە'
                  : activeCategory === 'movie'
                  ? 'فیلم'
                  : activeCategory === 'anime'
                  ? 'ئەنیمی'
                  : activeCategory === 'anime_series'
                  ? 'زنجیرەی ئەنیمی'
                  : activeCategory === 'animation'
                  ? 'ئەنیمەیشن و کارتۆن'
                  : 'زنجیرەی ئەنیمی'}
              </h2>
            </div>
            <ContentGrid category={activeCategory} searchQuery={searchQuery} onItemClick={setSelectedItem} />

            {/* Social media section */}
            {activeCategory === 'all' && !searchQuery && (
              <div className="mt-6 sm:mt-12 pt-5 sm:pt-8 border-t border-default">
                <h3 className="text-sm sm:text-lg md:text-xl font-bold text-primary text-center mb-4 sm:mb-6 tracking-wide">بەدوامان بکە لە سۆشیاڵ میدیا</h3>
                <SocialLinks variant="section" />
              </div>
            )}
          </main>

          <Footer
            onOpenAbout={() => setPage('about')}
            onOpenSettings={() => setPage('settings')}
            onOpenAdmin={() => setPage('admin')}
            onOpenVip={() => setPage('vip')}
          />
        </>
      )}

      {page === 'yadi' && (
        <>
          <YadiJaran onOpenAuth={() => setShowAuth(true)} />
          <Footer
            onOpenAbout={() => setPage('about')}
            onOpenSettings={() => setPage('settings')}
            onOpenAdmin={() => setPage('admin')}
            onOpenVip={() => setPage('vip')}
          />
        </>
      )}

      {page === 'books' && (
        <BookStore onClose={closeOverlay} />
      )}

      {page === 'channels' && (
        <>
          <KurdishChannels />
          <Footer
            onOpenAbout={() => setPage('about')}
            onOpenSettings={() => setPage('settings')}
            onOpenAdmin={() => setPage('admin')}
            onOpenVip={() => setPage('vip')}
          />
        </>
      )}

      {selectedItem && <ContentDetail item={selectedItem} onClose={() => setSelectedItem(null)} onContentUpdated={refreshContent} />}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {page === 'admin' && !isNativeApp() && (
        <Suspense fallback={null}><AdminPanel onClose={closeOverlay} /></Suspense>
      )}
      {page === 'settings' && (
        <Suspense fallback={null}><SettingsPage onClose={closeOverlay} /></Suspense>
      )}
      {page === 'about' && (
        <Suspense fallback={null}><AboutPage onClose={closeOverlay} /></Suspense>
      )}
      {page === 'profile' && (
        <Suspense fallback={null}><ProfilePage onClose={closeOverlay} /></Suspense>
      )}
      {page === 'vip' && (
        <Suspense fallback={null}><VipPage onClose={closeOverlay} /></Suspense>
      )}
      {showChat && (
        <Suspense fallback={null}><ChatComponent onClose={() => setShowChat(false)} /></Suspense>
      )}
      {showAIChat && (
        <Suspense fallback={null}><AIChat onClose={() => setShowAIChat(false)} /></Suspense>
      )}
      {showNotifications && (
        <Suspense fallback={null}>
          <NotificationsPanel
            onClose={() => setShowNotifications(false)}
            onNavigate={(target) => {
              setShowNotifications(false);
              if (target === 'chat') setShowChat(true);
              else if (target === 'games') setShowGames(true);
              else if (target === 'aichat') setShowAIChat(true);
              else if (target === 'content') { setPage('home'); setSelectedItem(null); }
            }}
          />
        </Suspense>
      )}
      {showGames && <GamesHub onClose={() => setShowGames(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AdminProvider>
          <I18nProvider>
            <AppContent />
          </I18nProvider>
        </AdminProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
