import { ConfigManager } from "@backend/config/Config";

async function main() {
  const config = new ConfigManager("./config/configFiles/development.json");

  console.log(config);
}

main();
