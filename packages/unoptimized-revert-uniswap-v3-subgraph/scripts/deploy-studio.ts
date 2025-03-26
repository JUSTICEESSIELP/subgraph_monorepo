import { deployStudio } from "./common";

async function main() {
  const network = process.argv[2];
  if (!network) {
    console.error("no network parameter passed");
    process.exit(-1);
  }
  const slug = process.argv[3];
  if (!slug) {
    console.error("no slug parameter passed");
    process.exit(-1);
  }
  const version = process.argv[4];
  if (!version) {
    console.error("no version parameter passed");
    process.exit(-1);
  }
  await deployStudio(network, slug, version);
}

main();