<template>
  <div id="app">
    <router-view> </router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {};
  }
};
</script>

<style>
#app {
  background-color: #f0f2f5;
}
/*面包屑前面两个加粗*/
.mall-crumbs .el-breadcrumb__inner {
  height: 14px;
  font-size: 14px;
  font-family: PingFangSC-Medium;
  font-weight: bold;
  color: #303133;
}
</style>
