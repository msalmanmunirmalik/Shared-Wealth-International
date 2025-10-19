import { useState } from 'react';

function SimpleApp() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '50px', fontFamily: 'Arial' }}>
      <h1 style={{ color: 'green' }}>✓ React is Working!</h1>
      <p>Shared Wealth International - Development Server</p>
      <button 
        onClick={() => setCount(count + 1)}
        style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
      >
        Click me: {count}
      </button>
      <hr />
      <p><a href="/auth">Go to Auth (if main app works)</a></p>
      <p>Server: http://localhost:8081</p>
      <p>Time: {new Date().toLocaleTimeString()}</p>
    </div>
  );
}

export default SimpleApp;

