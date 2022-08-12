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
  constructor() {
    super();
    this.state = {ethereumLoaded: true};
  }

  componentDidMount() {
    if(!window.ethereum) { this.setState({ethereumLoaded:false})}
  }

  renderApp() 
  {
    if(this.state.ethereumLoaded) 
    {
      return(
        <Routes>
          <Route path='/' element={<Dashboard/>}/>
          <Route path='/characters' element={<Marketplace/>}/>
          <Route path='account/*' element={<Account/>}/>
          <Route path="*" element={<Navigate to="/" replace={true}/>} />
        </Routes>
      );
    } else {
      return(
        <div className='w-full flex items-center justify-center pt-[40px]'>
          <p className="text-white font-bold text-xl">You must install metamask to be able to enjoy our service <a className="text-red" href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer">Metamask</a></p>
        </div>
      );
    }
  }

  render()
  {
    return (
      <Provider store={Store}>
        <Router>
          <div className='container w-full min-w-full h-screen'>
            <Header/>
            
            <div className='h-full mt-[75px]'>
              {this.renderApp()}
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;