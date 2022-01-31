import eslint from '@rollup/plugin-eslint'
import replace from '@rollup/plugin-replace'

const isDebug = process.env.DEBUG
const suffix = isDebug ? 'Debug' : 'Joiner'

export default {
  input: `src/${process.env.FILE}.js`,
  output: {
    file: `dist/${process.env.FILE}-${suffix}.js`,
    format: 'es'
  },
  plugins: [
    eslint({
      fix: true
    }),
    replace({
      preventAssignment: true,
      values: {
        'Testing': isDebug ? 'Testing' : 'Running'
      }
    })
  ]
}
