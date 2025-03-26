const util = require("util");
const exec = util.promisify(require("child_process").exec);
import 'dotenv/config'
import * as fs from 'fs';


const GRAFTING_SUBGRAPH_ID=process.env.GRAFTING_SUBGRAPH_ID!;
const GRAFTING_START_BLOCK=process.env.GRAFTING_START_BLOCK!;
const FACTORY_STARTBLOCK=process.env.FACTORY_STARTBLOCK!;
const FACTORY_CONTRACT_ADDRESS=process.env.FACTORY_CONTRACT_ADDRESS!;
const NONFUNGIBLEPOSITIONMANAGER_STARTBLOCK=process.env.NONFUNGIBLEPOSITIONMANAGER_STARTBLOCK!;
const NONFUNGIBLEPOSITIONMANAGER_CONTRACT=process.env.NONFUNGIBLEPOSITIONMANAGER_CONTRACT!;
const SUBGRAPH_STUDIO_DEPLOY_KEY = process.env.SUBGRAPH_STUDIO_DEPLOY_KEY!



const executeCommand = async (command) => {
  try {
    const { stdout, stderr } = await exec(command);
    if (stderr) {
      console.log(`stderr: ${stderr}`);
    }
    console.log("stdout:", stdout);
  } catch (e) {
    // should contain code (exit code) and signal (that caused the termination).
    console.error(`exec error: ${e}`);
  }
};

const graphCodegen = async () => {
  console.log("\n Running codegen...");
  await executeCommand("graph codegen --output-dir src/types/");
};

const graphBuild = async () => {
  await executeCommand("graph build");
};

const graphAuth = async () => {
  console.log(`>> ${SUBGRAPH_STUDIO_DEPLOY_KEY}`);
  if (!SUBGRAPH_STUDIO_DEPLOY_KEY) {
    throw new Error(
      `
        Missing access token in SUBGRAPH_STUDIO_DEPLOY_KEY env.
        You can get a token from https://thegraph.com/studio/
        `,
    );
  }

  await executeCommand(
    `graph auth ${SUBGRAPH_STUDIO_DEPLOY_KEY}`,
  );
};

const graphDeployStudio = async (slug, version) => {
  graphAuth();
  
  await executeCommand(`graph deploy ${slug} -l=${version}`);
};

export const addNetwork = async (network:string) => {
  await executeCommand(
    `cross-env mkdir -p protocols/deployments/uniswap-v3-subgraph-${network}`,
  );
  await executeCommand(
    `cross-env touch protocols/deployments/uniswap-v3-subgraph-${network}/configurations.json`,
  );

  const config = {
    graftEnabled: true,
    subgraphId: GRAFTING_SUBGRAPH_ID,
    graftStartBlock: parseInt(GRAFTING_START_BLOCK),
    network: network,
    factory_startBlock: parseInt(FACTORY_STARTBLOCK),
    factory_contract_address: FACTORY_CONTRACT_ADDRESS,
    nfpm_startBlock: parseInt(NONFUNGIBLEPOSITIONMANAGER_STARTBLOCK),
    nfpm_contract_address: NONFUNGIBLEPOSITIONMANAGER_CONTRACT
  };

  const filePath = `protocols/deployments/uniswap-v3-subgraph-${network}/configurations.json`;

  fs.mkdirSync(`protocols/deployments/uniswap-v3-subgraph-${network}`, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(config));

  console.log(`Created configuration files for ${network}`);
};

export const build = async (network:string) => {
  console.log(`Building subgraph for ${network}`);
  console.log(`\n Copying constants & templates for ${network} \n`);
  console.log(`\n Generating manifest for ${network} \n`);
  await executeCommand(
    `cross-env mustache protocols/deployments/uniswap-v3-subgraph-${network}/configurations.json subgraph.template.yaml > subgraph.yaml`,
  );
  await graphCodegen();
  await graphBuild();
};

export const deployStudio = async (network, slug, version) => {
  // build(network);
  // console.log(`Deploying ${slug}/${version} for ${network}`);
  await graphDeployStudio(slug, version);
};