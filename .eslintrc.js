// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential', 
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here

  /**
   * 0/off -- 关闭
   * 1/warn -- 警告
   * 2/error -- 错误
   **/
  rules: {
    // 箭头函数用小括号括起来
    'arrow-parens': 'off',
    // allow async-await  生成器函数*的前后空格
    'generator-star-spacing': 'off',
    // 禁止tab  -关闭
    "no-tabs":"off",
    // 文件以单一的换行符结束
    'eol-last': 'off',
    // allow debugger during development   禁止/***使用debugger
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'space-before-function-paren': 'off',
    // 空格缩进
    // "indent": ["error", 4],
    // tab缩进
    // "indent": ["error", "tab"],
    "indent": 'off',
    "no-unused-vars": [2, { 
      // 允许声明未使用变量
      "vars": "local",
      // 参数不检查
      "args": "none" 
    }],
    //不能用多余的空格
    "no-multi-spaces": 0,
    // 关闭语句强制分号结尾
    "semi": [0],
    //空行最多不能超过100行
    "no-multiple-empty-lines": [0, {"max": 100}],
    //关闭禁止混用tab和空格
    "no-mixed-spaces-and-tabs": [0],
    //逗号前后的空格
    "comma-spacing": 0,
    //禁止混用tab和空格
    "no-mixed-spaces-and-tabs": [2, false],
    //一行结束后面不要有空格
    "no-trailing-spaces": 0,
    //引号类型 `` "" ''
    // "quotes": [1, "single"],
    "quotes": 0,
  }
}
