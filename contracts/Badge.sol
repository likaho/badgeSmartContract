// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
/**
 * This implements OpenZeppelin ERC721 defined in the EIP that adds
 * enumerability of all the token ids in the contract as well as all token ids owned by each
 * account.
 */
contract Badge is ERC721 {

    // Struct Identifier definition
    struct Identifier {
        string student_id;  // Student ID
        string dataCID;     // IPFS CID (Content Identifier) for NFT data
    }

    // Mapping to store Identifiers
    mapping(uint256 => Identifier) private identifiers;

    // Minted event after a badge is minted
    event Minted(uint256 indexed _tokenId);

    // Constructor to initialize ERC721 token
    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}

    // Modifier to check if token exists
    modifier existence(uint256 _tokenId) {
        require(_exists(_tokenId), "Token does not exist");
        _;
    }
    
    // Mint function to create a new token and associate it with an Identifier
    function mint(string memory _student_id, string memory _dataCID) external {
        // Calculate the tokenId based on the dataCID
        require(bytes(_student_id).length > 0, "Student id cannot be an empty string.");
        require(bytes(_dataCID).length > 0, "dataCID cannot be an empty string.");
        uint256 tokenId = uint256(keccak256(abi.encode(_dataCID)));
        // Mint the token and associate it with the sender's address
        _mint(msg.sender, tokenId);
        // Store the Identifier in the mapping
        identifiers[tokenId] = Identifier(_student_id, _dataCID);
        emit Minted(tokenId);
    }

    // Get the Identifier associated with a tokenId
    function getIdentifier(uint256 _tokenId) external existence(_tokenId) view returns (Identifier memory) {
        return identifiers[_tokenId];
    }

    // Override the _baseURI function to return the base URI for the token metadata
    function _baseURI() internal view virtual override returns (string memory) {
        return "https://identitytoken.infura-ipfs.io/ipfs/";
    }

    // Burn function to destroy a token and remove its associated Identifier
    function burn(uint256 _tokenId) external existence(_tokenId) {
        require(_isApprovedOrOwner(_msgSender(), _tokenId), "ERC721: caller is not token owner or approved");
        _burn(_tokenId);
        delete identifiers[_tokenId];
    }

    // Return a token URI associated with a tokenId
    function tokenURI(uint256 _tokenId) public existence(_tokenId) view virtual override returns (string memory) {
        _requireMinted(_tokenId);
        return string(abi.encodePacked(_baseURI(), identifiers[_tokenId].dataCID));
    }
}
