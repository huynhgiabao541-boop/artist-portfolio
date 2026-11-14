import './App.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import About from './Routes/About';
import Museum from './Routes/Museum';
import Contact from './Routes/Contact';
import Admin from './Routes/Admin';

const App = () => {
  return (
    <Router>
      <div className="app-wrapper">
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
        <Footer />
      </div>
    </Router>
  );
};

export default App;
