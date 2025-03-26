# Uniswap V3 Subgraph

This is a minimal version of the official Uniswap V3 subgraph optimized for quick indexing with some bug fixes applied. It aims to improve indexing speed and accuracy over the official version.

## Branches
Each branch contains the version for the corresponding chain:

- `main` - Ethereum
- `polygon` - Matic
- `optimism` - Optimism
- `arbitrum` - Arbitrum
- `bnb-full` - Binance Chain (Full Subgraph)
- `base-full` - Base (Full Subgraph)

## Deployed Subgraphs
You can explore the deployed subgraphs here:

- [Mainnet](https://thegraph.com/legacy-explorer/subgraph/revert-finance/uniswap-v3-mainnet)
- [Polygon](https://thegraph.com/legacy-explorer/subgraph/revert-finance/uniswap-v3-polygon)
- [Optimism](https://thegraph.com/legacy-explorer/subgraph/revert-finance/uniswap-v3-optimism)
- [Arbitrum](https://thegraph.com/legacy-explorer/subgraph/revert-finance/uniswap-v3-arbitrum)
- [Binance Chain (Full)](https://thegraph.com/legacy-explorer/subgraph/revert-finance/uniswap-v3-bnb)
- [Base (Full)](https://thegraph.com/legacy-explorer/subgraph/revert-finance/uniswap-v3-base)

## Setup & Development

### 1. Install Dependencies
```sh
yarn
```

### 2. Add Network
To add support for a specific network, run:
```sh
npm run add-network <network-slug>
```
Example:
```sh
npm run add-network mainnet
```
Network slugs can be found in The Graph's [supported networks documentation](https://thegraph.com/docs/en/supported-networks/).

### 3. Build the Subgraph
Before deploying, build the subgraph with:
```sh
npm run prepare-build <network-slug>
```
Example:
```sh
npm run prepare-build mainnet
```

### 4. Deploy the Subgraph
#### a. Authenticate with The Graph
Ensure your deploy key is set. You can find it in your Graph Studio dashboard.
```sh
graph auth <deploy-key>
```

#### b. Deploy to The Graph Studio
```sh
npm run deploy-studio <network-slug> <subgraph-slug> <version>
```
Example:
```sh
npm run deploy-studio mainnet revert-subgraph-test-optimized 1.0.1
```

Alternatively, using Yarn:
```sh
yarn run deploy-studio mainnet revert-subgraph-test-optimized 1.0.1
```

## Adding Required Scripts to `package.json`
To ensure everything works smoothly, add the following scripts to your `package.json`:

```json
"scripts": {
  "add-network": "cross-env ts-node ./scripts/add-network",
  "prepare-build": "cross-env ts-node ./scripts/build",
  "deploy-studio": "cross-env ts-node ./scripts/deploy-studio"
}
```

These scripts handle network addition, subgraph building, and deployment to The Graph Studio.

## Resources
- [The Graph Documentation](https://thegraph.com/docs/en/)
- [Uniswap V3 Subgraph](https://github.com/Uniswap/v3-subgraph)

