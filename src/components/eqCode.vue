<template>
  <el-dialog title="商品链接" :visible.sync="modalData.show" width="450px">
    <div class="dialog-body">
      <div class="wechat-url" style="margin-bottom:30px;">
        <p style="font-weight: 600;margin-bottom:15px">页面链接</p>
        <div style="display:flex;align-items: center">
          <el-input type="textarea" :rows="2" v-model="modalData.pageUrl" disabled> </el-input>
          <a href="javaScript:void(0)" style="width:40px;margin-left:20px" v-clipboard:copy="modalData.pageUrl" v-clipboard:success="onCopy" v-clipboard:error="onError">
            复制
          </a>
        </div>
      </div>
      <div class="wechat-img-box" v-loading="modalData.loading">
        <p style="font-weight: 600;margin-bottom:15px">小程序二维码</p>
        <img :src="modalData.imgUrl" class="wechat-img" style="width:140px;height:140px;" />
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    modalData: {
      type: Object
    }
  },
  data() {
    return {
      // loading:true,
    };
  },
  methods: {
    onCopy(e) {
      this.$message.success('复制成功');
    },
    onError(e) {
      this.$message.error('复制失败');
    }
  }
};
</script>
<style scoped>
.wechat-img-box {
  margin: 0 auto;
  text-align: center;
}
.wechat-img {
  width: 200px;
  height: 200px;
}
</style>
