const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);
const { interface, bytecode } = require('../compiler.js');

let accounts;
let inbox;

beforeEach(async ()=> {
    //Get a list of all accounts
    /*web3.eth.getAccounts().then(fetchedAccounts =>{
        console.log(fetchedAccounts);
    });*/
    accounts = await web3.eth.getAccounts();
    //Use on of these accounts to deploy
    //the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data:bytecode,arguments:['Hi there']})
    .send({ from: accounts[0], gas:'1000000' })
    inbox.setProvider(provider);
})

describe('Inbox',()=>{
    it('Deploy contract',()=>{
        //console.log(accounts);
        //console.log(inbox);
        assert.ok(inbox.options.address);
    });
    it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, 'Hi there');
    });
})