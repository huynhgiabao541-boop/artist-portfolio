import './App.css';
import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/Header';
import Footer from './components/Footer';
import AtmosphereOverlay from './components/AtmosphereOverlay';
import CustomCursor from './components/CustomCursor';
import Preloader from './components/Preloader';
import About from './Routes/About';
import Museum from './Routes/Museum';
import Contact from './Routes/Contact';
import Admin from './Routes/Admin';

const AppContent = ({ appReady }) => {
  const location = useLocation();
  const isMuseum = location.pathname.startsWith('/museum');

  return (
    <div className={`app-wrapper ${appReady ? 'app-ready' : ''} ${isMuseum ? 'page-museum' : ''}`}>
      <AtmosphereOverlay />
      <Header />
      <Switch>
        <Route path="/about">
          <About />
        </Route>

        <Route path="/museum">
          <Museum />
        </Route>

        <Route path="/contact">
          <Contact />
        </Route>

        <Route path="/admin">
          <Admin />
        </Route>

        <Route exact path="/">
          <Redirect to="/about" />
        </Route>
      </Switch>
      {!isMuseum && <Footer />}
    </div>
  );
};

const App = () => {
  const [appReady, setAppReady] = useState(false);

  const handleRevealStart = useCallback(() => {
    setAppReady(true);
  }, []);

  return (
    <LanguageProvider>
      <Router>
        <Preloader onRevealStart={handleRevealStart} />
        <CustomCursor />
        <AppContent appReady={appReady} />
      </Router>
    </LanguageProvider>
  );
};

export default App;
