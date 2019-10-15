module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: ['eslint:recommended'],
  // plugins: [ 'security' ],
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  rules: {
    'no-console': 'off',
    quotes: ['error', 'single'],
    'brace-style': ['error', 'stroustrup'],
    'no-unused-vars': ['warn']
  }
};
