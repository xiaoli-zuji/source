<template>
  <el-container class="layout">
    <el-header class="header">
      <div class="left">
        <i @click="isCollapse = !isCollapse" style="font-size:20px;" class="el-icon-s-fold"></i>
        <img src="../../assets/layout_icon.png" class="marginlr" alt />
        <span class="title">面面</span>
      </div>
      <div class="right">
        <img :src="avatar" alt />
        <span class="name">{{ username }} 欢迎您</span>
        <el-button @click="layout" type="primary">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside width="auto">
        <el-menu
          router
          :default-active="defaultActiveRef"
          :collapse="isCollapse"
          class="el-menu-vertical-demo"
        >
          <el-menu-item
            v-for="item in $router.options.routes[2].children"
            :key="item.meta.fullPath"
            :index="item.meta.fullPath"
            v-show="item.meta.role.includes($store.getters.getUserInfo.role)"
          >
            <i :class="item.meta.icon"></i>
            <span slot="title">{{item.meta.title}}</span>
          </el-menu-item>
          <!-- <el-menu-item index="/layout/welcome">
            <i class="el-icon-s-grid"></i>
            <span slot="title">欢迎你</span>
          </el-menu-item>
          <el-menu-item index="/layout/chart">
            <i class="el-icon-pie-chart"></i>
            <span slot="title">数据预览</span>
          </el-menu-item>
          <el-menu-item index="/layout/user">
            <i class="el-icon-user"></i>
            <span slot="title">用户列表</span>
          </el-menu-item>
          <el-menu-item index="/layout/enterprise">
            <i class="el-icon-office-building"></i>
            <span slot="title">企业列表</span>
          </el-menu-item>
          <el-menu-item index="/layout/question">
            <i class="el-icon-edit-outline"></i>
            <span slot="title">题库列表</span>
          </el-menu-item>
          <el-menu-item index="/layout/subject">
            <i class="el-icon-notebook-2"></i>
            <span slot="title">学科列表</span>
          </el-menu-item>-->
        </el-menu>
      </el-aside>
      <!-- 内容部分 -->
      <el-main style="background-color:#e8e9ec;">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { removeToken } from "../../utils/token";
export default {
  data() {
    return {
      username: "", //用户名
      avatar: "", //头像
      isCollapse: false, //是否折叠菜单
      defaultActiveRef: ""
    };
  },
  methods: {
    // 获取用户信息
    async getUserInfoData() {
      const res = await this.$axios.get("/info");
      // console.log(res.data);
      if (res.data.code == 200) {
        this.username = res.data.data.username;
        this.avatar = process.env.VUE_APP_BASEURL + "/" + res.data.data.avatar;

        // 保存到仓库中
        // 触发 mutations 中的方法
        this.$store.commit("setUserInfo", res.data.data);
      }
    },
    // 退出
    layout() {
      this.$confirm("你确定要退出吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$axios.get("/logout");
          // console.log(res);
          if (res.data.code == 200) {
            // 删除token
            removeToken();
            // 跳转到登录页面
            this.$router.push("/login");
          }
        })
        .catch(() => {
          console.log("取消");
        });
    }
  },
  created() {
    this.defaultActiveRef = this.$route.fullPath;
    this.getUserInfoData();
    // console.log(this.$router);
  }
};
</script>

<style lang="less">
.layout {
  height: 100%;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f3f3f3;
    .left {
      display: flex;
      align-items: center;
      .marginlr {
        margin-left: 10px;
        margin-right: 10px;
      }
      .title {
        font-size: 22px;
        color: #49a1ff;
      }
    }
    .right {
      display: flex;
      align-items: center;
      img {
        width: 43px;
        height: 43px;
        margin-right: 9px;
        border-radius: 50%;
      }
      .name {
        margin-right: 38px;
      }
    }
  }
  .el-menu {
    border-right: solid 0px #e6e6e6;
    list-style: none;
    position: relative;
    margin: 0;
    padding-left: 0;
    background-color: #fff;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
}
</style>