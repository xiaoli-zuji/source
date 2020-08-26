<template>
  <div class="uploadFile">
    <el-upload
      class="avatar-uploader"
      :action="BASE_URL+'/question/upload'"
      name="file"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <div v-if="type=='video'">
        <video v-if="value" :src="BASE_URL+'/'+value" controls class="avatar"></video>
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </div>
      <div v-else>
        <img v-if="value" :src="BASE_URL+'/'+value" alt="" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </div>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: "UploadFile",
  props: {
    type: {
      type: String,
      default: "image"
    },
    value: String
  },
  data() {
    return {
      BASE_URL: process.env.VUE_APP_BASEURL,
    };
  },
  methods: {
    // 上传成功之后的回调
    handleAvatarSuccess(res) {
      // console.log(res);
      this.$emit("input", res.data.url);
    },
    // 上传之前的回调(一般限制文件类型和大小)
    beforeAvatarUpload(file) {
      if (this.type == "video") {
        const isVedio = file.type === "video/mp4";
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isVedio) {
          this.$message.error("上传视频只能是 MP4 格式!");
        }
        if (!isLt2M) {
          this.$message.error("上传视频大小不能超过 2MB!");
        }
        return isVedio && isLt2M;
      } else {
        const isImage =
          file.type === "image/jpeg" ||
          file.type === "image/png" ||
          file.type === "image/gif";
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isImage) {
          this.$message.error("上传头像图片只能是 png/jpeg/gif 格式!");
        }
        if (!isLt2M) {
          this.$message.error("上传头像图片大小不能超过 2MB!");
        }
        return isImage && isLt2M;
      }
    }
  }
};
</script>

<style lang="less">
.uploadFile {
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>