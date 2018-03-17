pragma solidity ^0.4.16;


contract Lottery {
    address public manager;
    address[] public players;

    function Lottery() public {
        manager = msg.sender; //Global variables msg
    }
    
    function enter() public payable { //get ether too
        require(msg.value > .01 ether);
        players.push(msg.sender);
    }
  
    function pickWinner() public restricted {
        //restricted require(msg.sender == manager); //Only manager
        uint index = random() % players.length;
        address winner = players[index];
        winner.transfer(this.balance);
        players = new address[](0);
    }

    function getPlayers() public view returns (address[]) {
        return players;    
    }
    
    function random() private view returns (uint) {
        return uint(keccak256(block.difficulty, now,
        players));//Same sha3()
    }
      
    modifier restricted() {
        require(msg.sender == manager); //Only manager
        _; //Run all the code inside the function
    }               
}