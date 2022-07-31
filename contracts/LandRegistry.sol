// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract LandRegistry is ERC721, ERC721URIStorage, Ownable {
    using ECDSA for bytes32;
    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR");
    uint256 registerIndex;
    uint256 contractBalance;

    constructor() ERC721("LandRegistry", "LRY") {
        registerIndex = 0;
        contractBalance = 0;
    }

    enum SaleType {
        NEW,
        RESALE,
        INHERITANCE,
        GIFT
    }

    struct OwnerType {
        string name;
        string resAddress;
        string care_of;
        string gender;
    }

    struct RegisterEntry {
        uint256 landId;
        OwnerType seller;
        OwnerType buyer;
        SaleType sale;
        uint256 salePrice;
        uint256 fee;
        bytes ownerSignature;
    }

    struct LandVoucher {
        uint256 tokenId;
        uint256 minPrice;
        string uri;
        bool isSold;
        bytes builderSignature;
    }

    struct Executor {
        string name;
        bool isVal;
    }

    mapping(address => OwnerType) users;
    mapping(uint256 => LandVoucher) public lands;
    mapping(uint256 => RegisterEntry) public landRegister;
    mapping(address => uint256[]) public ownedLands;
    mapping(address => Executor) public executors;

    function hasRole(address _addr) internal view returns (bool) {
        return executors[_addr].isVal;
    }

    function getUserDetails() external view returns (OwnerType memory) {
        return users[msg.sender];
    }

    function getOwnedAssets() external view returns (uint256[] memory) {
        return ownedLands[msg.sender];
    }

    function onlyExecutor() internal view {
        require(
            hasRole(msg.sender),
            "Only Executors"
        );
    }

    function safeMint(
        address to,
        uint256 tokenId,
        string memory uri
    ) public onlyOwner {
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function getContractBalance() public view onlyOwner returns (uint256) {
        return contractBalance;
    }

    function withdrawBalance() public payable onlyOwner {
        payable(owner()).transfer(contractBalance);
        contractBalance = 0;
    }

    function addExecutor(string memory name, address _addr) public onlyOwner {
        executors[_addr] = Executor(name, true);
    }

    function registerUserInRegistry(
        string memory _name,
        string memory _cof,
        string memory _resAddress,
        string memory _gender
    ) public {
        users[msg.sender] = OwnerType(_name, _resAddress, _cof, _gender);
    }

    function concat(string memory a, string memory b)
        internal
        pure
        returns (string memory)
    {
        return string(abi.encodePacked(a, "_", b));
    }

    function registerLand(
        string memory _uri,
        address builder,
        uint256 _price
    ) public {
        onlyExecutor();
        bytes memory signature = bytes(
            concat(string(abi.encodePacked(builder)), "BSIG")
        );
        lands[registerIndex] = LandVoucher(
            registerIndex,
            _price,
            _uri,
            false,
            signature
        );
        registerIndex++;
    }

    function _verify(bytes memory _builderSignature, address _asSigner)
        private
        pure
        returns (bool)
    {
        bytes memory tempSignature = bytes(
            concat(string(abi.encodePacked(_asSigner)), "BSIG")
        );
        return
            keccak256(abi.encodePacked(tempSignature)) ==
            keccak256(abi.encodePacked(_builderSignature));
    }

    function _verifyOwnerSignature(bytes memory _lrOwnerSignature, address _asOwner)
        private
        pure
        returns (bool)
    {
        bytes memory tempSignature = bytes(
            concat(string(abi.encodePacked(_asOwner)), "OWNER_SIG")
        );
        return
            keccak256(abi.encodePacked(tempSignature)) ==
            keccak256(abi.encodePacked(_lrOwnerSignature));
    }

    function executeSale(
        address _seller,
        address _buyer,
        uint256 _landToken,
        SaleType _sType,
        uint256 _salePrice
    ) public {
        onlyExecutor();
        require(
            (_sType == SaleType.NEW && lands[_landToken].isSold == false) ||
                (_sType != SaleType.NEW && lands[_landToken].isSold),
            "Invalid"
        );

        uint256 fees = 10000000;

        if (_sType == SaleType.NEW || _sType == SaleType.RESALE) {
            fees += (_salePrice / 1000) * 1;
        } else if (_sType == SaleType.INHERITANCE) {
            fees += (_salePrice / 1000) * 5;
        } else if (_sType == SaleType.GIFT) {
            fees += (_salePrice / 1000) * 8;
        }
        LandVoucher memory lv = lands[_landToken];
        if (_sType == SaleType.NEW) {
            bool verified = _verify(lv.builderSignature, _seller);
            require(verified, "Signature Error");
            require(lv.isSold == false, "Invalid");
            _safeMint(_seller, _landToken);
            _setTokenURI(_landToken, lv.uri);
            _transfer(_seller, _buyer, _landToken);
            lands[_landToken].isSold = true;
        } else {
            bool verifyOwnershipOfSeller = _verifyOwnerSignature(
                landRegister[_landToken].ownerSignature,
                _seller
            );
            require(
                verifyOwnershipOfSeller,
                "The given Seller is not the owner of the land"
            );
            require(lv.isSold, "Invalid Sale Condition");
            _transfer(_seller, _buyer, _landToken);
        }
        bytes memory newOwnerSignature = bytes(
            concat(string(abi.encodePacked(_buyer)), "OWNER_SIG")
        );
        landRegister[_landToken] = RegisterEntry(
            _landToken,
            users[_seller],
            users[_buyer],
            _sType,
            _salePrice,
            fees,
            newOwnerSignature
        );
        if (_sType == SaleType.NEW) {
            ownedLands[_buyer].push(_landToken);
        } else {
            for (uint256 i = 0; i < ownedLands[_seller].length; i = i + 1) {
                if (ownedLands[_seller][i] == _landToken) {
                    delete ownedLands[_seller][i];
                    break;
                }
            }
            ownedLands[_buyer].push(_landToken);
        }
        contractBalance += fees;
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}
