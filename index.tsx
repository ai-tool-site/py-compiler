import React, { useState } from 'react';
import Editor from '@monaco-editor/react';

const languages = ['python3', 'cpp17', 'java', 'javascript'];

export default function Home() {
  const [code, setCode] = useState("print('Hello, World')");
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('python3');

  const handleRun = async () => {
    const res = await fetch('/api/compile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, input, language }),
    });
    const data = await res.json();
    setOutput(data.output || 'No output');
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Python Online Compiler</h1>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        {languages.map((lang) => (
          <option key={lang}>{lang}</option>
        ))}
      </select>
      <Editor height="300px" defaultLanguage="python" theme="vs-dark" value={code} onChange={v => setCode(v || '')} />
      <textarea placeholder="Input" value={input} onChange={(e) => setInput(e.target.value)} style={{ width: '100%', height: 60 }} />
      <button onClick={handleRun}>Run</button>
      <pre>{output}</pre>
      <div style={{ marginTop: 10 }}>
        <button onClick={() => localStorage.setItem("savedCode", code)}>💾 Quick Save</button>
        <button onClick={() => alert(localStorage.getItem("savedCode") || 'No saved code')}>🕘 Version History</button>
        <button onClick={() => {
          const win = window.open('', '_blank');
          if (!win) return;
          win.document.write(`<pre>${code.replace(/</g, '&lt;')}</pre>`);
          win.print();
        }}>📄 Export PDF</button>
        <button onClick={() => window.location.href = `mailto:?subject=My Code&body=${encodeURIComponent(code)}`}>📧 Share via Email</button>
      </div>

    </div>
  );
}
