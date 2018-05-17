// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    srouceType: 'module'
  },
  env: {
    browser: true,
    node: true
  },
  extends: ['airbnb-base'],
  settings: {
    flowtype: {
      onlyFilesWithFlowAnnotation: false
    }
  },
  // check if imports actually resolve
  // add your custom rules here
  globals: {
    self: true
  },
  rules: {
    semi: ['error', 'never'],
    'no-param-reassign': [0],
    'comma-dangle': ['error', 'never'],
    // disallow reassignment of function parameters
    // disallow parameter object manipulation except for specific exclusions
    'no-param-reassign': ['off'],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': [0]
  }
}
