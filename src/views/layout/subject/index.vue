<template>
  <div>
    <!-- 搜索部分 -->
    <el-card>
      <el-form inline :model="searchForm" ref="searchFormRef" label-width="80px">
        <el-form-item label="学科编号" prop="rid">
          <el-input v-model.trim="searchForm.rid"></el-input>
        </el-form-item>
        <el-form-item label="学科名称" prop="name">
          <el-input v-model.trim="searchForm.name"></el-input>
        </el-form-item>
        <el-form-item label="创建者" prop="username">
          <el-input v-model.trim="searchForm.username"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="searchForm.status" style="margin-right:80px" placeholder="请选择">
            <el-option label="禁用" :value="0"></el-option>
            <el-option label="启用" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="clear">清除</el-button>
          <el-button type="primary" @click="add">+增加学科</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 内容部分 -->
    <el-card style="margin-top:20px">
      <el-table border stripe :data="subjectList" style="width: 100%">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="rid" label="学科编号"></el-table-column>
        <el-table-column prop="name" label="学科名称"></el-table-column>
        <el-table-column prop="short_name" label="简称"></el-table-column>
        <el-table-column prop="username" label="创建者"></el-table-column>
        <el-table-column prop="create_time" label="创建日期"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span
              :style="{ color: scope.row.status == 1 ? 'green' : 'red' }"
            >{{ scope.row.status == 1 ? "启用" : "禁用" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
            <el-button
              @click="changeStatus('/subject/status',scope.row.id)"
              :type=" scope.row.status == 1 ? 'info' : 'success'"
            >{{ scope.row.status == 1 ? "禁用" : "启用" }}</el-button>
            <el-button @click="del('/subject/remove',scope.row.id)" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div style="text-align:center;">
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
    <!-- 使用子组件 -->
    <subject-edit ref="subjectEditRef"></subject-edit>
  </div>
</template>

<script>
import SubjectEdit from "./subject-add-edit";
// 导入公共部分
import common from '@/mixnis/common.vue';
export default {
  name: "subject",
  mixins:[common],
  components: {
    SubjectEdit
  },
  data() {
    return {
      searchForm: {
        rid: "", // 学科编号
        name: "", // 学科名称
        username: "", // 创建者
        status: "" // 创建者
      },
      page: 1, // 页码
      limit: 2, // 页容量
      subjectList: [], // 学科列表数据
      total: 0 // 总条数
    };
  },
  created() {
    this.getListDate();
  },
  methods: {
    // 获取学科列表信息
    async getListDate() {
      const res = await this.$axios.get("/subject/list", {
        params: {
          limit: this.limit,
          page: this.page,
          ...this.searchForm
          // 下面是去掉空格
          // rid:this.searchForm.rid.trim(),
          // name:this.searchForm.name.trim(),
          // username:this.searchForm.username.trim(),
          // status:this.searchForm.status
        }
      });
      if (res.data.code == 200) {
        this.subjectList = res.data.data.items;
        this.total = res.data.data.pagination.total;
      }
      // console.log(this.subjectList);
    },
    // 搜索
    search() {
      this.page = 1;
      this.getListDate();
    },
    // 清除
    clear() {
      console.log(this.$refs.searchFormRef);
      this.$refs.searchFormRef.resetFields();
      this.search();
    },
    // 页码容量改变
    handleSizeChange(val) {
      this.limit = val;
      this.search();
    },
    // 当前页码改变
    handleCurrentChange(val) {
      this.page = val;
      this.getListDate();
    },
    // 修改用户状态
    // async changeStatus(id) {
      // const res = await this.$axios.post("/subject/status", { id });
      // if (res.data.code == 200) {
      //   this.$message({
      //     message: "更改状态成功",
      //     type: "success"
      //   });

      //   // 刷新列表
      //   this.getListDate();
      // }
    // },
    // 删除
    // del(id) {
    //   this.$confirm(`你确定要删除该条记录吗?`, "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   })
    //     .then(async () => {
    //       const res = await this.$axios.post("/subject/remove", { id });

    //       if (res.data.code == 200) {
    //         // 提示
    //         this.$message({
    //           message: "删除成功成功",
    //           type: "success"
    //         });

    //         // 刷新列表
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
      this.$refs.subjectEditRef.mode = "add";
      (this.$refs.subjectEditRef.subjectForm = {
        // 这个里面定义的属性，是要提交给后台的
        rid: "", // 学科编号
        name: "", // 学科名称
        short_name: "", // 学科简称
        intro: "", // 学科简介
        remark: "" // 备注
      }),
        (this.$refs.subjectEditRef.dialogVisible = true);
    },
    // 修改
    edit(row) {
      // console.log(row);
      this.$refs.subjectEditRef.mode = "edit";
      // rid: "", // 学科编号
      // name: "", // 学科名称
      // short_name: "", // 学科简称
      // intro: "", // 学科简介
      // remark: "" // 备注
      const { id, rid, name, short_name, intro, remark } = row;
      this.$refs.subjectEditRef.subjectForm = {
        id,
        rid,
        name,
        short_name,
        intro,
        remark
      };
      this.$refs.subjectEditRef.dialogVisible = true;
    }
  }
};
</script>

<style></style>
