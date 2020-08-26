<template>
  <div class="user">
    <!-- 搜索部分 -->
    <el-card>
      <el-form inline :model="searchForm" ref="searchFormRef" label-width="80px">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="searchForm.username"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="searchForm.email"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role_id">
          <el-select style="margin-right:80px" v-model="searchForm.role_id" placeholder="请选择">
            <el-option label="超级管理员" value="1"></el-option>
            <el-option label="管理员" value="2"></el-option>
            <el-option label="老师" value="3"></el-option>
            <el-option label="学生" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="search" type="primary">搜索</el-button>
          <el-button @click="clear" type="dafault">清除</el-button>
          <el-button @click="add" type="primary">+新增用户</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 内容部分 -->
    <el-card style="margin-top:20px">
      <el-table :data="userList" stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="role" label="角色"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status==0" style="color:red;">禁用</span>
            <span v-if="scope.row.status==1" style="color:#4fcb5c;">启用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280">
          <template slot-scope="scope">
            <el-button type="default" @click="editUser(scope.row)">编辑</el-button>
            <el-button
              @click="changeStatus('/user/status',scope.row.id)"
              :type="scope.row.status==0?'success':'info'"
            >{{scope.row.status==0?'启用':'禁用'}}</el-button>
            <el-button @click="del('/user/remove',scope.row.id)" type="default">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top:20px;text-align:center;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[2, 5, 10, 20]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>

    <user-edit ref="userEditRef"></user-edit>
  </div>
</template>

<script>
import UserEdit from "./user-add-or-update";
// 导入公共部分
import common from "../../../mixnis/common";
export default {
  mixins: [common],
  components: {
    UserEdit
  },
  name: "userList",
  data() {
    return {
      searchForm: {
        username: "", //昵称
        email: "", //邮箱
        role_id: "" //角色数字 1超级管理员 2管理员、3老师、 4学生
      },
      page: 1, //查询页码
      limit: 2, //查询时候的页容量(每页查询多少条)
      userList: [], //展示用户列表所需要的数据
      total: 0 //分页时候需要用到
    };
  },
  created() {
    this.getListDate();
  },
  methods: {
    // 获取用户列表数据,用于内容展示
    async getListDate() {
      const res = await this.$axios.get("/user/list", {
        params: {
          page: this.page,
          limit: this.limit,
          ...this.searchForm
        }
      });
      // console.log(res.data);
      if (res.data.code == 200) {
        this.userList = res.data.data.items;
        this.total = res.data.data.pagination.total;
      }
    },
    // 搜索
    search() {
      this.page = 1;
      this.getListDate();
    },
    // 清除
    clear() {
      // 方法一
      // this.searchForm.username = ''
      // this.searchForm.email = ''
      // this.searchForm.role_id = ''
      // 方法二 (form表单中的resetFields重置方法,必须配合prop使用)
      this.$refs.searchFormRef.resetFields();
      this.search();
    },
    // 页码容量改变
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.limit = val;
      this.search();
    },
    // 当前页码改变
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.page = val;
      this.getListDate();
    },
    // // 更改当前行的状态
    // async changeStatus(id) {
    //   // console.log(id);
    //   const res = await this.$axios.post("/user/status", { id });
    //   if (res.data.code == 200) {
    //     this.$message({
    //       message: "状态更改成功",
    //       type: "success"
    //     });
    //     // 重新查询
    //     // this.search();
    //     this.getListDate();
    //   }
    // },
    // 删除
    // del(id) {
    //   // console.log(this.page);
    //   // console.log(this.limit);
    //   // console.log(this.total);

    //   this.$confirm(`你确定要删除该条记录吗?`, "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   })
    //     .then(async () => {
    //       const res = await this.$axios.post("/user/remove", { id });
    //       if (res.data.code == 200) {
    //         this.$message({
    //           message: "删除成功",
    //           type: "success"
    //         });
    //         // 重新查询
    //         // this.search();
    //         if (this.total == this.limit * (this.page - 1) + 1) {
    //           this.page = this.page - 1;
    //           this.getListDate();
    //         } else {
    //           this.getListDate();
    //         }
    //       }
    //     })
    //     .catch(() => {});
    // },
    // 新增
    add() {
      this.$refs.userEditRef.mode = "add";
      this.$refs.userEditRef.dialogVisible = true;
      // 方法一:
      this.$refs.userEditRef.userForm = {
        username: "", // 用户名
        email: "", // 邮箱
        phone: "", // 手机号
        role_id: "", // 角色 1：超级管理员 2：管理员 3：老师 4：学生
        status: "", // 状态 1：启用 0：禁用
        remark: "" // 备注
      };
      this.$nextTick(() => {
        // 方法一:
        this.$refs.userEditRef.$refs.userFormRef.clearValidate();
        // 方法二:
        // this.$refs.userEditRef.$refs.userFormRef.resetFields();
      });
    },
    // 修改用户
    editUser(row) {
      // console.log(row);
      this.$refs.userEditRef.mode = "edit";
      this.$refs.userEditRef.userForm = JSON.parse(JSON.stringify(row));
      this.$refs.userEditRef.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.userEditRef.$refs.userFormRef.clearValidate();
      });
    }
  }
};
</script>

<style>
</style>