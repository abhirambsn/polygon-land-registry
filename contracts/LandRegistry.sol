// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {HeptaSign} from "./HeptaSign.sol";

contract LandRegistry is ERC721, ERC721URIStorage, Ownable {
    using ECDSA for bytes32;
    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR");
    uint256 registerIndex;
    uint256 contractBalance;
    uint noUsers;

    constructor() ERC721("LandRegistry", "LRY") {
        registerIndex = 0;
        contractBalance = 0;
        noUsers = 0;
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
        address addr;
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

    mapping(address => OwnerType) public users;
    mapping(uint256 => LandVoucher) public lands;
    mapping(uint256 => RegisterEntry) public landRegister;
    mapping(address => uint256[]) public ownedLands;
    mapping(address => Executor) public executors;

    function getUsers() external view returns(uint) {
        return noUsers;
    }

    function getOwnedLands(address addr) external view returns(uint256[] memory) {
        return ownedLands[addr];
    }

    function getLastSale() external view returns(RegisterEntry memory) {
        if (registerIndex - 1 < 0) {
            RegisterEntry memory emptyEntry;
            return emptyEntry;
        }
        return landRegister[registerIndex-1];
    }

    function hasRole(address _addr) internal view returns (bool) {
        return executors[_addr].isVal;
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
        address payable ownerAddr = payable(owner());
        (bool sent,) = ownerAddr.call{value: contractBalance}("");
        require(sent, "Sent Failure");
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
        users[msg.sender] = OwnerType(_name, _resAddress, _cof, _gender, msg.sender);
        noUsers++;
    }

    function getLatestLandIdx() external view returns (uint256) {
        return registerIndex - 1;
    }

    function registerLand(
        string memory _uri,
        address builder,
        uint256 _price
    ) public returns (uint256) {
        onlyExecutor();
        bytes memory signature = bytes(
            HeptaSign.concat(string(abi.encodePacked(builder)), "BSIG")
        );
        lands[registerIndex] = LandVoucher(
            registerIndex,
            _price,
            _uri,
            false,
            signature
        );
        registerIndex++;
        return registerIndex - 1;
    }

    

    function executeSale(
        address _seller,
        address _buyer,
        uint256 _landToken,
        SaleType _sType,
        uint256 _salePrice
    ) public payable {
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
        require(msg.value == fees, "Invalid Fees Supplied");
        LandVoucher memory lv = lands[_landToken];
        if (_sType == SaleType.NEW) {
            bool verified = HeptaSign._verify(lv.builderSignature, _seller);
            require(verified, "Signature Error");
            require(lv.isSold == false, "Invalid");
            _safeMint(_seller, _landToken);
            _setTokenURI(_landToken, lv.uri);
            _transfer(_seller, _buyer, _landToken);
            lands[_landToken].isSold = true;
        } else {
            bool verifyOwnershipOfSeller = HeptaSign._verifyOwnerSignature(
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
            HeptaSign.concat(string(abi.encodePacked(_buyer)), "OWNER_SIG")
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
            uint idx = 0;
            bool found = false;
            for (uint i = 0; i < ownedLands[_seller].length; i++) {
                if (ownedLands[_seller][i] == _landToken) {
                    idx = i;
                    found = true;
                    break;
                }
            }
            require(found, "Land Token Invalid");
            for (uint i = idx; i < ownedLands[_seller].length - 1; i++) {
                ownedLands[_seller][i] = ownedLands[_seller][i+1];
            }
            ownedLands[_seller].pop();
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
