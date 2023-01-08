// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract Ownable {
    error NOT_OWNER();

    address owner;

    modifier onlyOwner() {
        if (msg.sender != owner) revert NOT_OWNER();
        _;
    }

    constructor() {
        owner = msg.sender;
    }
}

contract Transferable is Ownable {
    function transfer(address _recipient) external onlyOwner {
        owner = _recipient;
    }
}
