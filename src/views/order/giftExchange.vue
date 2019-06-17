<template>
  <div class="mall-section-container">
    <div class="mall-content-section">
      <div class="mall-content-title" style="border:none">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '' }"><a href="/report/#/memberSummary">首页</a></el-breadcrumb-item>
          <el-breadcrumb-item>积分商城</el-breadcrumb-item>
          <el-breadcrumb-item>订单</el-breadcrumb-item>
          <el-breadcrumb-item>礼品兑换</el-breadcrumb-item>
        </el-breadcrumb>
        <h3>
          <span>礼品兑换</span>
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
              <div class="search-item">
                <el-select v-model="changeType" placeholder="配送方式" clearable @change="getListCurr" style="width:160px;">
                  <el-option label="物流发货" :value="2"></el-option>
                  <el-option label="在线发货（虚拟商品）" :value="3"></el-option>
                  <!-- <el-option label="门店自提" :value="4"></el-option> -->
                  <el-option label="文本券码" :value="5"></el-option>
                </el-select>
              </div>
              <div class="search-item">
                <el-input style="width:260px;" v-model="searchValue" placeholder="请输入会员/商品/订单进行搜索" prefix-icon="el-icon-search" clearable @keyup.enter.native="handleInputSearch(searchValue)" @clear="handleInputSearch(searchValue)"> </el-input>
              </div>
            </div>
            <div class="fr">
              <el-button type="primary" @click="betachDeliver">批量发货</el-button>
              <el-button plain @click="exportExcel"><i class="iconfont icon-icon_yunxiazai" style="margin-right:5px"></i>导出订单</el-button>
            </div>
          </div>
        </div>
        <el-tab-pane label="全部" name="-1" class="goods-table-content"> </el-tab-pane>
        <el-tab-pane label="待付款" name="11" class="goods-table-content"> </el-tab-pane>
        <el-tab-pane :label="'待发货' + '(' + deliverNum + ')'" name="1" class="goods-table-content"> </el-tab-pane>
        <el-tab-pane label="已发货" name="3" class="goods-table-content"> </el-tab-pane>
        <el-tab-pane label="交易成功" name="4" class="goods-table-content"> </el-tab-pane>
        <el-tab-pane label="交易关闭" name="0" class="goods-table-content"> </el-tab-pane>
        <div class="goods-list-content">
          <el-table :data="tableData" ref="multipleTable" style="width: 100%" @sort-change="sortChange" v-loading="loading">
            <!-- <el-table-column type="selection" width="40"> </el-table-column> -->
            <el-table-column label="礼品信息" width="300px">
              <template slot-scope="scope">
                <div class="gift-info">
                  <img :src="scope.row.giftMainPic" />
                  <div class="info-name">
                    <p class="pro-ellipsis">{{ scope.row.giftName }}</p>
                    <p class="category-ellipsis">
                      <span v-for="(i, v) in scope.row.sku" :key="v" style="margin-right:3px">{{ i.proName }}:{{ i.valueName ? i.valueName : '--' }}</span>
                    </p>
                    <p class="category-ellipsis">规格编码:{{ scope.row.proSkuCode }}</p>
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
                  <span class="el-dropdown-link">
                    <span class="go-link" @click="goDetail(scope.row)">{{ scope.row.definedCode }}</span
                    ><i class="iconfont icon-icon-"></i>
                  </span>
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
                <!-- <p>{{ scope.row.memberName }}</p>
                <p>
                  <a :href="windowUrl + '/member/#/wechatmemberDetail?memberId=' + scope.row.memberId" target="_blank">{{ scope.row.cardNum }}</a>
                </p> -->
              </template>
            </el-table-column>
            <el-table-column prop="complete" label="交易状态">
              <template slot-scope="scope">
                <p style="line-height:18px">
                  <span v-if="scope.row.status === 11">待付款</span>
                  <span v-if="scope.row.status === 1">待发货</span>
                  <span v-if="scope.row.status === 3">已发货</span>
                  <span v-if="scope.row.status === 4">交易完成</span>
                  <span v-if="scope.row.status <= 0">交易关闭</span>
                </p>
                <p style="line-height:18px">
                  <!-- <el-button type="text" @click="goDetail(scope.row)">订单详情</el-button> -->
                  <el-button type="text" v-if="scope.row.status === 1 && scope.row.changeType === 2" @click="handleDeliver(scope.row)">物流发货</el-button>
                  <el-button type="text" v-if="scope.row.status === 1 && scope.row.changeType === 3" @click="handleDeliver(scope.row)">在线发货</el-button>
                  <el-button type="text" v-if="scope.row.status === 1 && scope.row.changeType === 4" @click="deliverShop(scope.row)">核销</el-button>
                  <el-button type="text" v-if="scope.row.status === 3 && scope.row.changeType !== 5" @click="getDeliverInfo(scope.row)">查看物流</el-button>

                  <el-button type="text" v-if="scope.row.status === 1 && scope.row.refundStatus !== 2" @click="closeOrder(scope.row)">关闭订单</el-button>
                  <!-- 待付款关闭订单 -->
                  <el-button type="text" v-if="scope.row.status === 11" @click="closeOrderNoPay(scope.row)">关闭订单</el-button>
                  <el-button type="text" v-if="scope.row.status <= 0" @click="getCloseInfo(scope.row)">查看详情</el-button>
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
            <el-pagination v-if="total != 0" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="total"> </el-pagination>
          </div>
        </div>
      </el-tabs>
    </div>
    <!-- 物流详情
    length -->
    <el-dialog title="查看物流" :visible.sync="deliverInfodModal.dialogVisible" width="880px" @close="cancelSubmit('deliverInfodModal')">
      <el-form :model="deliverInfodModal" ref="deliverInfodModal" :rules="modalRules">
        <el-form-item v-if="deliverInfodModal.deliverStatus" label="收件人" label-width="80px">
          <span>{{ deliverInfodModal.consignee }}</span>
        </el-form-item>
        <el-form-item v-if="deliverInfodModal.deliverStatus" label="联系方式" label-width="80px">
          <span>{{ deliverInfodModal.consigneePhone }}</span>
        </el-form-item>
        <el-form-item v-if="deliverInfodModal.deliverStatus" label="收货地址" label-width="80px">
          <span>{{ deliverInfodModal.receivingAddress }}</span>
        </el-form-item>
        <el-form-item v-if="!deliverInfodModal.deliverStatus" label="发货时间" label-width="80px">
          <span>{{ getTimeAll(deliverInfodModal.deliveryTime) }}</span>
        </el-form-item>
        <el-form-item v-if="!deliverInfodModal.deliverStatus" label="操作人员" label-width="80px">
          <span>{{ deliverInfodModal.clerkName ? deliverInfodModal.clerkName : '---' }}</span>
        </el-form-item>
        <el-form-item v-if="!deliverInfodModal.deliverStatus" label="发货内容" label-width="80px">
          <span style="word-break: break-all;">{{ deliverInfodModal.deliveryContent ? deliverInfodModal.deliveryContent : '--' }}</span>
        </el-form-item>
        <div class="line"></div>
        <!-- {{ deliverInfodModal.traces }} -->
        <div class="editInfo-content" v-show="deliverInfodModal.changeType !== 3">
          <div v-if="!editStatus">
            <div class="logistics-item">
              <span>快递公司：</span><span>{{ deliverInfodModal.logisticsCompanyName }}</span>
            </div>
            <div class="logistics-item">
              <span>运单号码：</span><span>{{ deliverInfodModal.courierNumber }}</span>
            </div>
          </div>
          <div v-else>
            <div class="logistics-item">
              <span>快递公司：</span>
              <el-select v-model="deliverInfodModal.logisticsCompanyId" placeholder="请选择快递" clearable @change="changeLogistics" style="width:160px;">
                <el-option :label="item.logisticsCompanyName" :value="item.logisticsCompanyId" v-for="(item, index) in logistiesList" :key="index"></el-option>
              </el-select>
              <p style="margin:0px 10px 0 10px;display:inline-block" v-show="otherLogistics">
                <el-input type="text" v-model="testName" style="width:160px" placeholder="请输入快递公司" @input="value => limitOtherName(value)"> </el-input>
              </p>
            </div>
            <div class="logistics-item">
              <span>运单号码：</span>
              <el-input type="text" v-model="testNum" style="width:160px" placeholder="请输入快递单号" @input="value => limitCode(value)"> </el-input>
            </div>
          </div>
          <div style="float:right;margin-top:-20px;">
            <el-button type="text" v-show="!editStatus" @click="editLogisticsInfo">修改运单编号</el-button>
            <el-button type="text" v-show="editStatus" @click="updateLogisticsInfo">确认</el-button>
            <el-button type="text" v-show="editStatus" @click="cancelLogisticsInfo">取消</el-button>
          </div>
        </div>
        <div class="logisticsList" v-show="deliverInfodModal.traces.length">
          <ul class="el-timeline is-reverse">
            <li class="el-timeline-item" v-for="(i, v) in deliverInfodModal.traces" :key="v">
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
    <!-- 批量发货 -->
    <importdispatch :deliverModal="deliverModal"></importdispatch>
    <!-- 导出订单 -->
    <vue-gic-export-excel :dataArr="tableData" :dialogVisible.sync="dialogVisible" :type="2" :excelUrl="excelUrl" :params="params" :projectName="projectName"></vue-gic-export-excel>
    <!-- 发货 -->
    <deliverModal :deliverdModal="deliverdModal" @getList="getList" v-show="deliverdModal.dialogVisible"></deliverModal>
    <!-- 物流详情 -->
    <!-- <deliverInfoModal :deliverInfodModal="deliverInfodModal" v-show="deliverInfodModal.dialogVisible"></deliverInfoModal> -->
    <!-- 关闭订单 -->
    <closeOrder :refunOrderdModal="refunOrderdModal" @getList="getList"></closeOrder>
    <!-- 取消订单 -->
    <cancelOrder :closeInfoModal="closeInfoModal"></cancelOrder>
    <!-- 会员信息 -->
  </div>
</template>

<script>
import qs from 'qs';
import request from '../../service/request.js';
import getInputVal from '../../utils/common.js';
import importdispatch from './importInfo';
import deliverModal from './delive';
// import deliverInfoModal from './deliverInfo';
import closeOrder from './closeOrder';
import cancelOrder from './getCloseDetail';
import memberInfo from '../../components/memberInfo';
export default {
  data() {
    return {
      getTime: getInputVal.getTime,
      getTimeAll: getInputVal.formatDate,
      getSeconds: getInputVal.getSeconds,
      activeName: '-1',
      currentPage: 1,
      pageSizes: [20, 40, 60, 80],
      pageSize: 20,
      total: 0,
      tableData: [],
      deliverNum: 0,
      dateValue: [new Date() - 90 * 24 * 60 * 60 * 1000, new Date().valueOf()],
      searchValue: '',
      beginTime: '',
      endTime: '',
      changeType: '', //配送方式
      windowUrl: window.location.origin,
      orderStatus: '-1',
      deliverModal: {
        //批量发货
        dialogVisible: false
      },
      // 导出数据控件
      projectName: 'integral-mall', // 当前项目名
      dialogVisible: false,
      excelUrl: '/api-integral-mall/download-integral-online-excel', // 下载数据的地址
      params: {}, // 传递的参数
      orderInfo: {}, //订单信息
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
      deliverInfodModal: {
        //物流详情
        dialogVisible: false,
        changeType: '',
        integralMallProExchangeId: '',
        consignee: '', //收件人
        consigneePhone: '', //联系方式
        receivingAddress: '', //收货地址
        traces: [], //物流信息
        clerkName: '', //操作人员
        deliveryTime: '', //发货时间
        deliveryContent: '', //发货内容
        logisticsCompanyName: '',
        logisticsCompanyId: '',
        logisticsCompanyCode: '',
        deliverStatus: true //false是在线发货。true是快递发货
      },
      editStatus: false,
      refunOrderdModal: {
        //关闭订单
        dialogVisible: false,
        integralMallProExchangeId: ''
      },
      closeInfoModal: {
        //取消订单的详情
        dialogVisible: false,
        integralMallProExchangeId: '',
        consignee: '', //收件人
        consigneePhone: '', //联系方式
        receivingAddress: '', //收货地址
        cancelTime: '',
        clerkName: '', //操作人员
        cancelReason: ''
      },
      integralMallProId: '', //礼品id
      placement: 'top-start',
      requestProject: 'integral-mall',
      testNum: '',
      testName: '',
      shopDialogVisible: false, //门店自提
      shopIntegralMallProExchangeId: '', //门店自提订单id
      writeOffCode: '', //核销码
      submitLoading: false, //门店自提确认按钮
      giftOrderObj: {} //缓存数据
    };
  },
  watch: {
    $route(to, from) {
      this.integralMallProId = this.$route.query.integralMallProId;
      this.getList();
    }
  },
  created() {
    this.getNumber();
    this.integralMallProId = this.$route.query.integralMallProId;
    if (localStorage.getItem('giftOrderObj')) {
      this.giftOrderObj = JSON.parse(localStorage.getItem('giftOrderObj'));
      this.currentPage = this.giftOrderObj.currentPage;
      this.pageSize = this.giftOrderObj.pageSize;
      this.total = this.giftOrderObj.total;
      this.changeType = this.giftOrderObj.changeType; //配送方式
      this.orderStatus = this.giftOrderObj.orderStatus; //-1:全部 1、待发货 11、待付款 3、已发货 0 、已取消 4、交易成功
      this.searchValue = this.giftOrderObj.searchValue; //搜索
      this.pageType = this.giftOrderObj.pageType; //1、代表优惠券订单列表 2、礼品订单
      this.beginTime = this.giftOrderObj.beginTime;
      this.endTime = this.giftOrderObj.endTime;

      if (this.beginTime) {
        this.dateValue[0] = this.beginTime;
        this.dateValue[1] = this.endTime;
      } else {
        this.dateValue = null;
      }

      this.sortType = this.giftOrderObj.sortType;
      this.integralMallProId = this.giftOrderObj.integralMallProId;
      localStorage.removeItem('giftOrderObj'); //使用完就清除缓存
    }
    this.getList();
  },
  methods: {
    // tab切换
    handleClick(tab) {
      this.orderStatus = tab.name;
      this.currentPage = 1;
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
    getOrderInfo(i, integralMallProExchangeId) {
      if (i) {
        let params = {
          integralMallProExchangeId: integralMallProExchangeId
        };
        request.get('/api-integral-mall/get-order-information', { params }).then(res => {
          if (res.data.errorCode === 0) {
            if (res.data.result) {
              this.orderInfo = res.data.result;
            } else {
              this.orderInfo = {};
            }
          } else {
            this.$message.error(res.data.message);
          }
        });
      }
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
        this.beginTime = this.dateValue[0] ? this.getTimeAll(this.dateValue[0]) : '';
        this.endTime = this.dateValue[1] ? this.getTimeAll(this.dateValue[1]) : '';
      } else {
        this.beginTime = '';
        this.endTime = '';
      }
      this.currentPage = 1;
      this.getList();
    },
    //获取列表
    getList() {
      // console.log(this.dateValue)
      this.beginTime = this.dateValue ? this.getTimeAll(this.dateValue[0]) : '';
      this.endTime = this.dateValue ? this.getTimeAll(this.dateValue[1]) : '';
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        changeType: this.changeType === '' ? '-1' : this.changeType,
        orderStatus: this.orderStatus, //-1:全部 1、待发货 11、待付款 3、已发货 0 、已取消 4、交易成功
        searchParams: this.searchValue,
        pageType: 2, //1、代表优惠券订单列表 2、礼品订单
        beginTime: this.beginTime,
        endTime: this.endTime,
        sortType: this.sortType,
        integralMallProId: this.integralMallProId ? this.integralMallProId : ''
      };

      this.loading = true;
      request.post('/api-integral-mall/page-undeliver', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          this.loading = false;
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
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    getNumber() {
      request.get('/api-integral-mall/get-not-send-count').then(res => {
        if (res.data.errorCode === 0) {
          this.deliverNum = res.data.result;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    //批量发货
    betachDeliver() {
      this.deliverModal.dialogVisible = true;
    },
    // 导出发货单
    exportExcel() {
      if (this.dateValue) {
        this.beginTime = this.getTimeAll(this.dateValue[0]);
        this.endTime = this.getTimeAll(this.dateValue[1]);
      } else {
        this.beginTime = '';
        this.beginTime = '';
      }
      if (!this.beginTime || !this.beginTime) {
        this.$message.error('时间不能为空');
        return;
      }
      this.params = {
        orderStatus: this.orderStatus,
        changeType: this.changeType ? this.changeType : -1,
        searchParams: this.searchValue,
        beginTime: this.beginTime,
        endTime: this.endTime,
        integralMallProId: this.integralMallProId ? this.integralMallProId : '',
        pageType: 2, //1、代表优惠券订单列表 2、礼品订单
        requestProject: 'integral-mall'
      };
      this.dialogVisible = true;
      // window.location = `${exportOnlineListExcel}?orderStatus=${this.listParams.orderStatus}&changeType=${this.listParams.changeType}&searchParams=${this.listParams.searchParams}&beginTime=${this.listParams.beginTime}&endTime=${this.listParams.endTime}&requestProject=marketing`;
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
          this.deliverdModal.deliverStatus = true;
          this.deliverdModal.dialogVisible = true;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    //查看物流
    getDeliverInfo(item) {
      let params = {
        integralMallProExchangeId: item.integralMallProExchangeId
        // integralMallProExchangeId: 'ff80808161f71e780161f78895700005'
      };
      request.post('/api-integral-mall/list-logistics-traces', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          this.getLogistiesList();
          this.deliverInfodModal.integralMallProExchangeId = item.integralMallProExchangeId;
          this.deliverInfodModal.changeType = item.changeType;
          this.deliverInfodModal.consignee = res.data.result.changeLog.consignee; //收件人
          this.deliverInfodModal.consigneePhone = res.data.result.changeLog.consigneePhone; //联系方式
          this.deliverInfodModal.receivingAddress = res.data.result.changeLog.receivingAddress; //收货地址
          this.deliverInfodModal.logisticsCompanyName = res.data.result.changeLog.logisticsCompanyName; //快递公司
          this.deliverInfodModal.logisticsCompanyId = res.data.result.changeLog.logisticsCompanyId; //快递公司
          this.deliverInfodModal.logisticsCompanyCode = res.data.result.changeLog.logisticsCompanyCode; //快递code
          this.logisticsCompanyCode = res.data.result.changeLog.logisticsCompanyCode; //快递code
          // this.deliverInfodModal.courierNumber = res.data.result.changeLog.courierNumber; //快递单号
          this.testNum = this.deliverInfodModal.courierNumber = res.data.result.changeLog.courierNumber;

          if (res.data.result.traces) {
            this.deliverInfodModal.traces = res.data.result.traces; //物流信息
          } else {
            this.deliverInfodModal.traces = [];
          }
          this.deliverInfodModal.changeType = item.changeType;
          this.deliverInfodModal.deliveryTime = res.data.result.changeLog.deliveryTime; //发货时间
          this.deliverInfodModal.clerkName = res.data.result.changeLog.clerkName; //操作人员
          this.deliverInfodModal.deliveryContent = res.data.result.changeLog.deliveryContent; //发货内容
          if (item.changeType === 2) {
            //快递发货
            this.deliverInfodModal.deliverStatus = true;
          } else if (item.changeType === 3) {
            //在线发货
            this.deliverInfodModal.deliverStatus = false;
          }

          this.deliverInfodModal.dialogVisible = true;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 关闭订单
    closeOrder(item) {
      this.refunOrderdModal.integralMallProExchangeId = item.integralMallProExchangeId;
      // this.refunOrderdModal.orderStatus = item.orderStatus;
      this.refunOrderdModal.dialogVisible = true;
    },
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
    },
    // 获取关闭的详情
    getCloseInfo(item) {
      let params = {
        integralMallProExchangeId: item.integralMallProExchangeId
      };
      request.post('/api-integral-mall/list-logistics-traces', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          this.closeInfoModal.consignee = res.data.result.changeLog.consignee; //收件人
          this.closeInfoModal.consigneePhone = res.data.result.changeLog.consigneePhone; //联系方式
          this.closeInfoModal.receivingAddress = res.data.result.changeLog.receivingAddress; //收货地址

          this.closeInfoModal.cancelTime = res.data.result.changeLog.cancelTime; //取消时间时间
          this.closeInfoModal.clerkName = res.data.result.changeLog.clerkName; //操作人员
          this.closeInfoModal.cancelReason = res.data.result.changeLog.cancelReason; //取消原因
          this.closeInfoModal.changeType = item.changeType;
          this.closeInfoModal.dialogVisible = true;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
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
          this.deliverInfodModal.otherLogisticsCompanyName = '';
          //获取下拉的快递名称
          this.logisticsCompanyName = this.logistiesList.find(item => {
            return item.logisticsCompanyId === this.deliverInfodModal.logisticsCompanyId;
          }).logisticsCompanyName;
        }
      } else {
        this.otherLogistics = false;
        this.deliverInfodModal.otherLogisticsCompanyName = '';
      }
    },
    limitCode(value) {
      this.$nextTick(() => {
        this.testNum = getInputVal.getInputVal(value, 16);
      });
    },
    limitOtherName(value) {
      this.$nextTick(() => {
        this.testName = getInputVal.getInputVal(value, 8);
      });
    },
    editLogisticsInfo() {
      this.editStatus = true;
    },
    updateLogisticsInfo() {
      let params = {
        optType: 3,
        integralMallProExchangeId: this.deliverInfodModal.integralMallProExchangeId,
        logisticsCompanyId: this.deliverInfodModal.logisticsCompanyId,
        logisticsCompanyCode: this.logisticsCompanyCode,
        courierNumber: this.testNum,
        logisticsCompanyName: this.otherLogistics ? this.testName : this.logisticsCompanyName //物流公司名称
      };

      request.get('/api-integral-mall/order-opt', { params }).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success('修改成功');
          this.deliverInfodModal.dialogVisible = false;
          this.$emit('getList');
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
    },
    cancelLogisticsInfo() {
      this.editStatus = false;
    },
    //取消修改
    cancelSubmit(formName) {
      this.$refs[formName].resetFields();
      this.otherLogistics = false;
      this.editStatus = false;
      this.deliverInfodModal.dialogVisible = false;
      this.deliverInfodModal.dialogVisible = false;
    },
    // 进入订单详情
    goDetail(item) {
      //列表筛选条件存缓存
      this.giftOrderObj = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        total: this.total,
        changeType: this.changeType, //配送方式
        orderStatus: this.orderStatus, //-1:全部 1、待发货 11、待付款 3、已发货 0 、已取消 4、交易成功
        searchValue: this.searchValue, //搜索
        pageType: 2, //1、代表优惠券订单列表 2、礼品订单
        beginTime: this.beginTime,
        endTime: this.endTime,
        sortType: this.sortType,
        integralMallProId: this.integralMallProId ? this.integralMallProId : ''
      };
      window.localStorage.setItem('giftOrderObj', JSON.stringify(this.giftOrderObj));
      this.$router.push({ name: 'orderDetail', query: { integralMallProExchangeId: item.integralMallProExchangeId } });
    }
  },
  components: {
    importdispatch,
    deliverModal,
    // deliverInfoModal,
    closeOrder,
    cancelOrder,
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
  font-size: 14px;
}
.category-ellipsis {
  color: #909399;
  font-size: 13px;
}
.el-icon-edit {
  margin-left: 5px;
  cursor: pointer;
}
.pagination-conteiner {
  padding: 30px 16px 34px 0;
}

.go-link {
  color: #1890ff;
  cursor: pointer;
}
.drop-list .icon-icon- {
  color: #909399;
  margin-left: 5px;
  cursor: pointer;
}
.drop-list .icon-icon-:hover {
  color: #303133;
}

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
