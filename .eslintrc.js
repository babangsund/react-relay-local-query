module.exports = {
  extends: ['fbjs', 'prettier'],
  plugins: ['react-hooks'],
  rules: {
    'max-len': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
  },
};
