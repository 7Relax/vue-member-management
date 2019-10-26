<template>
    <div class="navbar">
        <!-- 
            default-active="0" 为默认选中的菜单 
            :router = true true表示开启路由模式，index值就代码路由地址
        -->
        <el-menu
            :router = true
            default-active="/"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
            <el-menu-item index="/">
                <i class="el-icon-s-home"></i>
                <span slot="title">首页</span>
            </el-menu-item>
            <el-menu-item index="/member/">
                <i class="el-icon-user-solid"></i>
                <span slot="title">会员管理</span>
            </el-menu-item>
            <el-menu-item index="/supplier/">
                <i class="el-icon-s-cooperation"></i>
                <span slot="title">供应商管理</span>
            </el-menu-item>
            <el-menu-item index="/goods/">
                <i class="el-icon-s-goods"></i>
                <span slot="title">商品管理</span>
            </el-menu-item>
            <el-menu-item index="/staff/">
                <i class="el-icon-user"></i>
                <span slot="title">员工管理</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
  export default {
    methods: {

    }
  }
</script>

<style scoped>
    .el-menu {
        border-right: none;
    }
</style>