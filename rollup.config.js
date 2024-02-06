import resolve from "@rollup/plugin-node-resolve";
import { babel } from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

export default {
  input: ["./src/index.js"],
  output: [
    {
      file: "dist/index.js",
      format: "esm",
      sourcemap: true,
    },
  ],
  external: [
    "react",
    "react-dom",
    "@wordpress/components",
    "@wordpress/block-editor",
    "@wordpress/core-data",
    "@wordpress/data",
    "@wordpress/html-entities",
    "@wordpress/icons",
    "@wordpress/server-side-render",
    "styled-components",
    "react-dnd",
    "react-dnd-html5-backend",
    "@tinymce/tinymce-react",
  ],
  plugins: [
    peerDepsExternal(),
    babel({
      exclude: "node_modules/**",
      presets: ["@babel/env", "@babel/preset-react"],
    }),
    resolve(),
    terser(),
  ],
};
