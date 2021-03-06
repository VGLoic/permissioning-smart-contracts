pragma solidity >=0.4.22 <0.6.0;

import "./RulesProxy.sol";
import "./RulesList.sol";
import "./Ingress.sol";
import "./Admin.sol";


contract Rules is RulesProxy, RulesList {

    // on read-only mode rules can't be added/removed
    bool readOnlyMode = false;
    // version of this contract: semver like 1.2.14 represented like 001002014
    uint version = 1000000;

    address private ingressContractAddress;

    modifier onlyOnEditMode() {
        require(!readOnlyMode, "In read only mode: rules cannot be modified");
        _;
    }

    modifier onlyAdmin() {
        Ingress ingressContract = Ingress(ingressContractAddress);
        address adminContractAddress = ingressContract.getContractAddress(ingressContract.ADMIN_CONTRACT());

        require(adminContractAddress != address(0), "Ingress contract must have Admin contract registered");
        require(Admin(adminContractAddress).isAuthorized(msg.sender), "Sender not authorized");
        _;
    }

    constructor (address ingressAddress) public {
        ingressContractAddress = ingressAddress;
    }

    // VERSION
    function getContractVersion() public view returns (uint) {
        return version;
    }

    // READ ONLY MODE
    function isReadOnly() public view returns (bool) {
        return readOnlyMode;
    }

    function enterReadOnly() public onlyAdmin returns (bool) {
        require(readOnlyMode == false, "Already in read only mode");
        readOnlyMode = true;
        return true;
    }

    function exitReadOnly() public onlyAdmin returns (bool) {
        require(readOnlyMode == true, "Not in read only mode");
        readOnlyMode = false;
        return true;
    }

    function connectionAllowed(
        bytes32 sourceEnodeHigh,
        bytes32 sourceEnodeLow,
        bytes16 sourceEnodeIp,
        uint16 sourceEnodePort,
        bytes32 destinationEnodeHigh,
        bytes32 destinationEnodeLow,
        bytes16 destinationEnodeIp,
        uint16 destinationEnodePort
    ) public view returns (bytes32) {
        if (
            enodeInWhitelist (
                sourceEnodeHigh,
                sourceEnodeLow,
                sourceEnodeIp,
                sourceEnodePort
            ) && enodeInWhitelist(
                destinationEnodeHigh,
                destinationEnodeLow,
                destinationEnodeIp,
                destinationEnodePort
            )
        ) {
            return 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
        } else {
            return 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
        }
    }

    function enodeInWhitelist(
        bytes32 enodeHigh,
        bytes32 enodeLow,
        bytes16 ip,
        uint16 port
    ) public view returns (bool) {
        return exists(enodeHigh, enodeLow, ip, port);
    }

    function addEnode(
        bytes32 enodeHigh,
        bytes32 enodeLow,
        bytes16 ip,
        uint16 port
    ) public onlyAdmin onlyOnEditMode returns (bool) {
        bool added = add(enodeHigh, enodeLow, ip, port);

        if (added) {
            triggerRulesChangeEvent(false);
        }

        return added;
    }

    function removeEnode(
        bytes32 enodeHigh,
        bytes32 enodeLow,
        bytes16 ip,
        uint16 port
    ) public onlyAdmin onlyOnEditMode returns (bool) {
        bool removed = remove(enodeHigh, enodeLow, ip, port);

        if (removed) {
            triggerRulesChangeEvent(true);
        }

        return removed;
    }

    function getSize() public view returns (uint) {
        return size();
    }

    function getByIndex(uint index) public view returns (bytes32 enodeHigh, bytes32 enodeLow, bytes16 ip, uint16 port) {
        (bool _exists, bytes32 _enodeHigh, bytes32 _enodeLow, bytes16 _ip, uint16 _port) = get(index);
        if (_exists) {
            return (_enodeHigh, _enodeLow, _ip, _port);
        }
    }

    function triggerRulesChangeEvent(bool addsRestrictions) public {
        Ingress(ingressContractAddress).emitRulesChangeEvent(addsRestrictions);
    }
}
