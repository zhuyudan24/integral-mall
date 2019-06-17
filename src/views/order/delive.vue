<template>
  <el-dialog title="发货" :visible.sync="deliverdModal.dialogVisible" width="600px" @close="cancelSubmit('deliverdModal')">
    <el-form :model="deliverdModal" ref="deliverdModal" :rules="modalRules">
      <el-form-item v-if="deliverdModal.changeType === 2" label="收件人" label-width="80px">
        <span>{{ deliverdModal.consignee }}</span>
      </el-form-item>
      <el-form-item v-if="deliverdModal.changeType === 2" label="联系方式" label-width="80px">
        <span>{{ deliverdModal.consigneePhone }}</span>
      </el-form-item>
      <el-form-item v-if="deliverdModal.changeType === 2" label="收货地址" label-width="80px">
        <span>{{ deliverdModal.receivingAddress }}</span>
      </el-form-item>
      <el-form-item label="快递公司" v-if="deliverdModal.changeType === 2" label-width="80px" prop="logisticsCompanyId">
        <el-select v-model="deliverdModal.logisticsCompanyId" placeholder="请选择快递" clearable class="w-450" @change="changeLogistics">
          <el-option :label="item.logisticsCompanyName" :value="item.logisticsCompanyId" v-for="(item, index) in logistiesList" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="deliverdModal.changeType === 2 && otherLogistics" label-width="80px" prop="otherLogisticsCompanyName">
        <el-input type="text" v-model="deliverdModal.otherLogisticsCompanyName" class="w-450" placeholder="请输入快递公司" @input="value => logisticsNameLimit(value)"> </el-input>
      </el-form-item>
      <el-form-item v-if="deliverdModal.changeType === 2" label="运单编号" label-width="80px" prop="courierNumber">
        <el-input type="text" v-model="deliverdModal.courierNumber" class="w-450" placeholder="请输入运单编号" @input="value => limitCode(value)"> </el-input>
      </el-form-item>
      <el-form-item v-if="deliverdModal.changeType === 3" label="发货内容" label-width="80px" prop="content">
        <el-input type="textarea" :rows="4" v-model="deliverdModal.content" class="w-450" @input="value => contentLimit(value)"> </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelSubmit('deliverdModal')">取 消</el-button>
      <el-button type="primary" @click="submitProNanme('deliverdModal')" :loading="submitLoading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import qs from 'qs';
import request from '../../service/request.js';
import copy from '../../utils/clone.js';
import getInputVal from '../../utils/common.js';
export default {
  props: {
    deliverdModal: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      reasonLen: 0,
      refundPoint: '',
      refundMoney: '',
      otherLogistics: false,
      otherLogisticsCompanyName: '', //其他公司快递名称
      logisticsCompanyCode: '', //物流公司code
      logisticsCompanyName: '',
      modalRules: {
        logisticsCompanyId: [{ required: true, message: '请选择快递公司', trigger: 'change' }],
        courierNumber: [{ required: true, message: '请输入运单编号', trigger: 'blur' }],
        otherLogisticsCompanyName: [{ required: true, message: '请输入快递公司名称', trigger: 'blur' }],
        content: [{ required: true, message: '请输入在线发货的内容', trigger: 'blur' }]
      },
      submitLoading: false,
      logistiesList: [] //快递公司
    };
  },
  created() {
    this.refundMoney = copy(this.deliverdModal.refundMoney);
    this.refundPoint = copy(this.deliverdModal.refundPoint);
    this.getLogistiesList();
  },
  methods: {
    getLogistiesList() {
      request.post('/api-integral-mall/load-logisties').then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.result) {
            this.logistiesList = res.data.result;
          } else {
            this.logistiesList = [];
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    changeLogistics(value) {
      if (value) {
        let code = this.logistiesList.find(item => {
          return item.logisticsCompanyId === value;
        }).logisticsCompanyCode;
        this.logisticsCompanyCode = code;
        if (code === 'QITA') {
          this.otherLogistics = true;
        } else {
          this.otherLogistics = false;
          this.deliverdModal.otherLogisticsCompanyName = '';
          //获取下拉的快递名称
          this.logisticsCompanyName = this.logistiesList.find(item => {
            return item.logisticsCompanyId === this.deliverdModal.logisticsCompanyId;
          }).logisticsCompanyName;
        }
      } else {
        this.otherLogistics = false;
        this.deliverdModal.otherLogisticsCompanyName = '';
      }
    },
    logisticsNameLimit(value) {
      this.$nextTick(() => {
        this.deliverdModal.otherLogisticsCompanyName = getInputVal.getInputVal(value, 8);
      });
    },
    limitCode(value) {
      this.$nextTick(() => {
        this.deliverdModal.courierNumber = getInputVal.getInputVal(value, 16);
      });
    },
    contentLimit(value) {
      this.$nextTick(() => {
        this.deliverdModal.content = getInputVal.getInputVal(value, 100);
      });
    },
    //确认修改商品名称
    submitProNanme(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            optType: 1, //1 发货； 2 取消订单； 3 修改物流；
            integralMallProExchangeId: this.deliverdModal.integralMallProExchangeId,
            logisticsCompanyId: this.deliverdModal.logisticsCompanyId, //物流公司id
            logisticsCompanyCode: this.logisticsCompanyCode, //物流公司code号
            logisticsCompanyName: this.otherLogistics ? this.deliverdModal.otherLogisticsCompanyName : this.logisticsCompanyName, //物流公司名称
            courierNumber: this.deliverdModal.courierNumber, //物流单号
            cancelReason: '', //取消发货原因
            deliveryContent: this.deliverdModal.changeType === 3 ? this.deliverdModal.content : '' //在线发货内容
          };
          if (this.deliverdModal.changeType === 3) {
            //在线发货
            params.logisticsCompanyId = '';
            params.logisticsCompanyCode = '';
            params.logisticsCompanyName = '';
            params.courierNumber = '';
          }
          this.submitLoading = true;
          request.get('/api-integral-mall/order-opt', { params }).then(res => {
            if (res.data.errorCode === 0) {
              this.$message.success('发货成功');
              this.deliverdModal.dialogVisible = false;
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
      this.otherLogistics = false;
      this.deliverdModal.dialogVisible = false;
    }
  }
};
</script>
<style scoped>
.w-450 {
  width: 450px;
}
</style>
