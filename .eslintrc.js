module.exports = {
  root: true,
  env: {
    commonjs: true,
    es2021: true
  },
  extends: [
    '@scriptable-ios'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    globalReturn: true,
    impliedStrict: true
  },
  rules: {
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'never']
  }
}
