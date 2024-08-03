import typescript from 'rollup-plugin-typescript2';
import * as pkg from './package.json' assert { type: "json" };

export default {
  input: 'src/index.ts', 
  output: [
    {
      file: pkg.main, // 'dist/index.js'
      format: 'cjs', 
      sourcemap: true,
      exports: 'named',
    },
    {
      file: pkg.module, // 'dist/index.mjs'
      format: 'es', 
      sourcemap: true,
    },
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      useTsconfigDeclarationDir: true, 
    }),
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}), 
    ...Object.keys(pkg.peerDependencies || {}),
  ], 
};