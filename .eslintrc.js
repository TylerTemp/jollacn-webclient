module.exports = {
  parser: 'babel-eslint',
  extends: 'airbnb',
  rules: {
    'react/prefer-stateless-function': 'off',
  },
  // "settings": {
  //   'import/resolver': {
  //     'alias': [
  //       ['~', './src']
  //      ]
  //    }
  // }
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['~', './src'],
        ],
        extensions: ['.ts', '.js', '.jsx', '.json'],
      },
    },
  },
  env: {
    browser: true,
  },
};
