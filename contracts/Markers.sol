// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract Markers is ERC1155, AccessControl, Pausable 
{
    address public _owner;
    uint256 public _cost;
    bool public _revealed;
    

    mapping (uint256 => string) private _uris;
    mapping (address => mapping (uint256 => uint)) _lockTokens;

    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    modifier checkLockToken(address from, uint256 id) 
    {
        require(_lockTokens[from][id] == uint(0x0), "Token lock");
        _;
    }

    modifier checkLockTokenForBatch(address from, uint256[] memory ids) 
    {
        bool lock = false;
        for (uint i = 0; i < ids.length; i++) {
            uint256 id = ids[i];
            if (_lockTokens[from][id] != uint256(0x0)) {
                lock = true;
                break;
            }
        }

        require(!lock, "Token lock");
        _;
    }
    
    constructor(
        string memory url,
        uint256 cost,
        bool revealed
    ) ERC1155(url) 
    {
        _owner = msg.sender;
        _revealed = revealed;
        _cost = cost; //0.05 ether;
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(URI_SETTER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function mint(uint256 id, string memory url)
        public
        onlyRole(MINTER_ROLE)
    {
        __mint(_owner, id, 1, "");
        setURI(id, url);
    }

    function __mint(address account, uint256 id, uint256 amount, bytes memory data)
        private
    {
        //_mint(account, id, amount, data);
        _mint(account, id, amount, data);
    }
    
    function __mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        private
    {
        _mintBatch(to, ids, amounts, data);
    }

    function getContractAddress() public view returns (address) 
    {
        return(address(this));
    }

    function uri(uint256 tokenId) override public view returns (string memory) 
    {
        if(_revealed == true) {
            return super.uri(0);
        }

        return(_uris[tokenId]);
    }
    
    function setURI(uint256 tokenId, string memory newUri) 
        onlyRole(MINTER_ROLE)
        public 
    {
        require(bytes(newUri).length != 0, "Cannot set uri empty");
        require(bytes(_uris[tokenId]).length == 0, "Cannot set uri twice"); 
        _uris[tokenId] = newUri; 
    }

    function setApprovalForAllAdmin(address operator, bool approveda)
        onlyRole(MINTER_ROLE)
        public 
    {
        super.setApprovalForAll(operator, approveda);
    }

    function setApprovalByTokenId(address operator, uint256 id)
        public 
    {
        super.setApprovalForAll(operator, true);
        lockToken(msg.sender, id);
    }

    function setApprovalByTokenIds(address operator, uint256[] memory ids)
        public 
    {
        for (uint i = 0; ids.length < 0; i++) {
            setApprovalByTokenId(operator, ids[i]);
        }
    }

    function getLockToken(address operator, uint256 id) 
        public 
        view returns (uint)
    {
        return(_lockTokens[operator][id]);
    }

    function lockToken(address operator, uint256 id) 
        private
    {
        _lockTokens[operator][id] = block.timestamp;
    }

    function unlockToken(address operator, uint256 id) 
        onlyRole(MINTER_ROLE)
        public
    {
        delete _lockTokens[operator][id];
    }

    function setApprovalForAll(address operator, bool approveda)
        override
        public 
    {}

    function safeTransferFromForAdmin(address from, address to, uint256 id, uint256 amount, bytes memory data)
        onlyRole(MINTER_ROLE)
        public 
    {
        super.safeTransferFrom(from, to, id, amount, data);
    }

    function safeBatchTransferFromForAdmin(address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        onlyRole(MINTER_ROLE)
        public 
    {
        super.safeBatchTransferFrom(from, to, ids, amounts, data);
    }

    function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data)
        checkLockToken(from, id) 
        override
        public 
    {
        super.safeTransferFrom(from, to, id, amount, data);
    }

    function safeBatchTransferFrom(address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        checkLockTokenForBatch(from, ids) 
        override
        public 
    {
        super.safeBatchTransferFrom(from, to, ids, amounts, data);
    }

    function reveal() 
        public  
        onlyRole(MINTER_ROLE) 
    {
        _revealed = true;
    }

    function unreveal() 
        public 
        onlyRole(MINTER_ROLE) 
    {
        _revealed = false;
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function buy(uint256 tokenId) 
        whenNotPaused
        payable 
        public 
    {
        if (msg.sender != _owner) {
            require(msg.value >= _cost, "No balance");
            (bool os, ) = payable(msg.sender).call{value: msg.value}("");
            require(os, "No buy error transaction");
        }
    
        __mint(msg.sender, tokenId, 1, "");
    }

    function withdraw() public payable onlyRole(MINTER_ROLE) {
        (bool os, ) = payable(address(this)).call{value: address(this).balance}("");
        require(os, "Error withdraw");
    }

    // The following functions are overrides required by Solidity.
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
