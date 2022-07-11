to add hardhat to the project run:
yarn add --dev hardhat

then to create a new project with hard hat run:
yarn hardhat
choose create basic sample project or advanced sample project

in the advanced sample project, comes in with .eslintrc and env

what is solhint ?
it is known as a solidity linter --> used to lint code --> a proces of running a program that analyze potential errors --> like eslintrc for js

to run solhint on a file do
yarn solhint contractrs/filename.sol

next we want to fill out our config for prettier
then update prettier.ignore to specify files for prettier to ignore

in fundme we downloaded the interface from chainlink , but on local machines it may not work since we do not have it installed
to install it --> run command
yarn add --dev @chainlink/contracts

after writing out code for solidity --> we can compile it

the reason why we use hardhat-deploy package because it makes deploying easier since we do not want to keep everything in the deploy script like we did in hardhat simple storage
to add it use :
yarn add --dev hardhat-deploy
then we need to add requires("hardhat-deploy") to the hardhat config and then we can delete the deploy script
now go back to the config file

we create a new folder for deployment
we also want to add hardhat-deploy-ethers
yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers

inside the deploy folder we have all the scripts that we want to deploy
