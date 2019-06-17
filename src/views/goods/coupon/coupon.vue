<template>
  <div class="mall-section-container">
    <div class="mall-content-section">
      <div class="mall-content-title">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '' }"><a href="/report/#/memberSummary">首页</a></el-breadcrumb-item>
          <el-breadcrumb-item>积分商城</el-breadcrumb-item>
          <el-breadcrumb-item>商品</el-breadcrumb-item>
          <el-breadcrumb-item>优惠券</el-breadcrumb-item>
        </el-breadcrumb>
        <h3>
          <span>优惠券</span>
        </h3>
      </div>
      <div class="section">
        <div class="operate-top">
          <div class="fl">
            <div class="search-item">
              <el-input v-model="searchValue" placeholder="请输入优惠券名称进行搜索" prefix-icon="el-icon-search" clearable class="w-280" @keyup.enter.native="getSearchList" @clear="getSearchList"> </el-input>
            </div>
            <div class="search-item">
              <el-select v-model="shelf" placeholder="上下架状态" clearable class="w-140" @change="getListCurr">
                <el-option label="已上架" :value="2"></el-option>
                <el-option label="已下架" :value="1"></el-option>
              </el-select>
            </div>
          </div>
          <div class="fr">
            <div class="search-item">
              <el-select v-model="goodsType" placeholder="请选择批量操作" clearable @change="handleData">
                <el-option label="批量上架" :value="0"></el-option>
                <el-option label="批量下架" :value="1"></el-option>
                <el-option label="批量删除" :value="2"></el-option>
              </el-select>
            </div>
            <el-button type="primary" @click="addCoupon">新增优惠券</el-button>
          </div>
        </div>
        <el-table ref="multipleTable" :data="tableDate" style="width: 100%" v-loading="loading" @sort-change="sortChange" @selection-change="handleSelectAll">
          <el-table-column type="selection" width="40"> </el-table-column>
          <el-table-column label="礼品信息" min-width="310px">
            <template slot-scope="scope">
              <div class="gift-info">
                <!-- <p v-if="scope.row.cardType === 2" style="display:inline-block">
                  <img v-if="scope.row.mainImageUrl" :src="scope.row.mainImageUrl" alt="" />
                  <img v-else src="../../../../static/img/quan02.png" alt="" />
                </p>
                <p style="display:inline-block"  v-if="scope.row.cardType === 0">
                  <img v-if="scope.row.mainImageUrl" :src="scope.row.mainImageUrl" alt="" />
                  <img v-else src="../../../../static/img/quan01.png" alt="" />
                </p> -->
                <img v-if="scope.row.mainImageUrl" :src="scope.row.mainImageUrl" alt="" />
                <img v-if="scope.row.cardType === 2 && !scope.row.mainImageUrl" src="../../../../static/img/quan02.png" alt="" />
                <img v-if="scope.row.cardType === 0 && !scope.row.mainImageUrl" src="../../../../static/img/quan01.png" alt="" />
                <img v-if="scope.row.cardType === 1 && !scope.row.mainImageUrl" src="../../../../static/img/quan03.png" alt="" />
                <div class="info-name">
                  <p class="pro-ellipsis">{{ scope.row.proTitle }}</p>
                  <p class="category-ellipsis">{{ scope.row.proSubTitle }}</p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="integralCost" label="积分费用" sortable="custom" min-width="110px">
            <template slot-scope="scope">
              <!-- <editInfo :popoverType='1' :popoverNum="scope.row.integralCost"><editInfo> -->
              <p class="intergral-edit">{{ scope.row.integralCost }}积分<i class="el-icon-edit" @click="handleTable(scope.row, 1)"></i></p>
            </template>
          </el-table-column>
          <el-table-column prop="cashCost" label="现金费用" sortable="custom" min-width="110px">
            <template slot-scope="scope">
              <p class="intergral-edit">{{ scope.row.cashCost }}元<i class="el-icon-edit" @click="handleTable(scope.row, 2)"></i></p>
            </template>
          </el-table-column>
          <el-table-column prop="sortCost" label="库存" sortable="custom">
            <template slot-scope="scope">
              <p class="intergral-edit">{{ scope.row.virtualStock }}<i class="el-icon-edit" @click="handleTable(scope.row, 3)"></i></p>
            </template>
          </el-table-column>
          <el-table-column prop="sortTimes" label="销量" sortable="custom">
            <template slot-scope="scope">
              <el-button type="text" @click="goRecord(scope.row)">{{ scope.row.allExchangeNumber }}</el-button>
              <!-- <p>{{ scope.row.allExchangeNumber }}</p> -->
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" sortable="custom" min-width="110px">
            <template slot-scope="scope">
              <p>{{ getTime(scope.row.createTime) }}</p>
              <p>{{ getSeconds(scope.row.createTime) }}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="175px">
            <template slot-scope="scope">
              <div>
                <el-button type="text" @click="getLink(scope.row)">推广</el-button>
                <el-button type="text" v-if="scope.row.status === 2" @click="deleteList(scope.row, 1)">下架</el-button>
                <el-button type="text" v-if="scope.row.status === 1" @click="deleteList(scope.row, 2)">上架</el-button>
                <el-button type="text" @click="goAdd(scope.row)">编辑</el-button>
                <el-popover placement="top" width="160" v-model="scope.row.visible2" style="margin-left:8px">
                  <p style="line-height:1.5;padding: 10px 10px 20px;">确定删除该商品吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="scope.row.visible2 = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="deleteList(scope.row, 0, scope.$index)">确定</el-button>
                  </div>
                  <el-button slot="reference" type="text">删除</el-button>
                </el-popover>
              </div>
            </template>
          </el-table-column>
          <template slot="empty">
            <div class="no-data-wrap">
              <div class="no-data-icon">
                <img src="../../../../static/img/no-data_icon.png" />
              </div>
              <p>暂无数据</p>
            </div>
          </template>
        </el-table>
        <div class="pagination-conteiner" v-show="tableDate.length > 0">
          <div class="pagination">
            <el-pagination v-if="total != 0" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="total"> </el-pagination>
          </div>
        </div>
      </div>
    </div>

    <!-- 推广 -->
    <eqCode :modalData="modalData"></eqCode>
    <!-- 调整积分费用 -->
    <editInfo :editInfoModal="editInfoModal" @getList="getList"></editInfo>
    <!-- <stockModal :intergralModal="intergralModal" @getList="getList"></stockModal> -->
  </div>
</template>

<script>
import qs from 'qs';
import request from '../../../service/request.js';
import getInputVal from '../../../utils/common.js';
// import copy from '../../../utils/clone.js';
import eqCode from '../../../components/eqCode';
import selectType from '../../../components/selectGoodsType';
import editInfo from '../../../components/editCouponInfo';
// import stockModal from '../../../components/getSkuList';
export default {
  data() {
    return {
      getTime: getInputVal.getTime,
      getSeconds: getInputVal.getSeconds,
      searchValue: '',
      shelf: '', //上下架状态
      goodsType: '', //批量操作
      tableDate: [],
      currentPage: 1,
      pageSizes: [20, 40, 60, 80],
      pageSize: 20,
      total: 0,
      modalData: {
        //推广数据
        show: false,
        imgUrl: '',
        loading: false
      },
      selectArr: [], //选中的数据
      addModalData: {
        dialogVisible: false
      },
      // 列表编辑组件传参
      editInfoModal: {
        dialogVisible: false,
        num: '',
        mallProId: '',
        type: '',
        costValue: ''
      },
      couponListObj: {}
    };
  },
  created() {
    if (localStorage.getItem('couponListObj')) {
      this.couponListObj = JSON.parse(localStorage.getItem('couponListObj'));
      this.currentPage = this.couponListObj.currentPage;
      this.pageSize = this.couponListObj.pageSize;
      this.total = this.couponListObj.total;
      this.shelf = this.couponListObj.shelf;
      this.searchValue = this.couponListObj.searchValue;
      this.sortType = this.couponListObj.sortType;
      this.sortColumn = this.couponListObj.sortColumn;
      localStorage.removeItem('couponListObj'); //使用完就清除缓存
    }
    this.getList();
  },
  methods: {
    //跳转到兑换记录
    goRecord(item) {
      this.$router.push({ name: 'couponExchange', query: { integralMallProId: item.integralMallProId } });
    },
    // 获取列表
    getList() {
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        sortType: this.sortType,
        sortColumn: this.sortColumn,
        giftName: this.searchValue,
        shelf: this.shelf ? this.shelf : -1 //上架状态
      };
      this.loading = true;
      request.post('/api-integral-mall/page-cards', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.result.rows) {
            this.tableDate = res.data.result.rows;
            this.total = res.data.result.total;
          } else {
            this.tableDate = [];
            this.total = 0;
          }
          this.loading = false;
        } else {
          this.$message.error(res.data.message);
          this.loading = false;
        }
      });
    },
    //分页设置每页的数量
    handleSizeChange(size) {
      this.pageSize = size;
      this.getList();
    },
    // 分页设置跳转到第几页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getList();
    },
    // 搜索
    getSearchList() {
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
    // 商品链接
    getLink(item) {
      this.modalData.loading = true;
      let params = {
        integralMallProId: item.integralMallProId,
        type: 'card'
      };
      this.modalData.show = true;
      request.get('/api-integral-mall/get-qRCode', { params }).then(res => {
        if (res.data.errorCode === 0) {
          this.modalData.show = true;
          this.modalData.pageUrl = res.data.result.page;
          this.modalData.imgUrl = res.data.result.url;
          this.modalData.loading = false;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 删除操作
    deleteList(item, type, index) {
      let params = {
        proId: item.integralMallProId,
        type: Number(type)
      };
      request.post('/api-integral-mall/delete-pro', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          let text = Number(type) === 0 ? '删除成功' : Number(type) === 1 ? '下架成功' : '上架成功';
          this.$message.success(text);
          if (Number(type) === 0) {
            this.tableDate.splice(index, 1);
            if (this.tableDate.length === 0) {
              if (this.currentPage > 1) {
                this.currentPage = this.currentPage - 1;
              }
            }
          }
          this.getList(); //拉取列表
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 全选操作
    handleSelectAll(val) {
      this.selectArr = val;
    },
    // 批量操作
    handleData() {
      if (this.selectArr.length === 0) {
        this.$message.error('请先选择要批量操作的数据');
        this.goodsType = '';
        return false;
      }
      let shelfArr = []; //上架的礼品id
      let soldOutArr = []; //下架的礼品id
      let deleteArr = []; //删除的礼品id
      let type = '';
      let proId = '';
      for (let item of this.selectArr) {
        if (item.status === 1) {
          //下架状态（进行上架操作）
          soldOutArr.push(item.integralMallProId);
        } else if (item.status === 2) {
          //上架状态（进行下架操作）
          shelfArr.push(item.integralMallProId);
        }
        deleteArr.push(item.integralMallProId);
      }
      if (this.goodsType === 0) {
        type = 2;
        //批量上架
        if (soldOutArr.length === 0) {
          this.$message.error('请先选择要上架的数据');
          return false;
        } else {
          proId = soldOutArr.join(',');
        }
      } else if (this.goodsType === 1) {
        //批量下架
        type = 1;
        if (shelfArr.length === 0) {
          this.$message.error('请先选择要下架的数据');
          return false;
        } else {
          proId = shelfArr.join(',');
        }
      } else if (this.goodsType === 2) {
        type = 0;
        //批量删除
        if (deleteArr.length === 0) {
          this.$message.error('请先选择要删除的数据');
          return false;
        } else {
          proId = deleteArr.join(',');
        }
      }
      let params = {
        proId: proId,
        type: type
      };
      request.post('/api-integral-mall/delete-pro', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          let text = Number(type) === 0 ? '删除成功' : Number(type) === 1 ? '下架成功' : '上架成功';
          this.$message.success(text);
          this.currentPage = 1;
          this.getList(); //拉取列表
          this.goodsType = '';
        } else {
          this.$message.error(res.data.message);
          this.goodsType = '';
        }
      });
    },
    // 新增礼品
    addCoupon() {
      this.$router.push({ name: 'couponInfo', query: { giftId: '-1', coupCardId: '-1' } });
    },
    // 编辑
    goAdd(item) {
      this.couponListObj = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        total: this.total,
        shelf: this.shelf,
        searchValue: this.searchValue,
        sortType: this.sortType,
        sortColumn: this.sortColumn
      };
      window.localStorage.setItem('couponListObj', JSON.stringify(this.couponListObj));
      this.$router.push({ name: 'couponInfo', query: { giftId: item.integralMallProId, coupCardId: item.proReferId } });
    },
    handleTable(item, type) {
      if (type === 1) {
        this.editInfoModal.num = item.integralCost;
        this.editInfoModal.type = '积分费用';
      } else if (type === 2) {
        this.editInfoModal.num = item.cashCost;
        this.editInfoModal.type = '现金费用';
        this.editInfoModal.costValue = item.costValue;
      } else if (type === 3) {
        this.editInfoModal.num = item.virtualStock;
        this.editInfoModal.type = '库存';
      }

      this.editInfoModal.mallProId = item.integralMallProId;
      this.editInfoModal.dialogVisible = true;
    }
  },
  components: {
    eqCode,
    selectType,
    editInfo
    // stockModal
  }
};
</script>
<style scoped>
.section {
  background: #fff;
  margin: 24px;
  padding: 24px;
}
.w-280 {
  width: 280px;
}
.w-140 {
  width: 140px;
}
.gift-info img {
  width: 75px;
  height: 75px;
  border-radius: 4px;
  padding: 4px;
  border: 1px solid #dcdfe6;
}
.info-name {
  display: inline-block;
  vertical-align: top;
  width: 70%;
  margin-left: 5px;
}
.pro-ellipsis {
  color: #303133;
  height: 36px;
  line-height: 18px;
  /* width: 230px; */
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
.operate-span {
  font-size: 13px;
  cursor: pointer;
}
.intergral-edit .el-icon-edit {
  display: none;
}
.intergral-edit:hover .el-icon-edit {
  display: inline-block;
}
</style>
