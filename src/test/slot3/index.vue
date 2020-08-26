<template>
  <div>
    父组件
    <br />
    <br />
    <!-- 使用子组件 -->
    <my-table :data="enterpriseList">
      <template slot-scope="scope">
        <span :style="{ color: scope.row.status == 1 ? 'red' : 'green' }">
          {{ scope.row.status == 1 ? "启用" : "禁用" }}
        </span>
      </template>
    </my-table>
  </div>
</template>

<script>
import MyTable from "./myTable";
export default {
  name: "slot3",
  components: {
    MyTable,
  },
  data() {
    return {
      enterpriseList: [
        { id: 1, name: "腾讯", address: "深南大道110号", status: 1 },
        { id: 2, name: "华为", address: "坂田大道220号", status: 0 },
        { id: 3, name: "大疆", address: "深圳湾120号", status: 0 },
      ],
    };
  },
};
</script>

<style></style>
