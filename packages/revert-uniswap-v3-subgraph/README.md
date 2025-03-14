# Uniswap V3 Subgraph
This is a minimal version of the official Uniswap v3 subgraph optimized for quick indexing and with some bugfixes applied which are incorrect in the official version.

## Branches
Each branch contains the version for the corresponding chain.

- main Ethereum
- polygon Matic
- optimism Optimism
- arbitrum Arbitrum
- bnb-full Binance Chain - Full
- base-full Base - Full

## Deployed Subgraphs

https://thegraph.com/legacy-explorer/subgraph/revert-finance/uniswap-v3-mainnet (mainnet)
https://thegraph.com/legacy-explorer/subgraph/revert-finance/uniswap-v3-polygon (matic)
https://thegraph.com/legacy-explorer/subgraph/revert-finance/uniswap-v3-optimism (optimism)
https://thegraph.com/legacy-explorer/subgraph/revert-finance/uniswap-v3-arbitrum (arbitrum)
https://thegraph.com/legacy-explorer/subgraph/revert-finance/uniswap-v3-bnb (bnb - full subgraph)
https://thegraph.com/legacy-explorer/subgraph/revert-finance/uniswap-v3-base (base - full subgraph)



## Dev

- Install Dependencies:
  `yarn`

> network-slugs can be found here
> https://thegraph.com/docs/en/supported-networks/

- Add Network:
  `npm run add-network <network-slug>`
  eg: npm run add-network mainnet

- Build:
  `npm run prepare-build <network-slug>`

> Create a subgraph on the graph studio
> https://thegraph.com/studio/

> Make sure your deploy key is set, can be found on your studio dashboard
> `graph auth --studio <deploy-key>`

- Deploy Studio:
  `npm run deploy-studio <network-slug> <subgraph-slug> <version>

  npm run deploy-studio mainnet revert-subgraph-test 1.0.1


  yarn run deploy-studio mainnet revert-subgraph-test 1.0.1