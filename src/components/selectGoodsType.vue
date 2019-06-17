<template>
  <el-dialog title="新增礼品" :visible.sync="addModalData.dialogVisible" width="450px" @close="cancel">
    <div class="dialog-body">
      <div class="type-item" @click="goAdd('1')">
        <img class="real-img" src="../../static/img/real.png" alt="" />
        <p class="type-name">实物礼品</p>
      </div>
      <div class="type-item" @click="goAdd('0')">
        <img class="virtual-img" src="../../static/img/virtual.png" alt="" />
        <p class="type-name">虚拟礼品<span>（无需物流）</span></p>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    addModalData: {
      type: Object
    }
  },
  data() {
    return {
      dialogVisible: true
    };
  },
  methods: {
    goAdd(type) {
      this.$router.push({ name: 'giftInfo', query: { type: type, giftId: '-1', proReferId: '-1' } });
    },
    cancel() {
      this.addModalData.dialogVisible = false;
    }
  }
};
</script>
<style scoped>
.dialog-body {
  display: flex;
  justify-content: center;
  margin-bottom: 25px;

  /* justify-content: space-around; */
}
.type-item {
  flex: 1;
  text-align: center;
  cursor: pointer;
}
.type-name {
  font-size: 14px;
  color: #606266;
  margin-top: 20px;
}
.type-name span {
  color: #828282;
}
.type-item:hover .type-name {
  color: #303133;
}
.type-item:hover .real-img {
  content: url('../../static/img/real-hover.png');
}
.type-item:hover .virtual-img {
  content: url('../../static/img/virtual-hover.png');
}
</style>
