<template>
    <!-- 可以将v-show="$route.path != '/home'"抽取到 <app-link/> 中去判断，这样效果会高一点 -->
    <!-- <el-breadcrumb separator="/" v-show="$route.path != '/home'"> -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item class="line" :to="{ path: $route.path }">{{$route.meta.title}}</el-breadcrumb-item>
        <!-- <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
        <el-breadcrumb-item>活动列表</el-breadcrumb-item>
        <el-breadcrumb-item>活动详情</el-breadcrumb-item> -->
    </el-breadcrumb>
</template>

<style scoped>
    .el-breadcrumb {
        height: 10px;
        padding: 20px;
        border-radius: 4px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }
    .line {
        border-left: 3px solid #31c17b;
        padding-left: 10px;
    }
</style>