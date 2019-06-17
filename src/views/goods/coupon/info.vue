<template>
  <div class="mall-section-container">
    <div class="mall-content-section">
      <div class="mall-content-title">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '' }"><a href="/report/#/memberSummary">首页</a></el-breadcrumb-item>
          <el-breadcrumb-item>积分商城</el-breadcrumb-item>
          <el-breadcrumb-item>商品</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/coupon' }">优惠券</el-breadcrumb-item>
          <el-breadcrumb-item>{{ mallProId === '-1' ? '新建' : '编辑' }}优惠券</el-breadcrumb-item>
        </el-breadcrumb>
        <h3>
          <span>{{ mallProId === '-1' ? '新建' : '编辑' }}优惠券</span>
        </h3>
      </div>
      <div class="section">
        <el-form :model="couponForm" :rules="couponRules" ref="couponForm" label-width="100px" class="demo-ruleForm" label-position="right">
          <div class="section-content">
            <h3>选择卡券</h3>
            <el-form-item label="选择卡券" required v-show="mallProId === '-1'">
              <el-button plain @click="showCard">添加卡券</el-button>
              <span style="font-size: 12px;color: rgb(144, 147, 153);margin-left:10px;">支持选择兑换券</span>
            </el-form-item>
            <div class="alert-content" v-if="couponStatus">
              <el-alert title="原卡券已被删除，请及时下线卡券，否则用户将无法兑换" type="warning"> </el-alert>
            </div>
            <el-form-item label="选择卡券" required v-show="mallProId !== '-1'"> </el-form-item>
            <el-table :data="cardList" style="width: 900px;margin-left:135px;margin-bottom:22px;display:inline-block" v-show="cardList.length > 0" :style="{ marginTop: mallProId !== '-1' ? '-60px' : '' }">
              <el-table-column label="卡券名称" prop="cardName"> </el-table-column>
              <el-table-column label="有效期" prop="limitDay">
                <template slot-scope="scope">
                  <div v-if="scope.row.cardEffectiveMode == 0">固定日期：{{ scope.row.beginDate + '至' + scope.row.endDate }}</div>
                  <div v-if="scope.row.cardEffectiveMode == 1">领取后{{ (scope.row.startDay === 0 ? '当' : scope.row.startDay) + '天，有效天数' + scope.row.limitDay }}天</div>
                </template>
              </el-table-column>
              <el-table-column label="领取限制">
                <template slot-scope="scope">
                  {{ scope.row.cardLimit }}张/人
                </template>
              </el-table-column>
              <el-table-column label="适用门店">
                <template slot-scope="scope">
                  {{ scope.row.storeMode === 0 ? '所有门店' : scope.row.storeMode === 1 ? '部分分组' : '部分门店' }}
                </template>
              </el-table-column>
              <el-table-column label="库存" prop="couponStock"> </el-table-column>
            </el-table>
            <el-form-item label="卡券主图">
              <span style="font-size: 12px;color: rgb(144, 147, 153);">小程序积分商城请升级至V3.0.5及以上版本方可支持</span>
              <div class="upload-list-box">
                <div style="display: inline-block;vertical-align: top;margin-right:5px">
                  <div v-for="(item, index) in couponForm.images" :key="index" class="img-box">
                    <img width="100%" :src="item.imageUrl" alt="" />
                    <i class="el-icon-arrow-left" @click="moveLeft(index)" v-show="index !== 0"></i>
                    <i class="el-icon-arrow-right" @click="moveRight(index)" v-show="index + 1 !== couponForm.images.length"></i>
                    <i class="el-icon-delete" @click="deteletDialogImageUrl(index)"></i>
                    <i class="el-icon-zoom-in" @click="enlargeDialogImageUrl(index)"></i>
                    <div class="dialog-img"></div>
                  </div>
                  <el-upload :action="uploadAction" :headers="headersUpload" list-type="picture-card" :on-preview="handlePictureCardPreview" :before-upload="beforeUpload" :on-success="uploadSuccess" with-credentials :show-file-list="false" v-show="uploadStatus" style="display: inline-block;vertical-align: top;">
                    <i class="el-icon-plus"></i>
                  </el-upload>
                </div>
                <p style="font-size: 12px; color: rgb(144, 147, 153);line-height:18px;margin-top:10px">图片宽度≥700px，图片宽高比1:1，单张图片大小不超过 2 MB。</p>
                <el-dialog :visible.sync="dialogVisibleImg">
                  <img width="100%" :src="dialogEnlargeImageUrl" alt="" />
                </el-dialog>
              </div>
            </el-form-item>
          </div>
          <div class="section-content">
            <h3>图文信息</h3>
            <el-form-item label="">
              <div class="tinymce-wrap">
                <tinymce-edit ref="tinymceWrap" :bodyHtml="couponForm.detailDescription" :projectName="projectName"></tinymce-edit>
              </div>
            </el-form-item>
          </div>
          <div class="section-content">
            <h3>销售信息</h3>
            <el-form-item label="积分费用" prop="integralCost">
              <el-input-number class="w-350" :precision="0" :min="0" v-model="couponForm.integralCost"></el-input-number>
            </el-form-item>
            <el-form-item label="现金费用" prop="cashCost">
              <el-input-number class="w-350" :precision="2" :min="0" v-model="couponForm.cashCost"></el-input-number>
            </el-form-item>
            <el-form-item label="礼品成本" prop="cashCost">
              <el-input-number class="w-350" :precision="2" :min="0" v-model="costValue" :disabled="costValueStatus"></el-input-number>
            </el-form-item>
            <el-form-item label="库存" prop="virtualStock">
              <el-input-number class="w-350" :precision="0" :min="1" v-model="couponForm.virtualStock"></el-input-number>
              <span style="font-size: 12px;color: rgb(144, 147, 153);margin-left:10px;" v-show="cardList.length"
                >兑换限制不得大于此优惠券的库存：<i>{{ couponCardStock }}</i
                >张</span
              >
            </el-form-item>
          </div>
          <div class="section-content">
            <h3>兑换设置</h3>
            <span style="display:none">{{ refash }}</span>
            <el-form-item label="适用会员" prop="memberGrade">
              <el-select v-model="couponForm.memberGrade" multiple placeholder="请选择" size="small" class="w-350">
                <el-option v-for="item in memberGradeList" :key="item.gradeId" :label="item.gradeName" :value="item.gradeId"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="展现门店" required>
              <vue-gic-store-linkage :disabled="isInfo" :msg="sendChildData" ref="selectTree" @sendSelectGroupData="getSelectGroupData"></vue-gic-store-linkage>
            </el-form-item>
            <el-form-item label="限兑">
              <el-checkbox v-model="couponForm.limitTimesStatus" @change="refashData()">每个会员限制兑换</el-checkbox>
              <span v-if="couponForm.limitTimesStatus"><el-input-number controls-position="right" v-model="couponForm.limitTimes" :precision="0" :min="0" @change="limitTimeChange"></el-input-number> 次</span>
              <span v-show="cardList.length" style="font-size: 12px;color: rgb(144, 147, 153);margin-left:10px;"
                >兑换限制不得大于此优惠券的领取次数：<i>{{ limitTimesNum }}</i
                >次</span
              >
            </el-form-item>
            <el-form-item label="兑换日期" required>
              <template>
                <el-radio v-model="couponForm.exchangeDateType" :label="1">全部日期</el-radio>
                <el-radio v-model="couponForm.exchangeDateType" :label="2">固定日期</el-radio>
                <el-radio v-model="couponForm.exchangeDateType" :label="3">每月</el-radio>
                <el-radio v-model="couponForm.exchangeDateType" :label="4">每周</el-radio>
              </template>
            </el-form-item>
            <!-- 兑换日期 -->
            <!-- 固定日期 -->
            <el-form-item class="form-item-mt" v-if="couponForm.exchangeDateType === 2" prop="exchangeFixDate">
              <el-date-picker class="w300" v-model="couponForm.exchangeFixDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <!-- 每月 -->
            <el-form-item class="form-item-mt" v-if="couponForm.exchangeDateType === 3" prop="exchangeDateDayArr">
              <el-select size="small" v-model="couponForm.exchangeDateDayArr" multiple placeholder="请选择" class="w-350">
                <el-option v-for="item in monthOptions" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <!-- 每周 -->
            <el-form-item class="form-item-mt" v-if="couponForm.exchangeDateType === 4" prop="exchangeDateWeekArr">
              <el-select size="small" v-model="couponForm.exchangeDateWeekArr" multiple placeholder="请选择" class="w-350">
                <el-option v-for="item in weekOptions" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="兑换时段" required>
              <template>
                <el-radio v-model="couponForm.exchangeTimeType" :label="1">全部时段</el-radio>
                <el-radio v-model="couponForm.exchangeTimeType" :label="2">部分时段</el-radio>
              </template>
            </el-form-item>
            <div v-if="couponForm.exchangeTimeType === 2">
              <el-form-item class="mt8" v-for="(v, i) in couponForm.timeRangeList" :key="i" :prop="'timeRangeList.' + i + '.timeRange'" :rules="[{ validator: validateTime, trigger: 'change' }]">
                <el-time-picker is-range v-model="v.timeRange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" value-format="HH:mm" format="HH:mm" placeholder="选择时间范围"> </el-time-picker>
                <el-button v-if="i" type="text" @click="delTimeRange(i)">删除</el-button>
              </el-form-item>
              <p style="font-size:12px;color:#909399;line-height:12px;margin-left:130px;">请使用24小时制输入时间，格式如11:00至14:30</p>
              <p><el-button type="text" style="margin:8px 0 10px 130px" @click="addTimeRange">添加时间段</el-button></p>
            </div>
            <el-form-item label="显示设置" required>
              <template>
                <el-radio v-model="couponForm.proShowStatus" :label="1">上架状态就显示</el-radio>
                <el-radio v-model="couponForm.proShowStatus" :label="2">可兑换时显示</el-radio>
              </template>
            </el-form-item>
            <el-form-item label="上架时间" required>
              <template>
                <el-radio v-model="couponForm.releaseType" :label="1">立即上架</el-radio>
                <el-radio v-model="couponForm.releaseType" :label="2">定时上架</el-radio>
              </template>
            </el-form-item>
            <!-- 定时上架 -->
            <el-form-item class="form-item-mt" v-if="couponForm.releaseType === 2" prop="limitTimeBegin">
              <el-date-picker v-model="couponForm.limitTimeBegin" type="datetime" placeholder="选择日期时间"> </el-date-picker>
            </el-form-item>
          </div>
          <div class="confim-btn" :style="{ width: fixedWidth + 'px' }">
            <el-form-item class="fix-btn">
              <el-button type="primary" size="small" @click="submitForm('couponForm')">保存</el-button>
              <el-button size="small" @click="goBack">返回</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    <!-- 卡券选择弹框 -->
    <vue-gic-card :disabledList="disabledList" :projectName="projectName" :showCardDialog="showCardDialog" :cardLimit="cardLimit" :cardType="cardType" @selectCard="selectCard" ref="dmcard"></vue-gic-card>
  </div>
</template>

<script>
import qs from 'qs';
import request from '../../../service/request.js';
import getInputVal from '../../../utils/common.js';
import tinymceEdit from '../../../components/tinymce-edit';
export default {
  data() {
    const validateTime = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入时间'));
      } else {
        callback();
      }
    };
    return {
      getTimeAll: getInputVal.formatDate,
      getTime: getInputVal.getTime,
      getHours: getInputVal.getHours,
      fixedWidth: document.documentElement.clientWidth - 200,
      // 卡券数据
      // 可传参数
      projectName: 'intergral-mall', //当前项目名
      showCardDialog: false,
      cardLimit: 3, //卡券限制类型 1-限制领取1张的卡券 2- 限制领取 1~100的卡券 3-限制领取&=100 的卡券
      cardType: null, //卡券类型集合（0：抵金券，1：折扣券，2：兑换券）null-为全部类型 逗号分隔
      disabledList: [],
      selectedData: {},
      cardList: [],
      limitTimes: 0,
      limitTimesNum: 0,
      proReferId: '', //卡券关联id
      couponForm: {
        cardType: '', //卡券类型
        images: [],
        detailDescription: '', //图文详情
        integralCost: '', //积分费用
        cashCost: '',
        virtualStock: '',
        memberLabelType: 1,
        memberGrade: [], //适用会员
        limitTimesStatus: false, //限兑
        limitTimes: '', //限兑次数
        releaseType: 1, //上架时间
        proShowStatus: 1, //显示状态
        exchangeDateType: 1, //兑换日期
        exchangeTimeType: 1, //兑换时段
        exchangeFixDate: [], //固定日期
        exchangeDateDayArr: [],
        exchangeDateWeekArr: [],
        timeRangeList: [{ timeRange: '' }], //部分时段数组
        limitTimeBegin: '',
        timeZones: ['', '']
      },
      uploadAction: window.location.origin + '/api-plug/upload-img?requestProject=integral-mall',
      // uploadAction: 'http://gicdev.demogic.com/api-plug/upload-img?requestProject=integral-mall',
      headersUpload: {
        sign: ''
      },
      uploadStatus: true, //上传按钮
      dialogVisibleImg: false, //上传图片
      refash: false,
      memberGradeList: [], //会员等级
      // 门店控件
      sendChildData: {
        storeType: 0,
        storeGroupIds: '',
        storeIds: []
      },
      monthOptions: Array.from(Array(31), (v, k) => (k + 1).toString()),
      weekOptions: ['1', '2', '3', '4', '5', '6', '7'],
      couponRules: {
        integralCost: [{ required: true, message: '请输入积分费用', trigger: 'blur' }],
        cashCost: [{ required: true, message: '请输入现金费用', trigger: 'blur' }],
        virtualStock: [{ required: true, message: '请输入库存', trigger: 'blur' }],
        memberGrade: [{ required: true, message: '请选择适用会员', trigger: 'change' }],
        exchangeFixDate: [{ required: true, message: '请选择时间', trigger: 'change' }],
        exchangeDateDayArr: [{ required: true, message: '请选择时间', trigger: 'change' }],
        exchangeDateWeekArr: [{ required: true, message: '请选择时间', trigger: 'change' }],
        limitTimeBegin: [{ required: true, message: '请选择时间', trigger: 'change' }]
      },
      validateTime,
      mallProId: '',
      coupCardId: '', //卡券id
      costValue: '', //礼品成本
      costValueStatus: true,
      couponCardStock: '', //优惠券库存
      couponStatus: false //卡券状态
    };
  },
  created() {
    window.onbeforeunload = function(e) {
      // var storage = window.localStorage;
      // storage.clear('couponListObj');
      localStorage.removeItem('giftListObj');
    };
    let val = {
      storeType: 0,
      storeGroupIds: '',
      storeIds: []
    };
    this.getSelectGroupData(val);
    this.mallProId = this.$route.query.giftId;
    this.coupCardId = this.$route.query.coupCardId;

    if (this.mallProId !== '-1') {
      this.getInfo();
    }

    this.getMemberGradeList(); //会员等级列表\
  },
  methods: {
    refashData() {
      this.refash = !this.refash;
    },
    // 获取会员等级
    getMemberGradeList() {
      request.post('/api-integral-mall/load-grade').then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.result) {
            this.memberGradeList = res.data.result;
          } else {
            this.memberGradeList = [];
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 获取详情
    getInfo() {
      let params = {
        integralMallProId: this.mallProId
      };
      request.post('/api-integral-mall/get-integral-mall-pro', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          // this.couponForm = res.data.result;
          this.coupCardId = res.data.result.proReferId;
          if (this.coupCardId !== '-1') {
            this.proReferId = this.coupCardId;
            this.getCardInfo();
          }
          //积分费用
          this.couponForm.integralCost = res.data.result.integralCost;
          //现金费用
          this.couponForm.cashCost = res.data.result.cashCost;
          //库存
          this.couponForm.virtualStock = res.data.result.virtualStock;
          this.couponForm.detailDescription = res.data.result.detailDescription; //图文详情
          //适用会员
          if (res.data.result.memberGrade) {
            this.couponForm.memberGrade = res.data.result.memberGrade.split(',');
          } else {
            this.couponForm.memberGrade = [];
          }
          if (res.data.result.images) {
            //主图
            for (let item of res.data.result.images) {
              this.couponForm.images.push({
                imageUrl: item.imageUrl,
                imageCode: item.imageFieldCode
              });
            }
          }
          if (this.couponForm.images.length >= 1) {
            this.uploadStatus = false;
          } else {
            this.uploadStatus = true;
          }
          this.sendChildData.storeType = res.data.result.showStore || 0;
          if (this.sendChildData.storeType === 1) {
            this.sendChildData.storeGroupIds = res.data.result.storeGroupIds || '';
          } else if (this.sendChildData.storeType === 2) {
            let list = [];
            if (res.data.result.storeInfo) {
              res.data.result.storeInfo.map(v => {
                list.push(v);
              });
            }
            this.sendChildData.storeIds = list;
          }
          this.getSelectGroupData(this.sendChildData);
          //限兑
          if (res.data.result.limitTimes === -1) {
            this.couponForm.limitTimesStatus = false;
          } else {
            this.couponForm.limitTimesStatus = true;
          }
          //限兑
          this.couponForm.limitTimes = res.data.result.limitTimes;

          this.costValue = res.data.result.costValue; //礼品陈本
          // 兑换日期
          // 兑换日期
          this.couponForm.exchangeDateType = res.data.result.exchangeDateType;

          if (this.couponForm.exchangeDateType === 2) {
            this.couponForm.exchangeFixDate = [];
            this.couponForm.exchangeFixDate.push(res.data.result.exchangeFixDateBegin);
            this.couponForm.exchangeFixDate.push(res.data.result.exchangeFixDateEnd);
          } else if (this.couponForm.exchangeDateType === 3) {
            this.couponForm.exchangeDateDayArr = res.data.result.exchangeDateDay.split(',');
            this.couponForm.exchangeDateWeekArr = [];
          } else if (this.couponForm.exchangeDateType === 4) {
            this.couponForm.exchangeDateWeekArr = res.data.result.exchangeDateWeek.split(',');
            this.couponForm.exchangeDateDayArr = [];
          }

          // 兑换时段
          this.couponForm.exchangeTimeType = res.data.result.exchangeTimeType;
          //部分时间段
          let timeDate;
          let timeRangeList;
          if (this.couponForm.exchangeTimeType === 2) {
            timeDate = res.data.result.timeZones.split('#');
            timeRangeList = [];
            for (let item of timeDate) {
              timeRangeList.push({
                timeRange: item.split('-')
              });
            }
            this.couponForm.timeRangeList = timeRangeList;
          }

          //显示状态
          this.couponForm.proShowStatus = res.data.result.proShowStatus;
          //上架时间
          this.couponForm.releaseType = res.data.result.releaseType;
          if (this.couponForm.releaseType === 2) {
            this.couponForm.limitTimeBegin = res.data.result.limitTimeBegin;
          } else {
            this.couponForm.limitTimeBegin = '';
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 获取卡券详情
    getCardInfo() {
      let params = {
        coupCardId: this.coupCardId
      };
      request.post('/api-integral-mall/get-card', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          this.cardList.push(res.data.result);
          if (this.cardList) {
            this.couponForm.cardType = this.cardList[0].cardType;
            for (let item of this.cardList) {
              item.beginDate = this.getTimeAll(item.beginDate);
              item.endDate = this.getTimeAll(item.endDate);
            }
          }
          if (res.data.result.status === 0) {
            this.couponStatus = true;
          } else {
            this.couponStatus = false;
          }
          this.limitTimes = Number(res.data.result.cardLimit);
          this.limitTimesNum = res.data.result.cardLimit;
          this.couponCardStock = res.data.result.couponStock;
          // this.couponForm.virtualStock = this.couponCardStock;
          this.couponForm.proName = res.data.result.cardName;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    limitTimeChange() {
      if (this.cardList.length) {
        if (Number(this.couponForm.limitTimes) > Number(this.limitTimes)) {
          this.$message.error('兑换限制不得大于此优惠券的领取次数');
          // this.couponForm.limitTimes = this.limitTimes;
          return false;
        }
      } else {
        this.limitTimesNum = this.couponForm.limitTimes;
      }
    },
    //门店分类回执方法
    getSelectGroupData(val) {
      // this.sendChildData.storeType = val.storeType || 0;
      // this.sendChildData.storeGroupIds = val.storeGroupIds || '';
      // this.sendChildData.storeIds = val.storeIds || [];
      this.sendChildData = {
        storeType: val.storeType || 0,
        storeGroupIds: val.storeGroupIds || '',
        storeIds: val.storeIds || []
      };
    },
    // 显示卡券弹窗
    showCard() {
      this.showCardDialog = true;
    },
    // 子组件触发方法
    selectCard(val) {
      this.showCardDialog = false;
      this.cardList = [];
      if (val) {
        this.cardList.push(val);
        this.limitTimes = val.cardLimit;
        this.limitTimesNum = val.cardLimit;
        this.proReferId = val.coupCardId;
        this.couponForm.cardType = val.cardType;

        this.couponCardStock = val.couponStock;
        // this.couponForm.virtualStock = this.couponCardStock;
        this.couponForm.proName = val.cardName;
        this.couponForm.limitTimesStatus = true;
        let params = {
          couponCardId: val.coupCardId,
          proType: 1
        };
        request.post('/api-integral-mall/get-integral-mall-CashCost', qs.stringify(params)).then(res => {
          if (res.data.errorCode === 0) {
            this.costValue = res.data.result.costValue;
          } else {
            this.$message.error(res.data.message);
          }
        });
      }
    },
    // 添加兑换时段
    addTimeRange() {
      if (this.couponForm.timeRangeList.length >= 5) {
        this.$message.error('最多五个时间段');
        return false;
      }
      this.couponForm.timeRangeList.push({ timeRange: '' });
    },
    // 删除兑换时段
    delTimeRange(index) {
      this.couponForm.timeRangeList.splice(index, 1);
    },

    // 图片上传
    // 上传图片前
    beforeUpload(file) {
      if (this.couponForm.images === null) {
        this.couponForm.images = [];
      }
      if (this.couponForm.images.length > 4) {
        this.$message.warning('最多上传5张商品主图');
        return false;
      }
      if (file.size > 2 * 1024 * 1024) {
        this.$message.error('请上传小于2MB的图片');
        return false;
      }
      if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/jpg' && file.type !== 'image/gif') {
        this.$message.error('请上传jpg，png，gif格式的图片');
        return false;
      }
      if (localStorage.getItem('sign')) {
        this.headersUpload.sign = localStorage.getItem('sign');
      } else {
        this.headersUpload.sign = '';
      }
      var that = this;
      return new Promise(function(resolve, reject) {
        let reader = new FileReader();
        reader.onload = function(event) {
          let image = new Image();
          image.onload = function() {
            let width = this.width;
            let height = this.height;
            if (width < 700 || width / height != 1) {
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
    // 预览
    handlePictureCardPreview(file) {
      this.couponForm.images = file.url;
      this.dialogVisibleImg = true;
    },
    // 上传图片成功
    uploadSuccess(response, file, fileList) {
      if (response.errorCode === 0) {
        this.couponForm.images.push({
          imageUrl: response.result[0].qcloudImageUrl,
          imageCode: response.result[0].imageFiledCode
        });
        this.$message.success('上传成功');
        if (this.couponForm.images.length === 1) {
          this.uploadStatus = false;
        } else {
          this.uploadStatus = true;
        }
      } else {
        this.$message.error(response.message);
      }
    },
    // 删除
    deteletDialogImageUrl(index) {
      this.uploadStatus = true;
      this.couponForm.images.splice(index, 1);
    },
    // 放大
    enlargeDialogImageUrl(index) {
      this.dialogEnlargeImageUrl = this.couponForm.images[index].imageUrl;
      this.dialogVisibleImg = true;
    },
    // 左移一位
    moveLeft(index) {
      this.swapArray(this.couponForm.images, index, index - 1);
    },
    //右移一位
    moveRight(index) {
      this.swapArray(this.couponForm.images, index, index + 1);
    },
    //两个数据条换位置
    swapArray(arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      return arr;
    },
    // 提交数据
    submitForm(couponForm) {
      this.couponForm.detailDescription = this.$refs.tinymceWrap.tinymceHtml;
      if (this.cardList.length === 0) {
        this.$message.error('请选择卡券');
        return false;
      }
      // if (Number(this.couponForm.cashCost) > Number(this.costValue)) {
      //   this.$message.error('现金费用不能大于礼品成本 ');
      //   return false;
      // }
      if (this.cardList.length) {
        if (Number(this.couponForm.limitTimes) > Number(this.limitTimes)) {
          this.$message.error('兑换限制不得大于此优惠券的领取次数');
          return false;
        }
      }
      if (Number(this.couponForm.virtualStock) === 0) {
        this.$message.error('库存不能为0');
        return false;
      }
      if (Number(this.couponForm.virtualStock) > Number(this.couponCardStock)) {
        this.$message.error('礼品库存不能大于卡券库存 ');
        return false;
      }
      if (this.couponForm.limitTimesStatus) {
        if (Number(this.couponForm.limitTimes) === 0) {
          this.$message.error('限兑次数不能为0');
          return false;
        }
      }
      //图文详情的大小限制
      if (this.couponForm.detailDescription) {
        if (this.couponForm.detailDescription.length > 5000) {
          this.$message.error('图文详情输入内容不能超过5000');
          return false;
        }
      }
      if (this.couponForm.cardType === 2) {
        //兑换券必须上传主图
        if (this.couponForm.images.length === 0) {
          this.$message.error('兑换券要上传商品主图');
          return false;
        }
      }
      let giftImageUrls = [];
      let giftImageFiledCodes = [];
      for (let item of this.couponForm.images) {
        giftImageUrls.push(item.imageUrl);
        giftImageFiledCodes.push(item.imageCode);
      }

      this.$refs[couponForm].validate(valid => {
        if (valid) {
          let params = {
            proName: this.couponForm.proName,
            integralMallProId: this.mallProId === '-1' ? '' : this.mallProId, //礼品id
            proType: 1, //优惠券
            proReferId: this.proReferId, //卡券id
            detailDescription: this.couponForm.detailDescription, //图文详情
            giftImageUrls: giftImageUrls.join(','), //礼品主图
            giftImageFiledCodes: giftImageFiledCodes.join(','),
            cardType: this.couponForm.cardType,
            integralCost: this.couponForm.integralCost, //积分费用
            costValue: this.costValue, //礼品成本
            cashCost: this.couponForm.cashCost, //现金
            virtualStock: this.couponForm.virtualStock, //库存
            memberGrade: this.couponForm.memberGrade.join(','), //适用会员
            showStore: this.sendChildData.storeType, // 显示门店 0所有 1部分分类 2部分门店
            storeIds: '', //展现门店id
            limitTimes: this.couponForm.limitTimesStatus ? this.couponForm.limitTimes : '-1', //限兑
            exchangeDateType: this.couponForm.exchangeDateType, //兑换日期
            exchangeFixDateBegin: this.couponForm.exchangeDateType === 2 ? this.getTime(this.couponForm.exchangeFixDate[0]) : '', //固定日期
            exchangeFixDateEnd: this.couponForm.exchangeDateType === 2 ? this.getTime(this.couponForm.exchangeFixDate[1]) : '',
            exchangeDateDay: this.couponForm.exchangeDateType === 3 ? this.couponForm.exchangeDateDayArr.join(',') : '', //兑换日期月
            exchangeDateWeek: this.couponForm.exchangeDateType === 4 ? this.couponForm.exchangeDateWeekArr.join(',') : '', //兑换日期周
            exchangeTimeType: this.couponForm.exchangeTimeType, //兑换时段
            proShowStatus: this.couponForm.proShowStatus, //显示状态
            releaseType: this.couponForm.releaseType, //上架状态
            limitTimeBegin: this.couponForm.releaseType === 2 ? this.getTimeAll(this.couponForm.limitTimeBegin) : '' //定时上架时间
          };
          // 门店分类
          if (this.sendChildData.storeType === 1) {
            if (this.sendChildData.storeGroupIds) {
              params.storeGroupIds = this.sendChildData.storeGroupIds || '';
            } else {
              this.$message.error('门店分类不能为空');
              return;
            }
          } else if (this.sendChildData.storeType === 2) {
            if (this.sendChildData.storeIds.length) {
              params.storeIds = this.sendChildData.storeIds.map(v => v.storeId).join(',');
            } else {
              params.storeIds = '';
              this.$message.error('部分门店不能为空');
              return;
            }
          }

          // 部分时段时间转换
          let timeLink = [];
          if (this.couponForm.exchangeTimeType === 2) {
            for (let item of this.couponForm.timeRangeList) {
              timeLink.push(item.timeRange[0] + '-' + item.timeRange[1]);
            }
          }
          params.timeZones = timeLink.join('#');
          this.submitLoading = true;
          request.post('/api-integral-mall/create-integral-pro', params).then(res => {
            if (res.data.errorCode === 0) {
              this.$router.push({
                name: 'coupon'
              });
              this.submitLoading = false;
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
        name: 'coupon'
      });
    }
  },
  components: {
    tinymceEdit
  }
};
</script>
<style scoped>
.section {
  background: #fff;
  margin: 24px;
  padding-bottom: 24px;
  /* padding: 24px; */
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
.w-350 {
  width: 350px;
}

.form-item-mt {
  margin-top: -12px;
}
/* 固定按钮 */
.confim-btn {
  height: 32px;
  padding: 12px 0;
  position: fixed;
  bottom: 0px;
  left: 200px;
  background: #fff;
  z-index: 2;
  text-align: center;
  border-top: 1px solid #dcdfe6;
}
.fix-btn {
  margin-left: -100px;
}
.mb8 {
  margin-bottom: 8px;
}
/* 主图 */
.img-box {
  width: 104px;
  height: 104px;
  border-radius: 4px;
  display: inline-block;
  margin-right: 8px;
  position: relative;
}
.img-box img {
  border-radius: 4px;
}

.dialog-img {
  width: 104px;
  height: 104px;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.5);
  display: none;
  cursor: pointer;
  border-radius: 6px;
}
.img-box:hover .dialog-img {
  display: block;
}

.upload-list-box .el-icon-delete {
  position: absolute;
  left: 56px;
  top: 50%;
  transform: translateY(-50%);
  display: none;
  font-size: 20px;
  color: #fff;
  z-index: 2;
}
.el-icon-zoom-in {
  position: absolute;
  left: 30px;
  top: 50%;
  transform: translateY(-50%);
  display: none;
  font-size: 20px;
  color: #fff;
  z-index: 2;
}
.el-icon-arrow-left {
  position: absolute;
  left: 5px;
  top: 50%;
  transform: translateY(-50%);
  display: none;
  font-size: 20px;
  color: #fff;
  z-index: 2;
}
.el-icon-arrow-right {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  display: none;
  font-size: 20px;
  color: #fff;
  z-index: 2;
}
.img-box:hover i {
  display: block;
  cursor: pointer;
}
.img-box:first-child .el-icon-arrow-left {
  display: none;
}
.img-box:last-child .el-icon-arrow-right {
  display: none;
}
/*.img-box:hover img{
    opacity:0.6;
    cursor: pointer;
  }*/
.img-box img {
  width: 104px;
  height: 104px;
}
.w-300 {
  width: 300px;
}
.w-600 {
  width: 600px;
}
.mall-content-section {
  position: relative;
}
.alert-content {
  width: 500px;
  margin: 22px 0 22px 133px;
}
</style>
<style>
.select-shop__right {
  line-height: 28px !important;
}
.section-content .pagination {
  float: none !important;
}
.upload-list-box .el-upload--picture-card {
  width: 104px;
  height: 104px;
  line-height: 104px;
}
</style>
