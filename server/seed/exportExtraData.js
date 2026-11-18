import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { categoriesData, demosData } from "./servicesData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDataDir = path.resolve(__dirname, "../../client/src/data");

fs.writeFileSync(path.join(clientDataDir, "categoriesData.json"), JSON.stringify(categoriesData, null, 2));
fs.writeFileSync(path.join(clientDataDir, "demosData.json"), JSON.stringify(demosData, null, 2));

console.log("Categories and Demos data exported to client/src/data/");
