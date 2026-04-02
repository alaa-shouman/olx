module.exports = {
  root: true,
  extends: '@react-native',
    rules: {
    'react-refresh/only-export-components': [
      'off',
      { allowConstantExport: true },
    ],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    "https://typescript-eslint.io/rules/no-explicit-any": 'off',
    '@typescript-eslint/no-explicit-any': 'off',},
    'no-inline-styles': 'off',
};
