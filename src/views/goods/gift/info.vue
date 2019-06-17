<template>
  <div class="mall-section-container">
    <div class="mall-content-section">
      <div class="mall-content-title">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '' }"><a href="/report/#/memberSummary">首页</a></el-breadcrumb-item>
          <el-breadcrumb-item>积分商城</el-breadcrumb-item>
          <el-breadcrumb-item>商品</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/gift' }">礼品</el-breadcrumb-item>
          <el-breadcrumb-item>{{ mallProId === '-1' ? '新建' : '编辑' }}礼品</el-breadcrumb-item>
        </el-breadcrumb>
        <h3>
          <span>{{ mallProId === '-1' ? '新建' : '编辑' }}礼品</span>
        </h3>
      </div>
      <div class="section">
        <el-form :model="giftForm" :rules="giftRules" ref="giftForm" label-width="150px" class="demo-ruleForm" label-position="right">
          <div class="section-content">
            <h3>基础信息</h3>
            <el-form-item label="礼品名称" prop="proName">
              <el-input v-model="giftForm.proName" class="w-600" type="text" placeholder="请输入礼品名称" @input="value => goodsLimit(value)">
                <span slot="suffix">{{ proNameLen }}/30</span>
              </el-input>
            </el-form-item>
            <el-form-item label="礼品主图" required>
              <div class="upload-list-box">
                <div style="display: inline-block;vertical-align: top;margin-right:5px;height:104px;">
                  <div v-for="(item, index) in giftForm.images" :key="index" class="img-box">
                    <img width="100%" :src="item.imageUrl" alt="" />
                    <i class="el-icon-arrow-left" @click="moveLeft(index)" v-show="index !== 0"></i>
                    <i class="el-icon-arrow-right" @click="moveRight(index)" v-show="index + 1 !== giftForm.images.length"></i>
                    <i class="el-icon-delete" @click="deteletDialogImageUrl(index)"></i>
                    <i class="el-icon-zoom-in" @click="enlargeDialogImageUrl(index)"></i>
                    <div class="dialog-img"></div>
                  </div>
                  <el-upload :action="uploadAction" :headers="headersUpload" list-type="picture-card" :on-preview="handlePictureCardPreview" :before-upload="beforeUpload" :on-success="uploadSuccess" with-credentials :show-file-list="false" v-show="uploadStatus" style="display: inline-block;vertical-align: top;">
                    <i class="el-icon-plus"></i>
                  </el-upload>
                </div>
                <p style="font-size: 12px; color: rgb(144, 147, 153);line-height:18px;margin-top:10px;">图片宽度≥700px，图片宽高比1:1，单张图片大小不超过 2 MB，至少上传1张，最多可上传 5 张。</p>
                <el-dialog :visible.sync="dialogVisibleImg">
                  <img width="100%" :src="dialogEnlargeImageUrl" alt="" />
                </el-dialog>
              </div>
            </el-form-item>
            <el-form-item label="礼品分类" prop="proCategoryId">
              <el-select v-model="giftForm.proCategoryId" placeholder="请选择" class="w-300 delete-select">
                <el-option v-for="(v, i) in categoryOptions" :key="i" :label="v.categoryName" :value="v.integralMallCategoryId">
                  <span class="fl">{{ v.categoryName }}</span>
                  <el-button class="fr delete-icon" type="text" @click.stop="deleteCategory(v.integralMallCategoryId)" style="line-height:34px"><i class="el-icon-error el-icon--right"></i></el-button>
                </el-option>
              </el-select>
              <el-button type="text" @click="createCategory">新建分类</el-button>
              <span style="display:none">{{ refash }}</span>
            </el-form-item>
          </div>
          <div class="section-content">
            <h3>销售信息</h3>
            <el-form-item label="礼品规格" v-if="giftType === 1 || submitSkuJson.length">
              <addSku :skuJson="giftProStandardJson" :giftType="giftType" @getSpuStock="getSpuStock" @getStandradList="getStandradList" @getSkuList="getSkuList" @IsAgreeUpload="IsAgreeUpload" :isStdImg="isStdImg" :skuList="skuList"></addSku>
            </el-form-item>
            <el-form-item label="礼品编码">
              <table class="spu-table">
                <thead>
                  <tr>
                    <th>礼品编码</th>
                    <th style="width:80px"><span class="red-color">*</span>积分</th>
                    <th style="width:80px"><span class="red-color">*</span>现金（元）</th>
                    <th style="width:120px"><span class="red-color">*</span>库存</th>
                    <th style="width:120px">礼品条形码</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="width:120px">
                      <el-input size="small" v-model="giftForm.proCode" placeholder="请输入内容" @input="limitProCode" @blur="limitProCodeType"> </el-input>
                    </td>
                    <td style="width:120px">
                      <el-input size="small" v-model="giftForm.integralCost" placeholder="请输入内容" @blur="limitCostType"> </el-input>
                    </td>
                    <td style="width:120px">
                      <el-input size="small" v-model="giftForm.cashCost" placeholder="请输入内容" @blur="limitCash"> </el-input>
                    </td>
                    <td style="width:120px">
                      <el-input size="small" v-model="giftForm.virtualStock" placeholder="请输入内容" :disabled="stockDisabled" @blur="limitStock"> </el-input>
                    </td>
                    <td style="width:120px">
                      <el-input size="small" v-model="giftForm.proCodeQuery" placeholder="请输入内容" @input="limintProCodeQuery" @blur="limitproCodeQueryType"> </el-input>
                    </td>
                  </tr>
                </tbody>
              </table>
            </el-form-item>
            <el-form-item label="礼品成本" prop="costValue">
              <el-input-number class="w-350" :precision="2" :min="0" v-model="giftForm.costValue" :disabled="costValueStatus"></el-input-number>
            </el-form-item>
            <el-form-item label="市场价">
              <el-input-number class="w-350" :precision="2" :min="0" :max="9999999" v-model="giftForm.marketPrice"></el-input-number>
              <el-popover placement="top-start" width="347" trigger="hover">
                <img src="../../../../static/img/eg.png" alt="" />
                <el-button slot="reference" type="text" style="margin-left:15px;">查看示例</el-button>
              </el-popover>
            </el-form-item>
          </div>
          <div class="section-content">
            <h3>图文信息</h3>
            <el-form-item label="">
              <div class="tinymce-wrap">
                <tinymce-edit ref="tinymceWrap" :bodyHtml="giftForm.detailDescription" :projectName="projectName"></tinymce-edit>
              </div>
            </el-form-item>
          </div>
          <div class="section-content">
            <h3>兑换设置</h3>
            <el-form-item label="适用会员" prop="memberGrade">
              <el-select v-model="giftForm.memberGrade" multiple placeholder="请选择" size="small" class="w-600">
                <el-option v-for="item in memberGradeList" :key="item.gradeId" :label="item.gradeName" :value="item.gradeId"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="展现门店" required>
              <vue-gic-store-linkage :disabled="isInfo" :msg="sendChildData" ref="selectTree" @sendSelectGroupData="getSelectGroupData"></vue-gic-store-linkage>
            </el-form-item>
            <el-form-item label="限兑">
              <el-checkbox v-model="giftForm.limitTimesStatus" @change="refashData()">每个会员限制兑换</el-checkbox>
              <span v-if="giftForm.limitTimesStatus"><el-input-number controls-position="right" v-model="giftForm.limitTimes" :precision="0" :min="0" @change="limitTimeChange"></el-input-number> 次</span>
              <span v-show="cardList.length" style="font-size: 12px;color: rgb(144, 147, 153);margin-left:10px;"
                >兑换限制不得大于此兑换券的领取次数：<i>{{ limitTimesNum }}</i
                >次</span
              >
            </el-form-item>
            <el-form-item label="兑换日期" required>
              <template>
                <el-radio v-model="giftForm.exchangeDateType" :label="1">全部日期</el-radio>
                <el-radio v-model="giftForm.exchangeDateType" :label="2">固定日期</el-radio>
                <el-radio v-model="giftForm.exchangeDateType" :label="3">每月</el-radio>
                <el-radio v-model="giftForm.exchangeDateType" :label="4">每周</el-radio>
              </template>
            </el-form-item>
            <!-- 兑换日期 -->
            <!-- 固定日期 -->

            <el-form-item class="form-item-mt" v-if="giftForm.exchangeDateType === 2" prop="exchangeFixDate">
              <el-date-picker class="w-300" v-model="giftForm.exchangeFixDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <!-- 每月 -->
            <el-form-item class="form-item-mt" v-if="giftForm.exchangeDateType === 3" prop="exchangeDateDayArr">
              <el-select size="small" v-model="giftForm.exchangeDateDayArr" multiple placeholder="请选择" class="w-300">
                <el-option v-for="item in monthOptions" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <!-- 每周 -->
            <el-form-item class="form-item-mt" v-if="giftForm.exchangeDateType === 4" prop="exchangeDateWeekArr">
              <el-select size="small" v-model="giftForm.exchangeDateWeekArr" multiple placeholder="请选择" class="w-300">
                <el-option v-for="item in weekOptions" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <!-- 兑换时段 -->
            <el-form-item label="兑换时段" required>
              <template>
                <el-radio v-model="giftForm.exchangeTimeType" :label="1">全部时段</el-radio>
                <el-radio v-model="giftForm.exchangeTimeType" :label="2">部分时段</el-radio>
              </template>
            </el-form-item>
            <div v-if="giftForm.exchangeTimeType === 2">
              <el-form-item class="mt8" v-for="(v, i) in giftForm.timeRangeList" :key="i" :prop="'timeRangeList.' + i + '.timeRange'" :rules="[{ validator: validateTime, trigger: 'change' }]">
                <el-time-picker is-range v-model="v.timeRange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" value-format="HH:mm" format="HH:mm" placeholder="选择时间范围"> </el-time-picker>
                <el-button v-if="i" type="text" @click="delTimeRange(i)">删除</el-button>
              </el-form-item>
              <p style="font-size:12px;color:#909399;line-height:12px;margin-left:170px;">请使用24小时制输入时间，格式如11:00至14:30</p>
              <p><el-button type="text" style="margin:8px 0 10px 170px" @click="addTimeRange">添加时间段</el-button></p>
            </div>
            <el-form-item label="显示状态" required>
              <el-radio-group v-model="giftForm.proShowStatus">
                <el-radio :label="1">上架状态就显示</el-radio>
                <el-radio :label="2">兑换状态下显示</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="上架时间" required>
              <el-radio-group v-model="giftForm.releaseType">
                <el-radio :label="1">立即上架</el-radio>
                <el-radio :label="2">定时上架</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- 定时上架 -->
            <el-form-item class="form-item-mt" v-if="giftForm.releaseType === 2" prop="limitTimeBegin">
              <el-date-picker v-model="giftForm.limitTimeBegin" type="datetime" placeholder="选择日期时间"> </el-date-picker>
            </el-form-item>
            <!-- 实物礼品 -->

            <el-form-item label="配送方式" required v-if="giftType === 1" prop="changeTypeList">
              <el-checkbox-group v-model="giftForm.changeTypeList" :disabled="editChangeTypeStatus" @change="handleStatus">
                <el-checkbox label="2">快递发货</el-checkbox>
                <el-checkbox v-if="giftForm.changeType === 1" label="1">微信兑换券</el-checkbox>
                <!-- <el-checkbox v-if="giftForm.changeType !== 1" label="4">门店自提</el-checkbox> -->
              </el-checkbox-group>
            </el-form-item>

            <!-- 虚拟礼品 -->
            <!-- <el-form-item label="配送方式" required v-else>
              <el-radio-group v-model="giftForm.changeType" @change="changeDeliver" :disabled="editChangeTypeStatus">
                <el-radio :label="3">在线发货 </el-radio>
                <el-radio :label="1">微信兑换券</el-radio>
              </el-radio-group>
            </el-form-item> -->
            <el-form-item label="配送方式" required v-if="giftType !== 1">
              <el-radio-group v-model="giftForm.changeType" @change="changeDeliver" :disabled="editChangeTypeStatus">
                <el-radio :label="3"
                  >在线发货
                  <el-tooltip effect="dark" content="上架虚拟商品时，若选择在线发货，则买家下单后，商户需及时在后台点击发货" placement="top-start">
                    <i class="iconfont icon-xinxixianshi"></i>
                  </el-tooltip>
                </el-radio>
                <el-radio :label="1" v-if="giftForm.changeType === 1">微信兑换券</el-radio>
                <el-radio :label="5" v-if="giftForm.changeType !== 1"
                  >文本券码
                  <el-tooltip effect="dark" content="上架虚拟商品时，若选择文本券码，则可预先上传券码等信息，买家下单后，系统会自动将券码发给买家并完成交易，无需商户在后台点击发货。" placement="top-start">
                    <i class="iconfont icon-xinxixianshi"></i>
                  </el-tooltip>
                </el-radio>
              </el-radio-group>
              <el-button type="primary" size="mini" v-if="giftForm.changeType === 5" style="margin-left:20px;" @click="handleImportCoupon">批量导入</el-button>
              <span v-if="giftForm.changeType === 5" style="font-size: 12px;color: rgb(144, 147, 153);margin-left:10px;">小程序积分商城请升级至V3.0.5及以上版本方可支持</span>
            </el-form-item>
            <!-- <el-form-item label="配送方式" required>
              <el-radio-group v-model="giftForm.changeType" @change="changeDeliver" :disabled="editChangeTypeStatus">
                <el-radio :label="2" v-if="giftType === 1">快递发货</el-radio>
                <el-radio :label="3" v-if="giftType === 0">在线发货</el-radio>
                <el-radio :label="1">微信兑换券</el-radio>
              </el-radio-group>
            </el-form-item> -->
            <div class="section-content1" v-show="giftForm.changeType === 1">
              <h3>选择卡券</h3>
              <el-form-item label="选择卡券" required v-show="mallProId === '-1'" style="margin-bottom:66px;">
                <el-button plain @click="showCard">添加卡券</el-button>
              </el-form-item>
              <el-form-item label="选择卡券" required v-show="mallProId !== '-1'"> </el-form-item>
              <el-table :data="cardList" style="width: 900px;margin-left:170px;margin-top:-44px;" v-show="cardList.length > 0">
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
            </div>
          </div>

          <div class="section-content section-tip-content">
            <h3>售后服务</h3>
            <el-form-item label="支持买家申请退款   " required>
              <el-tooltip class="tip-content" effect="dark" content="若商品不支持买家退款，则在下单时系统会提醒买家此商品不支持退款或退货。" placement="top-start">
                <i class="iconfont icon-xinxixianshi"></i>
              </el-tooltip>
              <el-radio-group v-model="giftForm.refundType" :disabled="refundTypeStatus">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
              <span style="font-size: 12px;color: rgb(144, 147, 153);margin-left:10px;">公众号积分商城不支持此功能，小程序积分商城请升级至V3.0.0及以上版本</span>
            </el-form-item>
          </div>
          <div class="confim-btn" :style="{ width: fixedWidth + 'px' }">
            <el-form-item class="fix-btn">
              <el-button type="primary" @click="submitGoodsForm('giftForm')" size="small" :loading="submitLoading">保存</el-button>
              <el-button @click="cancelGoodsForm" size="small">返回</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="anchor-link">
        <div class="link-item" :class="linkIndex === 0 ? 'link-item-active' : ''" @click="jump(0)">基础信息</div>
        <div class="link-item" :class="linkIndex === 1 ? 'link-item-active' : ''" @click="jump(1)">销售信息</div>
        <div class="link-item" :class="linkIndex === 2 ? 'link-item-active' : ''" @click="jump(2)">图文信息</div>
        <div class="link-item" :class="linkIndex === 3 ? 'link-item-active' : ''" @click="jump(3)">兑换信息</div>
        <div class="link-item" :class="linkIndex === 4 ? 'link-item-active' : ''" @click="jump(4)">售后服务</div>
      </div>
    </div>
    <!-- 新建分类弹框 -->
    <addCate :addCateModal="addCateModal" @getCategoryOptions="getCategoryOptions"></addCate>
    <!-- 卡券选择弹框 -->
    <vue-gic-card :disabledList="disabledList" :projectName="projectName" :showCardDialog="showCardDialog" :cardLimit="cardLimit" :cardType="cardType" @selectCard="selectCard" ref="dmcard"></vue-gic-card>
    <!-- 跳转链接 -->
    <el-dialog title="提示" :visible.sync="dialogVisibleLink" width="400px">
      <p style="margin-bottom:22px;">需先开启门店自提服务后方可生效，请先<el-button type="text" @click="goDeliverSet">前往设置</el-button></p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleLink = false">取 消</el-button>
        <el-button type="primary" @click="goDeliverSet">确 定</el-button>
      </span>
    </el-dialog>
    <importCoupon :importCouponModal="importCouponModal" @getSuceessNum="getSuceessNum"></importCoupon>
  </div>
</template>

<script>
import qs from 'qs';
import request from '../../../service/request.js';
import copy from '../../../utils/clone.js';
import getInputVal from '../../../utils/common.js';
import addCate from '../../../components/addGiftCate';
import tinymceEdit from '../../../components/tinymce-edit';
import importCoupon from './importCoupon';
import addSku from './addSku';
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
      projectName: 'integral-mall',
      giftType: '', //礼品类型
      mallProId: '', //礼品id
      linkIndex: 0,
      giftForm: {
        proReferId: '', //礼品关联id
        proName: '',
        proCategoryId: '', //分类id
        images: [],
        memberGrade: null, //会员等级
        limitTimesStatus: false,
        limitTimes: '', //限制兑换的次数
        exchangeDateType: 1, //兑换日期
        exchangeFixDate: [], //固定日期
        exchangeDateDayArr: [],
        exchangeDateWeekArr: [],
        exchangeTimeType: 1, //兑换时段
        timeRangeList: [{ timeRange: '' }], //部分时段数组
        detailDescription: '', //图文性情
        proShowStatus: 1, //显示状态
        releaseType: 1, //上架时间
        limitTimeBegin: '', //上架时间具体
        changeType: 5, //配送方式T
        changeTypeList: [], //配东方式
        refundType: 0, //是否允许退款
        costValue: '', //礼品成本
        marketPrice: '', //市场价
        proCode: '', //编码
        integralCost: '', //积分
        cashCost: '', //现金
        virtualStock: '', //库存
        proCodeQuery: '' //条形码
      },
      limitTimes: 0,
      limitTimesNum: 0,
      validateTime,
      memberGradeList: [], //会员等级列表
      submitLoading: false, //按钮加载中
      giftRules: {
        proName: [{ required: true, message: '请输入礼品名称', trigger: 'blur' }],
        costValue: [{ required: true, message: '请输入礼品成本', trigger: 'blur' }],
        memberGrade: [{ required: true, message: '请选择适用会员', trigger: 'blur' }],
        proCategoryId: [{ required: true, message: '请选择礼品分类', trigger: 'blur' }],
        exchangeFixDate: [{ required: true, message: '请选择时间', trigger: 'change' }],
        exchangeDateDayArr: [{ required: true, message: '请选择时间', trigger: 'change' }],
        exchangeDateWeekArr: [{ required: true, message: '请选择时间', trigger: 'change' }],
        limitTimeBegin: [{ required: true, message: '请选择时间', trigger: 'change' }],
        changeTypeList: [{ type: 'array', required: true, message: '请至少选择一个配送方式', trigger: 'change' }]
      },
      refundTypeStatus: false,
      uploadAction: window.location.origin + '/api-plug/upload-img?requestProject=integral-mall',
      // uploadAction: 'http://gicdev.demogic.com/api-plug/upload-img?requestProject=integral-mall',
      headersUpload: {
        sign: ''
      },
      proNameLen: 0,
      uploadStatus: true, //上传按钮
      dialogVisibleImg: false, //上传图片
      categoryOptions: [], //礼品分类
      addCateModal: {
        dialogVisible: false
      },
      monthOptions: Array.from(Array(31), (v, k) => (k + 1).toString()),
      weekOptions: ['1', '2', '3', '4', '5', '6', '7'],
      // 门店控件
      sendChildData: {
        storeType: 0,
        storeGroupIds: '',
        storeIds: []
      },
      stockDisabled: false, //spu库存是否可输入
      refash: false,
      giftProStandardJson: [], //规格列表
      isStdImg: false, //图片上传的状态
      skuList: [], //sku列表
      submitSkuJson: [],
      skuHeaderList: [],
      IsAgreeUploadStatus: false, //是否允许上传

      // 卡券数据
      // 可传参数
      // projectName: 'intergral-mall', //当前项目名
      showCardDialog: false,
      cardLimit: 3, //卡券限制类型 1-限制领取1张的卡券 2- 限制领取 1~100的卡券 3-限制领取&=100 的卡券
      cardType: 2, //卡券类型集合（0：抵金券，1：折扣券，2：兑换券）null-为全部类型 逗号分隔
      disabledList: [],
      selectedData: {},
      cardList: [],
      editChangeTypeStatus: false,

      couponCostValue: 0, //兑换券成本
      couponCardStock: 0, //兑换券库存
      costValueStatus: false,
      dialogVisibleLink: false,
      importCouponModal: {
        //文本券码导入
        dialogVisible: false,
        integralMallProId: ''
      },
      textStock: 0 //文本券码库存数
      // proReferId: ''
    };
  },
  created() {
    window.onbeforeunload = function(e) {
      // var storage = window.localStorage;
      // storage.clear('giftListObj');
      localStorage.removeItem('giftListObj');
    };
    this.giftType = Number(this.$route.query.type); //列表上实物是1虚拟是0
    this.mallProId = this.$route.query.giftId;
    if (this.$route.query.proReferId !== '-1') {
      //编辑
      this.giftForm.proReferId = this.$route.query.proReferId;
    } else {
      //新增
      this.giftForm.proReferId = '';
    }

    this.getCategoryOptions(); //分类数据
    this.getMemberGradeList(); //会员等级列表
    if (this.giftType === 1) {
      //实物
      this.giftForm.changeType = 2;
    } else if (this.giftType === 0) {
      //虚拟
      this.giftForm.changeType = 5;
      this.stockDisabled = this.giftForm.changeType === 5 ? true : false;
      this.refundTypeStatus = this.giftForm.changeType === 5 ? true : false;
    }
    if (this.mallProId !== '-1') {
      this.getInfo();
      this.editChangeTypeStatus = true;
    } else {
      if (this.giftType === 0) {
        this.getGiftId();
      } else {
        this.mallProId === '-1';
      }
    }
    // if (this.giftForm.changeType === 5) {
    //   this.refundTypeStatus = true;
    // }
    let val = {
      storeType: 0,
      storeGroupIds: '',
      storeIds: []
    };
    this.getSelectGroupData(val);
  },
  mounted: function() {
    this.$nextTick(function() {
      window.addEventListener('scroll', this.onScroll, true);
    });
  },
  methods: {
    // 获取卡券详情
    getCardInfo() {
      let params = {
        coupCardId: this.giftForm.proReferId
      };
      request.post('/api-integral-mall/get-card', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          this.cardList.push(res.data.result);
          if (this.cardList) {
            for (let item of this.cardList) {
              item.beginDate = this.getTimeAll(item.beginDate);
              item.endDate = this.getTimeAll(item.endDate);
            }
          }
          this.couponCardStock = res.data.result.couponStock; //兑换券库存
          this.limitTimes = Number(res.data.result.cardLimit);
          this.limitTimesNum = res.data.result.cardLimit;
          let params = {
            couponCardId: res.data.result.coupCardId,
            proType: 1
          };
          request.post('/api-integral-mall/get-integral-mall-CashCost', qs.stringify(params)).then(res => {
            if (res.data.errorCode === 0) {
              this.couponCostValue = res.data.result.costValue;
            } else {
              this.$message.error(res.data.message);
            }
          });
          // this.limitStock = Number(res.data.result.couponStock);
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    limitTimeChange() {
      if (this.cardList.length) {
        //选择了卡圈
        if (Number(this.giftForm.limitTimes) > Number(this.limitTimes)) {
          this.$message.error('兑换限制不得大于此优惠券的领取次数');
          // this.couponForm.limitTimes = this.limitStock;
          return false;
        }
      } else {
        //未选择了卡圈
        this.limitTimesNum = this.giftForm.limitTimes;
      }
    },
    refashData() {
      this.refash = !this.refash;
    },
    onScroll() {
      let scroll = document.documentElement.scrollTop || document.body.scrollTop;
      let jump = document.querySelectorAll('.section-content');
      jump.forEach((item, index) => {
        if (scroll >= item.offsetTop) {
          //滚动到对应的锚记改变样式
          this.linkIndex = index;
        }
      });
    },
    jump(num) {
      let index = Number(num);
      this.linkIndex = index;
      // 用 class="d_jump" 添加锚点
      let jump = document.querySelectorAll('.section-content');
      let total = jump[index].offsetTop;
      let distance = document.documentElement.scrollTop || document.body.scrollTop;
      // let distance = 200;
      // 平滑滚动，时长500ms，每10ms一跳，共50跳

      let step = total / 50;

      if (total > distance) {
        smoothDown();
      } else {
        let newTotal = distance - total;
        step = newTotal / 50;
        smoothUp();
      }
      function smoothDown() {
        if (distance < total) {
          distance += step;
          document.body.scrollTop = distance;
          document.documentElement.scrollTop = distance;
          setTimeout(smoothDown, 10);
        } else {
          document.body.scrollTop = total;
          document.documentElement.scrollTop = total;
        }
      }
      function smoothUp() {
        if (distance > total) {
          distance -= step;
          document.body.scrollTop = distance;
          document.documentElement.scrollTop = distance;
          setTimeout(smoothUp, 10);
        } else {
          document.body.scrollTop = total;
          document.documentElement.scrollTop = total;
        }
      }
    },
    // 获取详情
    getInfo() {
      let params = {
        integralMallProId: this.mallProId
      };
      request.post('/api-integral-mall/get-integral-mall-pro', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          this.giftForm.proName = res.data.result.proName; //名称
          this.giftForm.proCategoryId = res.data.result.proCategoryId; //分类
          this.giftForm.proCode = res.data.result.proCode; //编码
          this.giftForm.integralCost = res.data.result.integralCost; //积分
          this.giftForm.cashCost = res.data.result.cashCost; //现金
          this.giftForm.virtualStock = res.data.result.virtualStock; //库存
          this.giftForm.proCodeQuery = res.data.result.proCodeQuery; //条形码
          this.giftForm.costValue = res.data.result.costValue; //礼品成本
          this.giftForm.marketPrice = res.data.result.marketPrice; //市场价
          this.giftForm.detailDescription = res.data.result.detailDescription; //图文详情
          this.giftForm.memberGrade = res.data.result.memberGrade.split(','); //适用会员
          this.giftForm.proReferId = res.data.result.proReferId;
          if (res.data.result.images) {
            //主图
            for (let item of res.data.result.images) {
              this.giftForm.images.push({
                imageUrl: item.imageUrl,
                imageCode: item.imageFieldCode
              });
            }
          }
          if (this.giftForm.images.length >= 5) {
            this.uploadStatus = false;
          } else {
            this.uploadStatus = true;
          }
          //限兑
          if (res.data.result.limitTimes === -1) {
            this.giftForm.limitTimesStatus = false;
          } else {
            this.giftForm.limitTimesStatus = true;
          }
          this.giftForm.limitTimes = res.data.result.limitTimes;
          // 兑换日期
          this.giftForm.exchangeDateType = res.data.result.exchangeDateType;

          if (this.giftForm.exchangeDateType === 2) {
            this.giftForm.exchangeFixDate = [];
            this.giftForm.exchangeFixDate.push(res.data.result.exchangeFixDateBegin);
            this.giftForm.exchangeFixDate.push(res.data.result.exchangeFixDateEnd);
          } else if (this.giftForm.exchangeDateType === 3) {
            this.giftForm.exchangeDateDayArr = res.data.result.exchangeDateDay.split(',');
            this.giftForm.exchangeDateWeekArr = [];
          } else if (this.giftForm.exchangeDateType === 4) {
            this.giftForm.exchangeDateWeekArr = res.data.result.exchangeDateWeek.split(',');
            this.giftForm.exchangeDateDayArr = [];
          }
          // 兑换时段
          this.giftForm.exchangeTimeType = res.data.result.exchangeTimeType;
          //部分时间段
          let timeDate;
          let timeRangeList;
          if (this.giftForm.exchangeTimeType === 2) {
            timeDate = res.data.result.timeZones.split('#');
            timeRangeList = [];
            for (let item of timeDate) {
              timeRangeList.push({
                timeRange: item.split('-')
              });
            }
            this.giftForm.timeRangeList = timeRangeList;
          }
          this.sendChildData.storeType = res.data.result.showStore;

          if (this.sendChildData.storeType === 1) {
            this.sendChildData.storeGroupIds = res.data.result.storeGroupIds;
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
          //显示状态
          this.giftForm.proShowStatus = res.data.result.proShowStatus;
          //上架时间
          this.giftForm.releaseType = res.data.result.releaseType;
          if (this.giftForm.releaseType === 2) {
            this.giftForm.limitTimeBegin = res.data.result.limitTimeBegin;
          } else {
            this.giftForm.limitTimeBegin = '';
          }

          //配送方式
          if (res.data.result.giftType === 1) {
            //实物礼品
            this.giftForm.changeType = Number(res.data.result.changeType);
            this.giftForm.changeTypeList = res.data.result.changeType.split(',');
          } else if (res.data.result.giftType === 0) {
            //虚拟礼品
            this.giftForm.changeType = Number(res.data.result.changeType);
          }
          if (this.giftForm.changeType === 1 || this.giftForm.changeType === 5) {
            this.refundTypeStatus = true;
          } else {
            this.refundTypeStatus = false;
          }

          this.giftForm.refundType = res.data.result.refundType;
          if (this.giftForm.changeType === 1) {
            //微信兑换券
            this.getCardInfo();
          }
          // 规格列表
          if (res.data.result.giftProStandardJson) {
            this.giftProStandardJson = JSON.parse(res.data.result.giftProStandardJson);
          } else {
            this.giftProStandardJson = [];
          }

          if (this.giftProStandardJson.length) {
            if (this.giftProStandardJson[0].standardimg === 2) {
              this.isStdImg = true;
            } else {
              this.isStdImg = false;
            }
          }
          if (res.data.result.skuJsonList) {
            this.submitSkuJson = res.data.result.skuJsonList;
          } else {
            this.submitSkuJson = [];
          }

          // 获取头部
          this.skuHeaderList = [];

          if (res.data.result.skuJsonList) {
            for (let item of JSON.parse(res.data.result.skuJsonList[0].giftPropValues)) {
              this.skuHeaderList.push({
                proName: item.proName,
                proId: item.proId
              });
            }
          }

          // sku列表skuList
          if (res.data.result.skuJsonList) {
            for (let i in res.data.result.skuJsonList) {
              let tem = JSON.parse(res.data.result.skuJsonList[i].giftPropValues);
              tem.push({
                valueName: res.data.result.skuJsonList[i].giftProSkuIntegral //积分
              });
              tem.push({
                valueName: res.data.result.skuJsonList[i].giftProSkuCash //现金
              });
              tem.push({
                valueName: res.data.result.skuJsonList[i].stock //库存
              });
              tem.push({
                valueName: res.data.result.skuJsonList[i].giftProSkuStandCode //规格编码
              });
              tem.push({
                valueName: res.data.result.skuJsonList[i].giftProGiftCode //条形码
              });
              tem.push({
                valueName: res.data.result.skuJsonList[i].giftProSkuId //skuId
              });
              this.skuList.push(tem);
            }
          }
          if (res.data.result.giftType === 1) {
            //实物礼品
            if (this.giftProStandardJson.length > 0) {
              if (this.skuList.length > 0) {
                //spu库存是否可输入
                this.stockDisabled = true;
              } else {
                this.stockDisabled = false;
              }
            } else {
              this.stockDisabled = false;
            }
          } else if (res.data.result.giftType === 0) {
            //虚拟
            if (this.giftForm.changeType === 5) {
              //文本券码
              this.stockDisabled = true;
            } else {
              //在线发货
              if (this.giftProStandardJson.length > 0) {
                if (this.skuList.length > 0) {
                  //有sku(主要是处理老数据)
                  //spu库存是否可输入
                  this.stockDisabled = true;
                } else {
                  //无sku的数据
                  this.stockDisabled = false;
                }
              } else {
                this.stockDisabled = false;
              }
            }
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    getSpuStock(val) {
      this.giftForm.virtualStock = val;
    },
    // 礼品字数限制
    goodsLimit(value) {
      this.$nextTick(() => {
        this.giftForm.proName = getInputVal.getInputVal(value, 30);
        this.proNameLen = getInputVal.getZhLen(this.giftForm.proName);
      });
    },
    // spu信息限制
    limitProCode(value) {
      this.$nextTick(() => {
        this.giftForm.proCode = getInputVal.getInputVal(value, 16);
      });
    },
    limitProCodeType() {
      let reg = /^[0-9a-zA-Z]+?$/;
      if (!reg.test(this.giftForm.proCode)) {
        this.$message.error('请输入数字或者字母');
        this.giftForm.proCode = '';
      }
    },
    limitCostType() {
      //积分
      if (Number(this.giftForm.integralCost) < 0) {
        this.$message.error('请输入大于0的数字');
        this.giftForm.integralCost = '';
      } else if (Number(this.giftForm.integralCost) === 0) {
        return false;
      } else if (!Number(this.giftForm.integralCost)) {
        this.$message.error('请输入数字类型');
        this.giftForm.integralCost = '';
      } else if (Number(this.giftForm.integralCost) > 10000000) {
        this.$message.error('积分最大10000000');
        this.giftForm.integralCost = '';
      } else {
        this.giftForm.integralCost = Number(this.giftForm.integralCost).toFixed(0);
      }
    },
    limitCash() {
      //现金
      if (Number(this.giftForm.cashCost) < 0) {
        this.$message.error('请输入大于等于0的数字');
        this.giftForm.cashCost = '';
      } else if (Number(this.giftForm.cashCost) === 0) {
        return false;
      } else if (!Number(this.giftForm.cashCost)) {
        this.$message.error('请输入数字类型');
        this.giftForm.cashCost = '';
      } else if (Number(this.giftForm.cashCost) > 9999999) {
        this.$message.error('现金最大9999999');
        this.giftForm.cashCost = '';
      } else {
        this.giftForm.cashCost = Number(this.giftForm.cashCost).toFixed(2);
      }
    },
    limitStock() {
      //库存
      if (Number(this.giftForm.virtualStock) < 0) {
        this.$message.error('请输入大于0的数字');
        this.giftForm.virtualStock = '';
      } else if (!Number(this.giftForm.virtualStock)) {
        this.$message.error('请输入数字类型');
        this.giftForm.virtualStock = '';
      } else if (Number(this.giftForm.virtualStock) > 1000000) {
        this.$message.error('库存最大1000000');
        this.giftForm.virtualStock = '';
      } else {
        this.giftForm.virtualStock = Number(this.giftForm.virtualStock).toFixed(0);
      }
    },
    limintProCodeQuery(value) {
      this.$nextTick(() => {
        this.giftForm.proCodeQuery = getInputVal.getInputVal(value, 16);
      });
    },
    limitproCodeQueryType() {
      let reg = /^[0-9a-zA-Z]+?$/;
      if (!reg.test(this.giftForm.proCodeQuery)) {
        this.$message.error('请输入数字或者字母');
        this.giftForm.proCodeQuery = '';
      }
    },
    //获取礼品分类数据
    getCategoryOptions() {
      request.post('/api-integral-mall/load-category').then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.result) {
            this.categoryOptions = res.data.result;
          } else {
            this.categoryOptions = [];
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 删除分类
    deleteCategory(id) {
      let params = {
        integralMallCategoryId: id
      };
      request.post('/api-integral-mall/del-gift-category', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success('删除分类成功');
          this.getCategoryOptions();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    //新增分类
    createCategory() {
      this.addCateModal.dialogVisible = true;
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
    // 图片上传
    // 上传图片前
    beforeUpload(file) {
      if (this.giftForm.images === null) {
        this.giftForm.images = [];
      }
      if (this.giftForm.images.length > 4) {
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
      this.giftForm.images = file.url;
      this.dialogVisibleImg = true;
    },
    // 上传图片成功
    uploadSuccess(response, file, fileList) {
      if (response.errorCode === 0) {
        this.giftForm.images.push({
          imageUrl: response.result[0].qcloudImageUrl,
          imageCode: response.result[0].imageFiledCode
        });
        this.$message.success('上传成功');
        if (this.giftForm.images.length === 5) {
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
      this.giftForm.images.splice(index, 1);
    },
    // 放大
    enlargeDialogImageUrl(index) {
      this.dialogEnlargeImageUrl = this.giftForm.images[index].imageUrl;
      this.dialogVisibleImg = true;
    },
    // 左移一位
    moveLeft(index) {
      this.swapArray(this.giftForm.images, index, index - 1);
    },
    //右移一位
    moveRight(index) {
      this.swapArray(this.giftForm.images, index, index + 1);
    },
    //两个数据条换位置
    swapArray(arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      return arr;
    },
    // 添加兑换时段
    addTimeRange() {
      if (this.giftForm.timeRangeList.length >= 5) {
        this.$message.error('最多五个时间段');
        return false;
      }
      this.giftForm.timeRangeList.push({ timeRange: '' });
    },
    // 删除兑换时段
    delTimeRange(index) {
      this.giftForm.timeRangeList.splice(index, 1);
    },
    changeDeliver() {
      if (this.giftForm.changeType === 1 || this.giftForm.changeType === 5) {
        //微信兑换券
        this.refundTypeStatus = true;
        this.giftForm.refundType = 0;
      } else {
        this.refundTypeStatus = false;
        this.cardList = [];
      }
      if (this.giftForm.changeType === 3) {
        //在线发货
        this.giftForm.virtualStock = 0;
      } else if (this.giftForm.changeType === 5) {
        //文本卡券
        this.giftForm.virtualStock = this.textStock;
      }
      this.stockDisabled = this.giftForm.changeType === 5 ? true : false;
    },
    //获取商品的id
    getGiftId() {
      request.post('/api-integral-mall/get-gift-id').then(res => {
        if (res.data.errorCode === 0) {
          this.mallProId = res.data.result;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 导入文本券码
    handleImportCoupon() {
      this.importCouponModal.dialogVisible = true;
      this.importCouponModal.integralMallProId = this.mallProId;
    },
    // 获取文本券码成功的数据
    getSuceessNum(val) {
      this.textStock = val;
      this.giftForm.virtualStock = this.textStock;
    },
    // 勾选自提点
    handleStatus() {
      if (this.giftForm.changeTypeList.length) {
        if (this.giftForm.changeTypeList[0] === '4') {
          request.get('/api-integral-mall/pick-up-point-switch-status').then(res => {
            if (res.data.errorCode === 0) {
              if (res.data.result.status === 0) {
                //0关闭1开启
                this.dialogVisibleLink = true;
                for (let i = 0; i < this.giftForm.changeTypeList.length; i++) {
                  if (this.giftForm.changeTypeList[i] === '4') {
                    this.giftForm.changeTypeList.splice(i, 1);
                  }
                }
              }
            } else {
              this.$message.error(res.data.message);
            }
          });
        }
      }
    },
    // 跳转到设置自提点
    goDeliverSet() {
      this.$router.push({ name: 'deliverSet' });
    },
    // 获取规格列表
    getStandradList(val) {
      this.giftProStandardJson = val;
      if (this.giftProStandardJson.length) {
        for (let i in this.giftProStandardJson) {
          if (Number(i) === 0) {
            this.giftProStandardJson[i].standardimg = this.IsAgreeUploadStatus ? 2 : 1;
          } else {
            this.giftProStandardJson[i].standardimg = 1;
          }
        }
        this.skuHeaderList = [];
        for (let item of this.giftProStandardJson) {
          this.skuHeaderList.push({
            proName: item.standardName,
            proId: item.standardId
          });
        }
        if (this.giftProStandardJson.length <= 0) {
          this.stockDisabled = false;
          this.giftForm.virtualStock = 0;
        }
      }
    },
    getSkuList(val) {
      this.skuList = val;
      // return;
      this.handleSku();
      if (this.giftProStandardJson.length > 0) {
        if (this.skuList.length > 0) {
          //spu库存是否可输入
          this.stockDisabled = true;
        } else {
          this.stockDisabled = false;
        }
      } else {
        this.stockDisabled = false;
        this.giftForm.virtualStock = 0;
      }
    },
    IsAgreeUpload(val) {
      this.isStdImg = val;
      this.IsAgreeUploadStatus = val;
    },
    //处理sku
    handleSku() {
      let skuArr = copy(this.skuList);
      let outArr;
      let outArr1;
      let skuPrice = [];
      let skuSta = [];
      if (skuArr[0]) {
        for (let i in skuArr) {
          // console.log(777, skuArr[0]);
          //先获取sku价格条码这些
          outArr = copy(skuArr[i]); //得到固定的数据
          // console.log(333, outArr);
          outArr1 = outArr.splice(outArr.length - 6, 6);
          for (let k in outArr) {
            outArr[k].proName = this.skuHeaderList[k].proName;
            outArr[k].proId = this.skuHeaderList[k].proId;
            // outArr[k].proName = skuArr[0][k].proName;
            // outArr[k].proId = skuArr[0][k].proId;
          }
          skuSta.push(outArr);
          skuPrice.push(outArr1);
        }
        // console.log()
      }
      // return false;
      this.submitSkuJson = [];
      if (skuArr[0]) {
        for (let j in skuArr) {
          //数据的个数
          this.submitSkuJson.push({
            giftProSkuId: skuPrice[j][5].valueName ? skuPrice[j][5].valueName : '',
            giftProSkuIntegral: skuPrice[j][0].valueName, //积分
            giftProSkuCash: skuPrice[j][1].valueName, //现金
            stock: skuPrice[j][2].valueName, //库存
            giftProSkuStandCode: skuPrice[j][3].valueName, //规格编码
            giftProGiftCode: skuPrice[j][4].valueName, //条形码
            giftPropValues: skuSta[j]
          });
        }
      }
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
        this.costValueStatus = true;
        this.limitTimes = val.cardLimit;
        this.limitTimesNum = val.cardLimit;
        // this.limitStock = val.couponStock;
        this.giftForm.proReferId = val.coupCardId;
        this.giftForm.cardType = val.cardType;
        this.couponCardStock = val.couponStock; //兑换券库存
        this.giftForm.limitTimesStatus = true;
        let params = {
          couponCardId: val.coupCardId,
          proType: 1
        };
        request.post('/api-integral-mall/get-integral-mall-CashCost', qs.stringify(params)).then(res => {
          if (res.data.errorCode === 0) {
            this.couponCostValue = res.data.result.costValue;
            this.giftForm.costValue = res.data.result.costValue;
          } else {
            this.$message.error(res.data.message);
          }
        });
      }
    },
    // 保存
    submitGoodsForm(form) {
      this.giftForm.detailDescription = this.$refs.tinymceWrap.tinymceHtml;
      let giftImageUrls = [];
      let giftImageFiledCodes = [];
      if (this.giftForm.images.length === 0) {
        this.$message.error('请上传商品主图');
        return false;
      } else {
        for (let item of this.giftForm.images) {
          giftImageUrls.push(item.imageUrl);
          giftImageFiledCodes.push(item.imageCode);
        }
      }
      //校验规格明细
      if (this.giftProStandardJson) {
        for (let item of this.giftProStandardJson) {
          if (item.standardId === '') {
            this.$message.error('请填写完整的规格');
            return false;
          } else if (item.valueList.length === 0) {
            this.$message.error('请填写完整的规格');
            return false;
          }
          for (let item1 of item.valueList) {
            if (item1.valueName === '' || item1.valueId === '') {
              this.$message.error('请填写完整的规格');
              return false;
            }
          }
        }
      }
      //校验规格明细
      if (this.submitSkuJson.length) {
        for (let item of this.submitSkuJson) {
          if (item.giftPropValues.length) {
            for (let i of item.giftPropValues) {
              if (i.proId === '' || i.proName === '' || i.valueId === '' || i.valueName === '') {
                this.$message.error('请填写完整的sku数据');
                return false;
              }
            }
          }
          if (!item.stock && item.stock !== 0) {
            this.$message.error('请填写库存');
            return false;
          }
          if (Number(item.giftProSkuCash) !== 0) {
            if (!item.giftProSkuCash) {
              this.$message.error('请填写现金');
              return false;
            }
          }
          if (Number(item.giftProSkuIntegral) !== 0) {
            if (!item.giftProSkuIntegral) {
              this.$message.error('请填写积分');
              return false;
            }
          }
        }
      }

      // 检验规格图片
      if (this.IsAgreeUploadStatus) {
        if (this.giftProStandardJson[0].valueList) {
          for (let item of this.giftProStandardJson[0].valueList) {
            if (!item.propImg) {
              this.$message.error('请上传规格图片');
              return false;
            }
          }
        }
      }

      // spu未填校验||this.giftForm.cashCost===''||this.giftForm.virtualStock===''
      if (this.giftForm.integralCost === '') {
        this.$message.error('请填写礼品积分');
        return false;
      } else if (this.giftForm.cashCost === '') {
        this.$message.error('请填写礼品现金');
        return false;
      } else if (this.giftForm.virtualStock === '') {
        this.$message.error('请填写礼品库存');
        return false;
      }
      if (Number(this.giftForm.virtualStock) === 0) {
        this.$message.error('库存为0的礼品不允许保存');
        return false;
      }
      if (this.giftForm.changeType === 1) {
        if (this.cardList.length === 0) {
          this.$message.error('请选择卡券');
          return false;
        }
      }
      //库存不能大于兑换券库存
      if (this.giftForm.changeType === 1) {
        if (Number(this.giftForm.virtualStock) > Number(this.couponCardStock)) {
          this.$message.error('礼品库存不能大于兑换券的库存');
          return false;
        }
      }
      if (this.cardList.length) {
        if (Number(this.giftForm.limitTimes) > Number(this.limitTimes)) {
          this.$message.error('兑换限制不得大于此优惠券的领取次数');
          return false;
        }
      }
      if (this.giftForm.limitTimesStatus) {
        if (Number(this.giftForm.limitTimes) === 0) {
          this.$message.error('限兑次数不能为0');
          return false;
        }
      }
      // 成本
      // if (this.giftForm.changeType === 1) {
      //   if (Number(this.giftForm.costValue) > Number(this.couponCostValue)) {
      //     this.$message.error('礼品成本不能大于兑换券的成本');
      //     return false;
      //   }
      // }
      if (this.giftForm.detailDescription) {
        if (this.giftForm.detailDescription.length > 5000) {
          this.$message.error('图文详情输入内容不能超过5000');
          return false;
        }
      }

      this.$refs[form].validate(valid => {
        if (valid) {
          let params = {
            integralMallProId: this.mallProId === '-1' ? '' : this.mallProId, //礼品id
            proType: this.giftForm.changeType === 1 ? 2 : 3, //发货方式是微信兑换券传2其他传3
            giftType: this.giftType === 0 ? 0 : 1, //0、虚拟 1、实物
            proName: this.giftForm.proName, //礼品名称
            giftImageUrls: giftImageUrls.join(','), //礼品主图
            giftImageFiledCodes: giftImageFiledCodes.join(','),
            proReferId: this.giftForm.proReferId, //关联id
            cardType: this.giftForm.changeType === 1 ? this.giftForm.cardType : '', //卡券类型
            proCategoryId: this.giftForm.proCategoryId, //礼品分类
            detailDescription: this.giftForm.detailDescription, //图文详情
            memberGrade: this.giftForm.memberGrade.join(','), //适用会员
            showStore: this.sendChildData.storeType, // 显示门店 0所有 1部分分类 2部分门店
            storeIds: '', //展现门店id
            limitTimes: this.giftForm.limitTimesStatus ? this.giftForm.limitTimes : '-1', //限兑
            exchangeDateType: this.giftForm.exchangeDateType, //兑换日期
            exchangeFixDateBegin: this.giftForm.exchangeDateType === 2 ? this.getTime(this.giftForm.exchangeFixDate[0]) : '', //固定日期
            exchangeFixDateEnd: this.giftForm.exchangeDateType === 2 ? this.getTime(this.giftForm.exchangeFixDate[1]) : '',
            exchangeDateDay: this.giftForm.exchangeDateType === 3 ? this.giftForm.exchangeDateDayArr.join(',') : '', //兑换日期月
            exchangeDateWeek: this.giftForm.exchangeDateType === 4 ? this.giftForm.exchangeDateWeekArr.join(',') : '', //兑换日期周
            exchangeTimeType: this.giftForm.exchangeTimeType, //兑换时段
            integralCost: this.giftForm.integralCost, //积分
            cashCost: this.giftForm.cashCost, //现金
            proCode: this.giftForm.proCode, //编码
            proCodeQuery: this.giftForm.proCodeQuery, //条形码
            costValue: this.giftForm.changeType === 1 ? this.couponCostValue : this.giftForm.costValue, //卡券礼品成本
            marketPrice: this.giftForm.marketPrice, //市场价
            // cashCost: this.giftForm.costValue, //礼品成本
            virtualStock: this.giftForm.virtualStock, //库存
            timeZones: '', //部分时段
            proShowStatus: this.giftForm.proShowStatus, //显示状态
            releaseType: this.giftForm.releaseType, //上架状态
            limitTimeBegin: this.giftForm.releaseType === 2 ? this.getTimeAll(this.giftForm.limitTimeBegin) : '', //定时上架时间
            changeType: this.giftType === 0 ? String(this.giftForm.changeType) : this.giftForm.changeTypeList.join(','), //配送方式
            refundType: this.giftForm.refundType, //售后
            giftProStandardJson: this.giftProStandardJson ? JSON.stringify(this.giftProStandardJson) : '', //规格列表
            skuJson: this.submitSkuJson.length ? JSON.stringify(this.submitSkuJson) : '' //sku数据
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
          if (this.giftForm.exchangeTimeType === 2) {
            for (let item of this.giftForm.timeRangeList) {
              timeLink.push(item.timeRange[0] + '-' + item.timeRange[1]);
            }
          }
          params.timeZones = timeLink.join('#');

          this.submitLoading = true;
          request.post('/api-integral-mall/create-integral-pro', params).then(res => {
            if (res.data.errorCode === 0) {
              this.$message.success('保存成功');
              this.$router.push({
                name: 'gift'
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
    // 返回
    cancelGoodsForm() {
      this.$router.push({
        name: 'gift'
      });
    }
  },
  components: {
    addCate,
    tinymceEdit,
    addSku,
    importCoupon
  }
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
.section-content1 h3 {
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
.section-content1 .el-form-item {
  margin-left: 32px;
}
.w-376 {
  width: 376px;
}
/* 礼品主图 */
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

/* 锚记 */
.anchor-link {
  width: 120px;
  position: fixed;
  right: 24px;
  bottom: 110px;
  background: #fff;
}
.link-item {
  height: 28px;
  line-height: 28px;
  color: #606266;
  font-size: 14px;
  border-left: 2px solid #ebeef5;
  padding-left: 18px;
  cursor: pointer;
}
.link-item-active {
  border-left: 2px solid #1890ff;
  color: #1890ff;
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
/* 带删除的下拉框 */
.delete-select .delete-icon {
  display: none;
}
.delete-icon {
  color: #dcdfe6;
}
.delete-icon:focus {
  color: #dcdfe6;
}
.delete-icon:hover {
  color: #f5222d;
}
.curson-pointer tbody tr {
  cursor: pointer;
}
.form-item-mt {
  margin-top: -18px;
}
.mb8 {
  margin-bottom: 8px;
}
.red-color {
  color: #f5222d;
}
/* 表格 */
.spu-table {
  width: 900px;
  font-size: 14px;
  color: #606266;
  margin-bottom: 12px;
  border: 1px solid #ebeef5;
}
.spu-table thead tr {
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
.spu-table tbody td {
  padding: 20px 15px;
  vertical-align: middle;
}
.tip-content {
  position: absolute;
  left: -25px;
}
</style>
<style>
.upload-list-box .el-upload--picture-card {
  width: 104px;
  height: 104px;
  line-height: 104px;
}
.select-shop__right {
  line-height: 28px !important;
}
.section-tip-content .el-form-item__label {
  text-align: left !important;
}
</style>
