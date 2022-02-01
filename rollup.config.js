import eslint from '@rollup/plugin-eslint'
import replace from '@rollup/plugin-replace'
import banner2 from 'rollup-plugin-banner2'

const isDebug = process.env.DEBUG
const isTheme = process.env.THEME
const suffix = isDebug ? 'Debug' : 'Joiner'

const banner = `// These must be at the very top of the file. Do not edit.
// icon-color: ${isDebug ? 'deep-gray' : isTheme ? 'purple' : 'cyan'}; icon-glyph: ${isTheme ? 'star' : 'car'};
// Variables used by Scriptable.
//
// author: 淮城一只猫<\i@iiong.com>

`

export default {
  input: isTheme ? `src/themes/${process.env.FILE}.js` : `src/${process.env.FILE}.js`,
  output: {
    file: isTheme ? `dist/${process.env.FILE}.js` : `dist/${process.env.FILE}-${suffix}.js`,
    format: 'es'
  },
  plugins: [
    replace({
      preventAssignment: true,
      values: {
        'Testing': isDebug ? 'Testing' : 'Running'
      }
    }),
    eslint({
      fix: true
    }),
    banner2(() => banner)
  ]
}
