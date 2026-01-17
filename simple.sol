// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CertificateRegistry {
    address public owner;

    struct Certificate {
        string name;
        string course;
        uint256 issuedAt;
        bool exists;
    }

    mapping(string => Certificate) public certificates;

    event CertificateIssued(
        string indexed certId,
        string name,
        string course,
        uint256 issuedAt
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function issueCertificate(
        string memory _certId,
        string memory _name,
        string memory _course
    ) external onlyOwner {
        require(!certificates[_certId].exists, "Certificate ID already exists");

        certificates[_certId] = Certificate({
            name: _name,
            course: _course,
            issuedAt: block.timestamp,
            exists: true
        });

        emit CertificateIssued(_certId, _name, _course, block.timestamp);
    }

    function verifyCertificate(string memory _certId)
        external
        view
        returns (
            bool exists,
            string memory name,
            string memory course,
            uint256 issuedAt
        )
    {
        Certificate memory cert = certificates[_certId];
        if (!cert.exists) {
            return (false, "", "", 0);
        }

        return (true, cert.name, cert.course, cert.issuedAt);
    }
}
