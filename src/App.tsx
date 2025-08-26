import { useState } from 'react';
import './App.css';
import Header from './ui/Header';
import Sidebar from './ui/Sidebar';
import Content from './ui/Content';

function App() {
  const [font, setFont] = useState('Pretendard');

  const allSidebarProps = {
    font,
    setFont,
  };

  return (
    <div className="container">
      <Header />
      <div className="mainContent">
        <Sidebar {...allSidebarProps} />
        <Content />
      </div>
    </div>
  );
}

export default App;
