// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract Switch {
    error NOT_OWNER();
    error NOT_RECIPIENT();
    error WITHDRAW_FAILED();
    error NOT_DEAD();

    modifier onlyOwner() {
        if (msg.sender != i_owner) revert NOT_OWNER();
        _;
    }

    modifier onlyRecipient() {
        if (msg.sender != i_recipient) revert NOT_RECIPIENT();
        _;
    }

    uint256 private constant PERIOD = 52 weeks;
    address private immutable i_owner;
    address private immutable i_recipient;
    uint256 private pingedTimestamp;

    constructor(address _recipient) payable {
        i_owner = msg.sender;
        i_recipient = _recipient;
        // Init first ping at deployment
        pingedTimestamp = block.timestamp;
    }

    function ping() external onlyOwner {
        pingedTimestamp = block.timestamp;
    }

    function withdraw() external onlyRecipient {
        // If it's been deployed or pinged less than 52 weeks ago
        if (block.timestamp - pingedTimestamp < PERIOD) revert NOT_DEAD();

        // Withdraw the funds
        (bool success, ) = i_recipient.call{value: address(this).balance}("");
        if (!success) revert WITHDRAW_FAILED();
    }

    function getPeriod() external pure returns (uint256) {
        return PERIOD;
    }

    function getOwner() external view returns (address) {
        return i_owner;
    }

    function getRecipient() external view returns (address) {
        return i_recipient;
    }

    function getPingedTimestamp() external view returns (uint256) {
        return pingedTimestamp;
    }
}
