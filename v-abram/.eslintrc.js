module.exports = {
  env: {
    es6: true,
    browser: true,
  },
  extends: [
    'react-tools',
    'eslint:recommended',
    'plugin:security/recommended',
  ],
  plugins: [
    'security',
  ],
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  rules: {
    'linebreak-style': [
      'error',
      process.env.NODE_ENV === 'prod' ? 'unix' : 'windows',
    ],
    quotes: [
      'error',
      'single',
    ],
    'no-unused-vars': [
      'off',
    ],
    'no-var': [
      'off',
    ],
    'one-var': [
      'off',
    ],
    'brace-style': [
      'error',
      'stroustrup',
    ],
    'no-unused-vars': [
      'warn',
    ],
  },
};
