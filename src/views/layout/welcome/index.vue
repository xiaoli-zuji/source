<template>
  <div>
    {{$store.getters.getUserInfo.username}}欢迎你
    <br />
    你的角色是:{{$store.getters.getUserInfo.role }}
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>