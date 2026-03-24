// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import {LaukiConnectProfileRegistry} from "../src/LaukiConnectProfileRegistry.sol";
import {ILaukiConnectProfileRegistry} from "../src/ILaukiConnectProfileRegistry.sol";

contract LaukiConnectProfileRegistryTest is Test {
    LaukiConnectProfileRegistry internal registry;

    address internal builder = address(0xB0B);

    function setUp() public {
        registry = new LaukiConnectProfileRegistry();
    }

    function testRegisterProfile() public {
        vm.prank(builder);
        registry.registerProfile("ipfs://builder-profile", ILaukiConnectProfileRegistry.ProfileRole.Builder);

        ILaukiConnectProfileRegistry.Profile memory profile = registry.getProfile(builder);

        assertEq(profile.owner, builder);
        assertEq(profile.metadataURI, "ipfs://builder-profile");
        assertEq(uint256(profile.role), uint256(ILaukiConnectProfileRegistry.ProfileRole.Builder));
        assertTrue(profile.isActive);
        assertTrue(registry.isRegistered(builder));
    }

    function testUpdateProfile() public {
        vm.startPrank(builder);
        registry.registerProfile("ipfs://builder-profile", ILaukiConnectProfileRegistry.ProfileRole.Builder);
        registry.updateProfile(
            "ipfs://updated-profile",
            ILaukiConnectProfileRegistry.ProfileRole.Operator,
            false
        );
        vm.stopPrank();

        ILaukiConnectProfileRegistry.Profile memory profile = registry.getProfile(builder);

        assertEq(profile.metadataURI, "ipfs://updated-profile");
        assertEq(uint256(profile.role), uint256(ILaukiConnectProfileRegistry.ProfileRole.Operator));
        assertFalse(profile.isActive);
    }

    function testDeactivateProfile() public {
        vm.startPrank(builder);
        registry.registerProfile("ipfs://builder-profile", ILaukiConnectProfileRegistry.ProfileRole.Builder);
        registry.deactivateProfile();
        vm.stopPrank();

        ILaukiConnectProfileRegistry.Profile memory profile = registry.getProfile(builder);
        assertFalse(profile.isActive);
    }
}
