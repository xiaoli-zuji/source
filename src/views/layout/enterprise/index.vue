<template>
  <div>
    <el-card>
      <el-form inline :model="searchForm" ref="searchFormRef" label-width="80px">
        <el-form-item label="企业编号" prop="eid">
          <el-input v-model="searchForm.eid"></el-input>
        </el-form-item>
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="searchForm.name"></el-input>
        </el-form-item>
        <el-form-item label="创建者" prop="username">
          <el-input v-model="searchForm.username"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            style="margin-right:50px;width:200px;"
            v-model="searchForm.status"
            placeholder="请选择状态"
          >
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="clear">清除</el-button>
          <el-button type="primary" @click="add">+新增企业</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin-top:20px">
      <el-table :data="enterpriseList" border stripe>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="eid" label="企业编号"></el-table-column>
        <el-table-column prop="name" label="企业名称"></el-table-column>
        <el-table-column prop="username" label="创建者"></el-table-column>
        <el-table-column prop="create_time" label="创建日期"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span
              :style="{ color: scope.row.status == 0 ? 'red' : '#87cd67' }"
            >{{ scope.row.status == 0 ? "禁用" : "启用" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280">
          <template slot-scope="scope">
            <el-button @click="editEnterprise(scope.row)" type="primary">编辑</el-button>
            <el-button
              @click="changeStatus('/enterprise/status',scope.row.id)"
              :type="scope.row.status == 0 ? 'success' : 'info'"
            >{{ scope.row.status == 0 ? "启用" : "禁用" }}</el-button>
            <el-button @click="del('/enterprise/remove',scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:center;margin-top:10px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
        ></el-pagination>
      </div>
    </el-card>
    <enterprise-edit ref="enterpriseEditRef"></enterprise-edit>
  </div>
</template>

<script>
import EnterpriseEdit from "./enterprise-add-edit";
// 导入公共部分
import common from "@/mixnis/common.vue";
export default {
  name: "EnterPrise",
  mixins: [common],
  components: {
    // 局部注册
    EnterpriseEdit
  },
  data() {
    return {
      searchForm: {
        eid: "", // 企业编号
        name: "", // 企业名称
        username: "", // 创建者
        status: "" // 状态
      },
      page: 1, // 页码
      limit: 2, // 页容量
      enterpriseList: [], // table展示所需要的数据
      total: 0 // 总条数
    };
  },
  created() {
    this.getListDate();
  },
  methods: {
    // 获取数据
    async getListDate() {
      const res = await this.$axios.get("/enterprise/list", {
        params: {
          limit: this.limit,
          page: this.page,
          ...this.searchForm
        }
      });
      if (res.data.code == 200) {
        this.enterpriseList = res.data.data.items;
        this.total = res.data.data.pagination.total;
      }
      // console.log(this.enterpriseList);
    },
    // 搜索
    search() {
      this.page = 1;
      this.getListDate();
    },
    // 清除
    clear() {
      this.$refs.searchFormRef.resetFields();
      this.search();
    },
    // 页容量改变
    handleSizeChange(val) {
      this.limit = val;
      this.search();
    },
    // 当前页码改变
    handleCurrentChange(val) {
      this.page = val;
      this.getListDate();
    },
    // 更改用户状态
    // async changeStatus(id) {
    //   const res = await this.$axios.post("/enterprise/status", { id });
    //   if (res.data.code == 200) {
    //     this.$message({
    //       message: "更改状态成功",
    //       type: "success",
    //     });
    //     // 刷新列表信息
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
    //       const res = await this.$axios.post("/enterprise/remove", { id });
    //       if (res.data.code == 200) {
    //         this.$message({
    //           message: "删除成功",
    //           type: "success"
    //         });
    //         // 重新刷新列表
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
      this.$refs.enterpriseEditRef.mode = "add";
      this.$refs.enterpriseEditRef.enterpriseForm = {
        // 提交给后台的数据
        eid: "", // 企业编号
        name: "", // 企业名称
        short_name: "", // 简称
        intro: "", // 企业简介
        remark: "" // 备注
      };
      this.$refs.enterpriseEditRef.dialogVisible = true;
    },
    // 编辑
    editEnterprise(row) {
      // console.log(row);
      this.$refs.enterpriseEditRef.mode = "edit";
      const { id, eid, name, short_name, intro, remark } = row;
      this.$refs.enterpriseEditRef.enterpriseForm = {
        id,
        eid, // 企业编号
        name, // 企业名称
        short_name, // 简称
        intro, // 企业简介
        remark //备注
      };
      this.$refs.enterpriseEditRef.dialogVisible = true;
    }
  }
};
</script>

<style></style>
