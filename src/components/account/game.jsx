import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux/es/exports";
import { loadGame, loadEmail } from "../../store/slices/game/gameSlice";
import { GoUnverified, GoVerified} from "react-icons/go"

import { 
  addNew_email, 
  verifyGame_account,
  sendAgain_email
} from '../../services/connectServer';
import { 
  minify_number, 
  getClient_ip 
} from '../../utilities/';
import Loading from '../utilities/loading';
import GoldLogo from '../../utilities/resources/token-gold-getschiffy.webp'

function Game()
{
  const [email_input, setEmail_input] = useState('');
  const [show_emailForm, setShow_emailForm] = useState(false);
  const [initLoading, setInit_loading] = useState(false);
  const [emailLoading, SetEmail_loading] = useState(false);

  // Store
  const accountStore = useSelector((state) => state.account);
  const gameStore = useSelector((state) => state.game);
  const dispatch = useDispatch();

  useEffect(()=> 
  {
    if(!accountStore.activeLogin) {
      return <Navigate to={'/'} replace={true}/>
    }

    initGame();
  },[]);

  // Functions
  const initGame = async () =>
  {
    setInit_loading(true);
    const initGame_info = await verifyGame_account(accountStore.address, accountStore.messageSigned, (await getClient_ip()));

    if(initGame_info) {
      loadGame_account(initGame_info.data_game, initGame_info.record_game);
      return;
    }

    setInit_loading(false);
  }

  const loadGame_account = async (data_game, data_record) => 
  {
    dispatch(loadGame({
      game_email: data_game.game_email,
      game_gold: data_game.game_gold,
      game_verified: data_game.game_verified,
      registered: data_record.registered,
      
      last_login: data_record.last_login,
      last_device: data_record.last_device
    }));

    setInit_loading(false);
  }

  const emailSend_toVerify = async (event) => 
  {
    event.stopPropagation();
    event.preventDefault();
    
    if(emailLoading)
      return;

    SetEmail_loading(true);

    const sendTo_verify = await addNew_email(email_input, accountStore.address, accountStore.messageSigned, (await getClient_ip()));

    if(sendTo_verify) {
      dispatch(loadEmail(sendTo_verify.email_updated));
      toggleForm_email();
    }

    SetEmail_loading(false);
  }

  const emailSend_again = async () => 
  {
    if(emailLoading)
      return;

    SetEmail_loading(true);

    const emailAgain = await sendAgain_email(accountStore.address, accountStore.messageSigned, (await getClient_ip()));
    
    SetEmail_loading(false);
  }

  const emailChange = (event) => {
    setEmail_input(event.target.value);
  }

  const toggleForm_email = () => 
  {
    setEmail_input('');
    show_emailForm ? setShow_emailForm(false):setShow_emailForm(true);
    return;
  }

  // Retur to render
  const accountState = () => 
  {
    if(gameStore.email === undefined || gameStore.gameVerified !== 1 ) 
    {
      return (<>
        <h4 className="text-white text-[24px] font-bold flex items-center mr-[6px]">
          Game 
          <span className="ml-[6px]"><GoUnverified className="w-[24px] h-[24px] text-red"/></span>
        </h4>
        <span className="text-red text-center">{!gameStore.email ? "You haven't linked an email to your account yet.":'The email has not been verified yet.'}</span>
      </>);
    } else
    {
      return (<>
        <h4 className="text-white text-[24px] font-bold flex items-center mr-[6px]">
          Game 
          <span className="ml-[6px]"><GoVerified className="w-[24px] h-[24px] text-green"/></span>
        </h4>
        <span className="text-green text-center">Verified account</span>
      </>);
    }
  }

  const emailState = () => 
  {
    if(show_emailForm)
    {
      return(
        <div className="flex items-center">
          <form onSubmit={ e => emailSend_toVerify(e)} className="flex items-center">
            <input className="bg-black rounded py-[2px] px-1 border-gray-3 border outline-none" type="email" name="email_game" value={email_input} placeholder="write your email" required onChange={ e => emailChange(e)}/>
            {submitLoading()}
          </form>
          {cancelLoading()}
        </div>
      );
    } else if(!gameStore.email) 
    {
      return (
        <div className="flex items-center">
          <div><span className="text-gray-3">Empty</span></div>
          <div className="ml-[6px]"><button className="text-red border rounded py-[2px] px-1 border-gray-3 hover:border-red transition-all duration-500" onClick={toggleForm_email}>Add</button></div>
        </div>
      );
    } else {
      return(
        <div className="flex items-center">
          <div><span className="text-gray-3">{gameStore.email}</span></div>
          {gameStore.gameVerified === 1 ? '':verifyLoading()}
          {changeLoading()}
        </div>
      );
    }
  }

  const submitLoading = () =>
  {
    if(emailLoading) {
      return(<div className="ml-[6px]"><Loading/></div>);
    } else {
      return(<input className="border-gray-3 border cursor-pointer rounded py-[2px] px-1 ml-[6px] hover:border-white transition-all duration-500" type="submit" value="Add"/>);
    }
  }

  const verifyLoading = () =>
  {
    if(emailLoading) {
      return(<div className="ml-[6px]"><Loading/></div>);
    } else {
      return(buttonVerify());
    }
  }

  const cancelLoading = () =>
  {
    if(!emailLoading) {
      return(<button className="text-red border-gray-3 hover:border-red border py-[2px] px-1 ml-[6px] rounded transition-all duration-500" onClick={toggleForm_email}>Cancel</button>);
    }
  }

  const changeLoading = () =>
  {
    if(!emailLoading) {
      return(<div className="ml-[6px]"><button className="text-red py-[2px] px-1 border rounded border-gray-3 hover:border-red transition-all duration-500" onClick={toggleForm_email}>Change</button></div>);
    }
  }

  const buttonVerify = () => 
  {
    return(<div className='ml-[6px]'><button className='py-[2px] px-1 border rounded border-gray-3 hover:border-white transition-all duration-500' onClick={emailSend_again}>Verify</button></div>);
  }

  const contentGame = () => 
  {
    if(initLoading) {
      return(
      <div className="w-full h-screen flex justify-center items-center">
        <Loading/>
      </div>);
    } else 
    {
      return(
        <div>
          {/* Game info */}
          <div className="select-none border-b p-3 border-gray-3 flex flex-col justify-center sm:flex-row sm:justify-start items-center">
            {accountState()}
          </div>

          {/* Data */}
          <ul className="mt-4 text-white mx-4">
            {/* Registered */}
            <li className="mb-[1px] text-center sm:text-left">
              <span className="text-base mr-[6px]">Created at:</span>
              <span className="font-bold text-sm">{(gameStore.registered === undefined ? 'Unregistered account':gameStore.registered)}</span>
            </li>

            {/* Last visit */}
            <li className="text-center sm:text-left">
              <span className="text-base mr-[6px] text-red">Last visit:</span>
              <span className="font-bold text-sm">{(gameStore.lastLogin === undefined ? 'No records': (gameStore.lastLogin === gameStore.registered ? 'No records':gameStore.lastLogin))} <span className="text-red">Device</span> <span className="text-yellow">{(gameStore.lastDevice === undefined ? 'No records':(gameStore.lastLogin === gameStore.registered ? 'No records':gameStore.lastDevice))}</span></span>
            </li>

            {/* Email */}
            <li className="my-4">
              <div className="flex items-center flex-col sm:flex-row">
                {/* Title */}
                <div><span className="select-none text-lg sm:mr-[6px]">Login Email:</span></div>

                {/* Description */}
                <div className="mt-[2px] sm:hidden"><p className="text-sm">Email to login to the game</p></div>
                
                {/* Email options */}
                {emailState()}
              </div>

              {/* Description */}
              <div className="mt-[2px] hidden sm:block"><p className="text-sm">Email to login to the game</p></div>
            </li>

            {/* Gold Balance */}
            <li className="my-4">
              <div className="flex items-center flex-col sm:flex-row">
                {/* Token */}
                <div className="flex items-center">
                  <div className='mr-[6px] w-[25px] h-[25px] select-none'><img src={GoldLogo} alt="Gold Logo Balance"/></div>
                  <div><span className='font-bold text-base'>{`${minify_number(gameStore.goldBalance, 6)}`} GOLD</span></div>
                </div>

                {/* Description */}
                <div className="mt-[2px] block sm:hidden"><p className=" text-sm">Gold collected in game</p></div>

                {/* Claim */}
                <div className="select-none mt-[4px] sm:mt-0 sm:ml-[6px] text-gray-3">
                  <button disabled className="border rounded py-[2px] px-1 text-sm">Claim</button>
                  <span className="ml-[4px]">You can claim every 5 days.</span>
                </div>
              </div>

              {/* Description */}
              <div className="mt-[2px] hidden sm:block"><p className=" text-sm">Gold collected in game</p></div>
            </li>
          </ul>
        </div>
      );
    }
  }

  return(
    <div className="w-full">
      {contentGame()}
    </div>
  );
}

export default Game;