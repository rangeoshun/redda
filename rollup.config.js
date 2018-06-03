import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'build/index.cjs.js',
      format: 'cjs'
    },
    {
      file: 'build/index.es.js',
      format: 'es'
    }
  ],
  plugins: [
    babel({
      presets: false,
      plugins: ['external-helpers', 'transform-object-rest-spread'],
      babelrc: false
    }),
    resolve(),
    commonjs()
  ]
}
