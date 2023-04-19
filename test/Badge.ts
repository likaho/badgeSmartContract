const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Badge contract', () => {
  let badge: any, owner: any, user;
  const NAME = 'Coursera';
  const SYMBOL = 'CEA';

  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();
    const Badge = await ethers.getContractFactory('Badge');
    badge = await Badge.deploy(NAME, SYMBOL);
    await badge.deployed();
  });

  it('Should mint a new badge and get its identifier', async () => {
    const studentId = '123';
    const dataCID = 'QmXZaGsrnJYKseFghyU8rES9rJMdFZZEoCQcZsmHDdjZn1';
    const expectedTokenId = '19997581365812186671576823907906746703067519195421320673800857889964246531242';
    const tx = await badge.connect(owner).mint(studentId, dataCID);
    const receipt = await tx.wait();
    const tokenId = receipt.events[0].args[2];
    const identifier = await badge.getIdentifier(tokenId);
    expect(tokenId).to.equal(expectedTokenId);
    expect(identifier.student_id).to.equal(studentId);
    expect(identifier.dataCID).to.equal(dataCID);
  });

  it('Should not mint a new badge with empty student id', async () => {
    const studentId = '';
    const dataCID = 'QmXZaGsrnJYKseFghyU8rES9rJMdFZZEoCQcZsmHDdjZn1';
    await expect(badge.connect(owner).mint(studentId, dataCID)).to.be.revertedWith('Student id cannot be an empty string.');
  });

  it('Should not mint a new badge with empty dataCID', async () => {
    const studentId = '123';
    const dataCID = '';
    await expect(badge.connect(owner).mint(studentId, dataCID)).to.be.revertedWith('dataCID cannot be an empty string.');
  });

  it('Should get the token URI associated with a token ID', async () => {
    const studentId = '123';
    const dataCID = 'QmXZaGsrnJYKseFghyU8rES9rJMdFZZEoCQcZsmHDdjZn1';
    const tx = await badge.connect(owner).mint(studentId, dataCID);
    const receipt = await tx.wait();
    const tokenId = receipt.events[0].args[2];
    const tokenURI = await badge.tokenURI(tokenId);
    const expectedURI = `https://identitytoken.infura-ipfs.io/ipfs/${dataCID}`;
    expect(tokenURI).to.equal(expectedURI);
  });

  it('Should not get the token URI associated with a non-minted token ID', async () => {
    const tokenId = 0;
    await expect(badge.tokenURI(tokenId)).to.be.revertedWith('Token does not exist');
  });

  // it('Should burn an existing token', async () => {
  //   const studentId = '123';
  //   const dataCID = 'QmXZaGsrnJYKseFghyU8rES9rJMdFZZEoCQcZsmHDdjZn1';
  //   const tx = await badge.connect(owner).mint(studentId, dataCID);
  //   const receipt = await tx.wait();
  //   const tokenId = receipt.events[0].args[2].toNumber();
  //   await badge.connect(owner).burn(tokenId);
  //   await expect(badge.ownerOf(tokenId)).to.be.reverted
});