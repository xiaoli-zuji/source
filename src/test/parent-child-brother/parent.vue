<template>
  <div style="width:800px;height:600px;border:1px solid red">
    我是父组件
    <br>
    中午想吃 <b style="color:red">{{foodPrice}}</b> 元的 <b style="color:green">{{foodName}}</b>
    <br />
    <br />
    <br />
    <div style="margin-left:30px;float:left;width:300px;height:400px;border:1px solid green">
      <!-- 下面必须绑定 -->
      <!-- <child1 :list="dashenList" @senfdFood="getFoodValue"></child1> -->
      <!-- <child1></child1> -->
      <child1 :list="dashenList"></child1>
    </div>
    <div style="margin-right:30px;float:right;width:300px;height:400px;border:1px solid blue">
      <child2></child2>
    </div>
  </div>
</template>

<script>
import child1 from "./child1";
import child2 from "./child2";
export default {
  name: "parent",
  components: {
    child1,
    child2
  },
  data() {
    return {
      foodName: "",
      foodPrice: "",
      dashenList: [
        { id: 1, name: "郑千里", address: "河南南阳" },
        { id: 2, name: "王子丰", address: "湖南浏阳" },
        { id: 3, name: "唐波", address: "湖南长沙" }
      ]
    };
  },
  methods: {
    getFoodValue(obj){
      // console.log('你好',obj);
      this.foodName=obj.name
      this.foodPrice=obj.price
    }
  },
};
</script>

<style>
</style>