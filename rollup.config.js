import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import closure from 'rollup-plugin-closure-compiler-js'

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'build/index.js',
      format: 'umd',
      name: 'redda',
      sourcemap: true,
      extend: false
    }
  ],
  watch: {
    chokidar: true,
    exclude: ['node_modules/**']
  },
  plugins: [
    babel({
      presets: false,
      plugins: ['external-helpers', 'transform-object-rest-spread'],
      babelrc: false
    }),
    resolve(),
    commonjs()
    // closure(),
  ]
}
