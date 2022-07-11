const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
    //with draw to employer
    const { deployer } = await getNamedAccounts()
    const fundme = await ethers.getContract("FundMe", deployer)

    const withdrawResponse = await fundme.withdraw()
    await withdrawResponse.wait(1)
    console.log("funds withdrawn!")
    const fundleft = await ethers.provider.getBalance(fundme.address)
    console.log(`fund me funds left ${fundleft}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
