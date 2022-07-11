const { getNamedAccounts, ethers } = require("hardhat")

//what goes in scripts?
async function main() {
    const { deployer } = await getNamedAccounts()
    const fundme = await ethers.getContract("FundMe", deployer)

    console.log("Funding contract")
    const txresponse = await fundme.fund({
        value: ethers.utils.parseEther("0.1"),
    })

    await txresponse.wait(1)
    console.log("Funded!")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
