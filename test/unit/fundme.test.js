const { ethers, getNamedAccounts } = require("hardhat")
//get named accounts and deployments are extractedf from the HRE (hardhat runtime enviornment) which is the same thing as hardhat
const { assert, expect } = require("chai")
const { deployments } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", function () {
          let fundme
          let deployer
          let MockV3Aggregator
          const sendValue = ethers.utils.parseEther("1")
          beforeEach(async function () {
              //deploy our fund me contract using hardhat-deploy
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"]) //deploying all of the contract in the deploy folder --> since we have all tags in every deploy file
              fundme = await ethers.getContract("FundMe", deployer) //here we are specifying the account connected to the fundme(CONNECTED MEANING THAT AN ACCOUNT THAT IS CONNECTED SO THAT HE CAN SEND MONEY TO THE CONTRACT), this is already deployed to a contract address
              //note that fundme.address and deployer's address are not the same --> we specified deployer
              MockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer //connecting it to deployer
              )
          })
          describe("constructor", function () {
              it("sets the aggregator address correctly", async function () {
                  const reponse = await fundme.s_priceFeedAddress() //becuase varibales are basically just functions
                  assert.equal(reponse, MockV3Aggregator.address)
                  //since it is local testing --> this is just deploying the local testing network
              })
          })

          describe("fund", async function () {
              it("fails if you don't send enought eth", async function () {
                  await expect(fundme.fund()).to.be.reverted
              })

              it("passses if you send enough Eth", async function () {
                  await fundme.fund({ value: sendValue })
                  //reponse if the big number version is how much has been funded
                  const response = await fundme.s_addressToAmountFunded(
                      deployer
                  ) //since deployer is where we are sending it to and from at the same time
                  assert.equal(response.toString(), sendValue.toString())
              })

              it("adds funder to array of funders", async function () {
                  await fundme.fund({ value: sendValue })
                  const response = await fundme.s_funders(0) //somehow fundme.s_funders() does not work... it says missing parameter
                  assert.equal(response, deployer)
              })
          })

          describe("withdraw", function () {
              //add a before each to fund the contract before we run any test about withdrawl
              beforeEach(async function () {
                  await fundme.fund({ value: sendValue })
              })

              it("withdraw eth from a single funder", async function () {
                  //arrange
                  //get the starting balance
                  const startBalance = await fundme.provider.getBalance(
                      fundme.address
                  )

                  //console.log(`fund me address ${fundme.address}`)

                  const startingDeployerBlance =
                      await fundme.provider.getBalance(deployer)

                  //console.log(`deployer address ${deployer}`) //deployer is arleady an address --> wallet

                  const response = await fundme.withdraw()
                  const tx = await response.wait(1) //we can find the gascost from the tx reciept
                  //after debuggin --> we see that the trasaction reciept has a gasused and gascost parameter , multiplying those we get the price used
                  const gasCost = tx.gasUsed.mul(tx.effectiveGasPrice)
                  const endBalance = await fundme.provider.getBalance(
                      fundme.address
                  )
                  const endDeployerBalance = await fundme.provider.getBalance(
                      deployer
                  )

                  assert.equal(endBalance, 0)
                  assert.equal(
                      startBalance.add(startingDeployerBlance).toString(), //since they are big numbers
                      endDeployerBalance.add(gasCost).toString()
                  )
                  //but it is not accurate, since we need to incluide the gas cost, so how do we add the gastcost ?
              })

              //how do we create multiple accounts? --> ether.getsigners!!!!
              it("withdraw from multiple funder", async function () {
                  const accounts = await ethers.getSigners()
                  for (let i = 1; i <= 6; i++) {
                      const fundmeconnected = await fundme.connect(accounts[i]) //connecting function to a new accounts since in the begging we connected it to deployer
                      //connecting an signer is different than doing accounts[i].address!

                      /*
                    the above function returns a new contract with accounts[i] as the sender that calls the funciton and because it is not the deployer --> it can not withdraw

                */
                      await fundmeconnected.fund({ value: sendValue })
                      //zeroth position is disregarded since that is the position of the deployer
                      expect(fundmeconnected.withdraw()).to.be.reverted
                      console.log(fundmeconnected === fundme) //false --> not the same contract
                  }
                  const startBalance = await fundme.provider.getBalance(
                      fundme.address
                  )

                  const startingDeployerBlance =
                      await fundme.provider.getBalance(deployer)

                  const response = await fundme.withdraw()
                  const tx = await response.wait(1) //we can find the gascost from the tx reciept
                  //after debuggin --> we see that the trasaction reciept has a gasused and gascost parameter , multiplying those we get the price used
                  const gasCost = tx.gasUsed.mul(tx.effectiveGasPrice)
                  const endBalance = await fundme.provider.getBalance(
                      fundme.address
                  )
                  const endDeployerBalance = await fundme.provider.getBalance(
                      deployer
                  )

                  assert.equal(endBalance, 0)
                  assert.equal(
                      startBalance.add(startingDeployerBlance).toString(), //since they are big numbers
                      endDeployerBalance.add(gasCost).toString()
                  )

                  await expect(fundme.s_funders(0)).to.be.reverted //since we reset afterwards
                  for (let i = 1; i <= 6; i++) {
                      assert.equal(
                          await fundme.s_addressToAmountFunded(
                              accounts[i].address
                          ),
                          0
                      )
                  }
              })

              it("only allows onwer to withdraw the funds", async function () {
                  const accounts = await ethers.getSigners()
                  const attacker = accounts[1]
                  const attackerConnectedcontract = await fundme.connect(
                      attacker //connecting it to a new wallet --> but you can not call withdraw
                  )
                  await expect(
                      attackerConnectedcontract.withdraw()
                  ).to.be.revertedWith("FundMe__NotOnwer")
              })
          })
      })
