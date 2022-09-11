// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
pragma experimental ABIEncoderV2;

library HeptaSign {
    function concat(string memory a, string memory b)
        public
        pure
        returns (string memory)
    {
        return string(abi.encodePacked(a, "_", b));
    }

    function _verify(bytes memory _builderSignature, address _asSigner)
        public
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

    function _verifyOwnerSignature(
        bytes memory _lrOwnerSignature,
        address _asOwner
    ) public pure returns (bool) {
        bytes memory tempSignature = bytes(
            concat(string(abi.encodePacked(_asOwner)), "OWNER_SIG")
        );
        return
            keccak256(abi.encodePacked(tempSignature)) ==
            keccak256(abi.encodePacked(_lrOwnerSignature));
    }
}
