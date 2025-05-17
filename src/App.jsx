import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Button } from '@mui/material';
import MicrofrontendLoader from './MicrofrontendLoader';
import ReactDOM from 'react-dom/client';
import Home from './pages/Home';
import * as MaterialUI from '@mui/material';
import About from './pages/About';
import Services from './pages/Services';


const Details = () => (
  <div className='text-center text-xl'>
    <p>This is the Details Page</p>
  </div>
);

function App() {
  const handleButtonClick = (message) => {
    console.log('Host app received message:', message);
  };

  window.process = { env: {} };
  window.React = React;
  window.ReactDOM = ReactDOM;
  window.MaterialUI = MaterialUI;


  const handleButtonClickNav = () => {
    alert('Button clicked in Host!');
  };

  return (
    <Router>
      <div className='flex flex-col items-center min-h-screen'>
        <div className='bg-blue-900 py-4 px-2 w-full mb-10 flex justify-between items-center'>
          <h1 className='text-white text-xl ml-4'>Host App</h1>
          <div className='flex gap-4 mr-4'>
            <Link to="/" className='text-white'>Home</Link>
            <Link to="/details" className='text-white'>Details</Link>
            <Link to="/create" className='text-white'>Create</Link>
            <Link to="/about" className='text-white'>About</Link>
            <Link to="/services" className='text-white'>Services</Link>
            <Button variant="contained" color="primary" onClick={handleButtonClickNav}>
              Click Me (MUI)
            </Button>
          </div>
        </div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/details" element={<Details />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />

          <Route
            path="/create/*"
            element={
              <MicrofrontendLoader
                cssUrl="https://mf-component-bundle.vercel.app/microfrontend-project.css"
                scriptUrl="https://mf-component-bundle.vercel.app/microfrontend-bundle.js"
                mountDivId="microfrontend-root"
                globalVarName="MyMicrofrontendComponent"
                propsToPass={{
                  userId: 42,
                  onButtonClick: handleButtonClick,
                }}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
