import React, {useEffect, useState} from 'react';
import Web3 from 'web3';
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { loadAccount, disconnectAccount } from "../../store/slices/account/accountSlice";
import { disconnectGame } from '../../store/slices/game/gameSlice';
import { useSelector, useDispatch } from 'react-redux';

import { Toaster } from 'react-hot-toast';
import { Link, NavLink } from 'react-router-dom';
import {
  MdOutlineDashboard,
  MdOutlineStorefront, 
  MdOutlineAccountBalanceWallet, 
  MdOutlineExitToApp,
  MdClose 
} from "react-icons/md";
import { RiUserLine } from 'react-icons/ri';
import { FiMenu } from "react-icons/fi";
import { Jazzicon } from '@ukstv/jazzicon-react';

import './header.css';
import Loading from '../utilities/loading';
import { minify_number, resumedAddress, message_error, isConnected, getClient_ip } from '../../utilities/';
import { connect_toServer, messageToSign } from '../../services/connectServer';
import Tokens from '../../services/tokens';
import Logo from '../../utilities/resources/getSchiffy-Logo.webp';
import BusdLogo from '../../utilities/resources/token-busd-logo.webp';
import GoldLogo from '../../utilities/resources/token-gold-getschiffy.webp'

const ExpireSession = ((40*60)*1000);
const ChainID_bsc = '56';

export default function Header() 
{
  var web3Modal = undefined,
      provider = undefined, 
      _web3 = undefined, 
      _tokens = undefined; 

  const [active_menuAccount, setActive_menuAccount] = useState(false);
  const [active_menuHeader_mobile, setActive_menuHeader_mobile] = useState(false);
  const [loading_account, setLoading_account] = useState(false);

  // Store
  const accountStore = useSelector((state) => state.account);
  const dispatch = useDispatch();

  // Sign Message
  const messageSign = messageToSign;

  useEffect(()=> 
  { 
    eventListeners(); 
    if(!loading_account)
      initWeb3(); 
  });

  useEffect(()=> 
  {
    initWeb3(true);
    return () => { resetState(); }
  }, []);

  const toggle_menuAccount = () => {
    active_menuAccount ? setActive_menuAccount(false):setActive_menuAccount(true);
  };

  const toggle_menuHeader_mobile = (active = false) => 
  {
    if(active) {
      setActive_menuHeader_mobile(false);
      return;
    }

    active_menuHeader_mobile ? setActive_menuHeader_mobile(false):setActive_menuHeader_mobile(true);
  };

  const eventListeners = () =>
  {
    window.addEventListener('resize', (ev) => 
    {
      if(active_menuHeader_mobile)
        setActive_menuHeader_mobile(false);
    });

    document.addEventListener('click', (ev) => 
    {
      let child = ev.target;
      
      try 
      {
        if(active_menuAccount && child.id !== 'balance_account' && child.id !== 'picture_account' && child.id !== 'button_account' && child.tagName !== 'svg' && child.tagName !== 'rect') {
          setActive_menuAccount(false);
        }

        if(active_menuHeader_mobile && child.id !== 'iconMenuHeader' && child.id !== 'button_menuHeader') {
          setActive_menuHeader_mobile(false);
        }
      } catch (error) {
        return;
      }
    });
  }

  // --------------
  // Web3

  const initWeb3 = async (autologin=false) =>
  {
    const providerOptions = 
    {
      walletconnect: 
      {
        package: WalletConnectProvider,
        options: 
        {
          rpc: {
            56: "https://bsc-dataseed.binance.org"
          },
          network: 'binance'
        }
      }
    }

    web3Modal = new Web3Modal(
    {
      cacheProvider: true,
      providerOptions,
      theme:
      {
        background: '#141922',
        hover: '#465674',
        main: '#ffffff',
        secondary: '#ffffffb4'
      }
    })

    if(!autologin)
      return;
      
    let connected = isConnected();

    if (connected.login && connected.signed) {
      connect(connected.signed);
    }
  }

  const connect = async (signToConnect = undefined) => 
  {
    try 
    {
      var chainChanged_block = false;
      provider = await web3Modal.connect();
      setLoading_account(true);
      _web3 = new Web3(provider);
      
      // Providers Listeners
      provider.on("accountsChanged", (accounts) => {
        disconnect(true);
        return;
      })
  
      provider.on("chainChanged", (networkId) => 
      {
        if (!chainChanged_block) {
          disconnect(true);
          return;
        }
      })
  
      provider.on("disconnect", (error) => {
        disconnect(true);
        return;
      })

      if(provider.networkVersion !== ChainID_bsc) {
        await switchNetwork(ChainID_bsc); 
        chainChanged_block = true;
      }
    } catch (error) 
    {
      disconnect(true);
      return;
    }

    const account = (await getAccount());

    if(!account) 
    {
      disconnect(true);
      return;
    }

    let messageSigned = (
      signToConnect != undefined ? (await checkSign(messageSign, signToConnect))
      :
      (accountStore.messageSigned ? accountStore.messageSigned : (await signMessage(account)))
    );

    if(!messageSigned) {
      disconnect(true);
      return;
    }

    try 
    {
      var connectedToserver = (await connect_toServer( account, messageSigned, (await getClient_ip()) ));
    } catch (error) {
      message_error('An unexpected error has occurred, please try again later.');
      disconnect(true);
      return;
    }

    if(!connectedToserver) {
      disconnect(true);
      return;
    }

    _tokens = new Tokens(_web3);
    load(account, messageSigned, connectedToserver.registered, connectedToserver.last_login, connectedToserver.last_device);
  }

  const checkSign = async(message, signed) => 
  {
    let signedMessage = undefined; 

    try {
      signedMessage = await _web3.eth.personal.ecRecover(message, signed);
    } catch {
      message_error('An error occurred while verifying your account, please try again');
      disconnect(true);
      return;
    }

    return (signedMessage ? signed : undefined);
  }

  const signMessage = async(address) => 
  {
    let signatureMessage = undefined;

    try {
      signatureMessage = await _web3.eth.personal.sign(messageSign, address)
    } catch(error) {
      message_error('It is necessary to sign the agreements to be able to enter our platform.');
      disconnect(true);
      return;
    }

    return signatureMessage;
  }

  const switchNetwork = async (network) =>
  {
    try 
    { 
      await _web3.currentProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{chainId: Web3.utils.toHex(network)}],
      });
    } catch (error) 
    {
      switch(error.code)
      {
        case 4902:
          message_error('Failed to establish connection to the Binance Smart Chain network');
          break;
        case 4001:
          message_error('You must change your network to continue.');
          break;
        default:
          message_error('An unexpected error has occurred, please try again later.');
      }

      return disconnect(true);
    }
  }

  const disconnect = async (Clearprovider = false) => 
  {
    try 
    {
      dropState();
      resetState();
    } catch (errr) 
    {
      if (provider.close) 
      {
        await provider.close();
        provider = null;
      }
    }

    if(Clearprovider) {
      web3Modal.clearCachedProvider();
    }
  }

  const resetState = () => 
  { 
    setLoading_account(false);
    dispatch(disconnectAccount()); 
    dispatch(disconnectGame());
  }  

  const dropState = () => { localStorage.clear(); }

  const load = async (account, signed, registered, last_login, last_device) => 
  {
    dispatch(loadAccount({
      address: account,
      busd_balance: (await _tokens.balance_busd(account)),  
      gold_balance: (await _tokens.balance_gold(account)),
      messageSigned: signed,
      registered,
      last_login,
      last_device
    }));

    localStorage.setItem('getschiffy_eth_connected', true);
    localStorage.setItem('getschiffy_signed', signed);
    localStorage.setItem('getschiffy_expire_date', (Date.now() + ExpireSession));

    setLoading_account(false);
  }

  const getAccount = async () =>
  {
    const account = (await _web3.eth.getAccounts())[0]
    return account ? account.toLowerCase() : undefined
  }

  const userOptions = () => 
  {
    if(loading_account) {
      return <Loading/>;
    }

    if(accountStore.activeLogin)
    {
      return(
      <div className={'flex justify-end items-center transition-all duration-500'}>
        {/* Gold Balance */}
        <div className='hidden md:flex items-center mr-[14px]'>
          <div className='mr-[6px] w-[25px] h-[25px]'><img src={GoldLogo} alt="Gold Logo Balance"/></div>
          <div><span className='font-bold text-base'>{`${minify_number(accountStore.goldBalance, 4)}`} GOLD</span></div>
        </div>

        {/* Bnb Balance */}
        <div className='hidden md:flex items-center mr-[14px]'>
          <div className='mr-[6px] w-[24px] h-[24px]'><img src={BusdLogo} alt="Bnb Logo Balance"/></div>
          <div><span className='font-bold text-base'>{`${minify_number(accountStore.busdBalance, 4)}`} BUSD</span></div>
        </div>

        {/* Account */}
        <div className='relative'>
          <button onClick={() => toggle_menuAccount()} id="button_account" className={"flex items-center cursor-default p-2 border transition duration-500 rounded-tr rounded-tl border-b-0" + (active_menuAccount? ' border-gray-3':' border-transparent')}>
            <span className='cursor-pointer mr-[6px] text-sm' id='balance_account'>{resumedAddress(accountStore.address)}</span>
            <div id='picture_account' className='cursor-pointer w-[36px] h-[36px] rounded-full overflow-hidden bg-gray-3 border-2 border-yellow'><Jazzicon address={accountStore.address}/></div>
          </button>

          <ul className={'absolute left-0 right-0 transition-all ease-in-out duration-500 bg-black w-full rounded-bl rounded-br border border-t-0 h-0 overflow-hidden'+(active_menuAccount? ' h-[100px] border-gray-3':' border-transparent')}>
            <li className='h-[50%]'>
              <Link to='/account/' className='px-[12px] h-full py-[10px] cursor-pointer hover:bg-gray-3 transition duration-500 flex items-center'><span className='mr-[5px]'><RiUserLine className='w-5 h-5'/></span>Account
              </Link>
            </li>
            <li className='h-[50%]'>
              <button onClick={() => disconnect(true)} className='w-full px-[12px] h-full py-[10px] cursor-pointer hover:bg-gray-3 transition duration-500 flex items-center text-red'><span className='mr-[5px]'><MdOutlineExitToApp className='w-5 h-5'/></span>Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
      );
    } else 
    {
      return(
      <div>
        <button onClick={() => connect()} className='bg-yellow text-black font-bold text-[1.1em] px-[10px] py-[5px] rounded shadow-inner flex justify-between items-center'><span className='mr-[5px]'><MdOutlineAccountBalanceWallet className='w-5 h-5'/></span>Connect Wallet</button>
      </div>);
    }
  }

  const iconMenuHeader = () =>
  {
    if(active_menuHeader_mobile)
      return <MdClose id='iconMenuHeader' className='w-[22px] h-[22px]'/>
    else
      return <FiMenu id='iconMenuHeader' className='w-[22px] h-[22px]'/>
  }

  return(
    <>
      <Toaster/>
      <div className=' bg-black text-white fixed top-0 left-0 w-full z-[1200]'>
        <header className='container min-w-full px-4 flex'>
          {/* Logo */}
          <div className='py-[10px] select-none'>
            <Link to='/'>
              <img src={Logo} className=' min-w-[90px] max-w-[90px] h-[55px]' alt='Get Schiffy Logo'/>
            </Link>
          </div>

          {/* Menu */}
          <div className='w-full flex justify-end md:justify-between ml-[20px]'>
            <nav className={'z-[1900] fixed left-[-250px] h-full w-[250px] border-r md:border-0 border-gray-3 md:w-auto bg-black flex flex-col justify-items-stretch md:static md:flex-row md:items-stretch transition-all ease-in-out duration-500 overflow-hidden ' + (active_menuHeader_mobile ? 'transform translate-x-[250px]':'')} id="menu_mobile">
              {/* Mobile Balance */}
              <div className='border-b border-b-gray-3 select-none'>
                {/* Gold Balance */}
                <div className='flex md:hidden items-center px-[20px] py-[15px]'>
                  <div className='mr-[6px] w-[25px] h-[25px]'><img src={GoldLogo} alt="Gold Logo Balance"/></div>
                  <div><span className='font-bold text-base'>{`${minify_number(accountStore.goldBalance, 4)}`} GOLD</span></div>
                </div>

                {/* Bnb Balance */}
                <div className='flex md:hidden items-center px-[20px] py-[15px]'>
                  <div className='mr-[6px] w-[24px] h-[24px]'><img src={BusdLogo} alt="Bnb Logo Balance"/></div>
                  <div><span className='font-bold text-base'>{`${minify_number(accountStore.busdBalance, 4)}`} BNB</span></div>
                </div>
              </div>

              <NavLink to='/' className={ ({isActive}) => (isActive ? 'border-b-yellow ':'border-b-transparent ') + 'transition-all duration-500 flex md:justify-center items-center border-b-[2px] hover:bg-gray-6 px-[20px] py-[15px] md:px-[14px] select-none'}>
                <span className='mr-[5px]'><MdOutlineDashboard className='w-5 h-5'/></span>Dashboard
              </NavLink>

              <NavLink to='/characters' className={ ({isActive}) => (isActive ? 'border-b-yellow ':'border-b-transparent ') + 'transition-all duration-500 flex md:justify-center items-center border-b-[2px] hover:bg-gray-6 px-[20px] py-[15px] md:px-[14px] select-none'}>
                <span className='mr-[5px]'><MdOutlineStorefront className='w-5 h-5'/></span>Marketplace
              </NavLink>
            </nav>

            {/* Account */}
            <div className='flex justify-center items-center select-none z-[1800]'>
              {userOptions()}
            </div>
          </div>

          {/* Trigger Mobile Menu */}
          <div className='flex justify-center items-center md:hidden ml-[14px]'>
            <button onClick={() => toggle_menuHeader_mobile()} className={'border-2 rounded p-1 transition-all duration-500 ' + (active_menuHeader_mobile ? 'border-red':'border-yellow')} id="button_menuHeader">
              <span>{iconMenuHeader()}</span>
            </button>
          </div>
        </header>
      </div>
    </>
  );
}