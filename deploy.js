
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compiler.js');

const provider = new HDWalletProvider(
    //Mnmonic
'nuclear addict coffee vendor fringe pond century brand pepper force glue harbor',
'https://rinkeby.infura.io/z61F9wnFQemEARlIJKiu'
);


const web3 = new Web3(provider);

const deploy = async() => {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    console.log('Attempting do deploy from account',account);
    //Use on of these accounts to deploy
    //the contract
    const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data:bytecode,arguments:['Hi there']})
    .send({ from: account, gas:'1000000' })    
    console.log('Contract deploy to',result.options.address);
}
deploy();