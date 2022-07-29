// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LandRegistry is ERC721, ERC721URIStorage, Ownable {
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
    }

    struct LandVoucher {
        uint256 tokenId;
        uint256 minPrice;
        string uri;
    }

    mapping(address => OwnerType) users;
    mapping(uint256 => LandVoucher) public lands;
    mapping(uint256 => RegisterEntry) public landRegister;
    mapping(address => uint256[]) public ownedAssets;

    function safeMint(
        address to,
        uint256 tokenId,
        string memory uri
    ) public onlyOwner {
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function registerUserInRegistry(
        string memory _name,
        string memory _cof,
        string memory _resAddress,
        string memory _gender
    ) public {
        users[msg.sender] = OwnerType(_name, _resAddress, _cof, _gender);
    }

    function registerLand(string memory _uri, uint256 _price) public {
        lands[registerIndex] = LandVoucher(registerIndex, _price, _uri);
        registerIndex++;
    }

    function executeSale(
        address _seller,
        address _buyer,
        uint256 _landToken,
        SaleType _sType,
        uint256 _salePrice
    ) public {
        OwnerType memory buyer = users[_buyer];
        OwnerType memory seller = users[_seller];

        uint256 fees = 10000000;

        if (_sType == SaleType.NEW || _sType == SaleType.RESALE) {
            fees +=  _salePrice/1000 * 1;
        } else if (_sType == SaleType.INHERITANCE) {
            fees += _salePrice/1000 * 5;
        } else if (_sType == SaleType.GIFT) {
            fees += _salePrice/1000 * 8;
        }
        contractBalance += fees;
        if (_sType == SaleType.NEW) {
            LandVoucher memory lv = lands[_landToken];
            _safeMint(_buyer, _landToken);
            _setTokenURI(_landToken, lv.uri);
        } else {
            _transfer(_seller, _buyer, _landToken);
        }
        landRegister[_landToken] = RegisterEntry(
            _landToken,
            seller,
            buyer,
            _sType,
            _salePrice,
            fees
        );
        if (_sType == SaleType.NEW) {
            ownedAssets[_buyer].push(_landToken);
        } else {
            uint256[] memory objects = ownedAssets[_seller];
            for (uint256 i = 0; i < objects.length; i = i + 1) {
                if (objects[i] == _landToken) {
                    delete ownedAssets[_seller][i];
                    break;
                }
            }
            ownedAssets[_buyer].push(_landToken);
        }
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
