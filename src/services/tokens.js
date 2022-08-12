import Abi_tokenGold from '../utilities/resources/abi_gold.json';
import Abi_tokenBusd from '../utilities/resources/abi_busd.json';
import Abi_NftsNormal from '../utilities/resources/abi_normal_nfts.json';
import Abi_NftsSilver from '../utilities/resources/abi_silver_nfts.json';
import Abi_NftsGold from '../utilities/resources/abi_gold_nfts.json';

const normalAddress = '0x9709065c23A490e713ab3D468A452CC17038DE64';
const silverAddress = '0x2fFdFD478Da4c1846C3a3b8fE264949FF4E184a8';
const goldAddress = '0xba5c91a7A1a0Eba0366B76c7e7671CEEEDC08E36';

const normalIpfs = 'https://getschiffynft.mypinata.cloud/ipfs/QmTo7Qv9QtuyYy3efqonyBAaDVrJY5dCmHZKXPBLw1JSku';
const silverIpfs = 'https://getschiffynft.mypinata.cloud/ipfs/QmX3FyHU8d6wSdioBdAauUEjp5dJwvChtR7TFzYdx7d3jm';
const goldIpfs = 'https://getschiffynft.mypinata.cloud/ipfs/QmRSMuoxLX9q8wCPHERUQRmfoWpPcuFKAHSr3qnXxWaKV6';

export default class Tokens 
{
	constructor(web3) {
		this._web3 = web3;
	}

	async balance_busd(wallet) 
	{
		const addressBusd = '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56';
		const tokenInst = new this._web3.eth.Contract(Abi_tokenBusd, addressBusd);
		return (await tokenInst.methods.balanceOf(wallet).call() / (10 ** 18));
	}

	async balance_gold(wallet) 
	{
		const addressGold = '0x238EeffC574d93C8bEd5E960b2DF7dDB5A22d402';
		const tokenInst = new this._web3.eth.Contract(Abi_tokenGold, addressGold);
		return (await tokenInst.methods.balanceOf(wallet).call() / (10 ** 18));
	}

	async balance_normalNfts(wallet)
	{
		const tokenInst = new this._web3.eth.Contract(Abi_NftsNormal, normalAddress);
		return (await tokenInst.methods.tokensOfOwner(wallet).call());
	}

	async balance_silverNfts(wallet)
	{
		const tokenInst = new this._web3.eth.Contract(Abi_NftsSilver, silverAddress);
		return (await tokenInst.methods.tokensOfOwner(wallet).call());
	}

	async balance_goldNfts(wallet)
	{
		const tokenInst = new this._web3.eth.Contract(Abi_NftsGold, goldAddress);
		return (await tokenInst.methods.tokensOfOwner(wallet).call());
	}

}

export function contractNormal_addressAbi() {
	return {ABI:Abi_NftsNormal, ADDRESS: normalAddress, IPFS: normalIpfs};
}

export function contractSilver_addressAbi() {
	return {ABI:Abi_NftsSilver, ADDRESS: silverAddress, IPFS: silverIpfs};
}

export function contractGold_addressAbi() {
	return {ABI:Abi_NftsGold, ADDRESS: goldAddress, IPFS: goldIpfs};
}