<template>
  <div class="login-container">
    <div class="left">
      <div class="title-box">
        <img src="@/assets/login_icon.png" alt />
        <span class="title">面面</span>
        <span class="line"></span>
        <span class="sub-title">用户登录</span>
      </div>
      <!-- form表单部分 -->
      <el-form :model="loginForm" ref="loginFormRef" :rules="rules" class="login-form">
        <el-form-item prop="phone">
          <el-input v-model="loginForm.phone" prefix-icon="el-icon-user" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-row :gutter="20">
            <el-col :span="16">
              <el-input v-model="loginForm.code" prefix-icon="el-icon-key" placeholder="请输入验证码"></el-input>
            </el-col>
            <el-col :span="8">
              <img @click="getCode" class="captcha" :src="codeUrl" alt />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="isCheck">
          <el-checkbox v-model="loginForm.isCheck"></el-checkbox>我已阅读并同意
          <el-link type="primary" href="http://www.baidu.com">用户协议</el-link>和
          <el-link type="primary" href="http://www.baidu.com">隐私条款</el-link>
        </el-form-item>
        <el-form-item>
          <el-button style="width:100%" type="primary" @click="loginClick">登录</el-button>
        </el-form-item>
        <el-form-item>
          <el-button style="width:100%" @click="register" type="primary">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="right">
      <img src="../../assets/login_bg.png" alt />
    </div>
    <!-- 注册子组件 -->
    <register ref="registerRef"></register>
  </div>
</template>

<script>
// 按需导入
import { setToken } from "../../utils/token";
// 导入注册组件
import register from "./register";

export default {
  components: {
    register
  },
  name: "Login",
  data() {
    return {
      codeUrl: process.env.VUE_APP_BASEURL + "/captcha?type=login",
      loginForm: {
        // 模型
        phone: "", // 手机号
        password: "", // 密码
        code: "", // 验证码
        isCheck: true //是否勾选用户协议
      },
      rules: {
        // 校验规则
        phone: [
          // { required: true, message: "必须输入手机号", trigger: "blur" },
          // { min: 11, max: 11, message: "手机号必须是11位数", trigger: "blur" },
          // 自定义校验器
          {
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("电话号码不能为空"));
              }

              let reg = /^1[3456789][0-9]{9}$/;
              if (!reg.test(value)) {
                callback(new Error("电话号码不合法"));
              }
              callback();
            },
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "必须输入密码", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "blur"
          }
        ],
        code: [
          { required: true, message: "必须输入验证码", trigger: "blur" },
          {
            min: 4,
            max: 4,
            message: "验证码必须是4位数",
            trigger: "blur"
          }
        ],
        isCheck: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("必须勾选用户协议"));
              }
              callback();
            },
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    getCode() {
      // console.log(123);
      // 1.通过随机数
      // this.codeUrl =process.env.VUE_APP_BASEURL + "/captcha?type=login&r=" + Math.random();
      // 2.通过时间
      this.codeUrl =
        process.env.VUE_APP_BASEURL +
        "/captcha?type=login&t=" +
        (new Date() - 0); //时间-0 转换成 秒
      // console.log(this.codeUrl);
    },

    // 登录
    loginClick() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        //  发送post请求
        let res = await this.$axios.post("/login", this.loginForm);

        if (res.data.code == 200) {
          // 提示
          this.$message({
            message: "登陆成功了",
            type: "success"
          });
          // 保存token
          setToken(res.data.data.token);
          // 跳转到后台管理页面
          this.$router.push("/layout/welcome");
        } else {
          this.$message.error(res.data.message);
          this.codeUrl =
            process.env.VUE_APP_BASEURL +
            "/captcha?type=login&r=" +
            Math.random();
        }
        // this.$axios.post("/login", this.loginForm).then((res) => {
        //   console.log(res);
        //   if (res.data.code == 200) {
        //     this.$message({
        //       message: "登陆成功了",
        //       type: "success",
        //     });
        //   } else {
        //     this.$message.error(res.data.message);
        //     this.codeUrl =
        //       process.env.VUE_APP_BASEURL +
        //       "/captcha?type=login&r=" +
        //       Math.random();
        //   }
        // });
      });
    },

    // 注册
    register() {
      this.$refs.registerRef.dialogVisible = true;
    }
  },
  async created() {
    // console.log("开发阶段的基准路径", process.env.VUE_APP_BASEURL);
    // function promiseTest() {
    //   let promise = new Promise((resolve, jecect) => {
    //     let r = Math.random();
    //     console.log(r);
    //     if (r > 0.5) {
    //       resolve("成功之后的结果");
    //     } else {
    //       jecect("失败");
    //     }
    //   });
    //   return promise;
    // }
    // let res = await promiseTest();
    // console.log(res);
    // promiseTest()
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }
};
</script>

<style lang="less">
.login-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: linear-gradient(225deg, #1493fa, #01c6fa);
  .left {
    width: 478px;
    height: 550px;
    background: #f5f5f5;
    padding: 48px;
    .title-box {
      display: flex;
      align-items: center;
      img {
        width: 22px;
        height: 17px;
        margin-right: 16px;
      }
      .title {
        font-size: 24px;
        margin-right: 14px;
      }
      .line {
        width: 1px;
        background-color: #c7c7c7;
        height: 27px;
        margin-right: 12px;
      }
      .sub-title {
        font-size: 22px;
      }
    }
  }
}
.login-form {
  margin-top: 29px;
  .captcha {
    width: 100%;
    height: 40px;
  }
}
</style>
