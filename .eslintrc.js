module.exports = {
  "root": true,
  "plugins": ["vue"],
  "parserOptions": {
    "parser": "babel-eslint",
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  'extends': [
    'plugin:vue/essential',
    "eslint:recommended"
  ],
  "rules": {
    'no-console': 'off',
    // 关闭定义了，但没调用(** is defind but never used)
    "no-unused-vars": "off",
    "no-undef": 'off',
  },
}