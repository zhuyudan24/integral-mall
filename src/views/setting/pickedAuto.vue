<template>
  <el-dialog title="自提设置" :visible.sync="pickedForm.dialogVisible" width="750px" @close="cancelSubmit('pickedModal')">
    <el-form :model="pickedModal" ref="pickedModal" :rules="modalRules" label-width="150px">
      <el-form-item label="买家可选自提时间">
        <el-switch v-model="pickedModal.status"> </el-switch>
        <div class="tip-warm">
          <p>若不开启，则默认买家付款后即可在任意时间提货</p>
          <p>若开启，则买家需选择自提时间，商户需按约定时间备货完成</p>
        </div>
      </el-form-item>
      <div v-if="pickedModal.status">
        <el-form-item label="商户备货设置" required>
          <template>
            <div class="radio-item">
              <el-radio v-model="pickedModal.radio" :label="1">下单当天</el-radio>
              <el-form-item style="display:inline-block" prop="timeHours">
                <el-input type="text" v-model="pickedModal.timeHours" style="width:120px;" size="mini"> </el-input>
              </el-form-item>
              <span>小时</span>
              <el-form-item style="display:inline-block" prop="timeMinuter">
                <el-input type="text" v-model="pickedModal.timeMinuter" style="width:120px;" size="mini"> </el-input>
              </el-form-item>
              <span>分钟后，买家可提货</span>
            </div>
            <div class="radio-item">
              <el-radio v-model="pickedModal.radio" :label="2">下单</el-radio>
              <el-form-item style="display:inline-block" prop="timeDay">
                <el-input type="text" v-model="pickedModal.timeDay" style="width:120px;" size="mini"> </el-input>
              </el-form-item>
              <span>天后，买家可提货</span>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="买家自提时段" required></el-form-item>
        <div style="margin-top:-45px;">
          <el-form-item v-for="(v, i) in pickedModal.timeRangeList" :key="i" :prop="'timeRangeList.' + i + '.timeRange'" :rules="[{ validator: validateTime, trigger: 'change' }]">
            <el-time-picker class="w-280" :clearable="clearableBtn" is-range v-model="v.timeRange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" format="HH:mm" :editable="false" placeholder="选择时间范围" @change="val => limitTimeSelect(i, val)" @focus="value => blurLimitTimeSelect(i, value)"> </el-time-picker>
            <el-button v-if="i" type="text" @click="deleteTime(i)">删除</el-button>
            <span v-if="!i" style="font-size:12px;color:#909399;line-height:12px;margin-left:10px;">请使用24小时制输入时间，格式如11:00至14:30</span>
          </el-form-item>
          <p><el-button type="text" style="margin:0px 0 10px 150px" @click="addTime">添加时间段</el-button></p>
        </div>
        <!-- <el-form-item label="提货有效期" required>
          <span>备货完成</span>
          <el-form-item style="display:inline-block" prop="orderTimeHours">
            <el-input type="text" v-model="pickedModal.orderTimeHours" style="width:120px;" size="mini"> </el-input>
          </el-form-item>
          <span>天后，停止自提</span>
          <span style="font-size:12px;color:#909399;line-height:12px;margin-left:30px;">超期后，订单自动核销</span>
        </el-form-item> -->
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelSubmit('pickedModal')">取 消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="submit('pickedModal')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import qs from 'qs';
import request from '../../service/request.js';
// import copy from '../../utils/clone.js';
import getInputVal from '../../utils/common.js';
export default {
  props: {
    pickedForm: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    let timeHoursValidator = (rule, value, callback) => {
      var reg = /^[1-9]\d*$/;
      if (this.pickedModal.radio === 2) {
        if (!value) {
          callback();
        }
      } else if (this.pickedModal.radio === 1) {
        if (!value) {
          callback(new Error('请输入时间'));
        }
      }
      if (!reg.test(Number(value))) {
        callback(new Error('请输入1-23之间的整数'));
      } else if (Number(value) > 23) {
        callback(new Error('请输入1-23之间的整数'));
      } else {
        callback();
      }
    };
    let timeMinuterValidator = (rule, value, callback) => {
      var reg = /^[1-9]\d*$/;
      if (this.pickedModal.radio === 2) {
        if (!value) {
          callback();
        }
      } else if (this.pickedModal.radio === 1) {
        if (!value) {
          callback(new Error('请输入时间'));
        }
      }
      if (!reg.test(Number(value))) {
        callback(new Error('请输入1-59之间的整数'));
      } else if (Number(value) > 59) {
        callback(new Error('请输入1-59之间的整数'));
      } else {
        callback();
      }
    };
    let timeDayValidator = (rule, value, callback) => {
      var reg = /^[1-9]\d*$/;
      if (this.pickedModal.radio === 1) {
        if (!value) {
          callback();
        }
      } else if (this.pickedModal.radio === 2) {
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
      var reg = /^[1-9]\d*$/;
      if (!reg.test(Number(value))) {
        callback(new Error('请输入1-90之间的整数'));
      } else if (Number(value) > 90) {
        callback(new Error('请输入1-90之间的整数'));
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
      getHours: getInputVal.getHours,
      pickedModal: {
        dialogVisible: true,
        status: false,
        radio: 1,
        timeHours: '', //小时
        timeMinuter: '', //分钟
        timeDay: '',
        timeRangeList: [{ timeRange: '' }],
        orderTimeHours: ''
      },
      validateTime,
      modalRules: {
        timeHours: [{ validator: timeHoursValidator, trigger: 'blur' }],
        timeMinuter: [{ validator: timeMinuterValidator, trigger: 'blur' }],
        timeDay: [{ validator: timeDayValidator, trigger: 'blur' }],
        orderTimeHours: [{ required: true, message: '请输入时间', trigger: 'blur' }, { validator: orderTimeHoursValidator, trigger: 'blur' }]
      },
      submitLoading: false,
      clearableBtn: false
    };
  },
  // created() {
  //   let currentTime = new Date(new Date().valueOf());
  //   let currentTime1 = new Date(new Date(new Date().getTime() + 1000 * 60).valueOf());
  //   this.pickedModal.timeRangeList[0].timeRange = [currentTime, currentTime1];
  // },
  methods: {
    //添加时间段
    addTime() {
      if (this.pickedModal.timeRangeList.length >= 5) {
        this.$message.error('最多五个时间段');
        return false;
      }
      if (this.pickedModal.timeRangeList[this.pickedModal.timeRangeList.length - 1].timeRange) {
        //上一个时间存在添加
        let time1 = new Date((new Date(this.pickedModal.timeRangeList[this.pickedModal.timeRangeList.length - 1].timeRange[1]).getTime() + 1000 * 60 * 2).valueOf());
        let time2 = new Date((new Date(this.pickedModal.timeRangeList[this.pickedModal.timeRangeList.length - 1].timeRange[1]).getTime() + 1000 * 60 * 3).valueOf());
        this.pickedModal.timeRangeList.push({ timeRange: [time1, time2] });
      } else {
        this.pickedModal.timeRangeList.push({ timeRange: [] });
      }
    },
    //删除时间段
    deleteTime(index) {
      this.pickedModal.timeRangeList.splice(index, 1);
    },
    //时间限制
    limitTimeSelect(index, val) {
      let selectTime = new Date(val[0]).valueOf();
      let selectTimeEnd = new Date(val[1]).valueOf();
      if (selectTime === selectTimeEnd) {
        this.$message.error('时间不可重叠！');
        this.pickedModal.timeRangeList[index].timeRange = null;
      }
      if (index !== 0) {
        //不是第一个
        // 和前面的时间比较
        for (let i = index - 1; i >= 0; i--) {
          if (this.pickedModal.timeRangeList[i].timeRange) {
            let selectTimePrev = new Date(this.pickedModal.timeRangeList[i].timeRange[1]).valueOf();
            //和前前一个的存在的结束时间比较
            if (selectTime < selectTimePrev) {
              this.$message.error('时间不可重叠！');
              this.pickedModal.timeRangeList[index].timeRange = null;
            }
          }
        }
        //和后面的时间比较
        for (let j = index + 1; j < this.pickedModal.timeRangeList.length; j++) {
          if (this.pickedModal.timeRangeList[j].timeRange) {
            let selectTimeAfter = new Date(this.pickedModal.timeRangeList[j].timeRange[0]).valueOf();
            //和后一个的存在的开始时间比较
            if (selectTime > selectTimeAfter || selectTimeEnd > selectTimeAfter) {
              this.$message.error('时间不可重叠！');
              this.this.pickedModal.timeRangeList[index].timeRange = null;
            }
          }
        }
      } else {
        //和后面的时间比较
        for (let j = index + 1; j < this.pickedModal.timeRangeList.length; j++) {
          if (this.pickedModal.timeRangeList[j].timeRange) {
            let selectTimeAfter = new Date(this.pickedModal.timeRangeList[j].timeRange[0]).valueOf();
            //和后一个的存在的开始时间比较
            if (selectTime > selectTimeAfter || selectTimeEnd > selectTimeAfter) {
              this.$message.error('时间不可重叠！');
              this.this.pickedModal.timeRangeList[index].timeRange = null;
            }
          }
        }
      }
      // if (index !== 0) {
      //   //不是第一个
      //   if (this.pickedModal.timeRangeList[index - 1].timeRange) {
      //     //前一个存在
      //     if (val) {
      //       let selectTime = new Date(val[0]).valueOf();
      //       let selectTimeEnd = new Date(val[1]).valueOf();
      //       let selectTimePrev = new Date(this.pickedModal.timeRangeList[index - 1].timeRange[1]).valueOf(); //选中的前一个的结束时间

      //       //和前一个的结束时间比较

      //       if (selectTime < selectTimePrev) {
      //         this.$message.error('时间不可重叠！');
      //         let time1 = new Date((new Date(this.pickedModal.timeRangeList[index - 1].timeRange[0]).getTime() + 1000 * 60 * 1).valueOf());
      //         let time2 = new Date((new Date(this.pickedModal.timeRangeList[index - 1].timeRange[0]).getTime() + 1000 * 60 * 2).valueOf());
      //         this.pickedModal.timeRangeList[index].timeRange = [time1, time2];
      //       }
      //       //和后一个的开始时间比较
      //       if (this.pickedModal.timeRangeList.length - 1 > index) {
      //         let selectTimeAfter = new Date(this.pickedModal.timeRangeList[index + 1].timeRange[0]).valueOf(); //选中的后一个的开始时间
      //         if (selectTime > selectTimeAfter || selectTimeEnd > selectTimeAfter) {
      //           this.$message.error('时间不可重叠！');
      //           let time1 = new Date((new Date(this.pickedModal.timeRangeList[index - 1].timeRange[0]).getTime() + 1000 * 60 * 1).valueOf());
      //           let time2 = new Date((new Date(this.pickedModal.timeRangeList[index + 1].timeRange[0]).getTime() - 1000 * 60 * 1).valueOf());
      //           this.pickedModal.timeRangeList[index].timeRange = [time1, time2];
      //         }
      //       }
      //     }
      //   }
      // } else {
      //   if (this.pickedModal.timeRangeList.length !== 1) {
      //     //时间段不止一个情况下设置第一个
      //     let selectTime = new Date(val[0]).valueOf();
      //     let selectTimeEnd = new Date(val[1]).valueOf();
      //     let selectTimeAfter = new Date(this.pickedModal.timeRangeList[index + 1].timeRange[0]).valueOf();
      //     if (selectTime > selectTimeAfter || selectTimeEnd > selectTimeAfter) {
      //       this.$message.error('时间不可重叠！');
      //       let time1 = new Date((new Date(this.pickedModal.timeRangeList[index + 1].timeRange[0]).getTime() - 1000 * 60 * 2).valueOf());
      //       let time2 = new Date((new Date(this.pickedModal.timeRangeList[index + 1].timeRange[0]).getTime() - 1000 * 60 * 1).valueOf());
      //       this.pickedModal.timeRangeList[index].timeRange = [time1, time2];
      //     }
      //   }
      // }
    },
    blurLimitTimeSelect(index, val) {
      let selectTime = new Date(val[0]).valueOf();
      let selectTimeEnd = new Date(val[1]).valueOf();
      if (selectTime === selectTimeEnd) {
        this.$message.error('时间不可重叠！');
        this.pickedModal.timeRangeList[index].timeRange = null;
      }
    },
    submit(pickedModal) {
      this.$refs[pickedModal].validate(valid => {
        if (valid) {
          let params = {
            integralMallPickUpPointIdList: this.pickedForm.selectIdList,
            settingVo: {
              canChooseTime: this.pickedModal.status ? 1 : 0,
              delayTimeType: this.pickedModal.status ? this.pickedModal.radio : null,
              delayHour: this.pickedModal.timeHours ? Number(this.pickedModal.timeHours) : null,
              delayMinute: this.pickedModal.timeMinuter ? Number(this.pickedModal.timeMinuter) : null,
              delayDay: this.pickedModal.timeDay ? Number(this.pickedModal.timeDay) : null,
              choosenTime: []
            }
          };
          let arrObj = [];
          for (let item of this.pickedModal.timeRangeList) {
            if (item.timeRange) {
              arrObj.push({
                start: this.getHours(item.timeRange[0]),
                end: this.getHours(item.timeRange[1])
              });
            }
          }
          params.settingVo.choosenTime = arrObj;
          this.submitLoading = true;
          request.post('/api-integral-mall/update-pick-up-points', params).then(res => {
            if (res.data.errorCode === 0) {
              this.submitLoading = false;
              this.pickedForm.dialogVisible = false;
              this.$emit('getList');
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
    //取消
    cancelSubmit(pickedModal) {
      this.$refs[pickedModal].resetFields();
      this.pickedForm.dialogVisible = false;
      this.pickedModal.status = false;
      this.pickedModal.timeRangeList = this.pickedForm.list;
      // let currentTime = new Date(new Date().valueOf());
      // let currentTime1 = new Date(new Date(new Date().getTime() + 1000 * 60).valueOf());
      // this.pickedModal.timeRangeList[0].timeRange = [currentTime, currentTime1];
    }
  }
};
</script>
<style scoped>
.tip-warm {
  display: inline-block;
  vertical-align: top;
  margin-left: 20px;
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
</style>
)
