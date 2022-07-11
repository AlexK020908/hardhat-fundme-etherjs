const { assert } = require("chai")
const { getNamedAccounts, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

//this is the test we run test ets
developmentChains.includes(network.name)
    ? describe.skip
    : describe("fund me", function () {
          let fundme
          let deployer
          const sendvalue = ethers.utils.parseEther("1")

          beforeEach(async function () {
              deployer = (await getNamedAccounts).deployer
              fundme = await ethers.getContract("FundMe", deployer)
              //we do not need to fixture or mock becuase it is on a testnet
          })

          it("allow ppl to fund and withdraw", async function () {
              await fundme.fund({ value: sendvalue })
              await fundme.withDraw()
              const endingBalance = await fundme.provider.getBalance(
                  fundme.address
              )
              assert.equal(endingBalance.toString(), "0")
          })
      })
