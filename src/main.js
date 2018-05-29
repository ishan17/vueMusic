import 'babel-polyfill'
import Vue from 'vue'
import App from './App'

import router from './router'

import fastclick from 'fastclick'

import 'common/stylus/index.styl'

fastclick.attach(document.body)

// Vue.config.productionTip = false

/* eslint-disable no-new */   // 禁止在使用new构造一个实例后不赋值
new Vue({
  el: '#app',
  render: h => h(App),
	router
})
