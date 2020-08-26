<template>
  <div class="enterprise">
    <el-dialog center :visible.sync="dialogVisible" width="600px">
      <div slot="title" class="title">
        {{ mode == "add" ? "新增企业" : "编辑企业" }}
      </div>
      <!-- form表单 -->
      <el-form
        :model="enterpriseForm"
        :rules="rules"
        ref="enterpriseFormRef"
        label-width="80px"
      >
        <el-form-item label="企业编号" prop="eid">
          <el-input v-model="enterpriseForm.eid"></el-input>
        </el-form-item>
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="enterpriseForm.name"></el-input>
        </el-form-item>
        <el-form-item label="企业简称" prop="short_name">
          <el-input v-model="enterpriseForm.short_name"></el-input>
        </el-form-item>
        <el-form-item label="企业简介" prop="intro">
          <el-input v-model="enterpriseForm.intro"></el-input>
        </el-form-item>
        <el-form-item label="企业备注" prop="remark">
          <el-input v-model="enterpriseForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="submit" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "EnterpriseEdit",
  data() {
    return {
      dialogVisible: false,
      mode: "",
      enterpriseForm: {
        // 提交给后台的数据
        eid: "", // 企业编号
        name: "", // 企业名称
        short_name: "", // 简称
        intro: "", // 企业简介
        remark: "", // 备注
      },
      rules: {
        eid: [{ required: true, message: "企业编号不能为空", trigger: "blur" }],
        name: [
          { required: true, message: "企业名称不能为空", trigger: "blur" },
        ],
        short_name: [
          { required: true, message: "企业简称不能为空", trigger: "blur" },
        ],
        intro: [
          { required: true, message: "企业简介不能为空", trigger: "blur" },
        ],
        remark: [{ required: true, message: "备注不能为空", trigger: "blur" }],
      },
    };
  },
  watch: {
    dialogVisible(newValue) {
      // console.log(newValue);
      if (!newValue) {
        this.$refs.enterpriseFormRef.clearValidate();
      }
    },
  },
  methods: {
    submit() {
      this.$refs.enterpriseFormRef.validate(async (valid) => {
        if (!valid) return;
        let res = null;
        if (this.mode == "add") {
          // 新增
          res = await this.$axios.post("/enterprise/add", this.enterpriseForm);
        } else {
          // 修改
          res = await this.$axios.post("/enterprise/edit", this.enterpriseForm);
        }

        if (res.data.code == 200) {
          // 提示
          this.$message({
            message: this.mode == "add" ? "新增成功" : "编辑成功",
            type: "success",
          });

          // 关闭当前窗口
          this.dialogVisible = false;

          // 刷新列表
          if (this.mode == "add") {
            this.$parent.search();
          } else {
            this.$parent.getEnterpriseListData();
          }
        }
      });
    },
  },
};
</script>

<style lang="less">
.enterprise {
  .title {
    height: 53px;
    text-align: center;
    color: #fff;
    background-color: #0e9cfa;
    line-height: 53px;
  }
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
  }
}
</style>
