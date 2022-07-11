//this is a libaray for uint256
//SPDX-License-Identifier:MIT
pragma solidity ^0.8.4;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/* 
lib is really similar to a library 
*/
library PriceConverter {
    function getPrice(AggregatorV3Interface priceFeedAddress)
        internal
        view
        returns (uint256)
    {
        //we are interacting with a contract outside our projevt
        //need address of contract and ABI of contract
        //address : 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
        //what about ABI? how can we import? use interface --> it defines all the ways we can interact with a contrac t
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            priceFeedAddress
        );
        (
            ,
            /*uint80 roundID*/
            int256 price, /*uint startedAt*/ /*uint timeStamp*/ /*uint80 answeredInRound*/
            ,
            ,

        ) = priceFeed.latestRoundData();
        //eth in terms of USD, msg.value has 18 decmiamls
        return uint256(price * 1e10); //we times by 10 becuase there are 8 decmials in price initally , basically converting it to wei
    }

    function getConversionRate(
        uint256 ethAmount,
        AggregatorV3Interface priceFeedAddress
    ) internal view returns (uint256) {
        uint256 ethPrice = getPrice(priceFeedAddress);
        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18;
        return ethAmountInUsd;
    }

    //what happens if someone sends this contrract eth without calling fund function?
    //we want actions to triggert a function

    //recieve and fallback function '
}
