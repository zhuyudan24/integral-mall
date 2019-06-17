<template>
  <!-- 调整库存弹框 stockModalData.modalShow -->
  <el-dialog :title="title" :visible.sync="intergralModal.dialogVisible" :width="intergralModal.modalWidth + 40 + 'px'" @close="cancelStockModal">
    <div class="dialog-body" :width="intergralModal.modalWidth + 40 + 'px'">
      <table class="spu-table" :style="{ width: intergralModal.modalWidth + 'px' }" v-show="intergralModal.tableSkuData.length">
        <thead style=" display:table; width:100%;table-layout:fixed;">
          <tr>
            <!-- <span class="red-color" v-if="headerList.length - index1 < 2">*</span> -->
            <th style="width:120px" v-for="(item1, index1) in intergralModal.headerList" :key="index1">
              <span class="red-color" v-show="intergralModal.type === 'cash'" v-if="intergralModal.headerList.length - index1 < 3">*</span>
              <span class="red-color" v-show="intergralModal.type === 'stock'" v-if="intergralModal.headerList.length - index1 < 2">*</span>{{ item1.proName }}
            </th>
          </tr>
        </thead>
        <tbody :style="{ height: intergralModal.modalHeight + 'px' }">
          <tr v-for="(item2, index2) in intergralModal.tableSkuData" :key="index2">
            <td :key="index3" v-for="(item3, index3) in item2" v-if="intergralModal.type === 'stock'">
              <span v-if="item2.length - index3 > 1" style="width:120px;display:inline-block">{{ item3.valueName }}</span>
              <p v-else>
                <el-input v-model="item3.valueName" placeholder="请输入内容" @blur="inputLimit(item3, index3, item2)"> </el-input>
              </p>
            </td>
            <td :key="index3" v-for="(item3, index3) in item2" v-if="intergralModal.type === 'cash'">
              <span v-if="item2.length - index3 > 2" style="width:120px;display:inline-block">{{ item3.valueName }}</span>
              <p v-else>
                <el-input v-model="item3.valueName" placeholder="请输入内容" @blur="inputLimit(item3, index3, item2)"> </el-input>
              </p>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="gift-spu" v-if="intergralModal.type === 'cash'">
        <div class="table-title">
          <p>商品编码</p>
          <p><span class="red-color">*</span>积分</p>
          <p><span class="red-color">*</span>现金</p>
        </div>
        <div class="table-tbody">
          <p><el-input v-model="giftProSkuCode" placeholder="请输入内容" @blur="limitSkuCode" @input="spliceSkuCode"> </el-input></p>
          <p><el-input v-model="giftProSkuIntegral" placeholder="请输入内容" @blur="limitSkuIntegral"> </el-input></p>
          <p><el-input v-model="giftProSkuCash" placeholder="请输入内容" @blur="limitSkuCash"> </el-input></p>
        </div>
      </div>
      <div class="gift-spu" v-if="intergralModal.type === 'stock' && intergralModal.tableSkuData.length === 0">
        <p><el-input v-model="virtualStock" placeholder="请输入内容" @blur="limitVirtualStock"> </el-input></p>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelStockModal">取 消</el-button>
      <el-button type="primary" @click="confirmStockModal()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import qs from 'qs';
import request from '../service/request.js';
import getInputVal from '../utils/common.js';
export default {
  props: {
    intergralModal: {
      type: Array
    }
  },
  data() {
    return {
      payload: [],
      giftProSkuCode: '',
      giftProSkuIntegral: '',
      giftProSkuCash: '',
      virtualStock: '',
      headerList: []
    };
  },
  created() {
    if (this.intergralModal.type === 'cash') {
      this.title = '编辑积分费用或现金费用';
    } else if (this.intergralModal.type === 'stock') {
      this.title = '库存';
    }

    this.giftProSkuCash = this.intergralModal.cashCost; //现金
    this.giftProSkuIntegral = this.intergralModal.integralCost; //积分
    this.giftProSkuCode = this.intergralModal.proCode; //编码
    this.virtualStock = this.intergralModal.virtualStock; //库存
  },
  methods: {
    limitSkuCode() {
      let reg = /^[0-9a-zA-Z]+?$/;
      if (!reg.test(this.giftProSkuCode)) {
        this.$message.error('请输入数字或者字母');
        this.giftProSkuCode = '';
      }
    },
    spliceSkuCode(value) {
      this.$nextTick(() => {
        this.giftProSkuCode = getInputVal.getInputVal(value, 32);
      });
    },
    limitSkuIntegral() {
      //积分
      if (Number(this.giftProSkuIntegral) < 0) {
        this.$message.error('请输入大于0的数字');
        this.giftProSkuIntegral = '';
      } else if (Number(this.giftProSkuIntegral) === 0) {
        return false;
      } else if (!Number(this.giftProSkuIntegral)) {
        this.$message.error('请输入数字类型');
        this.giftProSkuIntegral = '';
      } else if (Number(this.giftProSkuIntegral) > 10000000) {
        this.$message.error('积分最大10000000');
        this.giftProSkuIntegral = '';
      } else {
        this.giftProSkuIntegral = Number(this.giftProSkuIntegral).toFixed(0);
      }
    },
    limitSkuCash() {
      if (Number(this.giftProSkuCash) < 0) {
        this.$message.error('请输入大于0的数字');
        this.giftProSkuCash = '';
      } else if (Number(this.giftProSkuCash) === 0) {
        return false;
      } else if (!Number(this.giftProSkuCash)) {
        this.$message.error('请输入数字类型');
        this.giftProSkuCash = '';
      } else if (Number(this.giftProSkuCash) > 9999999) {
        this.$message.error('现金最大9999999');
        this.giftProSkuCash = '';
      } else {
        this.giftProSkuCash = Number(this.giftProSkuCash).toFixed(2);
      }
    },
    // spu库存
    limitVirtualStock() {
      if (Number(this.virtualStock < 0)) {
        this.$message.error('请输入大于0的数字');
        this.virtualStock = '';
      } else if (!Number(this.virtualStock)) {
        this.$message.error('请输入数字类型');
        this.virtualStock = '';
      } else if (Number(this.virtualStock) > 1000000) {
        this.$message.error('库存最大1000000');
        this.virtualStock = '';
      } else {
        this.virtualStock = Number(this.virtualStock).toFixed(0);
      }
    },
    // 列表输入限制
    inputLimit(item2, index2, item1) {
      if (this.intergralModal.type === 'stock') {
        //库存cash
        if (Number(item2.valueName < 0)) {
          this.$message.error('请输入大于0的数字');
          item2.valueName = '';
        } else if (Number(item2.valueName) === 0) {
          return false;
        } else if (!Number(item2.valueName)) {
          this.$message.error('请输入数字类型');
          item2.valueName = '';
        } else if (Number(item2.valueName) > 1000000) {
          this.$message.error('库存最大1000000');
          item2.valueName = '';
        } else {
          item2.valueName = Number(item2.valueName).toFixed(0);
        }
      } else if (this.intergralModal.type === 'cash') {
        //积分
        if (item1.length - index2 === 2) {
          if (Number(item2.valueName < 0)) {
            this.$message.error('请输入大于0的数字');
            item2.valueName = '';
          } else if (Number(item2.valueName) === 0) {
            return false;
          } else if (!Number(item2.valueName)) {
            this.$message.error('请输入数字类型');
            item2.valueName = '';
          } else if (Number(item2.valueName) > 10000000) {
            this.$message.error('积分最大10000000');
            item2.valueName = '';
          } else {
            item2.valueName = Number(item2.valueName).toFixed(0);
          }
        } else if (item1.length - index2 === 1) {
          //现金
          //现金
          if (Number(item2.valueName < 0)) {
            this.$message.error('请输入大于0的数字');
            item2.valueName = '';
          } else if (Number(item2.valueName) === 0) {
            return false;
          } else if (!Number(item2.valueName)) {
            this.$message.error('请输入数字类型');
            item2.valueName = '';
          } else if (Number(item2.valueName) > 9999999) {
            this.$message.error('现金最大9999999');
            item2.valueName = '';
          } else {
            item2.valueName = Number(item2.valueName).toFixed(2);
          }
        }
      }
      //积分
    },
    confirmStockModal() {
      let skuJson = [];
      let arrCash = []; //费用
      let intergral = []; //积分
      let stock = []; //库存
      if (this.intergralModal.tableSkuData.length) {
        for (let j in this.intergralModal.tableSkuData) {
          let index = this.intergralModal.tableSkuData[0].length - 1;
          let index1 = this.intergralModal.tableSkuData[0].length - 2;
          for (let i in this.intergralModal.tableSkuData[j]) {
            if (Number(i) === index) {
              if (this.intergralModal.type === 'cash') {
                arrCash.push(this.intergralModal.tableSkuData[j][i].valueName);
              } else if (this.intergralModal.type === 'stock') {
                stock.push(this.intergralModal.tableSkuData[j][i].valueName);
              }
            }
            if (Number(i) === index1) {
              intergral.push(this.intergralModal.tableSkuData[j][i].valueName);
            }
          }
        }
      }

      if (this.intergralModal.list.length) {
        //多规格
        for (let m in this.intergralModal.list) {
          skuJson.push({
            giftProSkuId: this.intergralModal.list[m].giftProSkuId,
            giftProSkuCash: this.intergralModal.type === 'cash' ? arrCash[m] : '',
            giftProSkuIntegral: this.intergralModal.type === 'cash' ? intergral[m] : '',
            stock: this.intergralModal.type === 'stock' ? stock[m] : ''
          });
        }
      } else {
        //单规格
        skuJson = '';
        // skuJson.push({
        //   giftProSkuId: '',
        //   giftProSkuCash: this.intergralModal.type === 'cash' ? this.intergralModal.tableSkuData[0][1].valueName : '',
        //   giftProSkuIntegral: this.intergralModal.type === 'cash' ? this.intergralModal.tableSkuData[0][0].valueName : '',
        //   stock: this.intergralModal.type === 'stock' ? this.intergralModal.tableSkuData[0][0].valueName : ''
        // });
      }
      if (this.intergralModal.list.length) {
        if (this.intergralModal.type === 'cash') {
          //spu数据
          //规格
          if (this.giftProSkuIntegral === '' || this.giftProSkuCash === '') {
            this.$message.error('请填输入完整数据');
            return false;
          }
        }
      }

      if (skuJson) {
        for (let item of skuJson) {
          if (this.intergralModal.type === 'cash') {
            if (item.giftProSkuCash === '' || item.giftProSkuIntegral === '') {
              this.$message.error('请填输入完整数据');
              return false;
            }
          } else if (this.intergralModal.type === 'stock') {
            if (item.stock === '') {
              this.$message.error('请填输入完整数据');
              return false;
            }
          }
        }
      }

      let params = {
        integralMallProId: this.intergralModal.integralMallProId,
        proCode: this.giftProSkuCode,
        integralCost: this.giftProSkuIntegral,
        cashCost: this.giftProSkuCash,
        virtualStock: this.intergralModal.type === 'stock' ? this.virtualStock : '',
        skuJson: skuJson ? JSON.stringify(skuJson) : ''
      };
      if (this.intergralModal.tableSkuData.length) {
        //有规格
        let num = 0;
        if (this.intergralModal.type === 'stock') {
          //修改库存计算总库存
          for (let item of skuJson) {
            num = num + Number(item.stock);
          }
          params.virtualStock = num;
        }
      }
      if (this.intergralModal.type === 'stock') {
        //库存
        if (!params.virtualStock) {
          this.$message.error('请输入库存');
          return false;
        }
        if (Number(params.virtualStock) === 0) {
          this.$message.error('库存为0不允许修改');
          return false;
        }
      }

      request.post('/api-integral-mall/update-gift-sku', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          this.intergralModal.dialogVisible = false;
          this.$emit('getList');
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    cancelStockModal() {
      this.intergralModal.dialogVisible = false;
    }
  }
};
</script>
<style scoped>
.spu-table {
  width: 580px;
  font-size: 14px;
  color: #606266;
  margin-bottom: 12px;
  border: 1px solid #ebeef5;
  margin-bottom: 22px;
}
.spu-table thead tr {
  width: 100%;
  height: 48px;
  line-height: 48px;
  background: #f1f3f7;
  text-align: left;
}
.spu-table thead th {
  padding: 0 15px;
}
.spu-table tbody tr {
  border-bottom: 1px solid #ebeef5;
}
.spu-table tbody tr:last-child {
  border-bottom: none;
}
.spu-table tbody td {
  padding: 20px 15px;
  vertical-align: middle;
}
.red-color {
  color: red;
}
.spu-table tbody {
  display: block;
  height: 195px;
  overflow-y: scroll;
}
.gift-spu {
  border: 1px solid #ebeef5;
  width: 100%;
  margin-bottom: 22px;
}
.table-title {
  display: flex;
  height: 44px;
  line-height: 44px;
  background: #f1f3f7;
}
.table-title p {
  flex: 1;
  padding: 0 15px;
}
.table-tbody {
  display: flex;
}
.table-tbody p {
  flex: 1;
  padding: 8px 15px;
}
</style>
