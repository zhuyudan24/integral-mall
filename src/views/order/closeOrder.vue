<template>
  <el-dialog title="关闭订单" :visible.sync="refunOrderdModal.dialogVisible" width="450px" @close="cancelSubmit('refundForm')">
    <el-form :model="refundForm" ref="refundForm" :rules="modalRules">
      <el-form-item label="" label-width="0px" prop="closeReason">
        <p>确认取消订单吗？</p>
        <p>积分将会通过实时返回给会员。相应礼品的库存会归还</p>
        <el-input type="textarea" :rows="5" v-model="refundForm.closeReason" style="width:410px;" @input="value => reasonLimit(value)"> </el-input>
      </el-form-item>
      <span class="slot-num">{{ reasonLen }}/50</span>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelSubmit('refundForm')">取 消</el-button>
      <el-button type="primary" @click="submitProNanme('refundForm')" :loading="submitLoading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import qs from 'qs';
import request from '../../service/request.js';
import getInputVal from '../../utils/common.js';
export default {
  props: {
    refunOrderdModal: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      reasonLen: 0,
      refundForm: {
        closeReason: ''
      },
      submitLoading: false,
      modalRules: {
        closeReason: [{ required: true, message: '请输入关闭原因', trigger: 'blur' }]
      }
    };
  },
  methods: {
    //输入框字数统计
    reasonLimit(value) {
      this.$nextTick(() => {
        this.refundForm.closeReason = getInputVal.getInputVal(value, 50);
        this.reasonLen = getInputVal.getZhLen(this.refundForm.closeReason);
      });
    },
    //确认
    submitProNanme(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            integralMallProExchangeId: this.refunOrderdModal.integralMallProExchangeId,
            cancelReason: this.refundForm.closeReason,
            optType: 2
          };
          this.submitLoading = true;
          request.get('/api-integral-mall/order-opt', { params }).then(res => {
            if (res.data.errorCode === 0) {
              this.$message.success('关闭订单成功1');
              this.refunOrderdModal.dialogVisible = false;
              this.$emit('getList');
              this.submitLoading = false;
            } else {
              this.$message.error(res.data.message);
              this.submitLoading = false;
            }
          });
        } else {
          return false;
        }
      });
    },
    //取消修改
    cancelSubmit(formName) {
      this.$refs[formName].resetFields();
      this.refunOrderdModal.dialogVisible = false;
    }
  }
};
</script>
<style scoped>
.slot-num {
  float: right;
  margin-top: -20px;
  font-size: 13px;
}
</style>
