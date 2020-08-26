<template>
  <div>
    子组件
    <table border="1">
      <tr>
        <th style="width:100px;">名称</th>
        <th style="width:200px;">地址</th>
        <th style="width:100px;">状态</th>
      </tr>
      <tr v-for="(item, index) in data" :key="index">
          <td>{{item.name}}</td>
          <td>{{item.address}}</td>
          <td>
              <slot :row="item"/>
          </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
};
</script>

<style></style>
