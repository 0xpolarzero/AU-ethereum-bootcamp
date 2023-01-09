// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./IERC20.sol";

contract Chest {
    function plunder(address[] memory _addresses) external {
        for (uint256 i = 0; i < _addresses.length; i++) {
            uint256 _balance = IERC20(_addresses[i]).balanceOf(address(this));
            IERC20(_addresses[i]).transfer(msg.sender, _balance);
        }
    }
}
