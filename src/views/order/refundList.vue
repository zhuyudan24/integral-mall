<template>
  <div class="mall-section-container">
    <div class="mall-content-section">
      <div class="mall-content-title" style="border:none">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '' }"><a href="/report/#/memberSummary">首页</a></el-breadcrumb-item>
          <el-breadcrumb-item>积分商城</el-breadcrumb-item>
          <el-breadcrumb-item>订单</el-breadcrumb-item>
          <el-breadcrumb-item>退款列表</el-breadcrumb-item>
        </el-breadcrumb>
        <h3>
          <span>退款列表</span>
        </h3>
      </div>
      <el-tabs v-model="status" class="bread-content" @tab-click="handleClick">
        <div style="height:24px;background:#f0f2f5;"></div>
        <div>
          <div class="operate-top">
            <div class="fl">
              <div class="search-item">
                <el-date-picker class="date-picker" @change="changeTime" v-model="dateValue" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
              </div>
              <div class="search-item">
                <el-select v-model="refundType" placeholder="退款方式" clearable class="w-140" @change="getListCurr">
                  <el-option label="仅退款" :value="1"></el-option>
                  <el-option label="退货退款" :value="2"></el-option>
                </el-select>
              </div>
              <div class="search-item">
                <el-input class="w-340" v-model="searchValue" placeholder="请输入商品/会员/订单/退款编号进行搜索" prefix-icon="el-icon-search" clearable @keyup.enter.native="handleInputSearch(searchValue)" @clear="handleInputSearch(searchValue)"> </el-input>
              </div>
            </div>
          </div>
        </div>
        <el-tab-pane label="全部" name="-1" class="goods-table-content"> </el-tab-pane>
        <el-tab-pane label="待退款" name="0" class="goods-table-content"> </el-tab-pane>
        <el-tab-pane label="退款成功" name="1" class="goods-table-content"> </el-tab-pane>
        <el-tab-pane label="退款关闭" name="2" class="goods-table-content"> </el-tab-pane>
        <div class="goods-list-content">
          <el-table :data="tableData" ref="multipleTable" style="width: 100%" @sort-change="sortChange" v-loading="loading">
            <el-table-column type="selection" width="40"> </el-table-column>
            <el-table-column label="礼品信息" min-width="300px">
              <template slot-scope="scope">
                <div class="gift-info">
                  <img :src="scope.row.photoUrl" />
                  <div class="info-name">
                    <p class="pro-ellipsis">{{ scope.row.proName }}</p>
                    <p class="category-ellipsis">
                      <span v-for="(i, v) in scope.row.sku" :key="v" style="margin-right:5px">{{ i.proName }}:{{ i.valueName ? i.valueName : '--' }}</span>
                    </p>
                    <p class="category-ellipsis">规格编码:{{ scope.row.proCode }}</p>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="申请时间" sortable="custom" min-width="120px">
              <template slot-scope="scope">
                <p style="line-height:18px">{{ getTime(scope.row.createTime) }}</p>
                <p style="line-height:18px" class="gray-color">{{ getSeconds(scope.row.createTime) }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="orderRefundNumber" label="退款编号" min-width="140px">
              <template slot-scope="scope">
                <el-dropdown placement="bottom-end" class="drop-list" trigger="click">
                  <span class="el-dropdown-link"> {{ scope.row.refundNumber }}<i class="iconfont icon-icon-"></i> </span>
                  <el-dropdown-menu slot="dropdown" style="width:400px;">
                    <el-dropdown-item>订单编号：{{ scope.row.definedCode }}</el-dropdown-item>
                    <el-dropdown-item><span class="fw600">协商记录</span></el-dropdown-item>
                    <el-dropdown-item v-for="(i, v) in scope.row.consultList" :key="v">
                      <p>
                        <span v-if="i.role === 1" class="fw600" style="margin-right:10px">商家</span>
                        <span v-if="i.role === 2" class="fw600" style="margin-right:10px">买家</span>
                        <span>{{ i.createTime ? getTimeAll(i.createTime) : '--' }}</span>
                      </p>
                      <p>{{ i.description }}</p>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>

                <!-- <p>{{ scope.row.refundNumber }}</p> -->
              </template>
            </el-table-column>
            <el-table-column prop="definedCode" label="退款方式">
              <template slot-scope="scope">
                <p v-if="scope.row.refundType === 1">仅退款</p>
                <p v-if="scope.row.refundType === 2">退货退款</p>
              </template>
            </el-table-column>
            <el-table-column prop="definedCode" label="申请金额">
              <template slot-scope="scope">
                <p style="line-height:18px">积分：{{ scope.row.maxRefundPoints }}</p>
                <p style="line-height:18px">现金：￥{{ scope.row.maxRefundPrice }}</p>
              </template>
            </el-table-column>
            <el-table-column label="会员" min-width="120px">
              <template slot-scope="scope">
                <memberInfo :memberObj="scope.row" :requestProject="requestProject" :placement="placement"></memberInfo>
                <!-- <p>{{ scope.row.memberName }}</p>
                <p>
                  <a :href="windowUrl + '/member/#/wechatmemberDetail?memberId=' + scope.row.memberId" target="_blank">{{ scope.row.memberCardNumber }}</a>
                </p> -->
              </template>
            </el-table-column>
            <el-table-column prop="complete" label="退款状态">
              <template slot-scope="scope">
                <p style="line-height:18px;margin-bottom:5px" v-if="scope.row.refundStatus === 0">待退款</p>
                <p style="line-height:18px;" v-if="scope.row.refundStatus === 1">退款成功</p>
                <p style="line-height:18px;" v-if="scope.row.refundStatus === 2">退款关闭</p>
                <p style="line-height:18px">
                  <el-button type="text" v-if="scope.row.refundStatus === 0" @click="handleArgeeRefund(scope.row)">同意</el-button>
                  <el-button type="text" v-if="scope.row.refundType === 1 && scope.row.refundStatus === 0 && scope.row.changeType !== 4" @click="handleDeliver(scope.row)">发货</el-button>
                  <el-button type="text" v-if="scope.row.refundType === 1 && scope.row.refundStatus === 0 && scope.row.changeType === 4" @click="deliverShop(scope.row)">核销</el-button>
                  <el-button type="text" v-if="scope.row.refundType === 2 && scope.row.refundStatus === 0" @click="handleCloseRefund(scope.row)">关闭</el-button>
                </p>
              </template>
            </el-table-column>
            <template slot="empty">
              <div class="no-data-wrap">
                <div class="no-data-icon">
                  <img src="../../../static/img/no-data_icon.png" />
                </div>
                <p>暂无数据</p>
              </div>
            </template>
          </el-table>
        </div>
        <div class="pagination-conteiner" style="background:#fff;margin:-50px 24px 0 24px">
          <div class="pagination">
            <el-pagination v-if="total != 0" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="total"> </el-pagination>
          </div>
        </div>
      </el-tabs>
    </div>
    <!-- 门店自提核销 -->
    <el-dialog title="发货并核销" :visible.sync="shopDialogVisible" width="450px">
      <p style="margin-bottom:20px">
        请确认买家出示的提货码为：<span style="color:#f5222d">{{ writeOffCode }}</span>
      </p>
      <p style="margin-bottom:20px">确认无误后，将商品交付给买家，确认核销，则订单交易完成</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="shopDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="hanhdleShopDeliver" :loading="submitLoading">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 关闭退款单 -->
    <closeRefund :refundModal="refundModal" @getList="getList"></closeRefund>
    <!-- 同意退款 -->
    <agreeRefund :agreeRefundModal="agreeRefundModal" @getList="getList" v-if="agreeRefundModal.dialogVisible"></agreeRefund>
    <!-- 发货 -->
    <deliverModal :deliverdModal="deliverdModal" @getList="getList"></deliverModal>
  </div>
</template>

<script>
import qs from 'qs';
import request from '../../service/request.js';
import getInputVal from '../../utils/common.js';
import closeRefund from './closeRefund';
import agreeRefund from './agreeRefund';
import deliverModal from './delive';
import memberInfo from '../../components/memberInfo';
export default {
  data() {
    return {
      requestProject: 'integral-mall',
      placement: 'top-start',
      getTime: getInputVal.getTime,
      getSeconds: getInputVal.getSeconds,
      getTimeAll: getInputVal.formatDate,
      status: '-1',
      currentPage: 1,
      pageSizes: [20, 40, 60, 80],
      pageSize: 20,
      total: 0,
      loading: false,
      tableData: [],
      searchValue: '', //搜索字段
      refundType: '', //退款方式
      dateValue: [new Date() - 90 * 24 * 60 * 60 * 1000, new Date().valueOf()], //时间
      startTime: '',
      endTime: '',
      sortColumn: '',
      sortType: 'desc',
      windowUrl: window.location.origin,
      //退款关闭
      refundModal: {
        dialogVisible: false,
        integralMallProRefundId: '' //退款id
      },
      // 同意退款
      agreeRefundModal: {
        dialogVisible: false,
        integralMallProRefundId: '', //退款id
        refundMoney: '',
        refundPoint: ''
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
      shopIntegralMallProExchangeId: '', //门店自提订单id
      writeOffCode: '', //核销码
      submitLoading: false //门店自提确认按钮
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // tab切换
    // tab切换
    handleClick(tab) {
      this.status = tab.name;
      this.getList();
    },
    // 分页
    handleSizeChange(size) {
      //设置每页条数
      this.pageSize = size;
      this.getList();
    },
    handleCurrentChange(page) {
      //设置跳到第几页
      this.currentPage = page;
      this.getList();
    },
    // 搜索
    handleInputSearch() {
      this.currentPage = 1;
      this.getList();
    },
    getListCurr() {
      this.currentPage = 1;
      this.getList();
    },
    // 排序
    sortChange(value) {
      this.sortColumn = value.prop;
      if (value.order == 'ascending') {
        this.sortType = 'asc';
      } else if (value.order == 'descending') {
        this.sortType = 'desc';
      }
      this.getList();
    },
    // 时间改变
    changeTime() {
      if (this.dateValue) {
        this.startTime = this.getTimeAll(this.dateValue[0]);
        this.endTime = this.getTimeAll(this.dateValue[1]);
      } else {
        this.startTime = '';
        this.endTime = '';
      }
      this.currentPage = 1;
      this.getList();
    },
    //获取退款列表
    getList() {
      this.startTime = this.dateValue ? this.getTimeAll(this.dateValue[0]) : '';
      this.endTime = this.dateValue ? this.getTimeAll(this.dateValue[1]) : '';
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        refundType: this.refundType,
        search: this.searchValue,
        sort: this.sortType,
        startTime: this.startTime,
        endTime: this.endTime,
        status: this.status === '-1' ? '' : this.status
      };
      this.loading = true;
      request.post('/api-integral-mall/page-refunds', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.result.result) {
            this.tableData = res.data.result.result;
            this.total = res.data.result.totalCount;
          } else {
            this.tableData = [];
            this.total = 0;
          }
          this.loading = false;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 关闭退款
    handleCloseRefund(item) {
      this.refundModal.dialogVisible = true;
      this.refundModal.integralMallProRefundId = item.integralMallProRefundId;
    },
    // 同意退款
    handleArgeeRefund(item) {
      this.agreeRefundModal.refundMoney = item.maxRefundPrice;
      this.agreeRefundModal.refundPoint = item.maxRefundPoints;
      this.agreeRefundModal.integralMallProRefundId = item.integralMallProRefundId;
      this.agreeRefundModal.refundType = item.refundType;
      this.agreeRefundModal.dialogVisible = true;
    },
    // 发货
    handleDeliver(item) {
      // 获取快递发货的信息
      let params = {
        integralMallProExchangeId: item.integralMallProExchangeId
      };
      request.post('/api-integral-mall/list-logistics-traces', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          this.deliverdModal.integralMallProExchangeId = item.integralMallProExchangeId;
          this.deliverdModal.changeType = item.changeType;
          this.deliverdModal.consignee = res.data.result.changeLog.consignee; //收件人
          this.deliverdModal.consigneePhone = res.data.result.changeLog.consigneePhone; //联系方式
          this.deliverdModal.receivingAddress = res.data.result.changeLog.receivingAddress; //收货地址
          this.deliverdModal.courierNumber = '';
          this.deliverdModal.dialogVisible = true;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 门店自提发货
    deliverShop(item) {
      this.shopDialogVisible = true;
      this.shopIntegralMallProExchangeId = item.integralMallProExchangeId;
      this.writeOffCode = item.writeOffCode;
    },
    // 确认门店自提
    hanhdleShopDeliver(item) {
      let params = {
        optType: 1,
        integralMallProExchangeId: this.shopIntegralMallProExchangeId,
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
          this.getList();
          this.submitLoading = false;
        } else {
          this.$message.error(res.data.message);
          this.submitLoading = false;
        }
      });
    }
  },
  components: {
    closeRefund,
    agreeRefund,
    deliverModal,
    memberInfo
  }
};
</script>
<style scoped>
.section {
  background: #fff;
  margin: 24px;
  padding: 24px;
}

.operate-top {
  background: #fff;
  height: 32px;
  background: #fff;
  margin: 0 25px;
  padding: 25px 25px 0 25px;
}
.goods-list-content {
  margin: 0 25px 25px 25px;
  padding: 22px 24px 24px 24px;
  background: #fff;
}
.gift-info img {
  width: 63px;
  height: 63px;
  border-radius: 4px;
  margin-right: 5px;
  border: 1px solid #dcdfe6;
}
.info-name {
  display: inline-block;
  vertical-align: top;
  width: 65%;
}
.pro-ellipsis {
  color: #303133;
  height: 36px;
  line-height: 18px;
  font-size: 14px;
}
.category-ellipsis {
  color: #909399;
  font-size: 13px;
  line-height: 14px;
}
.el-icon-edit {
  margin-left: 5px;
  cursor: pointer;
}
.pagination-conteiner {
  padding: 30px 16px 34px 0;
}
.w-340 {
  width: 340px;
}
.w-140 {
  width: 140px;
}
.fw600 {
  font-weight: 600;
}
.drop-list .icon-icon- {
  color: #909399;
  margin-left: 5px;
  cursor: pointer;
}
.drop-list .icon-icon-:hover {
  color: #303133;
}
</style>
