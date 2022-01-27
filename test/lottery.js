
const { expect } = require("chai")

describe("RandomNumberConsumer", async function () {
  let linkToken, vrfCoordinatorMock,Lottery, seed, keyhash, fee
  beforeEach(async () => {
   let  LinkToken = await deployments.get("LinkToken");
    linkToken = await ethers.getContractAt("LinkToken", LinkToken.address);
     Lottery = await ethers.getContractFactory("Lottery")
    keyhash = '0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4'
    fee = '1000000000000000000'
    seed = 123

   
  })
 
})
