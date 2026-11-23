import { useState } from 'react';
import './App.css';
import HomePage from './pages/HomePage';
import BiblePage from './pages/BiblePage';
import LyricsPage from './pages/LyricsPage';

function App() {
  const [page, setPage] = useState<'home' | 'bible' | 'lyrics'>('home');
  const [lyricsOpened, setLyricsOpened] = useState(false);
  const goHome = () => setPage('home');

  return (
    <div className="container">
      {page === 'home' && (
        <HomePage onOpenBible={() => setPage('bible')} onOpenLyrics={() => { setLyricsOpened(true); setPage('lyrics'); }} />
      )}
      {page === 'bible' && <BiblePage onHome={goHome} />}
      {lyricsOpened && <div hidden={page !== 'lyrics'}><LyricsPage onHome={goHome} /></div>}
    </div>
  );
}

export default App;
