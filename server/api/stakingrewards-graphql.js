require("dotenv").config({path:__dirname+'/.env'});
const axios = require('axios');

// Define the GraphQL query
const getLiquidityPositionsQuery = (walletAddress) => `
{
  positions(where: {owner:"${walletAddress}"}) {
{
  {
    id
    liquidity
    pool {
      id
      token0 {
        symbol
        
      }
      token1 {
        symbol
      }
      feeTier
    }
  }
}
`;

// Fetch liquidity positions and rewards
async function fetchStakingRewards(walletAddress) {
    try {
        const response = await axios.get(
            process.env.UNISWAP_V3_SUBGRAPH_URL,
            {
                query: getLiquidityPositionsQuery(walletAddress)
            }
        );

        const positions = response.data.data.liquidityPositions;
        
        if (positions.length === 0) {
            console.log(`No liquidity positions found for wallet address: ${walletAddress}`);
            return;
        }

        console.log(`Liquidity Positions for wallet address: ${walletAddress}`);

        positions.forEach((position, index) => {
            console.log(`Position ${index + 1}:`);
            console.log(`  Pool ID: ${position.pool.id}`);
            console.log(`  Token0: ${position.pool.token0.symbol}`);
            console.log(`  Token1: ${position.pool.token1.symbol}`);
            console.log(`  Fee Tier: ${position.pool.feeTier}`);
            console.log(`  Liquidity Token Balance: ${position.liquidityTokenBalance}`);
        });

    } catch (error) {
        console.error('Error fetching liquidity positions:', error);
    }
}

fetchStakingRewards(process.env.WALLET_ADDRESS);
