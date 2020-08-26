<template>
  <div class="subject">
    <el-dialog center :visible.sync="dialogVisible" width="30%">
      <div slot="title" class="title">{{mode=="add"?'新增学科':'编辑学科'}}</div>
      <!-- form表单 -->
      <el-form :model="subjectForm" :rules="rules" ref="subjectFormRef" label-width="80px">
        <el-form-item label="学科编号" prop="rid">
          <el-input v-model="subjectForm.rid"></el-input>
        </el-form-item>
        <el-form-item label="学科名称" prop="name">
          <el-input v-model="subjectForm.name"></el-input>
        </el-form-item>
        <el-form-item label="学科简称" prop="short_name">
          <el-input v-model="subjectForm.short_name"></el-input>
        </el-form-item>
        <el-form-item label="学科简介" prop="intro">
          <el-input v-model="subjectForm.intro"></el-input>
        </el-form-item>
        <el-form-item label="学科备注" prop="remark">
          <el-input v-model="subjectForm.remark"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "subjectedit",
  data() {
    return {
      dialogVisible: false,
      mode: "",
      subjectForm: {
        // 这个里面定义的属性，是要提交给后台的
        rid: "", // 学科编号
        name: "", // 学科名称
        short_name: "", // 学科简称
        intro: "", // 学科简介
        remark: "" // 备注
      },
      rules: {
        rid: [{ required: true, message: "学科编号不能为空", trigger: "blur" }],
        name: [
          { required: true, message: "学科名称不能为空", trigger: "blur" }
        ],
        short_name: [
          { required: true, message: "学科简称不能为空", trigger: "blur" }
        ],
        intro: [
          { required: true, message: "学科简介不能为空", trigger: "blur" }
        ],
        remark: [
          { required: true, message: "学科备注不能为空", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    dialogVisible(newValue) {
      if (!newValue) {
        this.$refs.subjectFormRef.clearValidate();
      }
    }
  },
  methods: {
    submit() {
      this.$refs.subjectFormRef.validate(async valid => {
        if (!valid) return;
        let res = null;
        if (this.mode == "add") {
          // 新增
          res = await this.$axios.post("/subject/add", this.subjectForm);
        } else {
          // 修改
          res = await this.$axios.post("/subject/edit", this.subjectForm);
        }

        if (res.data.code == 200) {
          this.$message({
            message: this.mode == "add" ? "新增成功" : "修改成功",
            type: "success"
          });

          //   关闭弹框
          this.dialogVisible = false;

          // 刷新列表
          if (this.mode == "add") {
            this.$parent.search();
          } else {
            this.$parent.getSubjectListData();
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  }
};
</script>

<style lang="less">
.subject {
  .title {
    height: 53px;
    text-align: center;
    color: #fff;
    background-color: #0e9cfa;
    line-height: 53px;
  }
  .el-dialog__header {
    padding: 0px;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
  }
}
</style>