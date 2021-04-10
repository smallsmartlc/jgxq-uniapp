import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
import * as utils from '@/utils/common'
import moment from 'moment'


Vue.prototype.$utils = utils;
Vue.prototype.$moment = moment;
Vue.use(uView);
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
