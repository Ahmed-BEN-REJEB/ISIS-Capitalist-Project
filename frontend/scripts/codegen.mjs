// Explicit local inputs: no remote loaders or glob-pattern dependencies.
import { readFile, writeFile } from "node:fs/promises";
import { parse } from "graphql";
import { createRequire } from "node:module";
// Use the packages' CommonJS entry points consistently (Node 22 ESM interop).
const require = createRequire(import.meta.url);
const { codegen } = require("@graphql-codegen/core");
const typescript = require("@graphql-codegen/typescript");
const operations = require("@graphql-codegen/typescript-operations");
const orbit = require("@apollo-orbit/codegen");
const output = await codegen({
  filename: "src/app/graphql/operations.ts",
  schema: parse(await readFile("../backend/src/schema.graphql", "utf8")),
  documents: [
    {
      location: "src/app/graphql/queries.graphql",
      document: parse(
        await readFile("src/app/graphql/queries.graphql", "utf8"),
      ),
    },
  ],
  config: { enumsAsTypes: true, gqlFunction: false, useTypeImports: true },
  plugins: [{ typescript: {} }, { operations: {} }, { orbit: {} }],
  pluginMap: { typescript, operations, orbit },
});
await writeFile("src/app/graphql/operations.ts", output);
console.log("GraphQL types and typed operations generated.");
