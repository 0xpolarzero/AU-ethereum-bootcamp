// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract MultiSig {
    error NOT_OWNER();
    error MISSING_OWNERS();
    error WRONG_REQUIRED_AMOUNT();
    error ALREADY_EXECUTED();
    error TRANSFER_FAILED();
    // error NOT_ENOUGH_CONFIRMATIONS();

    modifier onlyOwner() {
        bool isOwner;
        address[] memory memOwners = owners;

        // Check that the sender is one of the owners
        for (uint256 i = 0; i < memOwners.length; i++) {
            if (msg.sender == memOwners[i]) isOwner = true;
        }

        if (!isOwner) revert NOT_OWNER();
        _;
    }

    struct Transaction {
        address destination;
        uint256 value;
        bool executed;
        bytes data;
    }

    address[] public owners;
    uint256 public required;

    mapping(uint256 => mapping(address => bool)) public confirmations;

    Transaction[] public transactions;

    // It would need to store a count as well
    // mapping(uint256 => Transaction) public transactions;

    constructor(address[] memory _owners, uint256 _required) {
        // Revert if no owner...
        if (_owners.length == 0) revert MISSING_OWNERS();
        // ... or if it requires 0 signature / more than owners amount
        if (_required == 0 || _required > _owners.length)
            revert WRONG_REQUIRED_AMOUNT();

        owners = _owners;
        required = _required;
    }

    receive() external payable {}

    function submitTransaction(
        address _destination,
        uint256 _value,
        bytes memory _data
    ) external onlyOwner {
        // Add a transaction and confirm it immediately
        uint256 id = addTransaction(_destination, _value, _data);
        confirmTransaction(id);
    }

    function confirmTransaction(uint256 _txId) public onlyOwner {
        confirmations[_txId][msg.sender] = true;

        if (isConfirmed(_txId)) executeTransaction(_txId);
    }

    function addTransaction(
        address _destination,
        uint256 _value,
        bytes memory _data
    ) internal returns (uint256) {
        // Push the Transaction to the array
        Transaction memory _tx = Transaction(
            _destination,
            _value,
            false,
            _data
        );
        transactions.push(_tx);

        // Return its ID (and location in the array)
        return transactions.length - 1;
    }

    function executeTransaction(uint256 _txId) internal onlyOwner {
        // Don't execute if not enough confirmations
        // No use because it's called automatically where there are enough confirmations
        // if (!isConfirmed(_txId)) revert NOT_ENOUGH_CONFIRMATIONS();

        // Or if already executed
        Transaction memory _tx = transactions[_txId];
        if (_tx.executed) revert ALREADY_EXECUTED();

        // Send the value to the destination
        (bool success, ) = _tx.destination.call{value: _tx.value}(_tx.data);
        if (!success) revert TRANSFER_FAILED();

        transactions[_txId].executed = true;
    }

    function transactionCount() public view returns (uint256) {
        return transactions.length;
    }

    function getConfirmationsCount(
        uint256 _txId
    ) public view returns (uint256) {
        address[] memory memOwners = owners;
        uint256 confirmationsCount;

        for (uint256 i = 0; i < memOwners.length; i++) {
            if (confirmations[_txId][memOwners[i]]) confirmationsCount++;
        }

        return confirmationsCount;
    }

    function isConfirmed(uint256 _txId) public view returns (bool confirmed) {
        uint256 confirmationsCount = getConfirmationsCount(_txId);
        if (confirmationsCount >= required) confirmed = true;
    }
}
