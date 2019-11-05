<template>
    <div class="header">
        <a href="#/">
            <img class="logo" src="@/assets/logo.png">
            <span class="company">会员管理系统</span>
        </a>
        <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
                {{user.name}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-edit" command="a">修改密码</el-dropdown-item>
                <el-dropdown-item icon="el-icon-right" command="b">退出系统</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <!-- 改密对话框 -->
        <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="390px">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" style="width: 300px">
                <el-form-item label="原密码" prop="oldPwd">
                    <el-input type="password" v-model="ruleForm.oldPwd" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPwd">
                    <el-input type="password" v-model="ruleForm.newPwd" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPwd">
                    <el-input type="password" v-model="ruleForm.checkPwd" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                    <el-button @click="$refs['ruleForm'].resetFields()">重置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
    
</template>

<script>
// 导出非成员方法，按需导入即可
import {logout} from '@/api/login'
// 引入密码api
import passwordApi from '@/api/password'
export default {
    data() {
        // 校验原密码是否正确
        const validateOldPwd = (rule, value, callback) => {
            passwordApi.checkPwd(this.user.id, value).then(response => {
                const resp = response.data;
                if (resp.flag) {
                    // 密码验证通过（饿了么提供的）
                    callback();
                } else {
                    callback(new Error(resp.message));
                }
            })
        };
        // 校验确认密码是否一致（确认密码与新密码）
        const validateCheckPwd = (rule, value, callback) => {
            if (value !== this.ruleForm.newPwd) {
                // 校验不通过
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        // 在return上面申明自定义校验器，这个校验器就相当于是一个对象中的语句，所以不能用逗号分隔
        return {
            // user: JSON.parse(localStorage.getItem("mxg-msm-user")),
            user: this.$store.state.user.user,
            ruleForm: {
                oldPwd: '',
                newPwd: '',
                checkPwd: ''
            },
            rules: {
                oldPwd: [
                    { required: true, message: "原密码不能为空", trigger: "blur" },
                    { validator: validateOldPwd, trigger: 'blur' }
                ],
                newPwd: [
                    { required: true, message: "新密码不能为空", trigger: "blur" }
                ],
                checkPwd: [
                    { required: true, message: "确认密码不能为空", trigger: "blur" },
                    { validator: validateCheckPwd, trigger: 'change' }
                ]
            },
            dialogFormVisible: false,
        }
    },
    methods: {
        handleCommand(command) {
            switch (command) {
                case 'a':
                    // 打开改密对话框
                    this.handlePwd();
                    break;
                case 'b':
                    // 退出系统
                    this.handleLogout();
                    break;
                default:
                    break;
            }
        },
        // 退出系统
        handleLogout() {
            this.$store.dispatch('Logout').then(response => {
                if (response.flag) {
                    // 退出成功
                    // 回到登录页面
                    this.$router.push("/login");
                } else {
                    this.$message({
                        message: resp.message,
                        type: 'warning',
                        duration: 2000
                    });
                }
            }).catch(error => {
            })

            // const token = localStorage.getItem('mxg-msm-token');
            // logout(token).then(response => {
            //     const resp = response.data;
            //     if (resp.flag) {
            //         // 退出成功，清除本地数据
            //         localStorage.removeItem('mxg-msm-token');
            //         localStorage.removeItem('mxg-msm-user');
            //         // 回到登录页面
            //         this.$router.push("/login");
            //     } else {
            //         this.$message({
            //             message: resp.message,
            //             type: 'warning',
            //             duration: 2000
            //         });
            //     }
            // })
        },
        // 打开改密对话框
        handlePwd() {
            this.dialogFormVisible = true;
            // 清除表单（当对话框打开后再清除）
            this.$nextTick( () => {
                this.$refs['ruleForm'].resetFields();
            })
        },
        // 提交改密
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    // 校验通过，可以提交
                    passwordApi.updatePwd(this.user.id, this.ruleForm.newPwd).then(response => {
                        const resp = response.data;
                        this.$message({
                            message: resp.message,
                            type: resp.flag ? 'success' : 'error',
                            duration: 2000
                        });
                        if (resp.flag) {
                            // 改密成功，退出系统回到登录页
                            this.handleLogout();
                            // 关闭改密对话框
                            // dialogFormVisible = false;
                        }
                    })
                }
            })
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