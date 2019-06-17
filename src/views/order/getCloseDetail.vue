<template>
  <el-dialog title="查看详情" :visible.sync="closeInfoModal.dialogVisible" width="600px" @close="cancelSubmit('closeInfoModal')">
    <el-form :model="closeInfoModal" ref="closeInfoModal" :rules="modalRules">
      <el-form-item label="收件人" label-width="80px" v-show="closeInfoModal.changeType === 2">
        <span>{{ closeInfoModal.consignee }}</span>
      </el-form-item>
      <el-form-item label="联系方式" label-width="80px" v-show="closeInfoModal.changeType === 2">
        <span>{{ closeInfoModal.consigneePhone }}</span>
      </el-form-item>
      <el-form-item label="收货地址" label-width="80px" v-show="closeInfoModal.changeType === 2">
        <span>{{ closeInfoModal.receivingAddress }}</span>
      </el-form-item>
      <el-form-item label="取消时间" label-width="80px">
        <span>{{ closeInfoModal.cancelTime ? getTimeAll(closeInfoModal.cancelTime) : '--' }}</span>
      </el-form-item>
      <el-form-item label="操作人员" label-width="80px">
        <span>{{ closeInfoModal.clerkName ? closeInfoModal.clerkName : '--' }}</span>
      </el-form-item>
      <el-form-item label="取消原因" label-width="80px">
        <span style="word-break: break-all;">{{ closeInfoModal.cancelReason ? closeInfoModal.cancelReason : '--' }}</span>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelSubmit('closeInfoModal')">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import qs from 'qs';
// import request from '../../service/request.js';
// import copy from '../../utils/clone.js';
import getInputVal from '../../utils/common.js';
export default {
  props: {
    closeInfoModal: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      getTimeAll: getInputVal.formatDate
      // reverse: true,
      // reasonLen: 0,
      // refundPoint: '',
      // refundMoney: '',
      // otherLogistics: false,
      // otherLogisticsCompanyName: '', //其他公司快递名称
      // logisticsCompanyCode: '', //物流公司code
      // logisticsCompanyName: '',
      // modalRules: {
      //   logisticsCompanyId: [{ required: true, message: '请选择快递公司', trigger: 'change' }],
      //   logisticsCode: [{ required: true, message: '请输入运单编号', trigger: 'blur' }],
      //   otherLogisticsCompanyName: [{ required: true, message: '请输入快递公司名称', trigger: 'blur' }],
      //   content: [{ required: true, message: '请输入在线发货的内容', trigger: 'blur' }]
      // },
      // logistiesList: [] //快递公司
    };
  },

  methods: {
    //取消修改
    cancelSubmit(formName) {
      this.$refs[formName].resetFields();
      this.otherLogistics = false;
      this.closeInfoModal.dialogVisible = false;
    }
  }
};
</script>
<style scoped>
.w-450 {
  width: 450px;
}
.line {
  border-bottom: 1px solid #dcdfe6;
}
</style>
