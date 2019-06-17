<template>
  <el-dialog title="关闭退款" :visible.sync="refundModal.dialogVisible" width="450px" @close="cancelSubmit('refundForm')">
    <el-form :model="refundForm" ref="refundForm" :rules="modalRules">
      <el-form-item label="原因" label-width="80px" prop="reason">
        <el-input type="textarea" :rows="5" v-model="refundForm.reason" style="width:330px;" @input="value => reasonLimit(value)"> </el-input>
      </el-form-item>
      <span class="slot-num">{{ reasonLen }}/200</span>
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
    refundModal: {
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
        reason: ''
      },
      submitLoading: false,
      modalRules: {
        reason: [{ required: true, message: '请输入关闭原因', trigger: 'blur' }]
      }
    };
  },
  methods: {
    //输入框字数统计
    reasonLimit(value) {
      this.$nextTick(() => {
        this.refundForm.reason = getInputVal.getInputVal(value, 200);
        this.reasonLen = getInputVal.getZhLen(this.refundForm.reason);
      });
    },
    //确认修改商品名称
    submitProNanme(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            integralMallProRefundId: this.refundModal.integralMallProRefundId,
            reason: this.refundForm.reason
          };
          this.submitLoading = true;
          request.get('/api-integral-mall/refuse-refund', { params }).then(res => {
            if (res.data.errorCode === 0) {
              this.$message.success('修改成功');
              this.refundModal.dialogVisible = false;
              this.submitLoading = false;
              this.$emit('getList');
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
      this.refundModal.dialogVisible = false;
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
