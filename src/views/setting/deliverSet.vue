<template>
  <div class="mall-section-container">
    <div class="mall-content-section">
      <div class="mall-content-title">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '' }"><a href="/report/#/memberSummary">首页</a></el-breadcrumb-item>
          <el-breadcrumb-item>积分商城</el-breadcrumb-item>
          <el-breadcrumb-item>设置</el-breadcrumb-item>
          <el-breadcrumb-item>配送设置</el-breadcrumb-item>
        </el-breadcrumb>
        <h3>
          <span>配送设置</span>
        </h3>
      </div>
      <div class="section">
        <div class="header-top">
          <span>门店自提</span>
          <el-switch v-model="pickStatus" @change="changeStatus"> </el-switch>
        </div>
        <div v-show="pickStatus">
          <div class="operate-top">
            <div class="fl">
              <div class="search-item">
                <el-input v-model="searchValue" placeholder="请输入自提点名称进行搜索" prefix-icon="el-icon-search" clearable class="w-280" @keyup.enter.native="getSearchList" @clear="getSearchList"> </el-input>
              </div>
            </div>
            <div class="fr">
              <el-button plain @click="setPicked">自提设置</el-button>
              <el-button type="primary" @click="addStore('-1')">新增自提点</el-button>
            </div>
          </div>
          <el-table ref="multipleTable" :data="tableDate" style="width: 100%" v-loading="loading" @selection-change="handleSelectAll">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="pickUpPointName" label="自提点名称" min-width="200px"> </el-table-column>
            <el-table-column prop="pickUpPointAddress" label="自提点地址" min-width="200px"> </el-table-column>
            <el-table-column prop="pickUpPointPhone" label="联系电话"> </el-table-column>
            <el-table-column prop="canChooseTime" label="自提时间可选">
              <template slot-scope="scope">
                <span>{{ scope.row.canChooseTime === 1 ? '是' : '否' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <div>
                  <el-button type="text" @click="goAdd(scope.row)">编辑</el-button>
                  <el-popover placement="top" width="160" v-model="scope.row.visible2" style="margin-left:8px">
                    <p style="line-height:1.5;padding: 10px 10px 20px;">确定删除该自提点吗？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button size="mini" type="text" @click="scope.row.visible2 = false">取消</el-button>
                      <el-button type="primary" size="mini" @click="deletePoint(scope.row, scope.$index)">确定</el-button>
                    </div>
                    <el-button slot="reference" type="text">删除</el-button>
                  </el-popover>
                </div>
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
          <div class="pagination-conteiner" v-show="tableDate.length > 0">
            <div class="pagination">
              <el-pagination v-if="total != 0" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="total"> </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 自提点设置 -->
    <pickedAuto :pickedForm="pickedForm" @getList="getList"></pickedAuto>
  </div>
</template>

<script>
import qs from 'qs';
import request from '../../service/request.js';
// import getInputVal from '../../../utils/common.js';
// import stockModal from '../../../components/getSkuList';
import pickedAuto from './pickedAuto';
export default {
  data() {
    return {
      searchValue: '',
      currentPage: 1,
      pageSizes: [20, 40, 60, 80],
      pageSize: 20,
      total: 2,
      pickStatus: true, //自提状态
      loading: false,
      selectList: [], //复选框选中的数据
      tableDate: [],
      pickedForm: {
        dialogVisible: false,
        selectIdList: [], //复选框选中的数据的id
        list: [{ timeRange: [] }] //初始数据
      }
    };
  },
  created() {
    this.getStatus();
  },
  methods: {
    getSearchList() {
      this.currentPage = 1;
      this.getList();
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
    //复选
    handleSelectAll(val) {
      this.selectList = val;
    },
    // 自提设置
    setPicked() {
      if (this.selectList.length < 1) {
        this.$message.error('请先选择自提点');
        return false;
      } else {
        this.pickedForm.selectIdList = [];
        for (let item of this.selectList) {
          this.pickedForm.selectIdList.push(item.integralMallPickUpPointId);
        }
        let currentTime = new Date(new Date().valueOf());
        let currentTime1 = new Date(new Date(new Date().getTime() + 1000 * 60).valueOf());
        // this.pickedModal.timeRangeList[0].timeRange = [currentTime, currentTime1];
        this.pickedForm.list[0].timeRange = [currentTime, currentTime1];
        this.pickedForm.dialogVisible = true;
      }
    },
    //获取自提点状态
    getStatus() {
      request.get('/api-integral-mall/pick-up-point-switch-status').then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.result.status === 0) {
            this.pickStatus = false;
          } else if (res.data.result.status === 1) {
            this.pickStatus = true;
          }
          this.getList();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 修改自提点状态
    changeStatus() {
      let params = {
        status: this.pickStatus ? 1 : 0
      };
      request.get('/api-integral-mall/set-pick-up-point-switch-status', { params }).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success('设置成功');
          this.getList();
        } else {
          this.pickStatus = true;
          this.$message.error(res.data.message);
        }
      });
    },
    //删除自提点
    deletePoint(item, index) {
      let params = {
        integralMallPickUpPointId: item.integralMallPickUpPointId
      };
      request.get('/api-integral-mall/delete-pick-up-point', { params }).then(res => {
        if (res.data.errorCode === 0) {
          this.tableDate.splice(index, 1);
          if (this.tableDate.length === 0) {
            if (this.currentPage > 1) {
              this.currentPage = this.currentPage - 1;
            }
          }
          this.getList();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    getList() {
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        search: this.searchValue
      };
      this.loading = true;
      request.post('/api-integral-mall/page-pick-up-points', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.result.result) {
            this.tableDate = res.data.result.result;
            this.total = res.data.result.totalCount;
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

    // 新增
    addStore() {
      this.$router.push({ name: 'editDeliver', query: { integralMallPickUpPointId: '-1' } });
    },
    // 编辑
    goAdd(item) {
      this.$router.push({ name: 'editDeliver', query: { integralMallPickUpPointId: item.integralMallPickUpPointId } });
    }
  },
  components: {
    pickedAuto
  }
};
</script>
<style scoped>
.section {
  background: #fff;
  margin: 24px;
  padding: 24px;
}
.header-top {
  margin: 15px 0 22px 0;
}
.header-top span {
  width: 80px;
  display: inline-block;
}
</style>
