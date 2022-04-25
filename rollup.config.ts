import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';
import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const packageJson = require('./package.json');

export default {
  input: 'src/index.ts',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
    },
  ],
  watch: {
    include: 'src/**',
  },
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    json(),
    typescript({ useTsconfigDeclarationDir: true }),
    postcss(),
  ],
};
