<template>
  <div class="mall-section-container">
    <div class="mall-content-section">
      <div class="mall-content-title">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '' }"><a href="/report/#/memberSummary">首页</a></el-breadcrumb-item>
          <el-breadcrumb-item>积分商城</el-breadcrumb-item>
          <el-breadcrumb-item>商品</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/giftExchange' }">礼品</el-breadcrumb-item>
          <el-breadcrumb-item>订单详情</el-breadcrumb-item>
        </el-breadcrumb>
        <h3>
          <span>订单详情</span>
        </h3>
      </div>
      <div class="section">
        <div class="progress-content" v-if="orderStatus > 0">
          <div class="progress-info progress-infoed">
            <p class="info-title">买家下单</p>
            <p class="info-time">{{ orderDetail.createTime ? getTimeAll(orderDetail.createTime) : '- -' }}</p>
          </div>
          <div class="progress-img" :class="{ 'progress-ing': orderStatus !== 1 || orderStatus !== 2 || orderStatus !== 3 || orderStatus !== 4, 'progress-ed': orderStatus === 1 || orderStatus === 2 || orderStatus === 4 || orderStatus === 3 }">
            <div class="progress-circle"></div>
            <div class="progress-circle"></div>
            <div class="progress-circle"></div>
            <div class="progress-circle"></div>
            <div class="progress-circle"></div>
            <div class="progress-circle"></div>
            <div class="progress-circle"></div>
            <div class="progress-circle"></div>
            <div class="progress-circle"></div>
            <div class="progress-circle"></div>
            <div class="progress-circle"></div>
            <div class="progress-circle"></div>
            <div class="progress-circle"></div>
            <i class="el-icon-arrow-right"></i>
          </div>
          <div class="progress-info" :class="{ 'progress-infoed': orderStatus === 1 || orderStatus === 2 || orderStatus === 3 || orderStatus === 4 }">
            <p class="info-title">买家付款</p>
            <p class="info-time" v-if="orderStatus === 1 || orderStatus === 2 || orderStatus === 3 || orderStatus === 4">{{ orderDetail.payTime ? getTimeAll(orderDetail.payTime) : '- -' }}</p>
          </div>
          <div class="progress-img" :class="{ 'progress-ing': orderStatus === 1 || orderStatus === 3, 'progress-ed': orderStatus === 3 || orderStatus === 4 }">
            <div class="progress-circle"></div>
            <div class="progress-circle"></div>
            <div class="progress-circle"></div>
            <div class="progress-circle"></div>
            <div class="progress-circle"></div>
            <div class="progress-circle"></div>
            <div class="progress-circle"></div>
            <div class="progress-circle"></div>
            <div class="progress-circle"></div>
            <div class="progress-circle"></div>
            <div class="progress-circle"></div>
            <div class="progress-circle"></div>
            <div class="progress-circle"></div>
            <i class="el-icon-arrow-right"></i>
          </div>
          <div class="progress-info" :class="{ 'progress-infoed': orderStatus === 3 || orderStatus === 4 }">
            <p class="info-title">商家发货</p>
            <p class="info-time" v-if="orderStatus === 3 || orderStatus === 4">{{ orderDetail.deliveryTime ? getTimeAll(orderDetail.deliveryTime) : '- -' }}</p>
          </div>
          <div class="progress-img" :class="{ 'progress-ing': orderStatus === 3 || orderStatus === 4, 'progress-ed': orderStatus === 4 }">
            <div class="progress-circle"></div>
            <div class="progress-circle"></div>
            <div class="progress-circle"></div>
            <div class="progress-circle"></div>
            <div class="progress-circle"></div>
            <div class="progress-circle"></div>
            <div class="progress-circle"></div>
            <div class="progress-circle"></div>
            <div class="progress-circle"></div>
            <div class="progress-circle"></div>
            <div class="progress-circle"></div>
            <div class="progress-circle"></div>
            <div class="progress-circle"></div>
            <i class="el-icon-arrow-right"></i>
          </div>
          <div class="progress-info" :class="{ 'progress-infoed': orderStatus === 4 }">
            <p class="info-title">交易成功</p>
            <p class="info-time" v-if="orderStatus === 4">{{ orderDetail.finishTime ? getTimeAll(orderDetail.finishTime) : '- -' }}</p>
          </div>
        </div>
        <div class="order-detail">
          <div class="order-mess">
            <h3>订单信息</h3>
            <p class="order-mess-item">
              <span>订单编号：</span>
              <span>{{ orderDetail.definedCode }}</span>
              <el-popover placement="bottom" trigger="hover">
                <p>
                  <span>商户支付号：</span><span>{{ orderDetail.payNumber ? orderDetail.payNumber : '--' }}</span>
                </p>
                <p>
                  <span>支付流水号：</span><span>{{ orderDetail.transactionId ? orderDetail.transactionId : '--' }}</span>
                </p>
                <!-- <el-button slot="reference" type="text" class="iconfont icon-icon-"></el-button> -->
                <i slot="reference" class="iconfont icon-icon-"></i>
              </el-popover>
            </p>
            <p class="order-mess-item">
              <span>会员名称：</span><span class="order-item-detail-mess">{{ orderDetail.memberName }}</span>
            </p>
            <p class="order-mess-item">
              <span>买家卡号：</span>
              <!-- <span>买家卡号：</span><span>{{ orderDetail.cardNum }}</span> -->
              <span class="order-item-detail-mess">
                <a :href="windowUrl + '/member/#/wechatmemberDetail?memberId=' + orderDetail.memberId" target="_blank">{{ orderDetail.cardNum ? orderDetail.cardNum : '' }}</a>
              </span>
            </p>
            <p class="order-mess-item">
              <span>配货方式：</span>
              <span v-if="orderDetail.changeType === 1" class="order-item-detail-mess">微信兑换</span>
              <span v-if="orderDetail.changeType === 2" class="order-item-detail-mess">快递发货</span>
              <span v-if="orderDetail.changeType === 3" class="order-item-detail-mess">在线发货</span>
              <span v-if="orderDetail.changeType === 4" class="order-item-detail-mess">门店自提</span>
              <span v-if="orderDetail.changeType === 5" class="order-item-detail-mess">文本卡券</span>
            </p>
            <p class="order-mess-item" v-if="orderDetail.changeType !== 4 && orderDetail.changeType !== 5">
              <span>收货信息：</span><span class="order-item-detail-mess">{{ orderDetail.receivingAddress }}</span>
            </p>
            <p class="order-mess-item" v-if="orderDetail.changeType === 4">
              <span>提货人：</span><span class="order-item-detail-mess">{{ orderDetail.goodsPerson }}</span>
            </p>
            <p class="order-mess-item" v-if="orderDetail.changeType === 4">
              <span>提货手机：</span><span class="order-item-detail-mess">{{ orderDetail.goodsPhone }}</span>
            </p>
            <p class="order-mess-item" v-if="orderDetail.changeType === 4">
              <span>自提点：</span><span class="order-item-detail-mess">{{ orderDetail.goodsPoint }}</span>
            </p>
            <p class="order-mess-item" v-if="orderDetail.changeType === 4">
              <span>提货地址：</span><span class="order-item-detail-mess">{{ orderDetail.goodsAddress }}</span>
            </p>
            <p class="order-mess-item" v-if="orderDetail.changeType === 4">
              <span>提货时间：</span><span class="order-item-detail-mess">{{ orderDetail.goodsTime ? orderDetail.goodsTime : '--' }}</span>
            </p>
            <p class="order-mess-item" v-if="orderDetail.changeType === 5">
              <span>卡号：</span><span class="order-item-detail-mess">{{ orderDetail.cardNumber ? orderDetail.cardNumber : '--' }}</span>
            </p>
            <p class="order-mess-item" v-if="orderDetail.changeType === 5">
              <span>卡密/券码：</span><span class="order-item-detail-mess">{{ orderDetail.cardPassWord ? orderDetail.cardPassWord : '--' }}</span>
            </p>
          </div>
          <div class="order-operate">
            <!-- 待付款 或者 待发货没申请退款-->
            <div v-if="orderStatus === 11">
              <div class="operate-header">订单已提交成功，等待买家付款</div>
              <el-button type="primary" class="operate-btn" @click="closeOrder">关闭订单</el-button>
            </div>
            <!-- 待发货不属于门店自提 -->
            <div v-if="orderStatus === 1 && orderDetail.changeType !== 4">
              <div class="operate-header">买家已付款，等待商家发货</div>
              <div class="operate-tip">买家已付款到商家账户，请及时发货</div>
              <el-button type="primary" class="operate-btn" @click="deliverOrder">发货</el-button>
              <el-button plain class="operate-btn" v-if="orderStatus === 1 && orderDetail.refundStatus !== 2" @click="closeOrder">关闭订单</el-button>
            </div>
            <!-- 门店自提的待发货 -->
            <div v-if="orderStatus === 1 && orderDetail.changeType === 4">
              <div class="operate-header">买家已付款，等待商家发货</div>
              <div class="operate-tip">买家已付款到商家账户，请及时发货</div>
              <el-button type="primary" class="operate-btn" @click="deliverShop">发货并核销</el-button>
              <el-button plain class="operate-btn" v-if="orderStatus === 1 && orderDetail.refundStatus !== 2" @click="closeOrder">关闭订单</el-button>
            </div>
            <!-- 已发货 -->
            <div v-if="orderStatus === 3">
              <div class="operate-header">商家已发货，等待交易成功</div>
              <div class="operate-tip">等待买家确认收货</div>
            </div>
            <!-- 交易完成 -->
            <div v-if="orderStatus === 4">
              <div class="operate-header">交易成功</div>
              <div class="operate-tip">订单交易完成</div>
            </div>
            <!-- 交易关闭 -->
            <div v-if="orderStatus <= 0">
              <div class="operate-header">交易关闭</div>
              <div class="operate-tip">{{ orderDetail.cancelReason }}</div>
            </div>
          </div>
        </div>
        <div class="order-list">
          <table class="order-table">
            <thead>
              <tr>
                <th style="width:32%">商品</th>
                <th style="width:15%">单价</th>
                <th style="width:13%">数量</th>
                <th style="width:15%">售后</th>
                <th style="width:10%">小计</th>
                <th style="width:15%" v-if="(orderStatus === 3 && (orderDetail.changeType === 2 || orderDetail.changeType === 3)) || (orderStatus === 4 && (orderDetail.changeType === 2 || orderDetail.changeType === 3))">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div class="order-goods-info">
                    <img :src="orderDetail.photoUrl" alt="" />
                    <div class="order-goods-mess">
                      <p class="goods-name">{{ orderDetail.proName }}</p>
                      <p v-for="(item, index) in orderDetail.sku" :key="index" class="goods-sku">
                        <span>{{ item.proName }}</span
                        >:{{ item.valueName }}
                      </p>
                      <p class="goods-procode">{{ orderDetail.proCode }}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div>{{ orderDetail.unitCostIntegral }}积分+{{ orderDetail.unitPrice }}元</div>
                </td>
                <td>{{ orderDetail.goodsNum }}</td>
                <td>
                  <span v-if="orderDetail.refundStatus === 0">退款中</span>
                  <span v-else-if="orderDetail.refundStatus === 1">退款成功</span>
                  <span v-else-if="orderDetail.refundStatus === 2">退款关闭</span>
                  <span v-else-if="orderDetail.refundStatus === -1">--</span>
                </td>
                <td>
                  <div>￥{{ orderDetail.cashShouldPay }}</div>
                </td>
                <td @click="getLogistics" v-if="(orderStatus === 3 && (orderDetail.changeType === 2 || orderDetail.changeType === 3)) || (orderStatus === 4 && (orderDetail.changeType === 2 || orderDetail.changeType === 3))">
                  <el-button type="text">{{ showLogistics ? '收起物流信息' : '展开物流信息' }}</el-button>
                  <i :class="showLogistics ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                </td>
                <!-- v-if="(orderStatus === 3 && orderDetail.changeType === 2) || orderDetail.changeType === 3 || ((orderStatus === 4 && orderDetail.changeType === 2) || orderDetail.changeType === 3)" -->
              </tr>
            </tbody>
          </table>
          <div v-if="(orderStatus === 3 && (orderDetail.changeType === 2 || orderDetail.changeType === 3)) || (orderStatus === 4 && (orderDetail.changeType === 2 || orderDetail.changeType === 3))">
            <div class="logistics-info" v-if="showLogistics">
              <div class="logistics-item">
                <p class="logistics-info-item">
                  <span>快递：</span><span>{{ logisticsInfo.changeLog.logisticsCompanyName }}</span>
                </p>
                <p class="logistics-info-item">
                  <span>物流单号：</span><span>{{ logisticsInfo.changeLog.courierNumber }}</span>
                </p>
                <p class="logistics-info-item">
                  <span>发货时间：</span><span>{{ orderDetail.deliveryTime ? getTimeAll(orderDetail.deliveryTime) : '--' }}</span>
                </p>
              </div>
              <div class="logisticsList">
                <ul class="el-timeline is-reverse">
                  <li class="el-timeline-item" v-for="(i, v) in logisticsInfo.traces" :key="v">
                    <div class="el-timeline-item__tail"></div>
                    <div class="el-timeline-item__node el-timeline-item__node--normal el-timeline-item__node--"></div>
                    <div class="el-timeline-item__wrapper">
                      <div class="el-timeline-item__content">{{ i.acceptStation }}</div>
                      <div class="el-timeline-item__timestamp is-bottom">{{ i.acceptTime }}</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="table-bottom">
            <span>实付金额：</span>
            <span class="pay-money">{{ orderDetail.unitCostIntegral }}积分+{{ orderDetail.payCost }}元</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 关闭订单 -->
    <closeOrder :refunOrderdModal="refunOrderdModal" @getList="getList"></closeOrder>
    <!-- 发货 -->
    <deliverModal :deliverdModal="deliverdModal" @getList="getList" v-show="deliverdModal.dialogVisible"></deliverModal>
    <!-- 门店自提核销 -->
    <el-dialog title="发货并核销" :visible.sync="shopDialogVisible" width="450px">
      <p style="margin-bottom:20px">
        请确认买家出示的提货码为：<span style="color:#f5222d">{{ orderDetail.writeOffCode }}</span>
      </p>
      <p style="margin-bottom:20px">确认无误后，将商品交付给买家，确认核销，则订单交易完成</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="shopDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="hanhdleShopDeliver" :loading="submitLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import qs from 'qs';
import request from '../../service/request.js';
import getInputVal from '../../utils/common.js';
import closeOrder from './closeOrder';
import deliverModal from './delive';
export default {
  data() {
    return {
      getTimeAll: getInputVal.formatDate,
      integralMallProExchangeId: '', //订单id
      orderStatus: 0, //订单状态
      orderDetail: {}, //订单详情
      logisticsInfo: {}, //物流信息
      showLogistics: false,
      windowUrl: window.location.origin,
      refunOrderdModal: {
        //关闭订单
        dialogVisible: false,
        integralMallProExchangeId: ''
      },
      deliverdModal: {
        //发货
        dialogVisible: false,
        changeType: '',
        integralMallProExchangeId: '',
        consignee: '', //收件人
        consigneePhone: '', //联系方式
        receivingAddress: '', //收货地址
        logisticsCompanyId: '',
        logisticsCode: '',
        otherLogisticsCompanyName: ''
      },
      shopDialogVisible: false, //门店自提
      submitLoading: false //门店自提确认按钮
    };
  },
  created() {
    window.onbeforeunload = function(e) {
      // var storage = window.localStorage;
      // storage.clear('giftOrderObj');
      localStorage.removeItem('giftOrderObj');
    };
    this.integralMallProExchangeId = this.$route.query.integralMallProExchangeId;
    this.getOrderDetail();
  },
  methods: {
    //订单详情
    getOrderDetail() {
      let params = {
        integralMallProExchangeId: this.integralMallProExchangeId
      };
      request.get('/api-integral-mall/get_gift_order_info', { params }).then(res => {
        if (res.data.errorCode === 0) {
          this.orderStatus = res.data.result.status;
          this.orderDetail = res.data.result;
          if (res.data.result.sku) {
            this.orderDetail.sku = JSON.parse(res.data.result.sku);
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    //获取物流详情
    getLogistics() {
      if (!this.showLogistics) {
        let params = {
          integralMallProExchangeId: this.integralMallProExchangeId
        };
        request.post('/api-integral-mall/list-logistics-traces', qs.stringify(params)).then(res => {
          if (res.data.errorCode === 0) {
            this.logisticsInfo = res.data.result;
            this.showLogistics = true;
          } else {
            this.$message.error(res.data.message);
          }
        });
      } else {
        this.showLogistics = false;
      }
    },
    //关闭订单
    closeOrder() {
      if (this.orderStatus === 11) {
        //待付款
        let params = {
          integralMallProExchangeId: this.integralMallProExchangeId,
          optType: 4
        };
        request.get('/api-integral-mall/order-opt', { params }).then(res => {
          if (res.data.errorCode === 0) {
            this.$message.success('关闭订单成功');
            this.getOrderDetail();
          } else {
            this.$message.error(res.data.message);
          }
        });
      } else if (this.orderStatus === 1 && this.orderDetail.refundStatus !== 2) {
        //待发货的并且为申请退款的
        this.refunOrderdModal.integralMallProExchangeId = this.integralMallProExchangeId;
        this.refunOrderdModal.dialogVisible = true;
      }
    },
    // 发货
    deliverOrder() {
      // 获取快递发货的信息
      let params = {
        integralMallProExchangeId: this.integralMallProExchangeId
      };
      request.post('/api-integral-mall/list-logistics-traces', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          this.deliverdModal.integralMallProExchangeId = this.integralMallProExchangeId;
          this.deliverdModal.changeType = this.orderDetail.changeType;
          this.deliverdModal.consignee = res.data.result.changeLog.consignee; //收件人
          this.deliverdModal.consigneePhone = res.data.result.changeLog.consigneePhone; //联系方式
          this.deliverdModal.receivingAddress = res.data.result.changeLog.receivingAddress; //收货地址
          this.deliverdModal.deliverStatus = true;
          this.deliverdModal.dialogVisible = true;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    getList() {
      this.getOrderDetail();
    },
    // 门店自提发货
    deliverShop() {
      this.shopDialogVisible = true;
    },
    // 确认门店自提
    hanhdleShopDeliver() {
      let params = {
        optType: 1,
        integralMallProExchangeId: this.integralMallProExchangeId,
        logisticsCompanyId: '',
        logisticsCompanyCode: '',
        logisticsCompanyName: '',
        courierNumber: '',
        cancelReason: '',
        deliveryContent: '',
        changeType: 4
      };
      this.submitLoading = true;
      request.get('/api-integral-mall/order-opt', { params }).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success('发货核销成功');
          this.shopDialogVisible = false;
          this.getOrderDetail();
          this.submitLoading = false;
        } else {
          this.$message.error(res.data.message);
          this.submitLoading = false;
        }
      });
    }
  },
  components: {
    closeOrder,
    deliverModal
  }
};
</script>
<style scoped>
.section {
  background: #fff;
  margin: 24px;
  padding: 24px 32px;
}
/* 进度 */
.progress-content {
  height: 116px;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 14px;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-pack: center;
  justify-content: center;
  -ms-flex-align: center;
  align-items: center;
}
.progress-info {
  font-size: 13px;
  color: #bbc2cb;
  text-align: center;
  position: relative;
}
.info-title {
  line-height: 18px;
  width: 70px;
}
.info-time {
  min-width: 110px;
  line-height: 18px;
  white-space: nowrap;
  position: absolute;
  font-size: 13px;
  top: 24px;
  left: -30%;
  text-align: center;
  white-space: nowrap;
}
.progress-img {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  margin: 0 10px;
}
.progress-circle {
  width: 8px;
  height: 8px;
  background-color: #bbc2cb;
  border-radius: 50%;
  margin-right: 6px;
  transform: scale(0.5);
}
.progress-img .el-icon-arrow-right {
  color: #bbc2cb;
}
.progress-infoed {
  color: #303133;
}
.progress-ing .progress-circle:nth-child(-n + 7) {
  background-color: #67c23a;
}
/* .progress-ing .progress-circle {
  background-color: #67c23a;
} */
.progress-ed .progress-circle {
  background-color: #67c23a;
}
.progress-ing .el-icon-arrow-right {
  color: #bbc2cb;
}
.progress-ed .el-icon-arrow-right {
  color: #67c23a;
}
/* 订单信息 */
.order-detail {
  display: flex;
}
.order-mess {
  width: 300px;
  border-right: 1px solid #ebeef5;
}
.order-mess h3 {
  height: 48px;
  line-height: 48px;
  color: #303133;
  font-size: 13px;
  padding-left: 15px;
  background-color: #f1f3f7;
  width: 285px;
}
.order-mess-item {
  font-size: 13px;
  line-height: 18px;
  color: #303133;
  margin: 8px 0;
  /* display: flex; */
}

.order-mess-item span:first-child {
  width: 80px;
  margin-right: 10px;
  text-align: right;
  display: inline-block;
}
.order-item-detail-mess {
  display: inline-block;
  width: 200px;
  vertical-align: top;
  word-break: break-all;
}
.order-operate {
  border-bottom: 1px solid #ebeef5;
  padding-left: 90px;
  flex: 1;
  margin-left: 15px;
}
.operate-header {
  font-size: 18px;
  color: #606266;
  margin: 36px 0 12px 0;
}
.operate-tip {
  font-size: 13px;
  color: #409eff;
}
.operate-btn {
  margin-top: 40px;
}
.order-list {
  margin-top: 22px;
}
/* 表格 */
.order-table {
  width: 100%;
}
.order-table thead tr {
  height: 48px;
  line-height: 48px;
  background: #f1f3f7;
  border-bottom: 1px solid #e4e7ed;
  color: #303133;
  font-weight: 500;
  font-size: 14px;
}
.order-table thead th {
  text-align: left;
  padding: 0 25px;
}
.order-table tbody tr {
  color: #303133;
  font-size: 14px;
  border-bottom: 1px solid #e4e7ed;
}
.order-table tbody tr:hover {
  background: #f5f7fa;
}
.order-table tbody td {
  text-align: left;
  padding: 12px 25px;
  vertical-align: middle;
}
.el-icon-arrow-down {
  font-size: 14px;
  color: #409eff;
  cursor: pointer;
}
.el-icon-arrow-up {
  font-size: 14px;
  color: #409eff;
  cursor: pointer;
}
.order-goods-info img {
  width: 64px;
  height: 64px;
  border-radius: 4px;
}
.order-goods-mess {
  margin-left: 5px;
  display: inline-block;
  vertical-align: top;
  width: 72%;
}
.goods-name {
  font-size: 14px;
  color: #303133;
  line-height: 18px;
  margin-bottom: 7px;
}
.goods-sku {
  font-size: 13px;
  color: #909399;
  line-height: 18px;
  display: inline-block;
  margin-right: 5px;
}
.goods-procode {
  font-size: 13px;
  color: #909399;
  line-height: 18px;
}
/* 物流信息 */
.logistics-info {
  height: 200px;
  width: 100%;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  padding: 22px 0;
}
.logistics-item {
  width: 400px;
  padding: 25px 40px 0 40px;
  border-right: 1px dashed #e4e7ed;
  /* text-align: center; */
  /* margin-top: 25px; */
}
.logistics-info-item {
  font-size: 13px;
  line-height: 18px;
  color: #303133;
  margin: 8px 0;
  margin: 20px 0;
  display: flex;
  /* white-space: nowrap; */
}
.logistics-info-item span:first-child {
  min-width: 80px;
  text-align: right;
  display: inline-block;
}
.logistics-info-item span:last-child {
  min-width: 80px;
  display: inline-block;
}
.table-bottom {
  text-align: right;
  margin-top: 22px;
  font-size: 14px;
}
.pay-money {
  color: #ff4040;
}
/* 时间线样式 */
.logisticsList {
  padding-top: 15px;
  height: 200px;
  overflow-y: auto;
  margin-left: 40px;
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
.icon-icon- {
  color: #606266;
  cursor: pointer;
}
.icon-icon-:hover {
  color: #303133;
}
</style>
