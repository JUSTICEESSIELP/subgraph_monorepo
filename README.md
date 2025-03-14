# Subgraph Monorepo Setup Guide

This guide will walk you through setting up a monorepo for managing multiple subgraphs using Yarn, Lerna, and Prettier. Note: use Node.js version >=20.18.1

You can start clone this repo , yarn install and start from Step 7 to setup  or follow this to start from scratch

## Step 1: Initialize the Monorepo

### Initialize the Project:
```bash
yarn init -y
```

### Install Lerna:
```bash
yarn add lerna --dev
```

### Initialize Lerna:
```bash
yarn dlx lerna init
```

### Update `package.json`:
Replace the content of `package.json` with the following:

```json
{
  "name": "subgraphs",
  "packageManager": "yarn@3.1.0",
  "version": "1.0.0",
  "private": true,
  "description": "Monorepo for Revert Finance related subgraphs",
  "homepage": "https://revert.finance/",
  "license": "AGPL-3.0-or-later",
  "repository": {
    "type": "git",
    "url": "https://github.com/revert-finance/uniswap-v3-subgraph/tree/7bd26246c0c4c24615591097ff7e5beff7d5439d"
  },
  "scripts": {
    "lint": "prettier ./**",
    "lint-fix": "prettier ./** --write"
  },
  "workspaces": [
    "packages/*"
  ],
  "dependencies": {},
  "devDependencies": {
    "lerna": "^8.2.1"
  }
}
```

## Step 2: Set Up `.gitignore`
Add the following to your `.gitignore` file:

```plaintext
node_modules
build
generated
.env
```

## Step 3: Set Up Prettier

### Install Prettier:
```bash
yarn add -D prettier
```

### Create `.prettierrc.json`:
```bash
touch .prettierrc.json
```

### Add the following content to `.prettierrc.json`:
```json
{
  "printWidth": 120,
  "bracketSpacing": true,
  "explicitTypes": "preserve",
  "tabWidth": 2
}
```

### Create `.prettierignore`:
```bash
touch .prettierignore
```

### Add the following content to `.prettierignore`:
```plaintext
yarn.lock
*.yaml
```

## Step 4: Set Up the Makefile
Create a `Makefile` in the root of your monorepo to automate the setup of new subgraph packages:

```Makefile
# Makefile for setting up a new subgraph package

# Define the root directory
ROOT_DIR := $(shell pwd)

# Define the target subgraph package directory
SUBGRAPH_DIR := $(ROOT_DIR)/packages/$(subgraph)

# Copy template files and scripts directory
setup-subgraph:
	@if [ -z "$(subgraph)" ]; then \
		echo "Error: Please specify the subgraph package name. Usage: make setup-subgraph subgraph=<subgraph-name>"; \
		exit 1; \
	fi
	@echo "Setting up subgraph package: $(subgraph)"
	@mkdir -p $(SUBGRAPH_DIR)/scripts
	@cp $(ROOT_DIR)/subgraph.template.yaml $(SUBGRAPH_DIR)/subgraph.yaml
	@cp $(ROOT_DIR)/.env.example $(SUBGRAPH_DIR)/.env
	@cp -r $(ROOT_DIR)/scripts/* $(SUBGRAPH_DIR)/scripts/
	@echo "Subgraph setup complete in $(SUBGRAPH_DIR)"
```

## Step 5: Set Up `.env.example`
Create a `.env.example` file in the root of your monorepo with the following content:

```plaintext
STAGING_NAMESPACE="my-github-username"
STAGING_KEY="staging-access-token"
PROD_KEY="production-access-token"
DEPLOY_KEY="graph-studio-deploy-key"
GRAPH_NODE="https://api.thegraph.com/deploy/"
IPFS="https://api.thegraph.com/ipfs/"
```

## Step 6: Set Up `subgraph.template.yaml`
Create a `subgraph.template.yaml` file in the root of your monorepo. This file will serve as a template for new subgraph packages.

```yaml
specVersion: 1.2.0
description: Uniswap is a decentralized protocol for automated token exchange on Ethereum.

{{#graftEnabled}}
features:
  - grafting
  - nonFatalErrors
graft:
  base: {{subgraphId}} # Subgraph ID of base subgraph
  block: {{graftStartBlock}} # Block number
{{/graftEnabled}} 
repository: https://github.com/Uniswap/uniswap-v3-subgraph
schema:
  file: ./schema.graphql
dataSources:
  - kind: ethereum/contract
    name: Factory
    network: {{network}}
    source:
      address: {{factory_contract_address}}
      abi: Factory
      startBlock: {{factory_startBlock}}
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.7
      language: wasm/assemblyscript
      file: ./src/mappings/factory.ts
      entities:
        - Pool
        - Token
      abis:
        - name: Factory
          file: ./abis/factory.json
        - name: ERC20
          file: ./abis/ERC20.json
        - name: ERC20SymbolBytes
          file: ./abis/ERC20SymbolBytes.json
        - name: ERC20NameBytes
          file: ./abis/ERC20NameBytes.json
        - name: Pool
          file: ./abis/pool.json
      eventHandlers:
        - event: PoolCreated(indexed address,indexed address,indexed uint24,int24,address)
          handler: handlePoolCreated
  - kind: ethereum/contract
    name: NonfungiblePositionManager
    network: mainnet
    source:
      address: {{nfpm_address}}
      abi: NonfungiblePositionManager
      startBlock: {{nfpm_startBlock}}
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.7
      language: wasm/assemblyscript
      file: ./src/mappings/position-manager.ts
      entities:
        - Pool
        - Token
      abis:
        - name: NonfungiblePositionManager
          file: ./abis/NonfungiblePositionManager.json
        - name: Pool
          file: ./abis/pool.json
        - name: Factory
          file: ./abis/factory.json
        - name: ERC20
          file: ./abis/ERC20.json
      eventHandlers:
        - event: IncreaseLiquidity(indexed uint256,uint128,uint256,uint256)
          handler: handleIncreaseLiquidity
          calls:
            positions: NonfungiblePositionManager[event.address].positions(event.params.tokenId)
        - event: DecreaseLiquidity(indexed uint256,uint128,uint256,uint256)
          handler: handleDecreaseLiquidity
          calls:
            positions: NonfungiblePositionManager[event.address].positions(event.params.tokenId)
        - event: Collect(indexed uint256,address,uint256,uint256)
          handler: handleCollect
          calls:
            positions: NonfungiblePositionManager[event.address].positions(event.params.tokenId)
        - event: Transfer(indexed address,indexed address,indexed uint256)
          handler: handleTransfer
          calls:
            positions: NonfungiblePositionManager[event.address].positions(event.params.tokenId)
templates:
  - kind: ethereum/contract
    name: Pool
    network: mainnet
    source:
      abi: Pool
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.7
      language: wasm/assemblyscript
      file: ./src/mappings/core.ts
      entities:
        - Pool
        - Token
      abis:
        - name: Pool
          file: ./abis/pool.json
        - name: Factory
          file: ./abis/factory.json
        - name: ERC20
          file: ./abis/ERC20.json
      eventHandlers:
        - event: Initialize(uint160,int24)
          handler: handleInitialize
        - event: Swap(indexed address,indexed address,int256,int256,uint160,uint128,int24)
          handler: handleSwap
          calls:
            feeGrowthGlobal0X128: Pool[event.address].feeGrowthGlobal0X128()
            feeGrowthGlobal1X128: Pool[event.address].feeGrowthGlobal1X128()
        - event: Mint(address,indexed address,indexed int24,indexed int24,uint128,uint256,uint256)
          handler: handleMint
          receipt: true
          calls:
            poolTickLower: Pool[event.address].ticks(event.params.tickLower)
            poolTickUpper: Pool[event.address].ticks(event.params.tickUpper)
        - event: Burn(indexed address,indexed int24,indexed int24,uint128,uint256,uint256)
          handler: handleBurn
          receipt: true
          calls:
            poolTickLower: Pool[event.address].ticks(event.params.tickLower)
            poolTickUpper: Pool[event.address].ticks(event.params.tickUpper)
        - event: Flash(indexed address,indexed address,uint256,uint256,uint256,uint256)
          handler: handleFlash
          receipt: true
          calls:
            feeGrowthGlobal0X128: Pool[event.address].feeGrowthGlobal0X128()
            feeGrowthGlobal1X128: Pool[event.address].feeGrowthGlobal1X128()


```

## Step 7 : Docker Compose file Setup
Create a `docker-compose.yaml` file in the root of your monorepo. This file will serve as a template for new subgraph packages.

```yaml
version: "3"
services:
  graph-node:
    image: graphprotocol/graph-node:v0.32.0
    ports:
      - "8000:8000"
      - "8001:8001"
      - "8020:8020"
      - "8030:8030"
      - "8040:8040"
    depends_on:
      - ipfs
      - postgres
    environment:
      postgres_host: postgres
      postgres_user: graph-node
      postgres_pass: let-me-in
      postgres_db: graph-node
      ipfs: "ipfs:5001"
      ethereum: "localhost:http://host.docker.internal:8545"
      GRAPH_LOG: info
    extra_hosts:
      - "host.docker.internal:host-gateway"
  ipfs:
    image: ipfs/go-ipfs:v0.10.0
    ports:
      - "5001:5001"
    volumes:
      - ./data/ipfs:/data/ipfs
  postgres:
    image: postgres
    ports:
      - "5432:5432"
    command:
      [
        "postgres",
        "-cshared_preload_libraries=pg_stat_statements"
      ]
    environment:
      POSTGRES_USER: graph-node
      POSTGRES_PASSWORD: let-me-in
      POSTGRES_DB: graph-node
      POSTGRES_INITDB_ARGS: "-E UTF8 --locale=C"
    volumes:
      - ./data/postgres:/var/lib/postgresql/data

```


## Step 8: Clone or init your subgraph

```
git clone https://github.com/Graph-BuildersDAO/revert-uniswap-v3-subgraph
```



## Step 9: Copy relevant files to your subgraph
To copy the `subgraph.template.yaml` + `docker-compose.yaml` + `.env` + `scripts folder`to the directory of your subgraph, run the following command:

```bash
make setup-subgraph subgraph=<subgraph-name>

eg: 
   make setup-subgraph subgraph revert-uniswap-v3-subgraph

```





