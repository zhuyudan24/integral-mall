<template>
  <div class="mall-section-container">
    <div class="mall-content-section">
      <div class="mall-content-title">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '' }"><a href="/report/#/memberSummary">首页</a></el-breadcrumb-item>
          <el-breadcrumb-item>积分商城</el-breadcrumb-item>
          <el-breadcrumb-item>设置</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/deliverSet' }">配送设置</el-breadcrumb-item>
          <el-breadcrumb-item>自提点设置</el-breadcrumb-item>
        </el-breadcrumb>
        <h3>
          <span>自提点设置</span>
        </h3>
      </div>
      <div class="section">
        <el-form :model="form" ref="form" :rules="formRules" label-width="140px" class="demo-ruleForm" label-position="right">
          <div class="section-content">
            <h3>自提点信息</h3>
            <el-form-item label="自提点类型" required>
              <template>
                <el-radio v-model="form.shopType" :label="0">从门店中选择</el-radio>
                <!-- <el-radio v-model="radio" label="1">手动新增自提点</el-radio> -->
              </template>
            </el-form-item>
            <el-form-item label="选择门店" required v-if="integralMallPickUpPointId === '-1'" class="shop-content">
              <vue-gic-store-new :options="options" :isAdd="isAdd" :uuid.sync="uuid" ref="storeGroup" @store-chane="storeChange"></vue-gic-store-new>
            </el-form-item>
            <el-form-item label="自提点名称" required v-if="integralMallPickUpPointId !== '-1'">
              <el-input v-model="form.pickUpPointName" class="w-600" type="text" disabled> </el-input>
            </el-form-item>
            <el-form-item label="联系电话" required v-if="integralMallPickUpPointId !== '-1'">
              <el-input v-model="form.pickUpPointPhone" class="w-600" type="text" disabled> </el-input>
            </el-form-item>
            <el-form-item label="自提点地址" required v-if="integralMallPickUpPointId !== '-1'">
              <el-input v-model="form.pickUpPointAddress" class="w-600" type="text" disabled> </el-input>
            </el-form-item>
            <el-form-item label="自提点图片" required v-if="integralMallPickUpPointId !== '-1'">
              <div v-for="(item, index) in form.pickUpPointImageList" :key="index" class="img-list">
                <img :src="item" alt="" />
              </div>
            </el-form-item>
            <el-form-item label="营业时间" required v-if="integralMallPickUpPointId !== '-1'" class="time-range">
              <el-time-select placeholder="起始时间" v-model="form.pickUpPointOpenTime" disabled> </el-time-select>
              至
              <el-time-select placeholder="起始时间" v-model="form.pickUpPointCloseTime" disabled> </el-time-select>
            </el-form-item>
          </div>
          <div class="section-content">
            <h3>自提设置</h3>
            <el-form-item label="买家可选自提时间">
              <el-switch v-model="form.status"> </el-switch>
              <div class="tip-warm">
                <p>若不开启，则默认买家付款后即可在任意时间提货</p>
                <p>若开启，则买家需选择自提时间，商户需按约定时间备货完成</p>
              </div>
            </el-form-item>
            <div v-if="form.status">
              <el-form-item label="商户备货设置" required>
                <template>
                  <div class="radio-item">
                    <el-radio v-model="form.radio" :label="1">下单当天</el-radio>
                    <el-form-item style="display:inline-block;margin-left:0px" prop="timeHours">
                      <el-input type="text" v-model="form.timeHours" style="width:120px;" size="mini"> </el-input>
                    </el-form-item>
                    <span>小时</span>
                    <el-form-item style="display:inline-block;margin-left:0px" prop="timeMinuter">
                      <el-input type="text" v-model="form.timeMinuter" style="width:120px;" size="mini"> </el-input>
                    </el-form-item>
                    <span>分钟后，买家可提货</span>
                  </div>
                  <div class="radio-item">
                    <el-radio v-model="form.radio" :label="2">下单</el-radio>
                    <el-form-item style="display:inline-block;margin-left:0px" prop="timeDay">
                      <el-input type="text" v-model="form.timeDay" style="width:120px;" size="mini"> </el-input>
                    </el-form-item>
                    <span>天后，买家可提货</span>
                  </div>
                </template>
              </el-form-item>
              <el-form-item label="买家自提时段" required></el-form-item>
              <div style="margin-top:-45px;">
                <el-form-item v-for="(v, i) in form.timeRangeList" :key="i" :prop="'timeRangeList.' + i + '.timeRange'" :rules="[{ validator: validateTime, trigger: 'change' }]">
                  <el-time-picker :clearable="clearableBtn" class="w-280" format="HH:mm" is-range v-model="v.timeRange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" @change="value => limitTimeSelect(i, value)" @focus="value => blurLimitTimeSelect(i, value)"> </el-time-picker>
                  <el-button v-if="i" type="text" @click="deleteTime(i)">删除</el-button>
                  <span v-if="!i" style="font-size:12px;color:#909399;line-height:12px;margin-left:10px;">请使用24小时制输入时间，格式如11:00至14:30</span>
                </el-form-item>
                <p><el-button type="text" style="margin:0px 0 10px 170px" @click="addTime">添加时间段</el-button></p>
              </div>
            </div>
          </div>
          <div class="confim-btn" :style="{ width: fixedWidth + 'px' }">
            <el-form-item class="fix-btn" style="margin-left:32px;">
              <el-button type="primary" size="small" :loading="submitLoading" @click="submitForm('form')">保存</el-button>
              <el-button size="small" @click="goBack">返回</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
// import qs from 'qs';
import request from '../../service/request.js';
import getInputVal from '../../utils/common.js';
// import stockModal from '../../../components/getSkuList';

export default {
  data() {
    let timeHoursValidator = (rule, value, callback) => {
      // var reg = /^[1-9]\d*$/;
      var reg = /^\+?(0|[1-9][0-9]*)$/;
      if (this.form.radio === 2) {
        if (!value) {
          callback();
        }
      } else if (this.form.radio === 1) {
        if (!value) {
          callback(new Error('请输入时间'));
        }
      }
      if (!reg.test(Number(value))) {
        callback(new Error('请输入0-23之间的整数'));
      } else if (Number(value) > 23) {
        callback(new Error('请输入0-23之间的整数'));
      } else {
        callback();
      }
    };
    let timeMinuterValidator = (rule, value, callback) => {
      // var reg = /^[1-9]\d*$/;
      var reg = /^\+?(0|[1-9][0-9]*)$/;
      if (this.form.radio === 2) {
        if (!value) {
          callback();
        }
      } else if (this.form.radio === 1) {
        if (!value) {
          callback(new Error('请输入时间'));
        }
      }
      if (!reg.test(Number(value))) {
        callback(new Error('请输入0-59之间的整数'));
      } else if (Number(value) > 59) {
        callback(new Error('请输入0-59之间的整数'));
      } else {
        callback();
      }
    };
    let timeDayValidator = (rule, value, callback) => {
      var reg = /^[1-9]\d*$/;
      // var reg = /^\+?(0|[1-9][0-9]*)$/;
      if (this.form.radio === 1) {
        if (!value) {
          callback();
        }
      } else if (this.form.radio === 2) {
        if (!value) {
          callback(new Error('请输入时间'));
        }
      }
      if (!reg.test(Number(value))) {
        callback(new Error('请输入1-90之间的整数'));
      } else if (Number(value) > 90) {
        callback(new Error('请输入1-90之间的整数'));
      } else {
        callback();
      }
    };
    let orderTimeHoursValidator = (rule, value, callback) => {
      // var reg = /^[1-9]\d*$/;
      var reg = /^\+?(0|[1-9][0-9]*)$/;
      if (!reg.test(Number(value))) {
        callback(new Error('请输入0-90之间的整数'));
      } else if (Number(value) > 90) {
        callback(new Error('请输入0-90之间的整数'));
      } else {
        callback();
      }
    };
    let validateTime = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入时间'));
      } else {
        callback();
      }
    };
    return {
      fixedWidth: document.documentElement.clientWidth - 200,
      getHours: getInputVal.getHours,
      form: {
        shopType: 0,
        pickUpPointName: '',
        pickUpPointPhone: '',
        pickUpPointAddress: '',
        pickUpPointImageList: [],
        pickUpPointOpenTime: '', //营业开始时间
        pickUpPointCloseTime: '', //营业关闭时间
        status: false,
        radio: 1,
        timeHours: '', //小时
        timeMinuter: '', //分钟
        timeDay: '',
        timeRangeList: [{ timeRange: '' }],
        orderTimeHours: '',
        validateTime
      },
      formRules: {
        timeHours: [{ validator: timeHoursValidator, trigger: 'blur' }],
        timeMinuter: [{ validator: timeMinuterValidator, trigger: 'blur' }],
        timeDay: [{ validator: timeDayValidator, trigger: 'blur' }],
        orderTimeHours: [{ required: true, message: '请输入时间', trigger: 'blur' }, { validator: orderTimeHoursValidator, trigger: 'blur' }]
      },
      validateTime,
      // 门店控件
      uuid: '', // 新增传空，编辑必传,
      options: [0, 1, 2, 3, 4, 5], // 需要的下拉 默认为全部[0,1,2,3,4,5]// 0 全部 1 门店类型 2门店标签 3 门店区域 4 门店分组 5 部分门店
      isAdd: true,
      storeWidgetKey: '', //传递的门店的KeyId
      integralMallPickUpPointId: '-1', //自提点id
      clearableBtn: false
    };
  },
  created() {
    this.integralMallPickUpPointId = this.$route.query.integralMallPickUpPointId;
    if (this.integralMallPickUpPointId !== '-1') {
      this.getInfo();
    }
    // else {
    //   //新增时候的时间段选择
    //   let currentTime = new Date(new Date().valueOf());
    //   let currentTime1 = new Date(new Date(new Date().getTime() + 1000 * 60).valueOf());
    //   this.form.timeRangeList[0].timeRange = [currentTime, currentTime1];
    // }
  },
  methods: {
    //添加时间段
    addTime() {
      if (this.form.timeRangeList.length >= 5) {
        this.$message.error('最多五个时间段');
        return false;
      }
      if (this.form.timeRangeList[this.form.timeRangeList.length - 1].timeRange) {
        //上一个时间存在添加
        let time1 = new Date((new Date(this.form.timeRangeList[this.form.timeRangeList.length - 1].timeRange[1]).getTime() + 1000 * 60 * 1).valueOf());
        let time2 = new Date((new Date(this.form.timeRangeList[this.form.timeRangeList.length - 1].timeRange[1]).getTime() + 1000 * 60 * 2).valueOf());
        this.form.timeRangeList.push({ timeRange: [time1, time2] });
      } else {
        this.form.timeRangeList.push({ timeRange: null });
      }
    },
    //时间限制
    limitTimeSelect(index, val) {
      let selectTime = new Date(val[0]).valueOf();
      let selectTimeEnd = new Date(val[1]).valueOf();
      if (selectTime === selectTimeEnd) {
        this.$message.error('时间不可重叠！');
        this.form.timeRangeList[index].timeRange = null;
      }
      if (index !== 0) {
        //不是第一个
        // // 和前面的时间比较
        for (let i = index - 1; i >= 0; i--) {
          if (this.form.timeRangeList[i].timeRange) {
            let selectTimePrev = new Date(this.form.timeRangeList[i].timeRange[1]).valueOf();
            //和前前一个的存在的结束时间比较

            if (selectTime < selectTimePrev) {
              this.$message.error('时间不可重叠！');
              this.form.timeRangeList[index].timeRange = null;
            }
          }
        }
        //和后面的时间比较
        for (let j = index + 1; j < this.form.timeRangeList.length; j++) {
          if (this.form.timeRangeList[j].timeRange) {
            let selectTimeAfter = new Date(this.form.timeRangeList[j].timeRange[0]).valueOf();
            //和后一个的存在的开始时间比较
            if (selectTime > selectTimeAfter || selectTimeEnd > selectTimeAfter) {
              this.$message.error('时间不可重叠！');
              this.form.timeRangeList[index].timeRange = null;
            }
          }
        }
      } else {
        //和后面的时间比较
        for (let j = index + 1; j < this.form.timeRangeList.length; j++) {
          if (this.form.timeRangeList[j].timeRange) {
            let selectTimeAfter = new Date(this.form.timeRangeList[j].timeRange[0]).valueOf();
            //和后一个的存在的开始时间比较
            if (selectTime > selectTimeAfter || selectTimeEnd > selectTimeAfter) {
              this.$message.error('时间不可重叠！');
              this.form.timeRangeList[index].timeRange = null;
            }
          }
        }
      }
    },
    blurLimitTimeSelect(index, val) {
      let selectTime = new Date(val[0]).valueOf();
      let selectTimeEnd = new Date(val[1]).valueOf();
      if (selectTime === selectTimeEnd) {
        this.$message.error('时间不可重叠！');
        this.form.timeRangeList[index].timeRange = null;
      }
    },
    //删除时间段
    deleteTime(index) {
      this.form.timeRangeList.splice(index, 1);
    },

    //获取编辑信息
    getInfo() {
      let params = {
        integralMallPickUpPointId: this.integralMallPickUpPointId
      };
      request.get('/api-integral-mall/get-pick-up-point', { params }).then(res => {
        if (res.data.errorCode === 0) {
          this.integralMallPickUpPointId = res.data.result.integralMallPickUpPointId;
          this.form.shopType = res.data.result.pickUpPointType;
          this.form.pickUpPointName = res.data.result.pickUpPointName;
          this.form.pickUpPointPhone = res.data.result.pickUpPointPhone;
          this.form.pickUpPointAddress = res.data.result.pickUpPointAddress;
          this.form.pickUpPointImageList = res.data.result.pickUpPointImageList;
          this.form.pickUpPointOpenTime = res.data.result.pickUpPointOpenTime;
          this.form.pickUpPointCloseTime = res.data.result.pickUpPointCloseTime;
          if (res.data.result.settingDTO.canChooseTime === 0) {
            //自提时间关闭
            this.form.radio = 1;
          } else {
            this.form.radio = res.data.result.settingDTO.delayTimeType;
          }
          this.form.status = res.data.result.settingDTO.canChooseTime === 1 ? true : false;
          this.form.timeHours = res.data.result.settingDTO.delayHour;
          this.form.timeMinuter = res.data.result.settingDTO.delayMinute;
          this.form.timeDay = res.data.result.settingDTO.delayDay;
          if (res.data.result.settingDTO.canChooseTime === 0) {
            //自提时间关闭
            let currentTime = new Date(new Date().valueOf());
            let currentTime1 = new Date(new Date(new Date().getTime() + 1000 * 60).valueOf());
            this.form.timeRangeList[0].timeRange = [currentTime, currentTime1];
          } else {
            if (res.data.result.settingDTO.choosenTime) {
              this.form.timeRangeList = [];
              for (let item of res.data.result.settingDTO.choosenTime) {
                let currentYear = new Date().getFullYear();
                let currentMonth = new Date().getMonth() + 1;
                let currentDate = new Date().getDate();
                let time1 = new Date(new Date(currentYear + '-' + currentMonth + '-' + currentDate + ' ' + item.start + ':00').valueOf());
                let time2 = new Date(new Date(currentYear + '-' + currentMonth + '-' + currentDate + ' ' + item.end + ':00').valueOf());
                this.form.timeRangeList.push({ timeRange: [time1, time2] });
              }
            }
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 门店控件
    // 一些方法 根据具体业务需求选用

    /*
     * 获取组件选中的值
     *  data返回示例：{list:[{id:'1',name:'名称'}],type:1}
     */
    getStoreConfig() {
      this.refs.storeNew.getStoreConfig().then(data => {
        this.storeConfig = data;
      });
    },
    /* 判断门店选择是否为空
     * 返回promise对象，flag为true or false ，true已保存，false未保存
     *
     */
    isStoreSave() {
      this.refs.storeNew.isStoreSave().then(flag => {
        //do something 返回bool值
        return flag;
      });
    },
    storeChange() {
      this.storeWidgetKey = this.uuid;
    },
    //保存
    async submitForm(form) {
      if (this.integralMallPickUpPointId === '-1') {
        let flag = await this.$refs.storeGroup.isStoreSave();
        if (!flag) {
          //未选择门店
          this.$message.error('请选择门店信息');
          return false;
        }
      }
      let params = {};
      let url = '';
      if (this.integralMallPickUpPointId === '-1') {
        //新增
        params = {
          storeWidgetKey: this.uuid,
          pickUpPointType: this.form.shopType,
          settingVo: {
            canChooseTime: this.form.status ? 1 : 0,
            delayTimeType: this.form.status ? this.form.radio : null,
            delayHour: this.form.timeHours ? Number(this.form.timeHours) : null,
            delayMinute: this.form.timeMinuter ? Number(this.form.timeMinuter) : null,
            delayDay: this.form.timeDay ? Number(this.form.timeDay) : null,
            choosenTime: []
          }
        };

        let arrObj = [];
        for (let item of this.form.timeRangeList) {
          if (item.timeRange) {
            arrObj.push({
              start: this.getHours(item.timeRange[0]),
              end: this.getHours(item.timeRange[1])
            });
          }
        }
        if (!this.form.status) {
          params.settingVo.choosenTime = [];
        } else {
          params.settingVo.choosenTime = arrObj;
        }

        url = '/api-integral-mall/create-pick-up-points';
      } else {
        //编辑
        params = {
          integralMallPickUpPointId: this.integralMallPickUpPointId,
          pickUpPointType: this.form.shopType,
          settingVo: {
            canChooseTime: this.form.status ? 1 : 0,
            delayTimeType: this.form.status ? this.form.radio : null,
            delayHour: this.form.timeHours ? Number(this.form.timeHours) : null,
            delayMinute: this.form.timeMinuter ? Number(this.form.timeMinuter) : null,
            delayDay: this.form.timeDay ? Number(this.form.timeDay) : null,
            choosenTime: []
          }
        };
        let arrObj = [];
        for (let item of this.form.timeRangeList) {
          if (item.timeRange) {
            arrObj.push({
              start: this.getHours(item.timeRange[0]),
              end: this.getHours(item.timeRange[1])
            });
          }
        }
        if (!this.form.status) {
          params.settingVo.choosenTime = [];
        } else {
          params.settingVo.choosenTime = arrObj;
        }
        url = '/api-integral-mall/update-pick-up-points';
      }
      this.$refs[form].validate(valid => {
        if (valid) {
          this.submitLoading = true;
          request.post(url, params).then(res => {
            if (res.data.errorCode === 0) {
              this.submitLoading = false;
              this.$router.push({
                name: 'deliverSet'
              });
            } else {
              this.$message.error(res.data.message);
              this.submitLoading = false;
            }
          });
        } else {
          return false;
        }
      });
    },
    goBack() {
      this.$router.push({
        name: 'deliverSet'
      });
    }
  },
  components: {}
};
</script>
<style scoped>
.section {
  background: #fff;
  margin: 24px;
  padding-bottom: 24px;
  margin-bottom: 0px;
}
.section-content h3 {
  height: 55px;
  line-height: 55px;
  border-bottom: 1px solid #e4e7ed;
  font-weight: 500;
  margin-bottom: 25px;
  padding-left: 32px;
  font-size: 16px;
}
.section-content .el-form-item {
  margin-left: 32px;
}
.w-600 {
  width: 600px;
}
.tip-warm {
  display: inline-block;
  vertical-align: top;
  margin-left: 30px;
}
.tip-warm p {
  font-size: 12px;
  color: rgb(144, 147, 153);
  line-height: 18px;
}
.radio-item {
  margin-bottom: 22px;
}
.radio-item:last-child {
  margin-bottom: 0px;
}
.w-280 {
  width: 280px !important;
}
.img-list {
  display: inline-block;
  margin-right: 10px;
  vertical-align: top;
}
.img-list img {
  width: 110px;
  height: 110px;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
}

/* .time-range .el-date-editor .el-range__close-icon {
  display: none !important;
} */
</style>
<style>
.shop-content .dm-store__inputtag--total {
  top: 2px;
}
</style>
