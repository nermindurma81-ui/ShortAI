import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useToast } from './hooks/useToast';
import { ToastContainer } from './components/Toast';
import { SettingsPanel, SettingsFab } from './components/Settings';
import { getSettings } from './lib/ai';

import Home from './pages/Home';
import AiStory from './pages/AiStory';
import { ScriptGen, RedditStory, Captions, VideoIdeas, Subtitles } from './pages/TextTools';
import { Dialogue, FakeText, TikTokCalc } from './pages/MediaTools';
import VideoStudio from './pages/VideoStudio';
import VideoInspector from './pages/VideoInspector';
import Scheduler from './pages/Scheduler';

import './styles/globals.css';

const NAV_ITEMS = [
  { path:'/',               icon:'🏠', label:'Home' },
  { path:'/video-studio',   icon:'🎬', label:'Studio' },
  { path:'/video-inspector',icon:'🔍', label:'Kloner' },
  { path:'/scheduler',      icon:'📅', label:'Planer' },
];

function Layout() {
  const { toasts, showToast } = useToast();
  const [showSettings, setShowSettings] = useState(false);
  const [hasKey, setHasKey] = useState(!!getSettings().apiKey);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle YouTube OAuth token callback
  useEffect(() => {
    const match = window.location.hash.match(/access_token=([^&]+)/);
    if (match) {
      localStorage.setItem('yt_access_token', match[1]);
      showToast('✅ YouTube nalog spojen!', 'success');
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  function handleSettingsSaved() {
    setHasKey(!!getSettings().apiKey);
    showToast('✅ Postavke sačuvane!', 'success');
  }

  const sharedProps = { showToast };

  return (
    <div className="app-layout">
      {/* Top nav */}
      <nav className="top-nav">
        <div className="nav-logo" onClick={() => navigate('/')} style={{cursor:'pointer'}}>⚡ ShortAI</div>
        <div className="nav-links" style={{display:'none'}}>
          {/* Hidden on mobile — use bottom nav */}
        </div>
      </nav>

      {/* Main content */}
      <main className="main-content">
        <Routes>
          <Route path="/"               element={<Home />} />
          <Route path="/ai-story"       element={<AiStory {...sharedProps} />} />
          <Route path="/reddit-story"   element={<RedditStory {...sharedProps} />} />
          <Route path="/fake-text"      element={<FakeText {...sharedProps} />} />
          <Route path="/dialogue"       element={<Dialogue {...sharedProps} />} />
          <Route path="/script-gen"     element={<ScriptGen {...sharedProps} />} />
          <Route path="/subtitles"      element={<Subtitles {...sharedProps} />} />
          <Route path="/tiktok-calc"    element={<TikTokCalc />} />
          <Route path="/captions"       element={<Captions {...sharedProps} />} />
          <Route path="/video-ideas"    element={<VideoIdeas {...sharedProps} />} />
          <Route path="/scheduler"      element={<Scheduler {...sharedProps} />} />
          <Route path="/video-studio"   element={<VideoStudio {...sharedProps} />} />
          <Route path="/video-inspector" element={<VideoInspector {...sharedProps} />} />
        </Routes>
      </main>

      {/* Bottom nav */}
      <nav className="bottom-nav">
        {NAV_ITEMS.map(item => (
          <button key={item.path} className={`bottom-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}>
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
        <button className="bottom-nav-item" onClick={() => setShowSettings(true)}>
          <span className="nav-icon">⚙️</span>
          <span>API</span>
        </button>
      </nav>

      {/* Settings FAB */}
      <SettingsFab onClick={() => setShowSettings(true)} hasKey={hasKey} />

      {/* Settings panel */}
      {showSettings && (
        <SettingsPanel onClose={() => setShowSettings(false)} onSaved={handleSettingsSaved} />
      )}

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
