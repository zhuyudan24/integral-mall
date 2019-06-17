<template>
  <div class="mall-section-container">
    <div class="mall-content-section">
      <div class="mall-content-title">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '' }"><a href="/report/#/memberSummary">首页</a></el-breadcrumb-item>
          <el-breadcrumb-item>积分商城</el-breadcrumb-item>
          <el-breadcrumb-item>商品</el-breadcrumb-item>
          <el-breadcrumb-item>礼品</el-breadcrumb-item>
        </el-breadcrumb>
        <h3>
          <span>礼品</span>
        </h3>
      </div>
      <div class="section">
        <div class="page-info">
          <h3><i class="el-icon-info"></i>优惠券已支持主图和图文详情，如需再发布以“微信兑换券”来配送的礼品，请直接前往优惠券中设置</h3>
        </div>
        <div class="operate-top">
          <div class="fl">
            <div class="search-item">
              <el-input v-model="searchValue" placeholder="请输入礼品名称/编码进行搜索" prefix-icon="el-icon-search" clearable class="w-280" @keyup.enter.native="getSearchList" @clear="getSearchList"> </el-input>
            </div>
            <div class="search-item">
              <el-select v-model="shelf" placeholder="上下架状态" clearable class="w-140" @change="getListCurr">
                <el-option label="已上架" :value="2"></el-option>
                <el-option label="已下架" :value="1"></el-option>
              </el-select>
            </div>
            <div class="search-item">
              <el-select v-model="giftType" placeholder="礼品类型" clearable class="w-140" @change="getListCurr">
                <el-option label="实物礼品" :value="1"></el-option>
                <el-option label="虚拟礼品" :value="2"></el-option>
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
            <el-button type="primary" @click="addGift">新增礼品</el-button>
          </div>
        </div>
        <el-table ref="multipleTable" :data="tableDate" style="width: 100%" v-loading="loading" @sort-change="sortChange" @selection-change="handleSelectAll">
          <el-table-column type="selection" width="40"> </el-table-column>
          <el-table-column label="礼品信息" min-width="330px">
            <template slot-scope="scope">
              <div class="gift-info">
                <img :src="scope.row.mainImageUrl" alt="" />
                <div class="info-name">
                  <p class="pro-ellipsis intergral-edit">{{ scope.row.proName }}<i class="el-icon-edit" @click="editProName(scope.row)"></i></p>
                  <p class="category-ellipsis">编码：{{ scope.row.proCode }}</p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="integralCost" label="积分费用" sortable="custom" min-width="110px">
            <template slot-scope="scope">
              <p class="intergral-edit">{{ scope.row.integralCost }}积分<i class="el-icon-edit" @click="handleTable(scope.row, 'cash')"></i></p>
            </template>
          </el-table-column>
          <el-table-column prop="cashCost" label="现金费用" sortable="custom" min-width="110px">
            <template slot-scope="scope">
              <p class="intergral-edit">{{ scope.row.cashCost }}元<i class="el-icon-edit" @click="handleTable(scope.row, 'cash')"></i></p>
            </template>
          </el-table-column>
          <el-table-column prop="sortCost" label="库存" sortable="custom">
            <template slot-scope="scope">
              <p class="intergral-edit">{{ scope.row.virtualStock }}<i class="el-icon-edit" v-if="scope.row.giftType === 1" @click="handleTable(scope.row, 'stock')"></i></p>
            </template>
          </el-table-column>
          <el-table-column prop="sortTimes" label="销量" sortable="custom">
            <template slot-scope="scope">
              <!-- <p>{{ scope.row.allExchangeNumber }}</p>
               -->
              <el-button type="text" @click="goRecord(scope.row)">{{ scope.row.allExchangeNumber }}</el-button>
              <!-- <a :href="windowUrl + '/member/#/wechatmemberDetail?memberId=' + scope.row.memberId" target="_blank">{{ scope.row.cardNum }}</a> -->
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="110px">
            <template slot-scope="scope">
              <p>{{ getTime(scope.row.createTime) }}</p>
              <p>{{ getSeconds(scope.row.createTime) }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="排序" sortable="custom" min-width="140px" :render-header="renderHeader">
            <template slot-scope="scope">
              <p v-if="!scope.row.editStatus" class="edit-number intergral-edit">{{ scope.row.sort }}<i class="el-icon-edit" @click="editNumber(scope.row)"></i></p>
              <div v-if="scope.row.editStatus">
                <el-input v-if="scope.row.editStatus" v-model="scope.row.sort" placeholder="" size="small" class="w-180" type="number" style="width:60px"></el-input>
                <span class="operate-span" @click="editNumSubmit(scope.row)">确定</span>
                <span class="operate-span" @click="editNumCancel(scope.row)">取消</span>
              </div>
              <span style="display:none">{{ refash }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="220px">
            <template slot-scope="scope">
              <div>
                <el-button type="text" @click="getLink(scope.row)">推广</el-button>
                <el-button type="text" v-if="scope.row.changeType === '5'" @click="getCouponList(scope.row.integralMallProId)">券码</el-button>
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
    <!-- 修改礼品名称 -->
    <editName :editInfoModal="editInfoModal" @getList="getList"></editName>
    <!-- 推广 -->
    <eqCode :modalData="modalData"></eqCode>
    <!-- 新增礼品 -->
    <selectType :addModalData="addModalData"></selectType>
    <!-- 调整积分费用 -->
    <stockModal :intergralModal="intergralModal" @getList="getList" v-if="intergralModal.dialogVisible"></stockModal>
    <!-- 卡券列表 -->
    <couponList :couponListModal="couponListModal" v-if="couponListModal.dialogVisible" @getChildSearch="getChildSearch" @getList="getList" @getClose="getClose"></couponList>
  </div>
</template>

<script>
import qs from 'qs';
import request from '../../../service/request.js';
import getInputVal from '../../../utils/common.js';
import editName from '../../../components/editName';
import eqCode from '../../../components/eqCode';
import selectType from '../../../components/selectGoodsType';
import stockModal from '../../../components/getSkuList';
import copy from '../../../utils/clone.js';
import couponList from './couponList';
export default {
  data() {
    return {
      getTime: getInputVal.getTime,
      getSeconds: getInputVal.getSeconds,
      searchValue: '',
      shelf: '', //上下架状态
      giftType: '', //商品类型
      sortColumn: '',
      sortType: '',
      tableDate: [
        {
          giftName: '1111'
        }
      ],
      currentPage: 1,
      pageSizes: [20, 40, 60, 80],
      pageSize: 20,
      total: 0,
      loading: false,
      editInfoModal: {
        //修改礼品名称
        proName: '',
        proNameLen: 0,
        mallProId: '',
        dialogVisible: false
      },
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
      refash: false,
      intergralModal: {
        dialogVisible: false,
        integralMallProId: '',
        headerList: [], //头部数组
        tableSkuData: [],
        modalWidth: '',
        modalHeight: '',
        stdNum: 0,
        list: [],
        type: ''
      },
      list: [],
      giftListObj: {}, //缓存数据
      couponListModal: {
        dialogVisible: false,
        integralMallProId: '',
        tableDate: []
      },
      couponListSearch: '',
      couponCurrentPage: 1,
      couponPageSize: 20
    };
  },
  created() {
    if (localStorage.getItem('giftListObj')) {
      this.giftListObj = JSON.parse(localStorage.getItem('giftListObj'));
      this.currentPage = this.giftListObj.currentPage;
      this.pageSize = this.giftListObj.pageSize;
      this.total = this.giftListObj.total;
      this.shelf = this.giftListObj.shelf;
      this.searchValue = this.giftListObj.searchValue;
      this.giftType = this.giftListObj.giftType;
      this.sortType = this.giftListObj.sortType;
      this.sortColumn = this.giftListObj.sortColumn;
      localStorage.removeItem('giftListObj'); //使用完就清除缓存
    }
    this.getList();
  },
  methods: {
    renderHeader(h, { column, $index }, index) {
      return h('span', {}, [h('span', {}, '序号'), h('el-popover', { props: { placement: 'top-start', width: '200', trigger: 'hover', content: '礼品在小程序端的展示排序，序号越大，排序越靠前。' } }, [h('i', { slot: 'reference', class: 'iconfont icon-xinxixianshi' }, '')])]);
    },
    //跳转到兑换记录
    goRecord(item) {
      if (item.cardType === 2) {
        this.$router.push({ name: 'couponExchange', query: { integralMallProId: item.integralMallProId } });
      } else {
        this.$router.push({ name: 'giftExchange', query: { integralMallProId: item.integralMallProId } });
      }
    },
    getListCurr() {
      this.currentPage = 1;
      this.getList();
    },
    // 获取列表
    getList() {
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        sortType: this.sortType,
        sortColumn: this.sortColumn,
        giftName: this.searchValue,
        giftType: this.giftType ? this.giftType : -1,
        shelf: this.shelf ? this.shelf : -1, //上架状态
        goodsType: this.goodsType //商品类型
      };
      this.loading = true;
      request.post('/api-integral-mall/page-gift', qs.stringify(params)).then(res => {
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
    // 编辑商品名称
    editProName(item) {
      this.editInfoModal.proName = item.proName;
      this.editInfoModal.dialogVisible = true;
      this.editInfoModal.proNameLen = getInputVal.getZhLen(this.editInfoModal.proName);
      this.editInfoModal.mallProId = item.integralMallProId;
    },
    // 商品链接
    getLink(item) {
      this.modalData.loading = true;
      let params = {
        integralMallProId: item.integralMallProId,
        type: 'gift'
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
    // 获取卡券列表
    // showCouponListModal(item) {
    //   // console.log(item);
    //   this.getCouponList(item)
    //   this.couponListModal.dialogVisible = true;

    // },

    getChildSearch(val, id, couponCurrentPage) {
      this.couponListSearch = val;
      this.couponCurrentPage = couponCurrentPage;
      this.getCouponList(id);
    },
    getClose(val, search) {
      this.couponCurrentPage = val;
      this.couponListSearch = search;
    },
    // 获取文本卡券列表
    getCouponList(integralMallProId) {
      let params = {
        integralMallProId: integralMallProId,
        search: this.couponListSearch,
        currentPage: this.couponCurrentPage,
        pageSize: 10
      };
      request.post('/api-integral-mall/page-giftcard', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.result.rows) {
            this.couponListModal.tableDate = res.data.result.rows;
            this.couponListModal.total = res.data.result.total;
          } else {
            this.couponListModal.tableDate = [];
            this.couponListModal.total = 0;
          }
          this.couponListModal.dialogVisible = true;
          this.couponListModal.integralMallProId = integralMallProId;
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
    addGift() {
      this.addModalData.dialogVisible = true;
    },
    // 编辑
    goAdd(item) {
      this.giftListObj = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        total: this.total,
        shelf: this.shelf,
        giftType: this.giftType,
        searchValue: this.searchValue,
        sortType: this.sortType,
        sortColumn: this.sortColumn
      };
      window.localStorage.setItem('giftListObj', JSON.stringify(this.giftListObj));
      this.$router.push({ name: 'giftInfo', query: { type: item.giftType, giftId: item.integralMallProId, proReferId: item.proReferId } });
    },
    //编辑序号
    editNumber(item) {
      item.editStatus = true;
      this.refash = !this.refash;
    },
    // 确定编辑序号
    editNumSubmit(item) {
      let params = {
        integralMallProId: item.integralMallProId,
        sort: item.sort
      };
      request.post('/api-integral-mall/update-integral-sort', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success('更新成功');
          item.editStatus = false;
          this.refash = !this.refash;
          this.getList(); //拉取列表
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 取消编辑序号
    editNumCancel(item) {
      item.editStatus = false;
      this.refash = !this.refash;
    },
    // 调整库存弹框
    handleTable(item, type) {
      let params = {
        integralMallProId: item.integralMallProId
      };

      request.post('/api-integral-mall/get-gift-sku', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          this.intergralModal.integralMallProId = item.integralMallProId;
          this.intergralModal.type = type;
          let list = copy(res.data.result);
          if (list.length) {
            //多规格
            this.intergralModal.list = copy(res.data.result);
            this.intergralModal.stdNum = list.length;
            this.intergralModal.headerList = [];
            this.intergralModal.tableSkuData = [];
            //有数据
            // 处理头部
            let header = JSON.parse(list[0].giftPropValues);
            for (let item of header) {
              this.intergralModal.headerList.push({
                proName: item.proName,
                proId: item.proId
              });
            }
            if (type === 'cash') {
              //积分现金
              this.intergralModal.headerList.push({
                proName: '积分',
                proId: ''
              });
              this.intergralModal.headerList.push({
                proName: '现金',
                proId: ''
              });
            } else if (type === 'stock') {
              //库存
              this.intergralModal.headerList.push({
                proName: '库存',
                proId: ''
              });
            }

            //获取表格数据
            let tem = [];
            for (let i in list) {
              tem = copy(JSON.parse(list[i].giftPropValues));
              if (type === 'cash') {
                tem.push({
                  valueName: list[i].giftProSkuIntegral //积分
                });
                tem.push({
                  valueName: list[i].giftProSkuCash //现金
                });
              } else if (type === 'stock') {
                tem.push({
                  valueName: list[i].stock //库存
                });
              }

              this.intergralModal.tableSkuData.push(tem);
            }

            this.intergralModal.modalWidth = (this.intergralModal.tableSkuData[0].length + 1) * 120; //根据内容设置弹框的宽度
            this.intergralModal.modalHeight = 200; //根据内容设置弹框的宽度
          } else {
            //单规格
            this.intergralModal.list = [];
            //无规格
            this.intergralModal.stdNum = 0;
            this.intergralModal.headerList = [];
            this.intergralModal.tableSkuData = [];
            // let arrTem = [];
            // if (type === 'cash') {
            //   this.intergralModal.headerList.push({
            //     proName: '积分',
            //     proId: ''
            //   });

            //   this.intergralModal.headerList.push({
            //     proName: '现金',
            //     proId: ''
            //   });
            //   arrTem.push({
            //     valueName: item.integralCost,
            //     valueId: ''
            //   });
            //   arrTem.push({
            //     valueName: item.cashCost,
            //     valueId: ''
            //   });
            // } else if (type === 'stock') {
            //   this.intergralModal.headerList.push({
            //     proName: '库存',
            //     proId: ''
            //   });
            //   arrTem.push({
            //     valueName: '',
            //     valueId: ''
            //   });
            // }

            // this.intergralModal.tableSkuData.push(arrTem);
            this.intergralModal.tableSkuData = [];
            this.intergralModal.modalWidth = 450; //根据内容设置弹框的宽度
            this.intergralModal.modalHeight = 80; //根据内容设置弹框的宽度
          }
          this.intergralModal.integralCost = item.integralCost; //积分
          this.intergralModal.cashCost = item.cashCost; //现金
          this.intergralModal.proCode = item.proCode; //编码
          this.intergralModal.virtualStock = item.virtualStock; //库存
          this.intergralModal.dialogVisible = true;
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  },
  components: {
    editName,
    eqCode,
    selectType,
    stockModal,
    couponList
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
  width: 71%;
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
.icon-xinxixianshi {
  margin-left: 5px;
  color: #909399;
  font-size: 14px;
  cursor: pointer;
}
.page-info {
  padding: 8px 16px;
  box-sizing: border-box;
  border-radius: 4px;
  background: #f4f4f5;
  color: #606266;
  margin-bottom: 22px;
  line-height: 1.5;
}
.page-info h3 {
  font-size: 13px;
  color: #606266;
  margin-bottom: 4px;
}
.page-info .el-icon-info {
  color: #1890ff;
  margin-right: 10px;
  font-size: 14px;
}
</style>
