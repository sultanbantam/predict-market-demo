import { useState } from 'react';
import './App.css';

function App() {
  return (
    <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Clean System</h2>
      <p style={{ color: '#888' }}>All files moved to backup. Environment is pure.</p>
      <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #333', display: 'inline-block' }}>
        Status: Clean Build Test
      </div>
    </div>
  );
}

export default App;
