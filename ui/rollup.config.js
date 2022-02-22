import { babel } from "@rollup/plugin-babel";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import { uglify } from "rollup-plugin-uglify";

export default {
  input: "ui/client.js",
  output: {
    file: "lib/client.js",
    format: "cjs",
  },
  plugins: [
    resolve({
      browser: true,
    }),
    commonjs(),
    babel({
      include: ["**.js", "node_modules/**"],
      babelHelpers: "bundled",
    }),
    uglify(),
  ],
};
