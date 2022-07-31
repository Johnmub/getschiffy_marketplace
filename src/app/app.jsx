import React, {Component} from 'react';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import { Store } from '../store/store';
import './app_v1.0.0.css';

import Header from '../components/header/header';
import Dashboard from '../components/dashboard/dashboard';
import Marketplace from '../components/marketplace/marketplace';
import Account from '../components/account/account';

class App extends Component
{
  render()
  {
    return (
      <Provider store={Store}>
        <Router>
          <div className='container w-full min-w-full h-screen overflow-hidden'>
            <Header/>
            
            <div className='h-full'>
              <Routes>
                <Route path='/' element={<Dashboard/>}/>
                <Route path='/characters' element={<Marketplace/>}/>
                <Route path='account/*' element={<Account/>}/>
                <Route path="*" element={<Navigate to="/" replace={true}/>} />
              </Routes>
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;