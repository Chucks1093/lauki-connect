// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import {LaukiConnectProfileRegistry} from "../src/LaukiConnectProfileRegistry.sol";

contract Deploy is Script {
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(pk);
        LaukiConnectProfileRegistry registry = new LaukiConnectProfileRegistry();
        vm.stopBroadcast();

        console2.log("LaukiConnectProfileRegistry:", address(registry));
    }
}
