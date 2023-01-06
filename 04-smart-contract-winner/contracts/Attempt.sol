// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Attempt {
    error CALL_FAILED();

    address private immutable targetContract;

    constructor(address _targetContract) {
        targetContract = _targetContract;
    }

    function attempt() external {
        bytes memory _data = abi.encodeWithSignature("attempt()");
        (bool success, ) = targetContract.call(_data);

        if (!success) revert CALL_FAILED();
    }
}
