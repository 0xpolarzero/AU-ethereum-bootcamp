// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Party {
    error NOT_ENOUGH_TO_ENTER();
    error ALREADY_PARTY();
    error TRANSFER_FAILED();

    uint256 private immutable i_amountToPay;
    address[] private parties;

    constructor(uint256 _amountToPay) {
        i_amountToPay = _amountToPay;
    }

    function rsvp() external payable {
        // Check that the amount has been paid
        if (msg.value != i_amountToPay) revert NOT_ENOUGH_TO_ENTER();

        // Check that the caller is not already a party
        address[] memory memParties = parties;
        for (uint256 i = 0; i < memParties.length; i++) {
            if (memParties[i] == msg.sender) revert ALREADY_PARTY();
        }

        // Add the party
        parties.push(msg.sender);
    }

    function payBill(address _venue, uint256 _totalCost) external {
        // Pay the venue
        (bool paySuccess, ) = _venue.call{value: _totalCost}("");
        if (!paySuccess) revert TRANSFER_FAILED();

        // Distribute the remaining amount
        uint256 remaining = address(this).balance;
        bool remainingSuccess = distributeRemaining(remaining);
        if (!remainingSuccess) revert TRANSFER_FAILED();
    }

    function distributeRemaining(uint256 _remaining) internal returns (bool) {
        address[] memory memParties = parties;
        uint256 sumForEach = _remaining / memParties.length;
        // Init success to true
        bool success = true;

        for (uint256 i = 0; i < memParties.length; i++) {
            (bool s, ) = memParties[i].call{value: sumForEach}("");
            // If any transfer fails, set success to false
            if (!s) success = false;
        }

        return success;
    }

    function getAmoutToPay() external view returns (uint256) {
        return i_amountToPay;
    }

    function getParties() external view returns (address[] memory) {
        return parties;
    }
}
