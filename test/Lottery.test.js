const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);
const { interface, bytecode } = require('../compiler.js');

let accounts;
let lottery;

beforeEach(async ()=> {
    //Get a list of all accounts
    /*web3.eth.getAccounts().then(fetchedAccounts =>{
        console.log(fetchedAccounts);
    });*/
    accounts = await web3.eth.getAccounts();
    //Use on of these accounts to deploy
    //the contract
    lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data:bytecode})
    .send({ from: accounts[0], gas:'1000000' });
    lottery.setProvider(provider);
})

describe('Lottery',()=>{
    it('Deploy contract',()=>{        
        assert.ok(lottery.options.address);
    });
    it('allows one account to enter',async ()=>{
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02','ether')
        })
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0],players[0]);
        assert.equal(1,players.length);
    }); 
    
    it('allows multiples accounts to enter',async ()=>{
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02','ether')
        })
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02','ether')
        })
        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02','ether')
        })
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0],players[0]);
        assert.equal(accounts[1],players[1]);
        assert.equal(accounts[2],players[2]);
        assert.equal(3,players.length);
    }); 

    it('requires a minimum account of ether to enter',async ()=>{
        try{
            await lottery.methods.enter().send({
                from: accounts[0],
                value: 0
            })
            assert(false);
        }catch(err) {
            assert(err);
        }
        
    }); 

    it('only manager can call pickWinner',async ()=>{
        try{
            await lottery.methods.pickWinner().send({
                from: accounts[1]                
            })
            assert(false);
        }catch(err) {
            assert(err);
        }        
    }); 
    it('send money to the winner and resets players',async () => {
        const account = accounts[0];
        await lottery.methods.enter().send({
            from: account,
            value: web3.utils.toWei('2','ether')
        });
        const initialBalance = await web3.eth.getBalance(account);
        await lottery.methods.pickWinner().send({from:account});
        const finalBalance = await web3.eth.getBalance(account);
        const difference = finalBalance - initialBalance;
        console.log(finalBalance - initialBalance);

        assert(difference > web3.utils.toWei('1.8','ether'));
        
    });
})