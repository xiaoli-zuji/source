import Vue from "vue";
import VueRouter from "vue-router";

import { getToken } from "../utils/token";

Vue.use(VueRouter);
// 导入子组件
// import Login from "../views/login";
// import Layout from "../views/layout";
// import chart from "../views/layout/chart";
// import enterprise from "../views/layout/enterprise";
// import question from "../views/layout/question";
// import subject from "../views/layout/subject";
// import user from "../views/layout/user";
// import welcome from "../views/layout/welcome";

// 路由懒加载
const Login = () => import("../views/login");
const Layout = () => import("../views/layout");
const chart = () => import("../views/layout/chart");
const enterprise = () => import("../views/layout/enterprise");
const question = () => import("../views/layout/question");
const subject = () => import("../views/layout/subject");
const user = () => import("../views/layout/user");
const welcome = () => import("../views/layout/welcome");

// 测试
// import parent from "../test/parent-child-brother/parent.vue";
// import slot3 from "../test/slot3/index.vue";

let router = new VueRouter({
  routes: [
    { path: "/", redirect: "/login" },
    { path: "/login", component: Login, meta: { title: "面面" } },
    {
      path: "/layout",
      component: Layout,
      meta: {
        role: ["超级管理员", "管理员", "老师", "学生"],
      },
      children: [
        {
          path: "welcome",
          component: welcome,
          meta: {
            role: ["超级管理员", "管理员", "老师", "学生"],
            fullPath: "/layout/welcome",
            icon: "el-icon-s-grid",
            title: "欢迎你",
          },
        },
        {
          path: "chart",
          component: chart,
          meta: {
            role: ["超级管理员", "管理员", "老师"],
            fullPath: "/layout/chart",
            icon: "el-icon-pie-chart",
            title: "数据预览",
          },
        },
        {
          path: "user",
          component: user,
          meta: {
            role: ["超级管理员", "管理员", "老师"],
            fullPath: "/layout/user",
            icon: "el-icon-user",
            title: "用户列表",
          },
        },
        {
          path: "enterprise",
          component: enterprise,
          meta: {
            role: ["超级管理员", "管理员", "老师"],
            fullPath: "/layout/enterprise",
            icon: "el-icon-office-building",
            title: "企业列表",
          },
        },
        {
          path: "question",
          component: question,
          meta: {
            role: ["超级管理员", "管理员", "老师", "学生"],
            fullPath: "/layout/question",
            icon: "el-icon-edit-outline",
            title: "题库列表",
          },
        },
        {
          path: "subject",
          component: subject,
          meta: {
            role: ["超级管理员", "管理员", "老师"],
            fullPath: "/layout/subject",
            icon: "el-icon-notebook-2",
            title: "学科列表",
          },
        },
      ],
    },

    // 测试
    // { path: "/parent", component: parent },
    // { path: "/slot3", component: slot3 },
  ],
});

// 全局导航守卫
router.beforeEach((to, from, next) => {
  //   console.log("to---", to);
  //   console.log("from---", from);
  //   next();

  if (to.fullPath == "/login") {
    next();
  } else {
    // 要去到非登录页面,就要判断是否登录了
    const token = getToken();
    if (token) {
      //   代表登录了
      next(); //去到想去的页面
    } else {
      next("/login");
    }
  }
});

// 全局后置钩子
router.afterEach((to) => {
  // console.log(to);
  document.title = to.meta.title || "面面";
});
export default router;
