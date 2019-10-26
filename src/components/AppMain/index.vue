<template>
    <div class="main">
        <app-link v-show="$route.path != '/home'"></app-link>
        <!-- 
            这个主区域做为路由跳转后（导航栏点击）的组件渲染出口；
            这个主区域又是Layout的子组件；
            导航栏上哪个功能点击后，路由跳转就是哪个功能的children，最终要渲染到此主区域（AppMain）;
        -->
        <router-view></router-view>
    </div>
</template>

<script>
import AppLink from './Link.vue'
export default {
    components: {
        AppLink
    }
}
</script>