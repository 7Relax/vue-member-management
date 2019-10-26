<template>
    <div class="header">
        <a href="#/">
            <img class="logo" src="@/assets/logo.png">
            <span class="company">会员管理系统</span>
        </a>
        <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
                下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-edit" command="a">修改密码</el-dropdown-item>
                <el-dropdown-item icon="el-icon-right" command="b">退出系统</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>
// 导出非成员方法，按需导入即可
import {logout} from '@/api/login'
export default {
    methods: {
        handleCommand(command) {
            switch (command) {
                case 'a':
                    this.$message('点击修改密码');
                    break;
                case 'b':
                    const token = localStorage.getItem('mxg-msm-token');
                    logout(token).then(response => {
                        const resp = response.data;
                        if (resp.flag) {
                            // 退出成功，清除本地数据
                            localStorage.removeItem('mxg-msm-token');
                            localStorage.removeItem('mxg-msm-user');
                            // 回到登录页面
                            this.$router.push("/login");
                        } else {
                            this.$message({
                                message: resp.message,
                                type: 'warning',
                                duration: 2000
                            });
                        }
                    })
                    break;
                default:
                    break;
            }
        }
    }
}
</script>

<style scoped>
    .logo {
        width: 25px;
        vertical-align: middle;
        padding: 0 10px 0 40px;

    }
    .company {
        position: absolute;
        color: white;

    }
    .el-dropdown {
        float: right;
        margin-right: 40px;

    }
    .el-dropdown-link {
        color: white;
        cursor: pointer;
    }
</style>