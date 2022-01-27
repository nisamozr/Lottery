require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers")

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});
task("request-random-number", "Requests a random number for a Chainlink VRF enabled smart contract")
  .addParam("contract", "The address of the API Consumer contract that you want to call")
  .addParam("seed", "The seed to be used in the requst for randomness", 777, types.int)
  .setAction(async taskArgs => {

    const contractAddr = taskArgs.contract
    const seed = taskArgs.seed
    const networkId = network.name
    console.log("Requesting a random number using VRF consumer contract ", contractAddr, " on network ", networkId)
    const RANDOM_NUMBER_CONSUMER_ABI = [{ "inputs": [{ "internalType": "address", "name": "_vrfCoordinator", "type": "address" }, { "internalType": "address", "name": "_link", "type": "address" }, { "internalType": "bytes32", "name": "_keyHash", "type": "bytes32" }, { "internalType": "uint256", "name": "_fee", "type": "uint256" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [{ "internalType": "uint256", "name": "userProvidedSeed", "type": "uint256" }], "name": "getRandomNumber", "outputs": [{ "internalType": "bytes32", "name": "requestId", "type": "bytes32" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "name": "nonces", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "randomResult", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "requestId", "type": "bytes32" }, { "internalType": "uint256", "name": "randomness", "type": "uint256" }], "name": "rawFulfillRandomness", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_keyHash", "type": "bytes32" }, { "internalType": "uint256", "name": "_fee", "type": "uint256" }, { "internalType": "uint256", "name": "_seed", "type": "uint256" }], "name": "requestRandomness", "outputs": [{ "internalType": "bytes32", "name": "requestId", "type": "bytes32" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "withdrawLink", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]

    //Get signer information
    const accounts = await hre.ethers.getSigners()
    const signer = accounts[0]

    //Create connection to VRF Contract and call the getRandomNumber function
    const vrfConsumerContract = new ethers.Contract(contractAddr, RANDOM_NUMBER_CONSUMER_ABI, signer)
    var result = await vrfConsumerContract.getRandomNumber(seed).then(function (transaction) {
      console.log('Contract ', contractAddr, ' external data request successfully called. Transaction Hash: ', transaction.hash)
      console.log("Run the following to read the returned random number:")
      console.log("npx hardhat read-random-number --contract ", contractAddr)
    })
  })

task("read-random-number", "Reads the random number returned to a contract by Chainlink VRF")
  .addParam("contract", "The address of the VRF contract that you want to read")
  .setAction(async taskArgs => {

    const contractAddr = taskArgs.contract
    const networkId = network.name
    console.log("Reading data from VRF contract ", contractAddr, " on network ", networkId)
    const RANDOM_NUMBER_CONSUMER_ABI = [{ "inputs": [{ "internalType": "address", "name": "_vrfCoordinator", "type": "address" }, { "internalType": "address", "name": "_link", "type": "address" }, { "internalType": "bytes32", "name": "_keyHash", "type": "bytes32" }, { "internalType": "uint256", "name": "_fee", "type": "uint256" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [{ "internalType": "uint256", "name": "userProvidedSeed", "type": "uint256" }], "name": "getRandomNumber", "outputs": [{ "internalType": "bytes32", "name": "requestId", "type": "bytes32" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "name": "nonces", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "randomResult", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "requestId", "type": "bytes32" }, { "internalType": "uint256", "name": "randomness", "type": "uint256" }], "name": "rawFulfillRandomness", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_keyHash", "type": "bytes32" }, { "internalType": "uint256", "name": "_fee", "type": "uint256" }, { "internalType": "uint256", "name": "_seed", "type": "uint256" }], "name": "requestRandomness", "outputs": [{ "internalType": "bytes32", "name": "requestId", "type": "bytes32" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "withdrawLink", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]

    //Get signer information
    const accounts = await hre.ethers.getSigners()
    const signer = accounts[0]

    //Create connection to API Consumer Contract and call the createRequestTo function
    const vrfConsumerContract = new ethers.Contract(contractAddr, RANDOM_NUMBER_CONSUMER_ABI, signer)
    var result = await vrfConsumerContract.randomResult().then(function (data) {
      console.log('Random Number is: ', web3.utils.hexToNumberString(data._hex))
    })
  })


// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity:{compilers: [
    {
        version: "0.8.11"
    },
    {
        version: "0.6.6"
    },
    {
        version: "0.6.0"
    }
]} ,
};
