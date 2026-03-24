// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ILaukiConnectProfileRegistry} from "./ILaukiConnectProfileRegistry.sol";

contract LaukiConnectProfileRegistry is ILaukiConnectProfileRegistry {
    error EmptyMetadataURI();
    error ProfileAlreadyRegistered();
    error ProfileNotRegistered();

    mapping(address => Profile) private profiles;

    function registerProfile(string calldata metadataURI, ProfileRole role) external {
        if (bytes(metadataURI).length == 0) revert EmptyMetadataURI();
        if (profiles[msg.sender].owner != address(0)) revert ProfileAlreadyRegistered();

        uint64 currentTimestamp = uint64(block.timestamp);

        profiles[msg.sender] = Profile({
            owner: msg.sender,
            metadataURI: metadataURI,
            role: role,
            isActive: true,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp
        });

        emit ProfileRegistered(msg.sender, metadataURI, role);
    }

    function updateProfile(
        string calldata metadataURI,
        ProfileRole role,
        bool isActive
    ) external {
        if (bytes(metadataURI).length == 0) revert EmptyMetadataURI();

        Profile storage profile = profiles[msg.sender];

        if (profile.owner == address(0)) revert ProfileNotRegistered();

        profile.metadataURI = metadataURI;
        profile.role = role;
        profile.isActive = isActive;
        profile.updatedAt = uint64(block.timestamp);

        emit ProfileUpdated(msg.sender, metadataURI, role, isActive);
    }

    function deactivateProfile() external {
        Profile storage profile = profiles[msg.sender];

        if (profile.owner == address(0)) revert ProfileNotRegistered();

        profile.isActive = false;
        profile.updatedAt = uint64(block.timestamp);

        emit ProfileDeactivated(msg.sender);
    }

    function getProfile(address owner) external view returns (Profile memory) {
        return profiles[owner];
    }

    function isRegistered(address owner) external view returns (bool) {
        return profiles[owner].owner != address(0);
    }
}
