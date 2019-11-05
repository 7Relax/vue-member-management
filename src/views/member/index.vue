<template>
  <div>
    <!-- 搜索框（行内表单）-->
    <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top: 20px">
      <!-- Element的方法：重置需要看 el-form-item 元素上是否指定了prop属性（且需要与v-model中对象的属性一一对应），未指定是不能重置的 -->
      <el-form-item prop="cardNum">
        <el-input v-model="searchMap.cardNum" placeholder="会员卡号"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="会员名称" style="width: 150px;"></el-input>
      </el-form-item>
      <el-form-item prop="payType">
        <el-select v-model="searchMap.payType" placeholder="支付类型" style="width: 110px;">
          <!-- 不要忘记将 payTypeOptions 绑定到data中，否则只是一个普通的变量 -->
          <el-option
            v-for="option in payTypeOptions"
            :key="option.type"
            :label="option.name"
            :value="option.type"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="birthday">
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="searchMap.birthday"
          type="date"
          placeholder="出生日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 弹出新增会员（默认隐藏） -->
    <el-dialog :title=popupTitle :visible.sync="dialogFormVisible" width="500px">
      <el-form
      :rules="rules"
      ref="pojoForm"
      label-width="100px"
      label-position="right"
      :model="pojo"
      style="width:400px;">
        <el-form-item label="会员卡号" prop="cardNum">
          <el-input v-model="pojo.cardNum" autocomplete="off" width="50"></el-input>
        </el-form-item>
        <el-form-item label="会员姓名" prop="name">
          <el-input v-model="pojo.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="会员生日" prop="birthday">
          <el-date-picker
              value-format="yyyy-MM-dd"
              v-model="pojo.birthday"
              type="date"
              placeholder="会员生日">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="pojo.phone" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="开卡金额" prop="money">
          <el-input v-model="pojo.money" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="可用积分" prop="integral">
          <el-input v-model="pojo.integral" autocomplete="on"></el-input>
        </el-form-item>

        <el-form-item label="支付类型" prop="payType">
          <el-select v-model="pojo.payType" placeholder="支付类型" style="width: 110px;">
              <!-- 不要忘记将 payTypeOptions 绑定到data中，否则只是一个普通的变量 -->
              <el-option
                v-for="option in payTypeOptions"
                :key="option.type"
                :label="option.name"
                :value="option.type">
              </el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="会员地址" prop="address">
          <el-input type="textarea" v-model="pojo.address" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible=false">取 消</el-button>
        <!-- <el-button type="primary" @click="addData('pojoForm')">确 定</el-button> -->
        <el-button type="primary" @click="pojo.id === null ? addData('pojoForm') : updateData('pojoForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 表格 -->
    <el-table :data="list" height="565" border style="width: 100%">
      <!-- type="index"获取索引值，从1开始  -->
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="cardNum" label="卡号" width="160"></el-table-column>
      <el-table-column prop="name" label="姓名" width="80"></el-table-column>
      <el-table-column prop="birthday" label="生日" width="120"></el-table-column>
      <el-table-column prop="phone" label="手机" width="120"></el-table-column>
      <el-table-column prop="integral" label="积分" width="70"></el-table-column>
      <el-table-column prop="money" label="开卡金额" width="100"></el-table-column>
      <el-table-column prop="payType" label="支付类型" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.payType | payTypeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column label="操作" width="150">
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
      :total="total"
      style="margin-top:18px"
    ></el-pagination>
  </div>
</template>

<script>
import memberApi from "@/api/member";

const payTypeOptions = [
  { type: "1", name: "现金" },
  { type: "2", name: "微信" },
  { type: "3", name: "支付宝" },
  { type: "4", name: "银行卡" }
];

export default {
  created() {
    // 初始化获取列表数据
    this.fetchData();
  },
  // 数据挂载之前，获取到了模板，但是数据还未挂载到模板上
  beforeMount() {
    // 获取浏览器可视区域高度
    this.clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
    // 监听高度
    const that = this;
    window.onresize = function temp() {
      that.clientHeight = document.documentElement.clientHeight;
      console.log('window.onresize >> clientHeight : ', that.clientHeight);
    };
  },
  watch: {
    // 如果 clientHeight 发生改变，这个函数就会运行
    clientHeight: function () {
      // 动态 tableHeight 高度
      this.tableHeight = this.clientHeight - 150;
      console.log("页面高度："+this.clientHeight);
      console.log("table高度："+this.tableHeight);
    }
  },
  data() {
    return {
      list: [],
      total: 0,       // 总记录数
      currentPage: 1, // 当前页
      pageSize: 10,   // 每页10条数据
      searchMap: {    // 条件查询中的查询条件（点击查询后会将查询条件的数据存入此对象中，之后再向后台查询会员信息，这个对象里可以不定义属性名{}，也可以写，但Element框架在未指定属性名的情况有时会出现bug：当点击重置后，再次去填写数据会发现不能输入数据）
        cardNum: "",
        name: "",
        payType: "",
        birthday: ""
      },
      tableHeight: 550 ,
      clientHeight: 650, // 当前客户端可视区域高度
      payTypeOptions,    // 等价于 payTypeOptions: payTypeOptions
      dialogFormVisible: false, // 显示/隐藏对话框（初始值是false：不显示）
      pojo: {
        id: null,
        cardNum: "",
        name: "",
        birthday: "",
        phone: "",
        money: "",
        integral: "",
        payType: "",
        address: ""
      },
      popupTitle: "新增会员",
      rules: { // 校验规则
         cardNum: [
           {required: true, message: '卡号不能为空', trigger: 'blur'}
         ],
         name: [
           {required: true, message: '姓名不能为空', trigger: 'blur'}
         ],
         payType: [
           {required: true, message: '支付类型不能为空', trigger: 'change'} // 因为是select元素所以用change
         ]
      }
    };
  },
  methods: {
    getHeight() {
      console.log("window.height: ", );
      return 333
    },
    fetchData() {
      //   memberApi.getList().then(response => {
      memberApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const resp = response.data;
          if (resp.flag) {
            console.log(resp);
            this.list = resp.data.rows;
            this.total = resp.data.total;
          } else {
          }
        });
    },
    // 当页码改变后触发
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.fetchData();
    },
    // 当每页显示条数改变后触发
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.fetchData();
    },
    // Element的方法：重置需要看 el-form-item 元素上是否指定了prop属性，未指定是不能重置的
    resetForm(formName) {
      console.log("formName: " + formName);
      this.$refs[formName].resetFields();
    },
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 前端验证通过，提交表单
          memberApi.add(this.pojo).then(response => {
            const resp = response.data;
            console.log(resp);
            if (resp.flag) {
              // 新增成功，刷新列表数据
              this.fetchData();
              // 隐藏新增对话框
              this.dialogFormVisible = false;
            } else {
              this.$message({
                message: resp.message,
                type: 'warning'
              })
            }
          })
        } else {
          return false;
        }
      })
    },
    updateData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          memberApi.update(this.pojo).then(response => {
            const resp = response.data;
            if (resp.flag) {
              // 刷新列表
              this.fetchData();
              this.dialogFormVisible = false;
            } else {
              this.$message({
                message: resp.message,
                type: 'warning'
              })
            }
          })
        }
      })
    },
    handleAdd(flag) {
      if (flag == 'edit') {
        this.popupTitle = "编辑会员";
      } else {
        this.popupTitle = "新增会员";
      }

      this.dialogFormVisible = true;

      // resetFields方法: 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果

      // 报错：Cannot read property 'resetFields' of undefined"
      // this.$refs['pojoForm'].resetFields();

      // 在vue提供的内置方法nextTick中就不会报错，实际是一个异步事件，因为 this.dialogFormVisible = true; 设置为true之后，弹出框就会弹出（需要花时间加载dom）,这个时候就去对表单进行重置操作，那报错的概率会很高（因为dom还没有渲染出来，表单还没有呢）
      // 应该等待加载完dom后再执行后续的操作
      // 注意：resetFields要结合prop使用，并且使用了prop就会出现输出框输入不了的问题（需要在pojo对象定义具体的属性才可以解决， 或者 this.pojo = {};）
      this.$nextTick(() => {
        this.$refs['pojoForm'].resetFields();
      })
    },
    handleEdit(id) {
      console.log("编辑", id);
      this.handleAdd('edit'); // 复用
      memberApi.getById(id).then(response => {
        const resp = response.data;
        if (resp.flag) {
          this.pojo = resp.data;
        } else {
          // 查询失败
          this.$message({
            type: 'error',
            message: resp.message
          });
        }
      })
    },
    handleDelete(id) {
      console.log("删除", id);
      // 弹出删除框
      this.$confirm('删除该会员, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          memberApi.deleteById(id).then(response => {
            const resp = response.data;
            this.$message({
              type: resp.flag ? 'success' : 'error',
              message: resp.message
            });
            // 刷新
            if (resp.flag) {
              this.fetchData();
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
  },
  filters: {
    payTypeFilter(type) {
      //   const payObj = payTypeOptions.find(obj => {
      //       return obj.type === type;
      //   })
      // 注意：在过滤器中不能引用当前实例 this，所以payTypeOptions这个数组变量定义在实例外面（全局）
      const payObj = payTypeOptions.find(obj => obj.type === type);
      return payObj ? payObj.name : null;
    }
  }
};
</script>