<template>
  <div>
    <div class="add-sku-list" v-show="skuJson.length">
      <div class="add-sku-item" v-for="(item, index) in skuJson" :key="index">
        <div class="sku-name">
          <span class="sku-title">规格名</span>
          <span style="display:none">{{ refash }}</span>
          <el-dropdown trigger="click" placement="bottom-start" @command="i => getSelected(i, item)">
            <el-input v-model="item.standardName" style="width:140px" size="smalll" placeholder="请选择" @input="value => spliceStandard(value, item)" @focus="getStdList(item)" @blur="addStandard(item)"></el-input>
            <el-dropdown-menu slot="dropdown" style="height:300px;overflow-y:auto;min-width:200px;">
              <el-dropdown-item style="width:140px" :command="i" v-for="i in standardList" :key="i.standardId">{{ i.standardName }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-checkbox v-model="isStdImg" v-if="!index" class="ml20" @change="stdImgUpload">添加图片</el-checkbox>
          <span class="tip-warm ml20" v-if="!index">只有第一个规格的规格值可添加图片</span>
          <span class="delete-btn" @click="deleteSku(index)">删除</span>
        </div>
        <div class="value-content" v-show="item.standardName">
          <span class="sku-value-title">规格值</span>
          <span style="display:none">{{ refash }}</span>
          <div class="value-list">
            <div class="value-item" v-for="(v, n) in item.valueList" :key="n">
              <el-dropdown trigger="click" placement="bottom-start" @command="i => getSelectedValue(i, item, n)">
                <el-input v-model="v.valueName" style="width:140px" size="smalll" placeholder="请选择" @input="value => spliceStandardValue(value, item)" @focus="getStdValueList(item)" @blur="addStandardValue(item, n)"></el-input>
                <el-dropdown-menu slot="dropdown" style="height:300px;overflow-y:auto;min-width:200px;">
                  <el-dropdown-item style="width:140px" :command="m" v-for="m in standardValueList" :key="m.valueId">{{ m.valueName }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <div class="table-img" v-if="!index && isStdImg">
                <el-upload class="avatar-uploader" :action="uploadAction" :show-file-list="false" with-credentials :on-success="(response, file, fileList) => tableUploadSuccess(response, file, fileList, v)" :before-upload="tableBeforeUpload">
                  <img v-if="v.propImg" :src="v.propImg" class="avatar" />
                  <!-- v-if="item2.valueName" :src="item2.valueName" -->
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <p class="img-modal" v-if="v.propImg">
                  <i class="el-icon-delete" @click="deleteImg(v)"></i>
                </p>
              </div>
              <span class="el-icon-error" @click="deleteValue(item, n)"></span>
            </div>
            <el-button type="text" @click="addValue(item)">添加规格值</el-button>
            <p v-if="!index && isStdImg" style="font-size: 12px; color: rgb(144, 147, 153);">图片宽度≥200px，建议宽高比1:1，单张图片大小不超过2MB</p>
          </div>
        </div>
      </div>
    </div>
    <div class="add-sku-btn" v-show="skuJson.length < 3 && giftType === 1">
      <el-button type="primary" size="small" @click="addSku">添加规格</el-button>
      <span class="tip-warm ml20">如有颜色、尺码等多种规格，请添加规格</span>
      <span style="font-size: 12px;color: rgb(144, 147, 153);margin-left:10px;">公众号积分商城不支持此功能，小程序积分商城请升级至V3.0.0及以上版本</span>
    </div>
    <div class="sku-list-content" v-show="skuJson.length > 0">
      <div class="operate-top">
        <span class="red-color">*</span>规格明细
        <div class="fr">
          <el-input v-model="intergral" placeholder="积分" size="small" class="w-100 margin-right10 vertical-top" @blur="limitIntergral(intergral)"></el-input>
          <el-input v-model="cash" placeholder="现金" size="small" class="w-100 margin-right10 vertical-top" @blur="limitCash"></el-input>
          <el-input v-model="stock" placeholder="库存" size="small" class="w-100 margin-right10 vertical-top" @blur="limitStock"></el-input>
          <el-input v-model="code" placeholder="规格编码" size="small" class="w-100 margin-right10 vertical-top" @input="limitCode" @blur="limitCodeType"></el-input>
          <el-input v-model="barCode" placeholder="礼品条形码" size="small" class="w-100 margin-right10 vertical-top" @input="limitBarCode" @blur="limitBarCodeType"></el-input>

          <el-button type="primary" size="small" @click="batchSetSku">批量填充</el-button>
        </div>
      </div>
      <table class="sku-table">
        <thead>
          <tr>
            <th v-for="(item, index) in skuJson" :key="index" style="width:120px">{{ item.standardName }}</th>
            <th style="width:80px"><span class="red-color">*</span>积分</th>
            <th style="width:80px"><span class="red-color">*</span>现金（元）</th>
            <th style="width:120px"><span class="red-color">*</span>库存</th>
            <th style="width:120px">规格编码</th>
            <th style="width:120px">礼品条形码</th>
            <!-- <th style="width:120px;display:none"></th> -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item1, index1) in skuList" :key="index1">
            <td v-for="(item2, index2) in item1" :key="index2" style="width:120px" v-if="item1.length - index2 > 1">
              <!-- {{ item1[7] }} -->
              <span v-if="item1.length - index2 < 7">
                <el-input size="small" v-model="item2.valueName" @blur="skuInput(item1, item2, index1, index2)" @input="setSkuValueName"> </el-input>
              </span>

              <!-- <span v-else-if="item1.length === index2 + 1" style="color:red">{{ item2.valueName ? item2.valueName : '' }}</span> -->
              <span v-else>{{ item2.valueName ? item2.valueName : '' }}</span>
            </td>
            <!-- 最后一列存的skuId -->
            <td v-else style="color:red;display:none">{{ item2.valueName }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import qs from 'qs';
import request from '../../../service/request.js';
import copy from '../../../utils/clone.js';
import getInputVal from '../../../utils/common.js';

export default {
  props: {
    skuJson: {
      type: Array,
      default() {
        return [];
      }
    },
    skuList: {
      type: Array,
      default() {
        return [];
      }
    },
    isStdImg: {
      type: Boolean
    },
    giftType: {
      type: Number
    }
  },
  data() {
    return {
      // skuJson: [],
      standardList: [], //规格列表
      standardValueList: [], //规格值列表
      refash: false,
      // skuList: [],
      uploadAction: window.location.origin + '/api-plug/upload-img?requestProject=intergral-mall',
      // uploadAction: 'http://gicdev.demogic.com/api-plug/upload-img?requestProject=intergral-mall',
      intergral: '',
      cash: '',
      stock: '',
      code: '',
      barCode: '',
      spuStock: 0,
      searchStandard: '',
      searchStandardValue: ''
      // isStdImg: false
    };
  },
  created() {
    // this.skuList = copy(this.combine(copy(this.skuJson)));
  },
  methods: {
    //获取规格列表
    getStandardList(item, ids) {
      let standradIds;
      if (ids) {
        standradIds = ids;
      } else {
        standradIds = '';
      }
      let params = {
        standardIds: standradIds,
        search: this.searchStandard
      };
      request.get('/api-integral-mall/load-standard', { params }).then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.result) {
            this.standardList = res.data.result;
          } else {
            this.standardList = [];
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    //添加规格
    addSku() {
      this.skuJson.push({
        standardId: '',
        standardName: '',
        valueList: [{ valueName: '', valueId: '' }]
      });
    },
    //删除规格
    deleteSku(index) {
      this.skuJson.splice(index, 1);
      this.handleSku();
      this.$emit('IsAgreeUpload', this.isStdImg);
      this.$emit('getStandradList', this.skuJson);
      this.$emit('getSkuList', this.skuList);
    },
    // 保存规格
    addStandard(item) {
      if (item.standardName) {
        let params = {
          standardName: item.standardName
        };
        request.post('/api-integral-mall/save-standard', qs.stringify(params)).then(res => {
          if (res.data.errorCode === 0) {
            item.standardId = res.data.result;
          } else {
            this.$message.error(res.data.message);
          }
        });
      }
    },

    // 规格去重
    getStdList(item) {
      let arrIds = [];
      for (let item of this.skuJson) {
        if (item.standardId && item.standardName) {
          arrIds.push(item.standardId);
        }
      }
      let ids = arrIds.join(',');
      this.getStandardList(item, ids);
    },
    // 添加规格值
    addValue(item) {
      item.valueList.push({ valueName: '', valueId: '' });
    },
    // 删除规格值
    deleteValue(item, index) {
      item.valueList.splice(index, 1);
      this.handleSku();
      this.$emit('IsAgreeUpload', this.isStdImg);
      this.$emit('getStandradList', this.skuJson);
      this.$emit('getSkuList', this.skuList);
    },
    //获取规格值列表
    getValueId(item) {
      let standardValueIdArr = [];
      for (let i of item.valueList) {
        if (i.valueId && i.valueName) {
          standardValueIdArr.push(i.valueId);
        }
      }
      let params = {
        standardId: item.standardId,
        standardValueIds: standardValueIdArr.join(','),
        search: this.searchStandardValue
      };
      request.get('/api-integral-mall/load-standard_value', { params }).then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.result) {
            this.standardValueList = res.data.result;
          } else {
            this.standardValueList = [];
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 保存规格值
    addStandardValue(item, index) {
      if (item.valueList[index].valueName) {
        let params = {
          standardId: item.standardId,
          standardValueName: item.valueList[index].valueName
        };
        request.post('/api-integral-mall/save-standard_value', qs.stringify(params)).then(res => {
          if (res.data.errorCode === 0) {
            item.valueList[index].valueId = res.data.result;
            this.handleSku();
            this.$emit('IsAgreeUpload', this.isStdImg);
            this.$emit('getStandradList', this.skuJson);
            this.$emit('getSkuList', this.skuList);
          } else {
            this.$message.error(res.data.message);
          }
        });
      }
    },
    // 截取规格名
    spliceStandardValue(value, item) {
      this.$nextTick(() => {
        item.valueName = getInputVal.getInputVal(value, 10);
      });
      this.searchStandardValue = value;
      this.getValueId(item);
    },
    spliceStandard(value, item) {
      this.$nextTick(() => {
        item.standardName = getInputVal.getInputVal(value, 10);
      });
      this.searchStandard = item.standardName;
      this.getStandardList();
    },
    //去重规格值
    getStdValueList(item) {
      this.refash = !this.refash;
      this.getValueId(item);
      this.handleSku();
    },
    // 点击规格下拉选中
    getSelected(i, item) {
      item.valueList = [{ valueName: '', valueId: '' }];
      item.standardName = i.standardName;
      item.standardId = i.standardId;
      this.refash = !this.refash;
      this.handleSku();
      this.$emit('IsAgreeUpload', this.isStdImg);
      this.$emit('getStandradList', this.skuJson);
      this.$emit('getSkuList', this.skuList);
    },
    //点击规格值
    getSelectedValue(i, item, index) {
      item.valueList[index].valueName = i.valueName;
      item.valueList[index].valueId = i.valueId;
      this.refash = !this.refash;
      this.handleSku();
      this.$emit('IsAgreeUpload', this.isStdImg);
      this.$emit('getStandradList', this.skuJson);
      this.$emit('getSkuList', this.skuList);
    },
    // 处理规格值得到sku列表
    handleSku() {
      let list = [];
      if (this.skuJson.length) {
        for (let item of this.skuJson) {
          if (item.valueList) {
            list.push(item.valueList);
          }
        }
        list.push([
          {
            valueName: '',
            valueId: ''
          }
        ]);
        list.push([
          {
            valueName: '',
            valueId: ''
          }
        ]);
        list.push([
          {
            valueName: '',
            valueId: ''
          }
        ]);
        list.push([
          {
            valueName: '',
            valueId: ''
          }
        ]);
        list.push([
          {
            valueName: '',
            valueId: ''
          }
        ]);
        list.push([
          {
            valueName: '',
            valueId: ''
          }
        ]);
      } else {
        list = [];
      }
      this.skuList = copy(this.combine(copy(list)));
    },
    // 表格里面的图片上传成功
    tableUploadSuccess(response, file, fileList, item2) {
      if (response.errorCode === 0) {
        item2.propImg = response.result[0].qcloudImageUrl;
        this.$message.success('上传成功');
        this.refash = !this.refash;
        this.$emit('IsAgreeUpload', this.isStdImg);
        this.$emit('getSkuList', this.skuList);
        this.$emit('getStandradList', this.skuJson);
      } else {
        this.$message.error(response.message);
      }
    },
    //是否上传img
    stdImgUpload() {
      this.$emit('IsAgreeUpload', this.isStdImg);
    },
    // 表格里面的图片上传前面
    tableBeforeUpload(file) {
      if (file.size > 2 * 1024 * 1024) {
        this.$message.error('请上传小于2MB的图片');
        return false;
      }
      if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/jpg' && file.type !== 'image/gif') {
        this.$message.error('请上传jpg，png，gif格式的图片');
        return false;
      }
      var that = this;
      return new Promise(function(resolve, reject) {
        let reader = new FileReader();
        reader.onload = function(event) {
          let image = new Image();
          image.onload = function() {
            let width = this.width;
            let height = this.height;
            if (width < 200 || width / height < 1 / 1) {
              that.$message.error('请上传正确的图片尺寸');
              reject();
            }
            resolve();
          };
          image.src = event.target.result;
        };
        reader.readAsDataURL(file);
      });
    },
    // 删除规格图片
    deleteImg(item) {
      item.propImg = '';
      this.refash = !this.refash;
    },
    // 批量填充的
    // 积分
    limitIntergral(value) {
      if (Number(this.intergral) === 0) {
        return false;
      } else if (!Number(this.intergral)) {
        this.$message.error('请输入数字类型');
        this.intergral = '';
      } else if (!Number(this.intergral) < 0) {
        this.$message.error('请输入大于等于0的数字');
        this.intergral = '';
      } else if (Number(this.intergral) > 10000000) {
        this.$message.error('积分最大10000000');
        this.intergral = '';
      } else {
        this.intergral = Number(this.intergral).toFixed(0);
      }
    },

    // 现金
    limitCash() {
      if (Number(this.cash) === 0) {
        return false;
      } else if (!Number(this.cash)) {
        this.$message.error('请输入数字类型');
        this.cash = '';
      } else if (Number(this.cash) < 0) {
        this.$message.error('请输入大于0的数字');
        this.cash = '';
      } else if (Number(this.cash) > 9999999) {
        this.$message.error('现金最大9999999');
        this.cash = '';
      } else {
        this.cash = Number(this.cash).toFixed(2);
      }
    },

    // 库存
    limitStock() {
      if (Number(this.stock) < 0) {
        this.$message.error('请输入大于0的数字');
        this.stock = '';
      } else if (!Number(this.stock)) {
        this.$message.error('请输入数字类型');
        this.stock = '';
      } else if (Number(this.stock) > 1000000) {
        this.$message.error('现金最大1000000');
        this.stock = '';
      } else {
        this.stock = Number(this.stock).toFixed(0);
      }
    },

    // 编码
    limitCode(value) {
      this.$nextTick(() => {
        this.code = getInputVal.getInputVal(value, 32);
      });
    },
    // 条形码
    limitBarCode(value) {
      this.$nextTick(() => {
        this.barCode = getInputVal.getInputVal(value, 32);
      });
    },
    limitCodeType() {
      let reg = /^[0-9a-zA-Z]+?$/;
      if (!reg.test(this.code)) {
        this.$message.error('请输入数字或者字母');
        this.code = '';
      }
    },
    limitBarCodeType() {
      let reg = /^[0-9a-zA-Z]+?$/;
      if (!reg.test(this.barCode)) {
        this.$message.error('请输入数字或者字母');
        this.barCode = '';
      }
    },
    setSkuValueName() {
      this.$emit('getSkuList', this.skuList);
      this.addStock();
    },
    //sku库存相加得spu库存
    addStock() {
      let temSum = 0;

      for (let i in this.skuList) {
        for (let j in this.skuList[i]) {
          if (this.skuList[i].length - j == 4) {
            if (this.skuList[i][j].valueName !== '') temSum += Number(this.skuList[i][j].valueName);
          }
        }
      }
      this.spuStock = temSum;
      this.$emit('getSpuStock', this.spuStock);
    },
    // 批量填充
    batchSetSku() {
      for (let i in this.skuList) {
        let length = this.skuList[i].length;
        if (this.intergral) {
          this.skuList[i][length - 6].valueName = this.intergral;
        }
        if (this.cash) {
          this.skuList[i][length - 5].valueName = this.cash;
        }
        if (this.stock) {
          this.skuList[i][length - 4].valueName = this.stock;
        }
        if (this.code) {
          this.skuList[i][length - 3].valueName = this.code;
        }
        if (this.barCode) {
          this.skuList[i][length - 2].valueName = this.barCode;
        }
      }
      this.$emit('getSkuList', this.skuList);
      this.addStock();
    },
    skuInput(item1, item2, index1, index2) {
      let reg = /^[0-9a-zA-Z]+?$/;
      if (item1.length - index2 === 6) {
        //积分
        //价格
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
      } else if (item1.length - index2 === 5) {
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
      } else if (item1.length - index2 === 4) {
        //库存
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
      } else if (item1.length - index2 === 3) {
        //规格编码
        if (!reg.test(item2.valueName)) {
          this.$message.error('请输入数字或者字母');
          item2.valueName = '';
        }
        item2.valueName = item2.valueName.slice(0, 32);
      } else if (item1.length - index2 === 2) {
        //商品条形码
        if (!reg.test(item2.valueName)) {
          this.$message.error('请输入数字或者字母');
          item2.valueName = '';
        }
        item2.valueName = item2.valueName.slice(0, 32);
      }
    },

    // 排列组合规格值
    combine(arr) {
      arr.reverse();
      var r = [];

      (function f(t, a, n) {
        if (n == 0) return r.push(t);
        for (let i = 0; i < a[n - 1].length; i++) {
          f(t.concat(a[n - 1][i]), a, n - 1);
        }
      })([], arr, arr.length);
      // var t = r;
      return r; //r是排列组合后的数据与
    }
  },
  components: {}
};
</script>
<style scoped>
/* .add-sku-btn {

} */
.add-sku-list {
  width: 900px;
  border-bottom: 1px solid #e4e7ed;
  margin-bottom: 22px;
}
.add-sku-item {
  width: 100%;
}

.sku-name {
  padding: 8px;
  background: #f3f6f9;
  position: relative;
}
.sku-title {
  color: #909399;
  margin-right: 7px;
}
.sku-value-title {
  color: #909399;
  width: 55px;
}
.tip-warm {
  color: #909399;
  font-size: 12px;
  vertical-align: middle;
}
.ml20 {
  margin-left: 20px;
}
.delete-btn {
  color: #909399;
  font-size: 14px;
  position: absolute;
  right: 20px;
  cursor: pointer;
}
/* 规格值 */
.value-content {
  padding: 15px 8px;
  display: flex;
}
.value-list {
  display: inline-block;
  flex: 1;
}
.value-item {
  border: 1px solid #e4e7ed;
  padding: 10px 8px;
  border-radius: 4px;
  display: inline-block;
  margin-right: 7px;
  position: relative;
  margin-bottom: 10px;
}
.value-item .el-icon-error {
  font-size: 16px;
  position: absolute;
  right: -10px;
  top: -5px;
  color: #c0c4cc;
  display: none;
  cursor: pointer;
}
.value-item:hover .el-icon-error {
  display: inline-block;
}

/* 规格明细 */
.sku-list-content {
  width: 900px;
  border: 1px solid #e4e7ed;
  margin-top: 22px;
  /* padding: 0 8px; */
}
.sku-list-content .operate-top {
  margin: 15px 8px 15px 8px;
}
.red-color {
  color: #f5222d;
}
.w-100 {
  width: 100px;
}
/* 表格 */
.sku-table {
  width: 900px;
  font-size: 14px;
  color: #606266;
  margin-bottom: 12px;
}
.sku-table thead tr {
  height: 48px;
  line-height: 48px;
  background: #f1f3f7;
  text-align: left;
}
.sku-table thead th {
  padding: 0 15px;
}
.sku-table tbody tr {
  border-bottom: 1px solid #ebeef5;
}
.sku-table tbody td {
  padding: 20px 15px;
  vertical-align: middle;
}
.margin-right10 {
  margin-right: 10px;
}
.vertical-top {
  vertical-align: top;
}
.table-img {
  display: inline-block;
  width: 30px;
  height: 30px;
  border-radius: 4px;
  border: 1px dashed #d9d9d9;
  cursor: pointer;
  text-align: center;
  vertical-align: top;
  position: relative;
}
.table-img img {
  width: 30px;
  height: 30px;
}
.table-img:hover {
  border: 1px dashed #409eff;
}
.img-modal {
  width: 32px;
  height: 32px;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.5);
  display: none;
  cursor: pointer;
  border-radius: 4px;
}
.img-modal .el-icon-delete {
  color: #fff;
}
.table-img:hover .img-modal {
  display: inline-block;
}
</style>
<style>
/* 规格值上传图片 */
.table-upload {
  display: inline-block;
  vertical-align: top;
}
.table-upload .avatar-uploader {
  height: 30px;
}
.table-upload .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  height: 30px;
}

.table-upload .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.table-upload .avatar-uploader-icon {
  font-size: 24px;
  color: #8c939d;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
}
.table-upload .avatar {
  width: 30px;
  height: 30px;
  display: block;
}
.w-260 {
  width: 260px !important;
}
.upload-list-box .el-upload--picture-card {
  width: 104px;
  height: 104px;
  line-height: 104px;
}
.el-upload {
  width: 30px;
  height: 30px;
}
/* 下拉滚动 */
.add-sku-list .el-dropdown-menu {
  height: 200px !important;
  overflow-y: auto !important;
  min-width: 140px !important;
}
</style>
