module.exports = {
  "rules": {
    "no-console": 0,
    "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
  },
  "env": {
    "node" : true,
    "browser": true,
    "es6": true
  },
  "extends": "eslint:recommended"
};
