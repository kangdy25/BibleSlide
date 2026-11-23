import Header from '../ui/Header';
import Sidebar from '../ui/Sidebar';
import Content from '../ui/Content';

export default function BiblePage({ onHome }: { onHome: () => void }) {
  return (
    <>
      <Header onHome={onHome} />
      <main className="mainContent">
        <Sidebar />
        <Content />
      </main>
    </>
  );
}
