import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Opening from './components/Opening.jsx';
import Home from './components/Home.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Opening />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App; // Export the App component as default
