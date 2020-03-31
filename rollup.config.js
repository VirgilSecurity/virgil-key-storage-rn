const path = require('path');

const license = require('rollup-plugin-license');
const typescript = require('rollup-plugin-typescript2');

const packageJson = require('./package.json');

const FORMAT = {
  CJS: 'cjs',
  ES: 'es',
};

const createEntry = (format) => ({
  external: Object.keys(packageJson.peerDependencies),
  input: path.join(__dirname, 'src', 'index.ts'),
  output: {
    format,
    file: path.join(__dirname, 'dist', `key-storage-rn.${format}.js`),
  },
  plugins: [
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        compilerOptions: {
          declarationDir: './dist/types',
        },
        exclude: ['**/dist/**/*', '**/__tests__/**/*'],
      },
    }),
    license({
      banner: {
        content: {
          file: path.join(__dirname, 'LICENSE'),
        },
      },
    }),
  ],
});

module.exports = [createEntry(FORMAT.CJS), createEntry(FORMAT.ES)];
