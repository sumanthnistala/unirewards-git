require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({path:__dirname+'/.env'});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks:
  {
    mainnet:{
      url:process.env.MAINNET_URL
    }
  }
};
