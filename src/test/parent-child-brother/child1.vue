<template>
  <div>
    子组件1
    <ul>
      <li v-for="(item, index) in list" :key="index">{{item.name}}--{{item.address}}</li>
    </ul>
    <br />
    <button @click="sendValueToParent">子传父</button>
    <br />
    <button @click="sendValueToChild2">兄弟传值</button>
  </div>
</template>

<script>
import bus from "./bus";
export default {
  name: "child1",
  // props:['list'],
  // props:{
  //   list:Array
  // }
  props: {
    list: {
      type: Array,
      // required:true,
      default: function() {
        return [
          { id: 4, name: "熊大", address: "森林" },
          { id: 5, name: "光头强", address: "地球" }
        ];
      }
    }
  },
  methods: {
    // 子传父
    sendValueToParent() {
      /**
       * 参数1：自定义事件的名字，可以随意写，但是不要写系统已经存在的时间，比如 click
       * 参数2：就是你要传递给父组件的值（任意类型）
       */
      // this.$emit('senfdFood',{name:'鱿鱼虾',price:59})
      this.$parent.getFoodValue({ name: "鸡腿饭", price: 20 });
    },
    // 兄弟传值
    sendValueToChild2() {
      bus.$emit("sendDrinks", { name: "百香果", price: 15 });
    }
  }
};
</script>

<style>
</style>