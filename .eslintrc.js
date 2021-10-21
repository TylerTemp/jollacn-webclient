module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'no-console': 'off',
    'react/prop-types': 'off',
    'jsx-a11y/media-has-caption': 'off',
    'jsx-a11y/alt-text': 'off',
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['~', 'src'],
        ],
        extensions: ['.ts', '.js', '.jsx', '.json'],
      },
    },
  },
};
