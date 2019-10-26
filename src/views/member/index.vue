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
        <el-button type="primary" @click="dialogFormVisible=true">新增</el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 弹出新增会员（默认隐藏） -->
    <el-dialog title="会员编辑" :visible.sync="dialogFormVisible">
      <el-form :model="memberObj">
        <el-form-item label="活动名称">
          <el-input v-model="memberObj.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域">
          <el-select v-model="memberObj.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible=false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 表格 -->
    <el-table :data="list" height="580" border style="width: 100%">
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
  data() {
    return {
      list: [],
      total: 0,       // 总记录数
      currentPage: 1, // 当前页
      pageSize: 10,   // 每页10条数据
      searchMap: {    // 条件查询中的查询条件（点击查询后会将查询条件的数据存入此对象中，之后再向后台查询会员信息，这个对象里可以不定义属性名{}，也可以写，但Element框架在未指定属性名的情况有时会出现bug：当点击重置后，再次去填写数据会发现不能输入进去，光标不能入焦）
        cardNum: "",
        name: "",
        payType: "",
        birthday: ""
      },
      payTypeOptions, // 等价于 payTypeOptions: payTypeOptions
      dialogFormVisible: false, // 显示/隐藏对话框（初始值是false：不显示）
      memberObj: {

      },
    };
  },
  methods: {
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
    // 当每页显示条数改变后触发
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.fetchData();
    },
    // 当页码改变后触发
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.fetchData();
    },
    // Element的方法：重置需要看 el-form-item 元素上是否指定了prop属性，未指定是不能重置的
    resetForm(formName) {
      console.log("formName: " + formName);
      this.$refs[formName].resetFields();
    },
    handleEdit(id) {
      console.log("编辑", id);
    },
    handleDelete(id) {
      console.log("删除", id);
    }
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