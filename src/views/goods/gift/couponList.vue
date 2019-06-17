<template>
  <div>
    <el-dialog title="券码" :visible.sync="couponListModal.dialogVisible" width="660px" @close="closeList">
      <div>
        <div class="coupon-search">
          <el-input v-model="searchValue" placeholder="请输入卡号/卡密券码" prefix-icon="el-icon-search" clearable @keyup.enter.native="getSearchList" @clear="getSearchList"> </el-input>
        </div>
        <el-table :data="couponListModal.tableDate" style="width: 100%;" height="500">
          <el-table-column prop="cardNumber" label="卡号" width="200px;">
            <template slot-scope="scope">
              <p style="line-height:16px">{{ scope.row.cardNumber ? scope.row.cardNumber : '--' }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="cardPassWord" label="卡密/券码" width="160px;">
            <template slot-scope="scope">
              <p style="line-height:16px">{{ scope.row.cardPassWord ? scope.row.cardPassWord : '--' }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="兑换状态" width="120px;">
            <template slot-scope="scope">
              <p class="intergral-edit">{{ scope.row.status === 1 ? '未兑换' : '已兑换' }}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140px;">
            <template slot-scope="scope">
              <div>
                <el-popover placement="top" width="160" v-model="scope.row.visible2">
                  <p style="line-height:1.5;padding: 10px 10px 20px;">确定删除该券码吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="scope.row.visible2 = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="deleteList(scope.row, scope.$index)">确定</el-button>
                  </div>
                  <el-button slot="reference" type="text" v-if="scope.row.status === 1">删除</el-button>
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
        <div style="margin:15px 0;text-align:right" v-if="couponListModal.tableDate.length > 0">
          <el-pagination :page-size="10" :pager-count="5" @current-change="handleCurrentChange" layout="prev, pager, next" :current-page="couponCurrentPage" :total="couponListModal.total"> </el-pagination>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import qs from 'qs';
import request from '../../../service/request.js';
export default {
  props: {
    couponListModal: {
      type: Object
    }
  },
  data() {
    return {
      dialogVisible: true,
      searchValue: '',
      couponCurrentPage: 1
    };
  },
  methods: {
    //搜索
    getSearchList() {
      this.couponCurrentPage = 1;
      this.$emit('getChildSearch', this.searchValue, this.couponListModal.integralMallProId, this.couponCurrentPage);
    },
    //设置页码
    handleCurrentChange(val) {
      this.couponCurrentPage = val;
      this.$emit('getChildSearch', this.searchValue, this.couponListModal.integralMallProId, this.couponCurrentPage);
    },
    //删除
    deleteList(item, index) {
      let params = {
        giftCardId: item.giftCardId
      };
      request.post('/api-integral-mall/delete-giftcard', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          this.couponListModal.tableDate.splice(index, 1);
          if (this.couponListModal.tableDate.length === 0) {
            if (this.couponCurrentPage > 1) {
              this.couponCurrentPage = this.couponCurrentPage - 1;
            }
          }
          this.$message.success('删除成功');
          this.$emit('getChildSearch', this.searchValue, this.couponListModal.integralMallProId, this.couponCurrentPage);
          this.$emit('getList');
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    closeList() {
      this.couponCurrentPage = 1;
      this.searchValue = '';
      this.$emit('getClose', this.couponCurrentPage, this.searchValue);
      // this.$emit('getChildSearch', this.searchValue, this.couponListModal.integralMallProId, this.couponCurrentPage);
    }
  },
  components: {}
};
</script>
<style scoped>
.coupon-search {
  width: 260px;
  margin-bottom: 22px;
}
</style>
