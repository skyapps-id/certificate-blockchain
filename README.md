# Certificate Blockchain Verification System

A Next.js application for issuing and verifying certificates on the Ethereum Sepolia testnet using smart contracts.

## Features

- **Verify Certificate**: Public verification of certificate authenticity on the blockchain
- **Issue Certificate**: Admin panel for issuing certificates via MetaMask wallet
- **Glassmorphism UI**: Modern dark theme with beautiful gradient effects

## Prerequisites

- Node.js 18+ installed
- MetaMask browser extension
- Ethereum Sepolia testnet account with test ETH

## Setup Instructions

### 1. Deploy Smart Contract

1. Open [Remix IDE](https://remix.ethereum.org/)
2. Create a new file named `simple.sol` and paste the smart contract code:
   ```solidity
   // SPDX-License-Identifier: MIT
   pragma solidity ^0.8.20;

   contract Certificate {
       struct CertificateData {
           string name;
           string course;
           uint256 issuedAt;
           bool exists;
       }

       mapping(string => CertificateData) public certificates;
       address public owner;

       event CertificateIssued(
           string indexed certId,
           string name,
           string course,
           uint256 issuedAt
       );

       constructor() {
           owner = msg.sender;
       }

       modifier onlyOwner() {
           require(msg.sender == owner, "Only owner can issue certificates");
           _;
       }

       function issueCertificate(
           string memory _certId,
           string memory _name,
           string memory _course
       ) public onlyOwner {
           require(!certificates[_certId].exists, "Certificate already exists");

           certificates[_certId] = CertificateData({
               name: _name,
               course: _course,
               issuedAt: block.timestamp,
               exists: true
           });

           emit CertificateIssued(_certId, _name, _course, block.timestamp);
       }

       function verifyCertificate(
           string memory _certId
       ) public view returns (
           bool exists,
           string memory name,
           string memory course,
           uint256 issuedAt
       ) {
           CertificateData memory cert = certificates[_certId];
           return (cert.exists, cert.name, cert.course, cert.issuedAt);
       }
   }
   ```

3. Compile the contract using the Solidity Compiler tab
4. Go to "Deploy & Run Transactions" tab
5. Select "Injected Provider - MetaMask" as environment
6. Click "Deploy" and confirm in MetaMask (ensure you're on Sepolia testnet)
7. Copy the **Deployed Contract Address** (e.g., `0x66f60471db7dA1f16d60C7e30c37A6fB7dD193fc`)
8. Go to the Solidity Compiler tab, scroll down to "ABI" section
9. Copy the entire ABI JSON

### 2. Get Ankr API Key

1. Visit [Ankr](https://www.ankr.com/)
2. Sign up and create a new project
3. Copy your API key (you'll need it for environment variables)

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
NEXT_PUBLIC_TOKEN_SEPOLIA_RPC=your_ankr_api_key_here
NEXT_PUBLIC_CONTRACT_ADDRESS=0x66f60471db7dA1f16d60C7e30c37A6fB7dD193fc
```

Replace:
- `your_ankr_api_key_here` with your actual Ankr API key
- `0x66f60471db7dA1f16d60C7e30c37A6fB7dD193fc` with your deployed contract address

### 4. Update ABI

Replace the content of `lib/abi.json` with the ABI you copied from Remix:

```bash
# Open lib/abi.json and paste the ABI from Remix
```

### 5. Install Dependencies

```bash
npm install
```

This will install:
- Next.js 16.1.2
- React 19
- ethers.js (blockchain library)
- Tailwind CSS v4

## Running the Application

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Production Build

```bash
npm run build
npm start
```

## Usage

### Verify Certificate (Public)

1. Visit the home page
2. Enter a Certificate ID (e.g., `EP-1768571028`)
3. Click "Verify Certificate"
4. View the certificate details if it exists on the blockchain

### Issue Certificate (Admin)

1. Visit `/owner` page
2. Ensure MetaMask is connected to Sepolia testnet
3. Enter student name and course name
4. Click "Issue Certificate"
5. Confirm transaction in MetaMask
6. View the transaction hash and verify on Etherscan

## Smart Contract Functions

- `issueCertificate(string _certId, string _name, string _course)` - Issue a new certificate (owner only)
- `verifyCertificate(string _certId)` - Verify if a certificate exists and return its details
- `certificates(string _certId)` - Get certificate data by ID

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/new)
3. Import your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_TOKEN_SEPOLIA_RPC`
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`
5. Deploy

For detailed deployment instructions, see the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## Project Structure

```
certificate-blockchain/
├── app/
│   ├── page.tsx          # Verify certificate page
│   ├── owner/
│   │   └── page.tsx      # Issue certificate page
│   ├── layout.tsx         # Root layout
│   └── globals.css       # Global styles
├── lib/
│   ├── contract.ts       # Contract interaction logic
│   ├── abi.json         # Smart contract ABI
│   └── abi.d.ts         # TypeScript declaration for ABI
├── simple.sol           # Smart contract source code
├── .env                # Environment variables (not committed)
└── .example.env        # Environment variables template
```

## Tech Stack

- **Framework**: Next.js 16.1.2 (App Router)
- **Language**: TypeScript
- **Blockchain**: ethers.js v6
- **Styling**: Tailwind CSS v4
- **Network**: Ethereum Sepolia Testnet

## Getting Test ETH

Get free test ETH from:
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Ankr Faucet](https://www.ankr.com/eth/faucet-sepolia/)

## License

MIT
