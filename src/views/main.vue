<template>
  <div class="container">
    <vue-gic-header :projectName="projectName" :collapseFlag="collapseFlag" @collapseTag="collapseTag" @toRouterView="toRouterView"></vue-gic-header>
    <div class="mall-content-container">
      <div class="left-menu">
        <vue-gic-aside-menu :projectName="projectName" :leftModulesName="leftModulesName" :collapseFlag="collapseFlag" style="display:inline-block;height:100%"></vue-gic-aside-menu>
      </div>
      <div class="goods-manege-content" :style="{ marginLeft: widthData }">
        <div :style="{ minHeight: mallHeight + 'px' }">
          <router-view></router-view>
        </div>
        <!-- 右侧页面部分 end-->
        <vue-gic-footer></vue-gic-footer>
      </div>
    </div>
  </div>
</template>
<script>
import bus from '../assets/eventBus.js';
export default {
  data() {
    return {
      mallHeight: document.documentElement.clientHeight - 64 - 98,
      widthData: '200px',
      collapseFlag: false, // 折叠参数
      menuRouter: [], // 路由菜单
      leftMenuRouter: [],
      leftModulesName: '积分商城',
      projectName: 'integral-mall'
    };
  },
  mounted() {
    var that = this;
    bus.$on('widthData', function(widthData) {
      that.widthData = widthData;
    });
  },
  computed: {},
  methods: {
    // 处理路由跳转
    toRouterView(val) {
      var that = this;
      that.$router.push({
        path: val.path
      });
    },
    // 折叠事件
    collapseTag(val) {
      var that = this;
      that.collapseFlag = val;
      if (that.collapseFlag) {
        that.widthData = '64px';
      } else {
        that.widthData = '200px';
      }
    }
  },
  components: {}
};
</script>
<style scoped>
.container {
  height: 100%;
  display: flex;
}
.goods-manege-content {
  flex: 1;
  overflow-x: auto;
  transition: width 0.5s;
  -moz-transition: width 0.5s;
  -webkit-transition: width 0.5s;
  -o-transition: width 0.5s;
  min-width: 1200px;
}
.mall-content-container {
  width: 100%;
  background-color: #f0f2f5;
  /*height:100%;*/
  flex: 1;
  min-width: 1200px;
  overflow-x: auto;
  display: flex;
  overflow-y: auto;
  margin-top: 64px;
}
.left-menu {
  position: fixed;
  height: 100%;
  z-index: 2;
}
</style>
<style>
.leftBar-wrap .cardmenu-item .el-submenu__title,
.leftBar-wrap .cardmenu-item .el-menu-item,
.leftBar-wrap .cardmenu-item .el-submenu .el-menu-item {
  height: 40px;
  line-height: 40px;
}

.leftBar-wrap .el-submenu__title:hover {
  background-color: #020b21;
}

.leftBar-wrap .cardmenu-item li.el-menu-item:hover i {
  /*background-color: #409EFF;*/
  color: #fff;
}

.leftBar-wrap .cardmenu-item li.el-menu-item:hover span {
  /*background-color: #409EFF;*/
  color: #fff;
}

.leftBar-wrap .cardmenu-item li.el-submenu:hover i {
  /*background-color: #409EFF;*/
  color: #fff;
}

.leftBar-wrap .cardmenu-item li.el-submenu:hover span {
  /*background-color: #409EFF;*/
  color: #fff;
}

.leftBar-wrap .cardmenu-item li.el-submenu .el-menu-item:hover label {
  /*background-color: #409EFF;*/
  color: #fff;
  cursor: pointer;
}

.user-form-dialog .el-dialog__body {
  padding: 30px 20px 0;
}
.user-form-dialog .el-dialog__header {
  padding: 0 20px;
  height: 54px;
}
.pass-form-dialog .el-dialog__body {
  padding: 30px 20px 0;
}
.pass-form-dialog .el-dialog__header {
  padding: 0 20px;
  height: 54px;
}

/* 左侧菜单 */
.leftBar-wrap .el-menu {
  background-color: #020b21;
}
.leftBar-wrap .cardmenu-item .el-submenu__title,
.leftBar-wrap .cardmenu-item .el-menu-item,
.leftBar-wrap .cardmenu-item .el-submenu .el-menu-item {
  height: 40px;
  line-height: 40px;
}
.leftBar-wrap .el-submenu__title:hover {
  background-color: #020b21;
}
.leftBar-wrap .cardmenu-item li.el-menu-item:hover i {
  /*background-color: #409EFF;*/
  color: #fff;
}
.leftBar-wrap .cardmenu-item li.el-menu-item:hover span {
  /*background-color: #409EFF;*/
  color: #fff;
}
.leftBar-wrap .cardmenu-item li.el-submenu:hover i {
  /*background-color: #409EFF;*/
  color: #fff;
}
.leftBar-wrap .cardmenu-item li.el-submenu:hover span {
  /*background-color: #409EFF;*/
  color: #fff;
}
.leftBar-wrap .cardmenu-item li.el-submenu .el-menu-item:hover label {
  /*background-color: #409EFF;*/
  color: #fff;
  cursor: pointer;
}
.leftBar-wrap .cardmenu-item .el-submenu.is-active div.el-submenu__title i {
  color: #fff;
}
.leftBar-wrap .cardmenu-item .el-submenu.is-active div.el-submenu__title span {
  color: #fff;
}
.el-menu.el-menu--popup .el-menu-item.is-active label {
  color: #fff;
}
</style>
