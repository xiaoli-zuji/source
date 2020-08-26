<template>
  <div>
    <!-- 搜索部分 -->
    <el-card>
      <el-form inline :model="searchForm" ref="searchFormRef" label-width="50px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="学科" prop="subject">
              <el-select v-model="searchForm.subject" placeholder="请选择学科">
                <el-option
                  v-for="item in subjectList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="阶段" prop="step">
              <el-select v-model="searchForm.step" placeholder="请选择阶段">
                <el-option v-for="(value,name) in stepObj" :key="name" :label="value" :value="name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="企业" prop="enterprise">
              <el-select v-model="searchForm.enterprise" placeholder="请选择企业">
                <el-option
                  v-for="item in enterpriseList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="题型" prop="type">
              <el-select v-model="searchForm.type" placeholder="请选择题型">
                <el-option v-for="(value,name) in typeObj" :key="name" :label="value" :value="name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="难度" prop="difficulty">
              <el-select v-model="searchForm.difficulty" placeholder="请选择难度">
                <el-option
                  v-for="(value,name) in difficultyObj"
                  :key="name"
                  :label="value"
                  :value="name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="作者" prop="username">
              <el-input style="width:218px;" v-model="searchForm.username"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态" prop="status">
              <el-select v-model="searchForm.status" placeholder="请选择状态">
                <el-option label="启用" value="1"></el-option>
                <el-option label="禁用" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="日期" prop="create_date">
              <el-date-picker v-model="searchForm.create_date" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="标题" prop="title">
              <el-input style="width:500px;" v-model="searchForm.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-button style="margin-left:10px;" @click="search" type="primary">搜索</el-button>
              <el-button @click="clear">清除</el-button>
              <el-button type="primary" @click="add">+新增试题</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!-- 内容部分 -->
    <el-card style="margin-top:20px;">
      <el-table :data="questionList" border stripe>
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column label="题目" width="300">
          <template slot-scope="scope">
            <span v-html="scope.row.title"></span>
          </template>
        </el-table-column>
        <el-table-column label="学科.阶段" :formatter="formatterStep">
          <!-- <template slot-scope="scope" >
          <span>-->
          <!-- 1.直接获取 -->
          <!-- {{`${scope.row.subject_name}.${stepObj[scope.row.step]}`}} -->
          <!-- 2.函数传参 -->
          <!-- {{formatterStep(scope.row)}} -->
          <!-- </span>
          </template>-->
        </el-table-column>
        <el-table-column label="题型" :formatter="formatterType">
          <!-- <template slot-scope="scope"> -->
          <!-- 1.直接写 -->
          <!-- <span>{{typeObj[scope.row.type]}}</span> -->
          <!-- 2.调用函数方法 -->
          <!-- <span>
             {{formatterType(scope.row.type)}}
          </span>-->
          <!-- </template> -->
        </el-table-column>
        <el-table-column prop="enterprise_name" label="企业"></el-table-column>
        <el-table-column prop="username" label="创建者"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span
              :style="{color:scope.row.status==1?'#67b043':'red'}"
            >{{scope.row.status==1?'启用':'禁用'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="reads" label="访问量"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
            <el-button
              @click="changeStatus(scope.row.id)"
              :type="scope.row.status==1?'info':'success'"
            >{{scope.row.status==1?'禁用':'启用'}}</el-button>
            <el-button type="danger" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:center;margin-top:20px;">
        <el-pagination
          @size-change="sizeChange"
          @current-change="currentChange"
          :current-page="page"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
        ></el-pagination>
      </div>
    </el-card>
    <question-edit
      ref="questionEditRef"
      :subjectList="subjectList"
      :enterpriseList="enterpriseList"
      :stepObj="stepObj"
      :typeObj="typeObj"
      :difficultyObj="difficultyObj"
    ></question-edit>
  </div>
</template>

<script>
import QuestionEdit from "./question-add-edit";
export default {
  name: "Question",
  components: {
    QuestionEdit
  },
  data() {
    return {
      subjectList: [], // 学科列表
      enterpriseList: [], // 企业列表
      stepObj: { 1: "初级", 2: "中级", 3: "高级" }, //阶段
      typeObj: { 1: "单选", 2: "多选", 3: "简答" }, //题型
      difficultyObj: { 1: "简单", 2: "一般", 3: "困难" }, //难度
      searchForm: {
        // 搜索的时候要传递给后台的
        subject: "", // 学科
        enterprise: "", // 企业
        step: "", // 阶段
        type: "", // 题型
        difficulty: "", // 难度
        username: "", // 作者
        status: "", // 状态 0 禁用 1 启用
        create_date: "", // 创建日期
        title: "" // 标题
      },
      page: 1, // 页码
      limit: 2, // 页容量（每页加载多少条）
      questionList: [], // 题库列表
      total: 0 // 总条数
    };
  },
  created() {
    // 获取题库列表数据
    this.getQuestionListData();
    // 获取所有的学科
    this.getSubjectListData();
    // 获取所有的企业
    this.getEnterpriseListData();
  },
  methods: {
    // 分页获取题库列表
    async getQuestionListData() {
      const res = await this.$axios.get("/question/list", {
        params: {
          limit: this.limit,
          page: this.page,
          ...this.searchForm
        }
      });

      if (res.data.code == 200) {
        this.questionList = res.data.data.items;
        this.total = res.data.data.pagination.total;
      }
    },
    // 获取所有的学科
    async getSubjectListData() {
      const res = await this.$axios.get("/subject/list");
      if (res.data.code == 200) {
        this.subjectList = res.data.data.items;
      }
    },
    // 获取所有的企业
    async getEnterpriseListData() {
      const res = await this.$axios.get("/enterprise/list");
      if (res.data.code == 200) {
        this.enterpriseList = res.data.data.items;
      }
    },
    // 搜索
    search() {
      this.page = 1;
      this.getQuestionListData();
    },
    // 清除
    clear() {
      this.$refs.searchFormRef.resetFields();
      this.search();
    },
    // 获取题型
    // formatterType(val){
    //   return  this.typeObj[val];
    // }
    // 格式化题型
    formatterType(row) {
      return this.typeObj[row.type];
    },
    // 获取学科阶段
    // formatterStep(row) {
    //   return `${row.subject_name}.${this.stepObj[row.step]}`
    // },
    // 格式化学科阶段
    formatterStep(row) {
      return `${row.subject_name}.${this.stepObj[row.step]}`;
    },
    // 页容量改变
    sizeChange(val) {
      this.limit = val;
      this.search();
    },
    // 页码改变
    currentChange(val) {
      this.page = val;
      this.getQuestionListData();
    },
    // 更改状态
    async changeStatus(id) {
      const res = await this.$axios.post("/question/status", { id });
      if (res.data.code == 200) {
        this.$message({
          message: "更改状态成功",
          type: "success"
        });
        this.getQuestionListData();
      }
    },
    // 删除
    del(id) {
      this.$confirm("你确定要删除该条记录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$axios.post("/question/remove", { id });
          if (res.data.code == 200) {
            //  提示
            this.$message({
              type: "success",
              message: "删除成功!"
            });

            // 刷新列表
            if (this.total == this.limit * (this.page - 1) + 1) {
              this.page = this.page - 1;
              this.getQuestionListData();
            } else {
            this.getQuestionListData();
            }
          }
        })
        .catch(() => {});
    },
    // 新增
    add() {
      this.$refs.questionEditRef.mode = "add";
      this.$refs.questionEditRef.questionForm = {
        // 这个里面的所有值，将来是传递给服务器的
        subject: "", // 学科
        step: "", // 阶段
        enterprise: "", // 企业
        city: [], // 城市
        type: 1, // 题型
        difficulty: 1, // 难度
        title: "", // 标题
        single_select_answer: "", // 单选答案
        multiple_select_answer: [], // 多选答案
        short_answer: "", // 简答答案
        answer_analyze: "", // 答案解析
        remark: "", // 答案备注
        video: "", //视频解析地址
        select_options: [
          {
            label: "A",
            text: "shift",
            image: ""
          },
          {
            label: "B",
            text: "pop",
            image: ""
          },
          {
            label: "C",
            text: "splice",
            image: ""
          },
          {
            label: "D",
            text: "slice",
            image: ""
          }
        ]
      };
      this.$refs.questionEditRef.dialogVisible = true;
    },
    // 编辑
    edit(row) {
      this.$refs.questionEditRef.mode = "edit";
      this.$refs.questionEditRef.questionForm = JSON.parse(JSON.stringify(row));
      // 城市
      if (row.city) {
        this.$refs.questionEditRef.questionForm.city = row.city.split(",");
      } else {
        this.$refs.questionEditRef.questionForm.city = [];
      }
      // 多选
      if (row.multiple_select_answer) {
        this.$refs.questionEditRef.questionForm.multiple_select_answer = row.multiple_select_answer.split(",");
      } else {
        this.$refs.questionEditRef.questionForm.multiple_select_answer = [];
      }
      this.$refs.questionEditRef.dialogVisible = true;
    }
  }
};
</script>

<style lange="less">
</style>