// SPDX-License-Identifier: UNLICENSED
pragma solidity = 0.7.6;
pragma abicoder v2;

struct IncentiveKey {
    address rewardToken;
    address pool;
    uint256 startTime;
    uint256 endTime;
    address refundee;
}

contract IncentiveId {
    /// Calculate the key for a staking incentive
    /// @param key The components used to compute the incentive identifier
    /// @return incentiveId The identifier for the incentive
    function compute(IncentiveKey memory key) public pure returns (bytes32 incentiveId) {
        return keccak256(abi.encode(key));
    }
}