# DEMO VIDEO

https://youtu.be/zUIOdlES2HM

# SET UP PROCEDURE
## Prerequisites 
- Download Ganache - https://www.trufflesuite.com/ganache
- Download Node JS - https://nodejs.org/en/download/
- Install Yarn - https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable
- Install Metamask - https://metamask.io/download
- Have python installed

## Wallet Set Up
- Start New workspace in Ganache
- Save the workspace
- Copy the MNEMONIC
- Import using Secret Phrase onto Metamask
- Past the MNEMONIC and set a password

## Backend Set Up
- Open Terminal and Go to Project Directory
- `cd Backend`
- `yarn install`
- `yarn compile`
- `yarn migrate`
- `cd ..`
- `python extract.py`

## Testing Set Up for backend
- Install hardhat
- Install the testing libs: `npm install --save-dev @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers`
- `cd Backend\test`
- `npx hardhat test`

## Deploy Project
- Open Terminal and Go to Project Directory
- `cd Frontend`
- `yarn install`
- `yarn dev`
- Go to localhost:3000
- Have FUN!
