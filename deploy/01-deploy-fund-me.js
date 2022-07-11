//before, we did import, main function and calling the main function
//hardhat deploy does not need main or calling of main fucntion
//not that hre means hardhat running enviornemnt, hre  is bascially the same thing as hardhat , when we do {ethers} = require("hardhat")

const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
/*
function deployfunc() {
    console.log("hi")
}

module.exports.default = deployfunc
*/

/*
    but what if we want to deploy to a network on local device or a harhat network that doesn't have a price feed address?
    solution: mock contracts 
        if the contract doesn't exist , we deploy a minimal version of it for local testing 


*/

//we can also use an anynomus function and use module.exports to wrap it

module.exports = async ({ getNamedAccounts, deployments }) => {
    //const { getNamedAccounts, deployment } = hre we are pulling them out, doing the same thing as what we did above in the brackets
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    //the getnamedaccounts gets the named accounts --> check if hardhat config, where we added a field called namedacounts and gave a deployer account an index of zero in the accounts array
    //here we are getting the chainID
    //in price converter-> the EVM chain hash is only for rinkeby, so what if we want to switch networks?

    //solutions: we want to parametize the hash...in price converter --> look back at its contrscutor after we parametized it

    //WHEN going for local or hardhat network, we want to use mock
    const chainId = network.config.chainId
    console.log(`chainid : ${chainId}`)
    let ethUsdPriceFeedAddress
    if (chainId == 31337) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator") //since we have already deployed it --> mionimal mock version of price feed
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    const fundme = await deploy("FundMe", {
        from: deployer,
        //args are args to the contructor
        args: [ethUsdPriceFeedAddress], //put price feed address, use the chainId! we can use aave --> deploy to multiple chains, refer to helper-hardhat-config.js
        //price feed address go here because we have an address parameter in the constructor
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    const args = [ethUsdPriceFeedAddress]
    if (!developmentChains.includes(network.name) && process.env.ETH_API_KEY) {
        //if it isnt a dev chain, we want to vberify
        await verify(fundme.address, args)
    }

    log("------------------------------")
}
//we can call deploy, hardhat calls this function with the hre var
//helper network config gives the EVM chain hash depending on the chain we are on, so we import that network config
module.exports.tags = ["all", "fundme"]
