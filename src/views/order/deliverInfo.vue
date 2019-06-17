<template>
  <el-dialog title="查看物流" :visible.sync="deliverInfodModal.dialogVisible" width="880px" @close="cancelSubmit('deliverInfodModal')">
    <el-form :model="temDeliverInfodModal" ref="deliverInfodModal" :rules="modalRules">
      <el-form-item v-if="temDeliverInfodModal.deliverStatus" label="收件人" label-width="80px">
        <span>{{ temDeliverInfodModal.consignee }}</span>
      </el-form-item>
      <el-form-item v-if="temDeliverInfodModal.deliverStatus" label="联系方式" label-width="80px">
        <span>{{ temDeliverInfodModal.consigneePhone }}</span>
      </el-form-item>
      <el-form-item v-if="temDeliverInfodModal.deliverStatus" label="收货地址" label-width="80px">
        <span>{{ temDeliverInfodModal.receivingAddress }}</span>
      </el-form-item>
      <el-form-item v-if="!temDeliverInfodModal.deliverStatus" label="发货时间" label-width="80px">
        <span>{{ getTimeAll(temDeliverInfodModal.deliveryTime) }}</span>
      </el-form-item>
      <el-form-item v-if="!temDeliverInfodModal.deliverStatus" label="操作人员" label-width="80px">
        <span>{{ temDeliverInfodModal.clerkName ? temDeliverInfodModal.clerkName : '---' }}</span>
      </el-form-item>
      <el-form-item v-if="!temDeliverInfodModal.deliverStatus" label="发货内容" label-width="80px">
        <span style="word-break: break-all;">{{ temDeliverInfodModal.deliveryContent ? temDeliverInfodModal.deliveryContent : '--' }}</span>
      </el-form-item>
      <div class="line"></div>
      <!-- {{ temDeliverInfodModal.traces }} -->
      <div class="editInfo-content" v-show="temDeliverInfodModal.changeType !== 3">
        <div v-if="!editStatus">
          <div class="logistics-item">
            <span>快递公司：</span><span>{{ temDeliverInfodModal.logisticsCompanyName }}</span>
          </div>
          <div class="logistics-item">
            <span>运单号码：</span><span>{{ temDeliverInfodModal.courierNumber }}</span>
          </div>
        </div>
        <div v-else>
          <div class="logistics-item">
            <span>快递公司：</span>
            <el-select v-model="temDeliverInfodModal.logisticsCompanyId" placeholder="请选择快递" clearable @change="changeLogistics" style="width:160px;">
              <el-option :label="item.logisticsCompanyName" :value="item.logisticsCompanyId" v-for="(item, index) in logistiesList" :key="index"></el-option>
            </el-select>
            <p style="margin:0px 10px 0 10px;display:inline-block" v-show="otherLogistics">
              <el-input type="text" v-model="temDeliverInfodModal.otherLogisticsCompanyName" style="width:160px" placeholder="请输入快递公司" @input="value => limitOtherName(value)"> </el-input>
            </p>
          </div>
          <div class="logistics-item">
            <span>运单号码：</span>
            <el-input type="text" v-model="temDeliverInfodModal.courierNumber" style="width:160px" placeholder="请输入快递单号" @input="value => limitCode(value)"> </el-input>
          </div>
        </div>
        <div style="float:right;margin-top:-20px;">
          <el-button type="text" v-show="!editStatus" @click="editLogisticsInfo">修改运单编号</el-button>
          <el-button type="text" v-show="editStatus" @click="updateLogisticsInfo">确认1</el-button>
          <el-button type="text" v-show="editStatus" @click="cancelLogisticsInfo">取消</el-button>
        </div>
      </div>
      <div class="logisticsList" v-show="temDeliverInfodModal.traces.length">
        <ul class="el-timeline is-reverse">
          <li class="el-timeline-item" v-for="(i, v) in temDeliverInfodModal.traces" :key="v">
            <div class="el-timeline-item__tail"></div>
            <div class="el-timeline-item__node el-timeline-item__node--normal el-timeline-item__node--"></div>
            <div class="el-timeline-item__wrapper">
              <div class="el-timeline-item__content">{{ i.acceptStation }}</div>
              <div class="el-timeline-item__timestamp is-bottom">{{ i.acceptTime }}</div>
            </div>
          </li>
        </ul>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelSubmit('deliverInfodModal')">关闭</el-button>
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
    deliverInfodModal: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      getTimeAll: getInputVal.formatDate,
      reverse: true,
      editStatus: false,
      otherLogistics: false,
      otherLogisticsCompanyName: '', //其他公司快递名称
      logisticsCompanyCode: '', //物流公司code
      logisticsCompanyName: '',
      logistiesList: [], //快递公司
      temDeliverInfodModal: ''
    };
  },
  watch: {
    deliverInfodModal() {
      this.temDeliverInfodModal = copy(this.deliverInfodModal);
    }
  },
  created() {
    this.getLogistiesList();
    this.temDeliverInfodModal = copy(this.deliverInfodModal);
    this.logisticsCompanyCode = this.deliverInfodModal.logisticsCompanyCode;
    this.logisticsCompanyName = this.deliverInfodModal.logisticsCompanyName;
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
          this.temDeliverInfodModal.otherLogisticsCompanyName = '';
          //获取下拉的快递名称
          this.logisticsCompanyName = this.logistiesList.find(item => {
            return item.logisticsCompanyId === this.temDeliverInfodModal.logisticsCompanyId;
          }).logisticsCompanyName;
        }
      } else {
        this.otherLogistics = false;
        this.temDeliverInfodModal.otherLogisticsCompanyName = '';
      }
    },
    limitCode(value) {
      this.$nextTick(() => {
        this.temDeliverInfodModal.courierNumber = getInputVal.getInputVal(value, 16);
      });
    },
    limitOtherName(value) {
      this.$nextTick(() => {
        this.temDeliverInfodModal.otherLogisticsCompanyName = getInputVal.getInputVal(value, 8);
      });
    },
    editLogisticsInfo() {
      this.editStatus = true;
    },
    updateLogisticsInfo() {
      let params = {
        optType: 3,
        integralMallProExchangeId: this.temDeliverInfodModal.integralMallProExchangeId,
        logisticsCompanyId: this.temDeliverInfodModal.logisticsCompanyId,
        logisticsCompanyCode: this.logisticsCompanyCode,
        courierNumber: this.temDeliverInfodModal.courierNumber,
        logisticsCompanyName: this.otherLogistics ? this.temDeliverInfodModal.otherLogisticsCompanyName : this.logisticsCompanyName //物流公司名称
      };
      return false
      request.get('/api-integral-mall/order-opt', { params }).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success('发货成功');
          this.temDeliverInfodModal.dialogVisible = false;
          this.$emit('getList');
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    cancelLogisticsInfo() {
      this.editStatus = false;
    },
    //取消修改
    cancelSubmit(formName) {
      this.$refs[formName].resetFields();
      this.otherLogistics = false;
      this.deliverInfodModal.dialogVisible = false;
      this.temDeliverInfodModal.dialogVisible = false;
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
/* 时间线样式 */
.logisticsList {
  padding-top: 15px;
  height: 200px;
  overflow-y: auto;
  border-top: 1px solid #dcdfe6;
  width: 100%;
}
.el-timeline {
  margin: 0;
  font-size: 14px;
  list-style: none;
}
.el-timeline-item {
  position: relative;
  padding-bottom: 20px;
}
.el-timeline-item__tail {
  position: absolute;
  left: 4px;
  height: 100%;
  border-left: 2px solid #e4e7ed;
}
.el-timeline-item__node {
  position: absolute;
  background-color: #e4e7ed;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-timeline-item__node--normal {
  left: -1px;
  width: 12px;
  height: 12px;
}
.el-timeline-item__wrapper {
  position: relative;
  padding-left: 28px;
  top: -3px;
}
.el-timeline-item__content {
  color: #303133;
}
.el-timeline-item__timestamp {
  color: #909399;
  line-height: 1;
  font-size: 13px;
}

.el-timeline-item__timestamp.is-bottom {
  margin-top: 8px;
}
.editInfo-content {
  padding: 20px 0;
}
.logistics-item {
  display: inline-block;
  margin-right: 10px;
  vertical-align: top;
}
</style>
