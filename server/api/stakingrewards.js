const express = require("express");
const {ethers} = require("hardhat");
const cors = require('cors');

const app = express();
const port =3001;

app.use(cors());
require("dotenv").config({path:__dirname+'/.env'});
app.get("/",async(req,res)=>{

    let data = [];
    const provider = new ethers.JsonRpcProvider(process.env.MAINNET_URL);
    const contractAddress = new ethers.Contract(
        process.env.UNISWAP_V3_POSITIONS_NFT_ADDRESS,
        [
            "function balanceOf(address owner) external view returns (uint256)",
            "function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)",
            "function positions(uint256 tokenId) external view returns (uint96 nonce, address operator, address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint128 liquidity, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, uint128 tokensOwed0, uint128 tokensOwed1)"
        ],
        provider
    );

const balances = await contractAddress.balanceOf(process.env.WALLET_ADDRESS);
console.log(`Number of liquidity positions:${balances.toString()}`);

for (let i = 0; i < balances; i++) {
    const tokenId = await contractAddress.tokenOfOwnerByIndex(process.env.WALLET_ADDRESS, i);
    const position = await contractAddress.positions(tokenId);
    data.push({
        "TokenID": tokenId.toString(),
        "Liquidity":position.liquidity.toString(),
        "GrowthInside0": ethers.formatUnits(position.feeGrowthInside0LastX128),
        "GrowthInside1": ethers.formatUnits(position.feeGrowthInside1LastX128),
        "Token0":ethers.formatUnits(position.tokensOwed0, 18),
        "Token1":ethers.formatUnits(position.tokensOwed1, 18),
    });
}
if(data != null)
res.status(200).json(data)
else
res.status(404);

console.log("Process Completed");

});


app.listen(port, ()=>
{
    console.log(`Server is listening on at http://localhost:${port}`);
});