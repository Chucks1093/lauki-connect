// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ILaukiConnectProfileRegistry {
    enum ProfileRole {
        Unknown,
        Builder,
        Investor,
        Operator,
        Partner
    }

    struct Profile {
        address owner;
        string metadataURI;
        ProfileRole role;
        bool isActive;
        uint64 createdAt;
        uint64 updatedAt;
    }

    event ProfileRegistered(address indexed owner, string metadataURI, ProfileRole role);
    event ProfileUpdated(
        address indexed owner,
        string metadataURI,
        ProfileRole role,
        bool isActive
    );
    event ProfileDeactivated(address indexed owner);

    function registerProfile(string calldata metadataURI, ProfileRole role) external;

    function updateProfile(string calldata metadataURI, ProfileRole role, bool isActive) external;

    function deactivateProfile() external;

    function getProfile(address owner) external view returns (Profile memory);

    function isRegistered(address owner) external view returns (bool);
}
