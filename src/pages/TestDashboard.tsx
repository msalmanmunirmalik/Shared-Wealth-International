import React from 'react';

const TestDashboard = () => {
  return (
    <div style={{ 
      backgroundColor: 'rgb(224, 230, 235)', 
      minHeight: '100vh', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: 'rgb(30, 58, 138)', marginBottom: '20px' }}>
          🎉 Dashboard Test - SUCCESS!
        </h1>
        
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ color: 'rgb(30, 58, 138)' }}>✅ What This Confirms:</h2>
          <ul style={{ color: 'rgb(75, 85, 99)' }}>
            <li>Routing is working correctly</li>
            <li>Authentication is working</li>
            <li>Color scheme is applied</li>
            <li>Component rendering is working</li>
          </ul>
        </div>

        <div style={{ 
          backgroundColor: 'rgb(245, 158, 11)', 
          color: 'white', 
          padding: '15px', 
          borderRadius: '6px',
          marginBottom: '20px'
        }}>
          <strong>🎯 Next Steps:</strong>
          <p>If you can see this test page, the issue is with the main CompanyDashboard component, not routing or authentication.</p>
        </div>

        <div style={{ 
          backgroundColor: 'rgb(248, 250, 252)', 
          padding: '15px', 
          borderRadius: '6px',
          border: '1px solid rgb(224, 230, 235)'
        }}>
          <h3 style={{ color: 'rgb(30, 58, 138)' }}>🔧 Troubleshooting:</h3>
          <ol style={{ color: 'rgb(75, 85, 99)' }}>
            <li>Check browser console for JavaScript errors</li>
            <li>Try hard refresh (Ctrl+F5 or Cmd+Shift+R)</li>
            <li>Clear browser cache completely</li>
            <li>Check if all imports are working in CompanyDashboard.tsx</li>
          </ol>
        </div>

        <a 
          href="/user-dashboard" 
          style={{
            display: 'inline-block',
            backgroundColor: 'rgb(30, 58, 138)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '6px',
            textDecoration: 'none',
            marginTop: '20px'
          }}
        >
          ← Back to Company Dashboard
        </a>
      </div>
    </div>
  );
};

export default TestDashboard; 