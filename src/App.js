import React from 'react';

import './App.css';
import LoginFormComponent from './components/LoginFormComponent';

function App() {
  return (
    <div
      style={{
        height: '100vh',
      }}
    >
      <div className="shadows"></div>
      <div className="shadows2"></div>

      <div
        style={{ zIndex: 1000 }}
        className="hidden md:block absolute left-1/2 -translate-x-1/2 pointer-events-none -z-10"
        aria-hidden="true"
      >
        {/* <img
          src={Illustration}
          className="max-w-none"
          width="1440"
          height="749"
          alt="Hero Illustration"
        /> */}
      </div>
      <LoginFormComponent />
    </div>
  );
}

export default App;
