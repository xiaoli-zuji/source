import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    userInfo: {},
  },
  // 所有更改仓库操作的方法都写在这里
  mutations: {
    setUserInfo(state, userinfo) {
      state.userInfo = userinfo;
    },
  },
  // 所有获取仓库中值的代码，写在getters 中
  getters: {
    getUserInfo(state) {
      return state.userInfo;
    },
  },
});

export default store;
