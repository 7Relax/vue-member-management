<template>
    <div>
        <!-- 搜索框（行内表单）-->
        <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top: 20px">
            <!-- Element的方法：重置需要看 el-form-item 元素上是否指定了prop属性（且需要与v-model中对象的属性一一对应），未指定是不能重置的 -->
            <el-form-item prop="name">
                <el-input v-model="searchMap.name" placeholder="商品名称" style="width: 230px;"></el-input>
            </el-form-item>
            <el-form-item prop="code">
                <el-input v-model="searchMap.code" placeholder="商品编码" style="width: 230px;"></el-input>
            </el-form-item>
            <el-form-item prop="supplierName">
                <!-- 注意 el-input是组件，要在组件元素监听原生事件，需要使用 v-on:原生事件名.native="处理函数" -->
                <el-input readonly placeholder="选择供应商" style="width: 230px;" 
                    v-model="searchMap.supplierName"
                    @click.native="dialogSupplierVisible = true"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="fetchData">查询</el-button>
                <el-button type="primary" @click="handleAdd">新增</el-button>
                <!-- <el-button @click="resetForm('searchForm')">重置</el-button> -->
                <el-button @click="$refs['searchForm'].resetFields()">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 表格 -->
        <el-table :data="list" height="580" border style="width: 100%">
            <!-- type="index"获取索引值，从1开始  -->
            <el-table-column type="index" label="序号" width="80"></el-table-column>
            <el-table-column prop="name" label="商品名称" width="180"></el-table-column>
            <el-table-column prop="code" label="商品编码" width="120"></el-table-column>
            <el-table-column prop="spec" label="商品规格" width="80"></el-table-column>
            <el-table-column prop="retailPrice" label="零售价" width="90"></el-table-column>
            <el-table-column prop="purchasePrice" label="进货价" width="90"></el-table-column>
            <el-table-column prop="storageNum" label="库存数量" width="90"></el-table-column>
            <el-table-column prop="supplierName" label="供应商" width="240"></el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <!-- 供应商对话框，异步打开的，所以有sync -->
        <!-- <el-dialog title="选择供应商" :visible.sync="dialogSupplierVisible" fullscreen="true" width="500px"> -->
        <el-dialog title="选择供应商" :visible.sync="dialogSupplierVisible" width="500px">
            <!-- 绑定一个自定义事件(option-supplier)来接受子组件传来的数据 -->
            <supplier @option-supplier="optionSupplier" :isDialog="true"></supplier>
        </el-dialog>
        <!-- 弹出新增商品（默认隐藏）-->
        <el-dialog :title="popupTitle" :visible.sync="dialogFormVisible" width="500px">
            <el-form
                :rules="rules"
                ref="pojoForm"
                label-width="100px"
                label-position="right"
                :model="pojo"
                style="width:400px;">
                <el-form-item label="商品名称" prop="name">
                    <el-input v-model="pojo.name" autocomplete="off" width="50"></el-input>
                </el-form-item>
                <el-form-item label="商品编码" prop="code">
                    <el-input v-model="pojo.code" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品规格" prop="spec">
                    <el-input v-model="pojo.spec" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="零售价" prop="retailPrice">
                    <el-input v-model="pojo.retailPrice" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="进货价" prop="purchasePrice">
                    <el-input v-model="pojo.purchasePrice" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="库存数量" prop="storageNum">
                    <el-input v-model="pojo.storageNum" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="供应商" prop="supplierName">
                    <el-input v-model="pojo.supplierName" autocomplete="off" 
                        readonly @click.native="dialogOptionSupplier" placeholder="选择供应商"></el-input>
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
import goodsApi from '@/api/goods'
// 引入供应商组件，组件一般首字母大写
import Supplier from '@/views/supplier'
export default {
    components: {
        // 注册Supplier作为子组件
        Supplier
    },
    data() {
        return {
            list: [],
            currentPage: 1,
            pageSize: 10,
            total: 0,
            searchMap: {
                name: '',
                code: '',
                supplierName: ''
            },
            dialogSupplierVisible: false, // 供应商弹出框
            popupTitle: '新增商品',
            dialogFormVisible: false,     // 新增/编辑商品弹出框
            isEdit: false,                // 判断是否是从 新增/编辑对话框中打开的 供应商对话框，true为是 
            pojo: {
                id: null,
                name: '',
                code: '',
                spec: '',
                retailPrice: '',
                purchasePrice: '',
                storageNum: '',
                supplierName: ''
            },
            rules: {
                // 校验规则
                name: [{ required: true, message: "商品名称不能为空", trigger: "blur" }],
                code: [{ required: true, message: "商品编码不能为空", trigger: "blur" }],
                retailPrice: [{ required: true, message: "零售价不能为空", trigger: "blur" }]
            }
        }
    }, 
    created() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            goodsApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
                const resp = response.data.data;
                console.log(resp);
                this.list = resp.rows;
                this.total = resp.total;
            })
        },
        handleCurrentChange(val) {
            console.log("当前页码："+val);
            this.currentPage = val;
            this.fetchData();
        },
        handleSizeChange(val) {
            console.log("每页显示条数："+val);
            this.pageSize = val;
            this.fetchData();
        },
        handleAdd(flag) {
            // 弹出框动态title
            if (flag == "edit") {
                this.popupTitle = "编辑商品";
            } else {
                this.popupTitle = "新增商品";
            }
            // 显示新增商品对话框
            this.dialogFormVisible = true;
            // 重置表单
            this.$nextTick(() => {
                this.$refs["pojoForm"].resetFields();
            });
        },
        handleEdit(id) {
            console.log("edit, " + id);
            this.handleAdd("edit"); // 复用（弹出新增对话框、清空表单）
            goodsApi.getById(id).then(response => {
                const resp = response.data;
                if (resp.flag) {
                    // 根据id查询出供应商
                    this.pojo = resp.data;
                } else {
                    // 查询失败
                    this.$message({
                        type: "error",
                        message: resp.message
                    });
                }
            });
        },
        // 重置
        resetForm(formName) {
            console.log("formName: " + formName);
            this.$refs[formName].resetFields();
        },
        // 接收子组件传递过来的数据，参数名：currentRow可与子组件传递过来的不一样
        optionSupplier(currentRow) {
            console.log('parent : ', currentRow);
            // 判断入口（从哪里来：是从搜索框中点击“选择供应商”还是从新增/编辑中点击“选择供应商”）
            if (this.isEdit) {
                this.pojo.supplierName = currentRow.name;
                this.pojo.supplierId = currentRow.id;
            } else {
                // 反显供应商名（反显到搜索框中）
                this.searchMap.supplierName = currentRow.name;
                // id（因为提交的时候是以id来提交的），supplierId 是用来区分 goods中searchMap里也有一个id
                this.searchMap.supplierId = currentRow.id;
            }
            // 恢复初始值
            this.isEdit = false;
            // 关闭供应商对话框
            this.dialogSupplierVisible = false;
        },
        addData(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    goodsApi.add(this.pojo).then(response => {
                        const resp = response.data;
                        if (resp.flag) {
                            // 新增成功
                            this.$message({
                                type: "success",
                                message: resp.message
                            });
                            // 刷新列表数据
                            this.fetchData();
                            // 关闭新增对话框
                            this.dialogFormVisible = false;
                        } else {
                            // 新增失败
                            this.$message({
                                type: "error",
                                message: resp.message
                            });
                        }
                    })
                }
            })
        },
        updateData(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    goodsApi.update(this.pojo).then(response => {
                        const resp = response.data;
                        if (resp.flag) {
                            // 更新成功
                            this.$message({
                                type: "success",
                                message: resp.message
                            });
                            // 刷新列表数据
                            this.fetchData();
                            // 关闭编辑对话框
                            this.dialogFormVisible = false;
                        } else {
                            // 更新失败
                            this.$message({
                                type: "error",
                                message: resp.message
                            });
                        }
                    })
                }
            })
        },
        // 新增/编辑对话框里点击了选择供应商
        dialogOptionSupplier() {
            this.isEdit = true; // 是从 新增/编辑对话框中打开的 供应商对话框，则将值设置为true
            this.dialogSupplierVisible = true;
        },
        handleDelete(id) {
            this.$confirm('删除该商品, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                goodsApi.deleteById(id).then(response => {
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