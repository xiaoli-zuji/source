<template>
  <div>
    子组件2
    <br />
    饮料:{{name}} 价格:{{price}}
  </div>
</template>

<script>
import bus from "./bus";
export default {
  name: "child2",
  data() {
    return {
      name: "",
      price: ""
    };
  },
  created() {
    bus.$on("sendDrinks", obj => {
      this.name = obj.name;
      this.price = obj.price;
    });
  }
};
</script>

<style>
</style>