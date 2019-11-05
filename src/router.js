import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from './views/login/index.vue'
// 默认会导入 ./views/login/index.vue 所以可以不写index.vue
import Login from './views/login'
import Layout from '@/components/Layout.vue'
import Home from '@/views/home'
import Member from '@/views/member'
import Supplier from '@/views/supplier'
import Goods from '@/views/goods'
import Staff from '@/views/staff'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',  // 路由名称
    component: Login
  },
  {
    path: '/',
    name: 'layout',
    component: Layout, // Layout里面指定了子路由的渲染出口 -> AppMain中的 <router-view></router-view>
    redirect: '/home', // 重定向到它的子路由（效果：登录成功就直接选中首页，登录成功后首先进入 / 如：this.$router.push('/') 进入/后立刻又会重定向到/home）
    children: [
      {
        path: '/home',
        component: Home,
        meta: {title: '首页'}
      },
      // { // 不采取这种将所有路由都做为 / 的子路由的形式
      //   path: '/member',
      //   component: Member
      // }
    ]
  },
  {
    path: '/member',
    component: Layout,
    children: [
      {
        path: '/', // 这种是绝对路径：path: '/member/',
        component: Member,
        meta: {title: '会员管理'}
      }
    ]
  },
  {
    path: '/supplier',
    component: Layout,
    children: [
      {
        path: '/',
        component: Supplier,
        meta: {title: '供应商管理'}
      }
    ]
  },
  {
    path: '/goods',
    component: Layout,
    children: [
      {
        path: '/',
        component: Goods,
        meta: {title: '商品管理'}
      }
    ]
  },
  {
    path: '/staff',
    component: Layout,
    children: [
      {
        path: '/',
        component: Staff,
        meta: {title: '员工管理'}
      }
    ]
  }
]

const router = new VueRouter({
  // mode: 'history', // 历史路由就没有哈希如：http://localhost:8080/about， 取消历史路由则：http://localhost:8080/#/about
  base: process.env.BASE_URL,
  routes
})

export default router
