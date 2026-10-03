// Explicit local inputs: no remote loaders or glob-pattern dependencies.
import { readFile, writeFile } from "node:fs/promises";
import { parse } from "graphql";
import { createRequire } from "node:module";
// Use the packages' CommonJS entry points consistently (Node 22 ESM interop).
const require = createRequire(import.meta.url);
const { codegen } = require("@graphql-codegen/core");
const typescript = require("@graphql-codegen/typescript");
const operations = require("@graphql-codegen/typescript-operations");
const documentNode = require("@graphql-codegen/typed-document-node");
const output = await codegen({
  filename: "src/lib/generated.ts",
  schema: parse(await readFile("../backend/src/schema.graphql", "utf8")),
  documents: [
    {
      location: "src/lib/operations.graphql",
      document: parse(await readFile("src/lib/operations.graphql", "utf8")),
    },
  ],
  config: { enumsAsTypes: true },
  plugins: [{ typescript: {} }, { operations: {} }, { documentNode: {} }],
  pluginMap: { typescript, operations, documentNode },
});
await writeFile("src/lib/generated.ts", output);
console.log("GraphQL types and typed operations generated.");
