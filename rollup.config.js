import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

import { babel } from "@rollup/plugin-babel";

import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import json from "@rollup/plugin-json";

const packageJson = require("./package.json");

export default [
  {
    input: "lib/index.js",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
      },
      // {
      //   file: packageJson.module,
      //   format: "esm",
      //   sourcemap: true,
      // },
    ],
    globals: {
      react: "React",
      "react-dom": "ReactDOM",
    },
    external: ["react", "react-dom"],
    plugins: [
      json(),
      resolve(),
      peerDepsExternal(),
      babel({
        exclude: "node_modules/**",
        presets: ["@babel/env", "@babel/preset-react"],
      }),
      commonjs(),
      terser(),
    ],
    external: ["react"],
  },
];
