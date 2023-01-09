// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract Token {
    error NOT_ENOUGH_BALANCE();

    event Transfer(address sender, address recipient, uint256 amount);

    uint256 public totalSupply;
    uint8 public decimals = 18;
    string public name = "Token";
    string public symbol = "TKN";

    mapping(address => uint256) private balances;

    constructor() {
        totalSupply = 1000 * (10 ** 18);
        balances[msg.sender] = totalSupply;
    }

    function transfer(
        address _recipient,
        uint256 _amount
    ) public returns (bool success) {
        if (balances[msg.sender] < _amount) revert NOT_ENOUGH_BALANCE();

        balances[msg.sender] -= _amount;
        balances[_recipient] += _amount;

        success = true;
        emit Transfer(msg.sender, _recipient, _amount);
    }

    function balanceOf(address _user) external view returns (uint256) {
        return balances[_user];
    }
}
