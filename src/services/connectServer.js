import { message_error, message_success } from '../utilities/';
import API_SERVER from './apiServer';

export const messageToSign = [
  "I accept that I have carefully read the terms of use and policies (https://whitepaper.getschiffy.com/faqs/terms-of-use) of this application.",
  "Sign!"
].join("\n");

export async function connect_toServer(addressWallet = '', signedWallet = '', ipUser = '')
{
  var response = await API_SERVER.post('connect_wallet/', {address:addressWallet, signed:signedWallet, ipUser});
  response = response.data;

  if(response.error) {
    message_error(response.message);
    return false;
  }

  return (response.login_success ? response.data_login:false);
}

export async function verifyGame_account(addressWallet = '', signedWallet = '', ipUser = '')
{
  var response = await API_SERVER.post('connect_game/', {address:addressWallet, signed:signedWallet, ipUser});
  response = response.data;

  if(response.error) {
    message_error(response.message);
    return false;
  }

  return response;
}

export async function addNew_email(newEmail = '', addressWallet = '', signedWallet = '', ipUser = '')
{
  var response = await API_SERVER.post('add_game_email/', {newEmail, address:addressWallet, signed:signedWallet, ipUser});
  response = response.data;

  if(response.error) {
    message_error(response.message);
    return false;
  }

  message_success(response.message);
  
  return response;
}

export async function sendAgain_email(addressWallet = '', signedWallet = '', ipUser = '')
{
  var response = await API_SERVER.post('send_game_email/', {address:addressWallet, signed:signedWallet, ipUser});
  response = response.data;

  if(response.error) {
    message_error(response.message);
    return false;
  }

  message_success(response.message);
  
  return response;
}