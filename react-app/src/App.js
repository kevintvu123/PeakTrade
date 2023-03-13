import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import StockDetail from './components/StockDetail';
import Homepage from './components/Homepage';
import Landing from './components/Landing';
import ApexStockChart from './components/StockDetail/ApexStockChart';
import { authenticate } from './store/session';

function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  const user = useSelector(state => state.session.user);

  useEffect(() => {
    (async () => {
      await dispatch(authenticate());
      setLoaded(true);
    })();
  }, [dispatch]);

  if (!loaded) {
    return null;
  }

  return (
    // BrowserRouter uses HTML5 history API to allow navigation w/ URLS to diff. parts of application w/o full refresh
    <BrowserRouter>
      {user && <NavBar />}
      {/* Switch renders first child that matches the current URL exactly. If not matches, renders a fallback route (404 Route) */}
      <Switch>
        <Route path='/' exact={true}>
          <Landing />
        </Route>
        <Route path='/login' exact={true}>
          <LoginForm />
        </Route>
        <Route path='/sign-up' exact={true}>
          <SignUpForm />
        </Route>
        <ProtectedRoute path='/main' exact={true} >
          <Homepage />
        </ProtectedRoute>
        <ProtectedRoute path='/stocks/:stockTicker'>
          <StockDetail />
        </ProtectedRoute>
        <Route path='/test' exact={true}>
          <ApexStockChart />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
