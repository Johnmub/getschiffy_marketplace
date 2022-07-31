import Abi_tokenGold from '../utilities/resources/abi_gold.json';
import Abi_tokenBusd from '../utilities/resources/abi_busd.json';

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
}