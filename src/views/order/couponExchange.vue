<template>
  <div class="mall-section-container">
    <div class="mall-content-section">
      <div class="mall-content-title" style="border:none">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '' }"><a href="/report/#/memberSummary">首页</a></el-breadcrumb-item>
          <el-breadcrumb-item>积分商城</el-breadcrumb-item>
          <el-breadcrumb-item>订单</el-breadcrumb-item>
          <el-breadcrumb-item>优惠券兑换</el-breadcrumb-item>
        </el-breadcrumb>
        <h3>
          <span>优惠券兑换</span>
        </h3>
      </div>
      <el-tabs v-model="orderStatus" class="bread-content" @tab-click="handleClick">
        <div style="height:24px;background:#f0f2f5;"></div>
        <div>
          <div class="operate-top">
            <div class="fl">
              <div class="search-item">
                <el-date-picker class="date-picker" @change="changeTime" v-model="dateValue" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
              </div>
              <!-- <div class="search-item">
                <el-select v-model="changeType" placeholder="配送方式" clearable @change="getList">
                  <el-option label="物流发货" :value="2"></el-option>
                  <el-option label="在线发货（虚拟商品）" :value="3"></el-option>
                </el-select>
              </div> -->
              <div class="search-item">
                <el-input v-model="searchValue" style="width:260px;" placeholder="请输入会员/卡券/订单进行搜索" prefix-icon="el-icon-search" clearable @keyup.enter.native="handleInputSearch(searchValue)" @clear="handleInputSearch(searchValue)"> </el-input>
              </div>
            </div>
            <div class="fr">
              <el-button @click="exportExcel" v-if="integralMallProId" type="primary"><i class="iconfont icon-icon_yunxiazai" style="margin-right:5px"></i>导出订单</el-button>
              <el-button @click="exportExcelAll" v-else type="primary"><i class="iconfont icon-icon_yunxiazai" style="margin-right:5px"></i>导出订单</el-button>
            </div>
          </div>
        </div>
        <el-tab-pane label="全部" name="-1" class="goods-table-content"> </el-tab-pane>
        <el-tab-pane label="待付款" name="11" class="goods-table-content"> </el-tab-pane>
        <el-tab-pane label="已付款" name="12" class="goods-table-content"> </el-tab-pane>
        <el-tab-pane label="交易关闭" name="0" class="goods-table-content"> </el-tab-pane>
        <div class="goods-list-content">
          <el-table :data="tableData" ref="multipleTable" style="width: 100%" @sort-change="sortChange" v-loading="loading">
            <!-- <el-table-column type="selection" width="40"> </el-table-column> -->
            <el-table-column label="礼品信息" width="300px">
              <template slot-scope="scope">
                <div class="gift-info">
                  <!-- <img v-if="scope.row.cardType === 2" src="../../../static/img/dui.png" alt="" /> -->
                  <!-- 抵换券 -->
                  <!-- <img v-if="scope.row.cardType === 0" src="../../../static/img/di.png" alt="" /> -->

                  <!-- 折扣券 -->
                  <!-- <img v-if="scope.row.cardType === 1" src="../../../static/img/zhe.png" alt="" /> -->
                  <!-- 兑换券 -->
                  <img v-if="scope.row.giftMainPic" :src="scope.row.giftMainPic" alt="" />
                  <img v-if="scope.row.cardType === 2 && !scope.row.giftMainPic" src="../../../static/img/quan02.png" alt="" />
                  <!-- 抵金券 -->
                  <img v-if="scope.row.cardType === 0 && !scope.row.giftMainPic" src="../../../static/img/quan01.png" alt="" />
                  <!-- 折扣券 -->
                  <img v-if="scope.row.cardType === 1 && !scope.row.giftMainPic" src="../../../static/img/quan03.png" alt="" />
                  <div class="info-name">
                    <p class="pro-ellipsis">{{ scope.row.giftName }}</p>
                    <!-- status： <= 1是未领取，2是已领取 -->
                    <p style="font-size:13px;color:#909399"><span v-if="scope.row.status === 2">已领取</span><span v-if="scope.row.status <= 1">未领取</span> / <span v-if="scope.row.useStatus === 5">已使用</span><span v-if="scope.row.useStatus === 0">未使用</span></p>
                    <!-- <p class="category-ellipsis">
                      <span v-for="(i, v) in scope.row.sku" :key="v" style="margin-right:3px">{{ i.proName }}:{{ v.valueName ? v.valueName : '--' }}</span>
                    </p>
                    <p class="category-ellipsis">规格编码:{{ scope.row.proCode }}</p> -->
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="下单时间" sortable="custom">
              <template slot-scope="scope">
                <p style="line-height:18px">{{ scope.row.createTime ? getTime(scope.row.createTime) : '--' }}</p>
                <p style="line-height:18px" class="gray-color">{{ scope.row.createTime ? getSeconds(scope.row.createTime) : '--' }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="definedCode" label="订单编号" width="200px">
              <template slot-scope="scope">
                <el-dropdown @visible-change="i => getOrderInfo(i, scope.row.integralMallProExchangeId)" trigger="click" class="drop-list">
                  <span class="el-dropdown-link"> {{ scope.row.definedCode }}<i class="iconfont icon-icon-"></i> </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="orderInfo.definedCode">订单编号：{{ orderInfo.orderNumber }}</el-dropdown-item>
                    <el-dropdown-item command="orderInfo.definedCode">商户支付号：{{ orderInfo.merchantNumber }}</el-dropdown-item>
                    <el-dropdown-item command="orderInfo.definedCode">支付流水号：{{ orderInfo.payNumber }}</el-dropdown-item>
                    <el-dropdown-item command="orderInfo.definedCode">下单时间：{{ orderInfo.orderTime ? getTimeAll(orderInfo.orderTime) : '--' }}</el-dropdown-item>
                    <el-dropdown-item command="orderInfo.definedCode">付款时间：{{ orderInfo.payTime ? getTimeAll(orderInfo.payTime) : '--' }}</el-dropdown-item>
                    <el-dropdown-item command="orderInfo.definedCode">发货时间：{{ orderInfo.deliveryTime ? getTimeAll(orderInfo.deliveryTime) : '--' }}</el-dropdown-item>
                    <el-dropdown-item command="orderInfo.definedCode">交易完成时间：{{ orderInfo.finishTime ? getTimeAll(orderInfo.finishTime) : '--' }}</el-dropdown-item>
                    <el-dropdown-item command="orderInfo.definedCode">收货信息：{{ orderInfo.definedCode }} {{ orderInfo.consignee }} {{ orderInfo.consigneePhone }} {{ orderInfo.receivingAddress }}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
            <el-table-column label="会员">
              <template slot-scope="scope">
                <memberInfo :memberObj="scope.row" :requestProject="requestProject" :placement="placement"></memberInfo>
              </template>
            </el-table-column>
            <el-table-column prop="complete" label="交易状态">
              <template slot-scope="scope">
                <p style="line-height:18px">
                  <span v-if="scope.row.status <= 0">交易关闭</span>
                  <span v-if="scope.row.status === 2 || scope.row.status === 1">买家已付款</span>
                  <span v-if="scope.row.status === 11">待付款</span>
                </p>
                <p style="line-height:18px">
                  <el-button type="text" v-if="scope.row.status === 11 && scope.row.refundStatus !== 2" @click="closeOrderNoPay(scope.row)">关闭订单</el-button>
                </p>
              </template>
            </el-table-column>
            <el-table-column prop="saleNum" label="实付金额">
              <template slot-scope="scope">
                <p style="line-height:18px">积分：{{ scope.row.unitCostIntegral }}</p>
                <p style="line-height:18px">现金：￥{{ scope.row.payCost }}</p>
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
            <el-pagination v-if="total != 0" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageNum" :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="total"> </el-pagination>
          </div>
        </div>
      </el-tabs>
    </div>
    <!-- 关闭订单 -->
    <!-- <closeOrder :refunOrderdModal="refunOrderdModal" @getList="getList"></closeOrder> -->
    <!-- 导出订单 -->
    <vue-gic-export-excel :dataArr="tableData" :dialogVisible.sync="dialogVisible" :type="2" :excelUrl="excelUrl" :params="params" :projectName="projectName"></vue-gic-export-excel>
    <!-- 导出优惠券所有 -->
    <vue-gic-export-excel :dataArr="tableData" :dialogVisible.sync="dialogVisibleAll" :type="2" :excelUrl="excelUrlAll" :params="paramsAll" :projectName="projectName"></vue-gic-export-excel>
  </div>
</template>

<script>
import qs from 'qs';
import request from '../../service/request.js';
import getInputVal from '../../utils/common.js';
import memberInfo from '../../components/memberInfo';
// import closeOrder from './closeOrder';
export default {
  data() {
    return {
      getTime: getInputVal.getTime,
      getSeconds: getInputVal.getSeconds,
      getTimeAll: getInputVal.formatDate,
      activeName: '-1',
      currentPage: 1,
      pageSizes: [20, 40, 60, 80],
      pageSize: 20,
      total: 0,
      tableData: [],
      deliverNum: 0,
      searchValue: '',
      changeType: '', //配送方式
      windowUrl: window.location.origin,
      orderStatus: '-1',
      dateValue: [new Date() - 90 * 24 * 60 * 60 * 1000, new Date().valueOf()],
      // 导出数据控件
      projectName: 'integral-mall', // 当前项目名
      dialogVisible: false,
      excelUrl: '/api-integral-mall/download-exchange-list-execl', // 下载数据的地址
      excelUrlAll: '/api-integral-mall/download-integral-online-excel', //下载数据
      params: {}, // 传递的参数
      orderInfo: {}, //订单信息
      paramsAll: {}, //到处所有发货单
      dialogVisibleAll: false,
      refunOrderdModal: {
        //关闭订单
        dialogVisible: false,
        integralMallProExchangeId: ''
      },
      integralMallProId: '',
      requestProject: 'integral-mall',
      placement: 'top-start'
    };
  },
  watch: {
    $route(to, from) {
      this.integralMallProId = this.$route.query.integralMallProId;
      this.getList();
    }
  },
  created() {
    this.integralMallProId = this.$route.query.integralMallProId;
    this.getList();
  },
  methods: {
    // tab切换
    handleClick(tab) {
      this.orderStatus = tab.name;

      this.getList();
    },
    // 搜索
    handleInputSearch() {
      this.currentPage = 1;
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
    // 导出优惠券记录
    exportExcel() {
      if (this.dateValue) {
        this.beginTime = this.getTimeAll(this.dateValue[0]);
        this.endTime = this.getTimeAll(this.dateValue[1]);
      } else {
        this.beginTime = '';
        this.endTime = '';
      }
      if (!this.beginTime || !this.beginTime) {
        this.$message.error('时间不能为空');
        return;
      }
      this.params = {
        orderStatus: this.orderStatus,
        changeType: this.changeType,
        searchParams: this.searchValue,
        beginTime: this.beginTime,
        endTime: this.endTime,
        pageType: 1, //1、代表优惠券订单列表 2、礼品订单
        requestProject: 'integral-mall',
        integralMallProId: this.integralMallProId
      };
      this.dialogVisible = true;
      // window.location = `${exportOnlineListExcel}?orderStatus=${this.listParams.orderStatus}&changeType=${this.listParams.changeType}&searchParams=${this.listParams.searchParams}&beginTime=${this.listParams.beginTime}&endTime=${this.listParams.endTime}&requestProject=marketing`;
    },

    // 导出列表
    exportExcelAll() {
      if (this.dateValue) {
        this.beginTime = this.getTimeAll(this.dateValue[0]);
        this.endTime = this.getTimeAll(this.dateValue[1]);
      } else {
        this.beginTime = '';
        this.endTime = '';
      }
      if (!this.beginTime || !this.beginTime) {
        this.$message.error('时间不能为空');
        return;
      }
      this.paramsAll = {
        orderStatus: this.orderStatus,
        changeType: -1,
        searchParams: this.searchValue,
        beginTime: this.beginTime,
        endTime: this.endTime,
        integralMallProId: '',
        pageType: 1, //1、代表优惠券订单列表 2、礼品订单
        requestProject: 'integral-mall'
      };
      this.dialogVisibleAll = true;
      // window.location = `${exportOnlineListExcel}?orderStatus=${this.listParams.orderStatus}&changeType=${this.listParams.changeType}&searchParams=${this.listParams.searchParams}&beginTime=${this.listParams.beginTime}&endTime=${this.listParams.endTime}&requestProject=marketing`;
    },
    getOrderInfo(i, integralMallProExchangeId) {
      let params = {
        integralMallProExchangeId: integralMallProExchangeId
      };
      request.get('/api-integral-mall/get-order-information', { params }).then(res => {
        if (res.data.errorCode === 0) {
          // this.loading = false;
          if (res.data.result) {
            this.orderInfo = res.data.result;
          } else {
            this.orderInfo = {};
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
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
        this.beginTime = this.getTimeAll(this.dateValue[0]);
        this.endTime = this.getTimeAll(this.dateValue[1]);
      } else {
        this.beginTime = '';
        this.endTime = '';
      }
      this.currentPage = 1;
      this.getList();
    },
    //获取列表
    getList() {
      this.beginTime = this.dateValue ? this.getTimeAll(this.dateValue[0]) : '';
      this.endTime = this.dateValue ? this.getTimeAll(this.dateValue[1]) : '';
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        orderStatus: this.orderStatus,
        searchParams: this.searchValue,
        pageType: 1,
        changeType: -1,
        beginTime: this.beginTime,
        endTime: this.endTime,
        sortType: this.sortType,
        integralMallProId: this.integralMallProId ? this.integralMallProId : ''
      };
      this.loading = true;
      request.post('/api-integral-mall/page-undeliver', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.result.rows) {
            this.tableData = res.data.result.rows;
            this.total = res.data.result.total;
            for (let item of this.tableData) {
              if (item.sku) {
                item.sku = JSON.parse(item.sku);
              }
            }
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
    // 关闭订单
    // closeOrder(item) {
    //   this.refunOrderdModal.integralMallProExchangeId = item.integralMallProExchangeId;
    //   this.refunOrderdModal.status = item.status;
    //   this.refunOrderdModal.dialogVisible = true;
    // }
    // 待付款关闭订单
    closeOrderNoPay(item) {
      let params = {
        integralMallProExchangeId: item.integralMallProExchangeId,
        optType: 4
      };
      request.get('/api-integral-mall/order-opt', { params }).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success('关闭订单成功');
          this.getList();
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  },
  components: {
    // closeOrder
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
.gift-info {
  display: flex;
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
  width: 75%;
}
.pro-ellipsis {
  color: #303133;
  line-height: 18px;
  height: 36px;
  font-size: 14px;
}
.category-ellipsis {
  color: #909399;
  font-size: 13px;
  line-height: 18px;
}
.el-icon-edit {
  margin-left: 5px;
  cursor: pointer;
}
.pagination-conteiner {
  padding: 30px 16px 34px 0;
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
