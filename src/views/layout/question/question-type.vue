<template>
  <div class="questionType">
    <div v-if="questionForm.type == 1">
      <div v-for="item in questionForm.select_options" :key="item.label" class="item">
        <!-- radio -->
        <el-radio
          v-model="questionForm.single_select_answer"
          :label="item.label"
          @change="changeValue"
        >{{item.label}}</el-radio>
        <!-- input -->
        <el-input v-model="item.text" style="margin-right:15px;"></el-input>
        <!-- 上传的子组件 -->
        <upload-file v-model="item.image"></upload-file>
      </div>
    </div>
    <div v-if="questionForm.type == 2">
      <div v-for="item in questionForm.select_options" :key="item.label" class="item">
        <!-- checkbox -->
        <el-checkbox
          v-model="questionForm.multiple_select_answer"
          :label="item.label"
          @change="changeValue"
        ></el-checkbox>

        <!-- input -->
        <el-input style="margin-left:15px;margin-right:15px;" v-model="item.text"></el-input>
        <!-- 上传的子组件 -->
        <upload-file v-model="item.image"></upload-file>
      </div>
    </div>
    <div v-if="questionForm.type == 3">
      <el-input
        type="textarea"
        :rows="5"
        placeholder="请输入内容"
        v-model="questionForm.short_answer"
        @change="changeValue"
      ></el-input>
    </div>
  </div>
</template>

<script>
import UploadFile from "./upload-file";
export default {
  name: "QuestionType",
  components: {
    UploadFile
  },
  props: ["questionForm"],
  methods: {
    changeValue(){
      this.$emit('childchange')
    }
  },
};
</script>

<style lang="less">
.questionType {
  .item {
    display: flex;
    align-items: center;
  }
}
</style>
