# 代码规则

![](https://www.npmjs.com/package/eslint-config-airbnb-base-extend)
## 普通代码规则

```javascript
```

## vue 项目代码规则

```javascript
// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true
  },
  // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
  // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
  extends: ['plugin:vue/essential', 'airbnb-base'],
  plugins: ['vue'],
  settings: {
    'import/resolver': {
      webpack: {
        config: 'build/webpack.base.conf.js'
      }
    }
  },
  // add your custom rules here
  rules: {
    semi: ['error', 'never'],
    'no-shadow': ['error', { hoist: 'functions', allow: ['state'] }],
    'comma-dangle': ['error', 'never'],
    'arrow-parens': ['error', 'always'], // 箭头函数总是需要括号
    // don't require .vue extension when importing
    'import/extensions': [
      'error',
      'always',
      {
        js: 'never',
        vue: 'never'
      }
    ],
    // disallow reassignment of function parameters
    // disallow parameter object manipulation except for specific exclusions
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: [
          'state', // for vuex state
          'acc', // for reduce accumulators
          'e' // for e.returnvalue
        ]
      }
    ],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': [
      'error',
      {
        optionalDependencies: ['test/unit/index.js']
      }
    ],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
```

## react 项目代码规则

### 使用方法

```bash
$ touch .eslintrc
$ touch .eslintignore
```

输入下面代码:

.eslintrc

```json
{
  "parser": "babel-eslint",
  "env": {
    "browser": true,
    "node": true,
    "es6": true,
    "mocha": true,
    "jest": true,
    "jasmine": true
  },
  "extends": ["airbnb-base-extend/eslint-config-react"],
  "rules": {
    "semi": ["error", "never"],
    "comma-dangle": ["error", "never"]
  }
}
```

.eslintignore

```
node_modules
.DS_Store
```

