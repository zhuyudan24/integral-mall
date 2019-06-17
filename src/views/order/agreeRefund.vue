<template>
  <el-dialog title="同意退款" :visible.sync="agreeRefundModal.dialogVisible" width="450px" @close="cancelSubmit('agreeRefundModal')">
    <el-form :model="agreeRefundModal" ref="agreeRefundModal" :rules="modalRules">
      <el-form-item label="退回积分" label-width="80px" prop="refundPoint">
        <el-input type="text" v-model="agreeRefundModal.refundPoint" style="width:230px;"> </el-input>
      </el-form-item>
      <el-form-item label="退回金额" label-width="80px" prop="refundMoney">
        <el-input :disabled="agreeRefundModal.refundType === 1" type="text" v-model="agreeRefundModal.refundMoney" style="width:230px;" @blur="spliceMoney"> </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelSubmit('agreeRefundModal')">取 消</el-button>
      <el-button type="primary" @click="submitProNanme('agreeRefundModal')" :loading="submitLoading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import qs from 'qs';
import request from '../../service/request.js';
import copy from '../../utils/clone.js';
// import getInputVal from '../../utils/common.js';
export default {
  props: {
    agreeRefundModal: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    let refundPointValidator = (rule, value, callback) => {
      let reg = /^\d+$/;
      if (Number(value) !== 0) {
        if (!reg.test(Number(value))) {
          callback(new Error('积分必须为正整数'));
        } else if (Number(value) > this.refundPoint) {
          callback(new Error('不能超过最大可退积分'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    let refundMoneyValidator = (rule, value, callback) => {
      let reg = /^\d+(\.\d+)?$/;
      if (!reg.test(value)) {
        callback(new Error('金额必须为大于0数字类型'));
      } else if (Number(value) > this.refundMoney) {
        callback(new Error('不能超过最大可退金额'));
      } else {
        callback();
      }
    };
    return {
      reasonLen: 0,
      refundPoint: '',
      refundMoney: '',
      modalRules: {
        refundPoint: [{ required: true, message: '请输入积分', trigger: 'blur' }, { validator: refundPointValidator, trigger: 'blur' }],
        refundMoney: [{ required: true, message: '请输入金额', trigger: 'blur' }, { validator: refundMoneyValidator, trigger: 'blur' }]
      },
      submitLoading: false //按钮禁止重复提交
    };
  },
  created() {
    this.refundMoney = copy(this.agreeRefundModal.refundMoney);
    this.refundPoint = copy(this.agreeRefundModal.refundPoint);
  },
  methods: {
    spliceMoney() {
      if (this.agreeRefundModal.refundMoney) {
        this.agreeRefundModal.refundMoney = Number(this.agreeRefundModal.refundMoney).toFixed(2);
      }
    },
    //确认提交
    submitProNanme(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            integralMallProRefundId: this.agreeRefundModal.integralMallProRefundId,
            refundMoney: this.agreeRefundModal.refundMoney,
            refundPoint: this.agreeRefundModal.refundPoint
          };
          this.submitLoading = true;
          request.get('/api-integral-mall/agree-refund', { params }).then(res => {
            if (res.data.errorCode === 0) {
              this.$message.success('修改成功');
              this.agreeRefundModal.dialogVisible = false;
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
      this.agreeRefundModal.dialogVisible = false;
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
