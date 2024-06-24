const express = require("express");
const {ethers} = require("hardhat");
const cors = require('cors');
const {abi}= require("./abi.json");

const app = express();
const port =3001;

app.use(cors());
require("dotenv").config({path:__dirname+'/.env'});
app.get("/",async(req,res)=>{

    let data = [];
    const provider = new ethers.JsonRpcProvider(process.env.MAINNET_URL);
    const matic_provider = new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology/");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, matic_provider) ;
    const signer = matic_provider.getSigner();
    const contractAddress = new ethers.Contract(
        process.env.UNISWAP_V3_POSITIONS_NFT_ADDRESS,
        [
            "function balanceOf(address owner) external view returns (uint256)",
            "function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)",
            "function positions(uint256 tokenId) external view returns (uint96 nonce, address operator, address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint128 liquidity, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, uint128 tokensOwed0, uint128 tokensOwed1)"
        ],
        provider
    );

    const erc20Abi = [
        "function symbol() view returns (string)",
        "function balanceOf(address account) external view returns (uint256)",
    ];

    const stakerContract  = new ethers.Contract(
        process.env.UNISWAP_V3_STAKING_ADDRESS,
        [
            "event IncentiveCreated(address indexed rewardToken, uint256 indexed pool,uint256 startTime, uint256 endTime,address refundee, uint256 reward)",
            "function getRewardInfo(bytes32 key, uint256 tokenId) external returns (uint256 reward, uint160 secondsInsideX128)"
        ],
        provider
    );

    const incentiveIdContract = new ethers.Contract(
        "0xF2f0d05489ac12Ac69d5ee1a2C467aFA49ee31a2",
        [
            "function compute(address rewardToken, address pool, uint256 startTime, uint256 endTime, address refundee)"
        ],
        matic_provider
    );

const balances = await contractAddress.balanceOf(process.env.WALLET_ADDRESS);
console.log(`Number of liquidity positions:${balances.toString()}`);

for (let i = 0; i < balances; i++) {
    const tokenId = await contractAddress.tokenOfOwnerByIndex(process.env.WALLET_ADDRESS, i);
    const position = await contractAddress.positions(tokenId);
    const erc20Contract = new ethers.Contract(position.token0, erc20Abi, provider);
    const token0Symbol= await erc20Contract.symbol();
    const token0 = await erc20Contract.balanceOf(process.env.WALLET_ADDRESS);
    const erc20Contract1 = new ethers.Contract(position.token1, erc20Abi, provider);
    const token1Symbol = await erc20Contract1.symbol();
    const token1 = await erc20Contract1.balanceOf(process.env.WALLET_ADDRESS);

    const filters = stakerContract.filters.IncentiveCreated(null, null,null, null, null, null);
    const evnentFilters =await stakerContract.queryFilter(filters);
    let args0, args1, args2, args3, args4, args5;
    if(evnentFilters.length>0)
    {
        for (const eventFilter in evnentFilters) {
            args0= eventFilter.args[0];
            args1= eventFilter.args[1];
            args2= eventFilter.args[2];
            args3= eventFilter.args[3];
            args4= eventFilter.args[4];
        }

    }

    const incentiveId = incentiveIdContract.connect(signer).compute(args0, args1, args2, args3, args4);

    const rewardInfo = stakerContract.getRewardInfo(incentiveId, tokenId);
    data.push({
        "TokenID": tokenId.toString(),
        "Liquidity":position.liquidity.toString(),
        "Token0Symbol": token0Symbol,
        "GrowthInside0": ethers.formatUnits(position.feeGrowthInside0LastX128),
        "GrowthInside1": ethers.formatUnits(position.feeGrowthInside1LastX128), 
        "Token1Symbol": token1Symbol,
        "Token0":ethers.formatUnits(position.tokensOwed0, 18),
        "Token1":ethers.formatUnits(position.tokensOwed1, 18),
        "Token0Balance": token0,
        "Token1Balance": token1,
        "Reward": rewardInfo? rewardInfo.Reward: 0,
        "SecondsInside": rewardInfo? rewardInfo.secondsInsideX128: 0
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