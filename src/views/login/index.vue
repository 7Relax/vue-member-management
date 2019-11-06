<template>
    <div class="login-container">
        <el-form ref="form" :rules="rules" :model="form" label-width="60px" class="login-form">
            <h2 class="login-title">会员管理系统</h2>
            <el-form-item label="账号" prop="username">
                <el-input v-model="form.username" type="text" style="width: 275px" clearable></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="form.password" type="password" show-password style="width: 275px"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('form')">登录</el-button>
                <el-button @click="resetForm('form')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
// 这种方式是导入默认对象
// import loginApi from '@/api/login';
// 按需导入
import { login, getUserInfo } from "@/api/login";

export default {
    data() {
        return {
            form: {
                username: "",
                password: ""
            },
            rules: {
                username: [
                    { required: true, message: "请输入用户名", trigger: "blur" },
                    { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
                ],
                password: [
                    { required: true, message: "请输入密码", trigger: "blur" },
                    { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
                ]
            }
      };
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                // valid为true：前端验证通过
                if (valid) {
                    // 提交给后台验证（验证用户名和密码）
                    console.log("submit!");
                    // 改成在这里触发actions 并提交载荷，这里的载荷是表单（通过Vuex来管理数据）
                    this.$store.dispatch('Login', this.form).then(response => {
                        console.log("login : ", response);
                        if (response.flag) {
                            // 登录成功，前往首页（因为在permission权限校验里已经实现了当未获取到用户信息时会通过token去获取，所以这里可以省略获取用户信息的操作）
                            this.$router.push("/");
                        } else {
                            this.$message({
                                type: 'warning',
                                message: response.message
                            })
                        }
                    }).catch(error => {
                        // 不做处理（因为在响应拦截器里已经做了全局异常处理了：request.interceptors.response）
                    })
                    /* login(this.form.username, this.form.password).then(response => {
                        const resp = response.data;
                        console.log(resp);
                        if (resp.flag) {
                            // 验证成功
                            getUserInfo(resp.data.token).then(response => {
                                // 获取到了用户信息
                                const respUser = response.data;
                                if (respUser.flag) {
                                    console.log("respUser : ", respUser);
                                    // 保存token及用户信息
                                    localStorage.setItem("mxg-msm-user", JSON.stringify(respUser.data));
                                    localStorage.setItem("mxg-msm-token", resp.data.token);
                                    // 前往首页
                                    this.$router.push("/");
                                } else {
                                    // 获取用户信息失败
                                    this.$message({
                                        message: respUser.message,
                                        type: "warning"
                                    });
                                }
                            });
                        } else {
                            // 验证失败
                            this.$message({
                              message: resp.message,
                              type: "warning"
                            });
                        }
                    }); */
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
};
</script>

<style scoped>
    .login-form {
        width: 350px;
        margin: 160px auto;
        background-color: rgb(255, 255, 255, 0.75);
        padding: 28px;
        border-radius: 20px;
    }
    .login-container {
        position: absolute;
        width: 100%;
        height: 100%;
        background: url("../../assets/login.jpg");
    }
    .login-title {
        color: #303133;
        text-align: center;
    }
</style>