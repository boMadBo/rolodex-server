module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  root: true,
  env: {
    node: true,
  },
  rules: {
    '@typescript-eslint/quotes': ['error', 'single'],
    'object-curly-spacing': ['error', 'always'],
    'no-multi-spaces': 'error',
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
        ignoredNodes: ['PropertyDefinition'],
      },
    ],
    'comma-dangle': ['error', 'always-multiline'],
    semi: ['error', 'always'],
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          String: false,
          Boolean: false,
          Number: false,
          Symbol: false,
          '{}': false,
          Object: false,
          object: false,
          Function: false,
        },
        extendDefaults: true,
      },
    ],
    '@typescript-eslint/no-empty-function': 'off',
  },
};
