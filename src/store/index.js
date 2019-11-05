import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'

// 引入Vuex插件
Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        user
    }
})

export default store