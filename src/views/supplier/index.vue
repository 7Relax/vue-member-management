<template>
  <div>
    <!-- 搜索框（行内表单）-->
    <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top: 20px">
      <!-- Element的方法：重置需要看 el-form-item 元素上是否指定了prop属性（且需要与v-model中对象的属性一一对应），未指定是不能重置的 -->
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="供应商名称" style="width: 230px;"></el-input>
      </el-form-item>
      <el-form-item prop="linkman" v-if="!isDialog">
        <el-input v-model="searchMap.linkman" placeholder="联系人" style="width: 230px;"></el-input>
      </el-form-item>
      <el-form-item prop="mobile" v-if="!isDialog">
        <el-input v-model="searchMap.mobile" placeholder="联系电话" style="width: 230px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="handleAdd" v-if="!isDialog">新增</el-button>
        <el-button @click="resetForm('searchForm')" v-if="!isDialog">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 弹出新增会员（默认隐藏），为了节省性能开销，如果是从商品管理点击的供应商那就是弹出框，那就不让其渲染isDialog -->
    <el-dialog :title="popupTitle" :visible.sync="dialogFormVisible" width="500px" v-if="!isDialog">
      <el-form
        :rules="rules"
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        :model="pojo"
        style="width:400px;"
      >
        <el-form-item label="供应商名称" prop="name">
          <el-input v-model="pojo.name" autocomplete="off" width="50"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="pojo.linkman" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="pojo.mobile" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="pojo.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible=false">取 消</el-button>
        <!-- <el-button type="primary" @click="addData('pojoForm')">确 定</el-button> -->
        <el-button
          type="primary"
          @click="pojo.id === null ? addData('pojoForm') : updateData('pojoForm')"
        >确 定</el-button>
      </div>
    </el-dialog>
    <!-- 表格 
      highlight-current-row 激活单选行
      @current-change 当点击某一行后，会触发这个事件，从而调用对应的函数handleCurrentChange，
      handleCurrentChange 这个函数会接受两个参数 currentRow、oldCurrentRow
      -->
    <el-table height="550" border style="width: 100%"
      :data="list" 
      :highlight-current-row="isDialog" 
      @current-change="handleCurrentChange2">
      <!-- type="index"获取索引值，从1开始  -->
      <el-table-column type="index" label="序号" width="80"></el-table-column>
      <el-table-column prop="name" label="供应商名称" width="280"></el-table-column>
      <el-table-column prop="linkman" label="联系人" width="160"></el-table-column>
      <el-table-column prop="mobile" label="联系电话" width="160" v-if="!isDialog"></el-table-column>
      <el-table-column prop="remark" label="备注" width="280" v-if="!isDialog"></el-table-column>
      <el-table-column label="操作" width="200" v-if="!isDialog">
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
      :page-sizes="[10, 20, 50]"
      :page-size="pageSize"
      :layout="!isDialog ? 'total, sizes, prev, pager, next, jumper' : 'prev, pager, next'"
      :total="total"
      style="margin-top:10px"
    ></el-pagination>
  </div>
</template>

<script>
import supplierApi from "@/api/supplier";
export default {
  props: {
    isDialog: Boolean, // 子组件接受父组件传递过来的数据，通过isDialog来判断是否为弹框，true则为弹框
  },
  created() {
    this.fetchData();
  },
  data() {
    return {
      list: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      searchMap: {
        name: "",
        linkman: "",
        mobile: ""
      },
      popupTitle: "",
      dialogFormVisible: false,
      rules: {
        // 校验规则
        name: [{ required: true, message: "供应商名称", trigger: "blur" }],
        linkman: [{ required: true, message: "联系人", trigger: "blur" }]
      },
      pojo: {
        id: null,
        name: "",
        linkman: "",
        mobile: "",
        remark: ""
      }
    };
  },
  methods: {
    fetchData() {
      // supplierApi.getList().then(response => {
      supplierApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const resp = response.data.data;
          console.log(resp);
          this.list = resp.rows;
          this.total = resp.total;
        });
    },
    // 当页码改变后触发
    handleCurrentChange(val) {
      console.log("当前页码：" + val);
      this.currentPage = val;
      this.fetchData();
    },
    // 当每页显示条数改变后触发
    handleSizeChange(val) {
      console.log("每页条数：" + val);
      this.pageSize = val;
      this.fetchData();
    },
    // 重置
    resetForm(formName) {
      console.log("formName: " + formName);
      this.$refs[formName].resetFields();
    },
    handleAdd(flag) {
      console.log("handleAdd ...");
      if (flag == "edit") {
        this.popupTitle = "编辑供应商";
      } else {
        this.popupTitle = "新增供应商";
      }
      // 弹出新增对话框
      this.dialogFormVisible = true;
      // 重置表单
      this.$nextTick(() => {
        this.$refs["pojoForm"].resetFields();
      });
    },
    handleEdit(id) {
      console.log("edit, " + id);
      this.handleAdd("edit"); // 复用（弹出新增对话框、清空表单）
      supplierApi.getById(id).then(response => {
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
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 前端验证通过，提交表单
          supplierApi.add(this.pojo).then(response => {
            const resp = response.data;
            console.log(resp);
            if (resp.flag) {
              // 新增成功
              this.$message({
                type: "success",
                message: resp.message
              });
              // 刷新列表数据
              this.fetchData();
              // 隐藏新增对话框
              this.dialogFormVisible = false;
            } else {
              this.$message({
                message: resp.message,
                type: "warning"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    updateData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 前端验证通过，提交表单
          supplierApi.update(this.pojo).then(response => {
            const resp = response.data;
            console.log(resp);
            if (resp.flag) {
              // 更新成功
              this.$message({
                type: "success",
                message: resp.message
              });
              // 刷新列表数据
              this.fetchData();
              // 隐藏编辑对话框
              this.dialogFormVisible = false;
            } else {
              this.$message({
                message: resp.message,
                type: "warning"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    handleDelete(id) {
      console.log("delete, " + id);
      // 弹出删除框
      this.$confirm('删除该供应商, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          supplierApi.deleteById(id).then(response => {
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
    },
    // 当点击某一行时，会调用这个函数
    handleCurrentChange2(currentRow) {
        // 触发父组件里面的事件，第一个参数是事件名，第二个参数是传递的数据
        this.$emit('option-supplier', currentRow);
    }
  }
};
</script>