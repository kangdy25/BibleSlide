import React, { useState } from "react";

declare global {
  interface Window {
    electronAPI: {
      generatePpt: (input: string) => Promise<string>;
    };
  }
}

function App() {
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");

  const handleClick = async () => {
    setMessage("처리 중...");
    const res = await window.electronAPI.generatePpt(input);
    setMessage(res);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>BibleSlide - 성경 구절 PPT 생성기</h2>
      <input
        type="text"
        placeholder="예: 창1:1"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "100%", padding: 8, fontSize: 16 }}
      />
      <button onClick={handleClick} style={{ marginTop: 10, padding: "8px 16px" }}>
        PPT 생성
      </button>
      <p>{message}</p>
    </div>
  );
}

export default App;
