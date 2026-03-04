pragma solidity ^0.6.6;

import './RawMaterial.sol';

contract Supplier {
    
    mapping (address => address[]) public supplierRawMaterials;
    address[] public allRawMaterials;
    
    constructor() public {}
    
    function createRawMaterialPackage(
        bytes32 _description,
        uint _quantity,
        address _transporterAddr,
        address _manufacturerAddr
    ) public {

        RawMaterial rawMaterial = new RawMaterial(
            msg.sender,
            address(bytes20(sha256(abi.encodePacked(msg.sender, now)))),
            _description,
            _quantity,
            _transporterAddr,
            _manufacturerAddr
        );
        
        supplierRawMaterials[msg.sender].push(address(rawMaterial));
        allRawMaterials.push(address(rawMaterial));
    }
    
    function getNoOfPackagesOfSupplier() public view returns(uint) {
        return supplierRawMaterials[msg.sender].length;
    }
    
    //  Global getter for Manufacturer
    function getAllPackages() public view returns(address[] memory) {
        return allRawMaterials;
    }
}