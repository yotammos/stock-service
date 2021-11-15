import typescript from "rollup-plugin-typescript2";
import json from "@rollup/plugin-json";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
  input: "./src/app.ts",
  output: {
    dir: "dist",
    format: "cjs",
  },
  plugins: [
    typescript({ tsconfig: "./tsconfig.json" }),
    nodeResolve(),
    commonjs({ ignoreDynamicRequires: true }),
    json(),
  ],
};
