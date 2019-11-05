<template>
    <div>
        <!-- 搜索框（行内表单）-->
        <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top: 20px">
            <!-- Element的方法：重置需要看 el-form-item 元素上是否指定了prop属性（且需要与v-model中对象的属性一一对应），未指定是不能重置的 -->
            <el-form-item prop="username">
                <el-input v-model="searchMap.username" placeholder="账号" style="width: 230px;"></el-input>
            </el-form-item>
            <el-form-item prop="name">
                <el-input v-model="searchMap.name" placeholder="姓名" style="width: 230px;"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="fetchData">查询</el-button>
                <el-button type="primary" @click="handleAdd">新增</el-button>
                <!-- <el-button @click="resetForm('searchForm')">重置</el-button> -->
                <el-button @click="$refs['searchForm'].resetFields()">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 表格 -->
        <el-table :data="list" height="565" border style="width: 100%">
            <!-- type="index"获取索引值，从1开始  -->
            <el-table-column type="index" label="序号" width="80"></el-table-column>
            <el-table-column prop="username" label="账号" width="160"></el-table-column>
            <el-table-column prop="name" label="姓名" width="120"></el-table-column>
            <el-table-column prop="age" label="年龄" width="80"></el-table-column>
            <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
            <el-table-column prop="salary" label="薪酬" width="150"></el-table-column>
            <el-table-column prop="entryDate" label="入职时间" width="180"></el-table-column>
            <el-table-column label="操作" width="220">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            style="margin-top:18px">
        </el-pagination>
        <!-- 弹出新增员工（默认隐藏）-->
        <el-dialog :title="popupTitle" :visible.sync="dialogFormVisible" width="500px">
            <el-form
                :rules="rules"
                ref="pojoForm"
                label-width="100px"
                label-position="right"
                :model="pojo"
                style="width:400px;">
                <el-form-item label="账号" prop="username">
                    <el-input v-model="pojo.username" autocomplete="off" width="50"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="pojo.name" autocomplete="off" width="50"></el-input>
                </el-form-item>
                <el-form-item label="年龄" prop="age">
                    <el-input v-model="pojo.age" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="pojo.mobile" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="薪酬" prop="salary">
                    <el-input v-model="pojo.salary" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="入职时间" prop="entryDate">
                    <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="pojo.entryDate"
                        type="date"
                        placeholder="会员生日">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible=false">取 消</el-button>
                <!-- <el-button type="primary" @click="addData('pojoForm')">确 定</el-button> -->
                <el-button type="primary" @click="pojo.id === null ? addData('pojoForm') : updateData('pojoForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import staffApi from '@/api/staff'
export default {
    data() {
        return {
            list: [],
            currentPage: 1,
            pageSize: 10,
            total: 0,
            searchMap: {
                username: '',
                name: ''
            },
            dialogFormVisible: false,
            popupTitle: '',
            pojo: {
                id: null,
                username: '',
                name: '',
                age: '',
                mobile: '',
                salary: '',
                entryDate: ''
            },
            rules: {
                // 校验规则                
                username: [{ required: true, message: "账号不能为空", trigger: "blur" }],
                name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
            }
        }
    },
    created() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            staffApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
                const resp = response.data;
                if (resp.flag) {
                    // 查询成功
                    this.list = resp.data.rows;
                    this.total = resp.data.total;
                }
            })
        },
        handleAdd(flag) {
            // 弹出框动态title
            if (flag == "edit") {
                this.popupTitle = "编辑员工";
            } else {
                this.popupTitle = "新增员工";
            }
            // 显示新增商品对话框
            this.dialogFormVisible = true;
            // 重置表单
            this.$nextTick(() => {
                this.$refs["pojoForm"].resetFields();
            });
        },
        // 当改变当前页码的时候触发
        handleCurrentChange(val) {
            console.log("当前页码：",val);
            this.currentPage = val;
            this.fetchData();
        },
        // 当改变每页条数的时候触发
        handleSizeChange(val) {
            console.log("每页条数：",val);
            this.pageSize = val;
            this.fetchData();
        },
        addData(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    staffApi.add(this.pojo).then(response => {
                        const resp = response.data;
                        this.$message({
                            type: resp.flag ? "success" : "error",
                            message: resp.message
                        });
                        if (resp.flag) {
                            // 新增成功
                            this.fetchData();
                            this.dialogFormVisible = false;
                        }
                    })
                }
            })
        },
        handleEdit(id) {
            this.handleAdd("edit");
            staffApi.getById(id).then(response => {
                const resp = response.data;
                if (resp.flag) {
                    // 成功查询员工信息
                    this.pojo = resp.data;
                } else {
                    // 查询失败
                    this.$message({
                        type: "error",
                        message: resp.message
                    });
                }
            })
        },
        updateData(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    staffApi.update(this.pojo).then(response => {
                        const resp = response.data;
                        this.$message({
                            type: resp.flag ? 'success' : 'error',
                            message: resp.message
                        });
                        if (resp.flag) {
                            this.fetchData();
                            this.dialogFormVisible = false;
                        }
                    })
                }
            })
        },
        handleDelete(id) {
            this.$confirm('删除该员工, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                staffApi.deleteById(id).then(response => {
                    const resp = response.data;
                    this.$message({
                        type: resp.flag ? 'success' : 'error',
                        message: resp.message
                    });
                    // 成功才刷新列表数据
                    if (resp.flag) {
                        this.fetchData();
                    }
                })
            }).catch(() => {
                // 取消删除
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        }
    },
}
</script>