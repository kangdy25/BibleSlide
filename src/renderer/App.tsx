import './App.css';
import Header from './ui/Header';
import Sidebar from './ui/Sidebar';
import Content from './ui/Content';

function App() {
  return (
    <div className="container">
      <Header />
      <div className="mainContent">
        <Sidebar />
        <Content />
      </div>
    </div>
  );
}

export default App;
