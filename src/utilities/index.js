import millify from "millify";
import toast from 'react-hot-toast';
import axios from "axios";

const ERASE_WORDS = [
  'Silver',
  'Gold',
  'Series',
  'series',
  'Rare',
  'Normals',
  'Normal'
];

export function minify_number(number, precision) 
{
	if (number)
		return millify(number, {precision: precision});
	else 
		return '0.00';
}

export function removeWords(text)
{
	let textOut = text;

	ERASE_WORDS.forEach(word => 
	{
		let initWord = textOut.indexOf(word);
		if(initWord !== -1) {
			textOut = textOut.replace(word, '');
		}
	});

	return textOut;
}

export function dMinify_number(number) 
{
	if (number)
		return millify(number);
	else 
		return '0.00';
}

export function resumedAddress(address) {
	return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function copy(text) 
{
	navigator.clipboard.writeText(text);
	toast.success('Copied!');
}

export function message_success(text) {
	toast.success(text);
}

export function message_error(text) {
	toast.error(text);
}

export function message_loading(text) {
	toast.loading(text, { duration: 5000 })
}

export async function getClient_ip() 
{
	const response = await axios.get('https://api.ipify.org?format=json');
	return response.data.ip;
}

export function isConnected() 
{
	let expire_date = parseInt(localStorage.getItem('getschiffy_expire_date'));
	let account_loggedin = localStorage.getItem('getschiffy_eth_connected');
	let account_signed = localStorage.getItem('getschiffy_signed');

	if(account_loggedin === 'true' && expire_date > Date.now() && account_signed)
		return {login:true, signed:account_signed};

	localStorage.clear();
	return {login:false, signed:undefined};
}