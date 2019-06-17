<template>
  <div>
    <el-dialog title="批量发货" :visible.sync="deliverModal.dialogVisible" width="620px">
      <el-form :model="dialogForm" label-position="right" label-width="80px" v-loading="loading">
        <el-form-item label="选择文件" required>
          <div>
            <div class="upload-btn">
              <el-upload class="upload-ele" :action="action" :headers="headersUpload" :before-upload="uploadFileBefore" :on-success="uploadFile" with-credentials :show-file-list="showList" :data="uploadData">
                <el-button size="small"><i class="el-icon-upload2" style="margin-right:5px"></i>点击上传</el-button>
              </el-upload>
            </div>
            <el-button type="info" plain @click="downloadFile">下载EXCEL模板</el-button>
          </div>
          <p class="import-info" v-show="importMess">
            本次共导入&nbsp;<span style="font-weight:600">{{ errornumber + correctNumber }}</span
            >&nbsp;个商品，其中成功&nbsp;<span style="font-weight:600">{{ correctNumber }}</span
            >&nbsp;个，失败&nbsp;<span style="color:#f5222d">{{ errornumber }}</span
            >&nbsp;个<a href="javaScript:void(0)" v-show="errornumber > 0" style="margin-left:10px" @click="showInfo">查看失败原因</a>
          </p>
        </el-form-item>
        <el-form-item label="导入规则">
          <div class="line"></div>
          <div class="upload-rules">
            <p>1. 每个sheet表最多300个订单，文件大小不超过2M</p>
            <p>2. 只需要填写订单编号，物流公司，物流单号（其中物流公司的填写请参考模板中的物流公司字典）</p>
            <p>3. 仅支持.xlsx .csv文件的导入（建议直接下载模板，在模板的基础上进行数据的填充）</p>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <errorList :importInfo="importInfo"></errorList>
  </div>
</template>

<script>
import errorList from './errorList';
export default {
  props: {
    deliverModal: {
      type: Object
    }
  },
  data() {
    return {
      action: window.location.origin + '/api-integral-mall/upload-order-ship?requestProject=intergral-mall',
      // action: 'http://gicdev.demogic.com/api-integral-mall/upload-order-ship?requestProject=intergral-mall',
      headersUpload: {
        sign: ''
      },
      dialogForm: {},
      errorList: [],
      showList: false,
      correctNumber: 0,
      errornumber: 0,
      importInfo: {
        //失败原因列表
        dialogVisible: false,
        list: []
      },
      importMess: false
    };
  },
  methods: {
    //下载模板
    downloadFile() {
      let url = 'static/批量发货模板.xlsx';
      window.open(url);
    },
    //上传之前
    uploadFileBefore(file) {
      const isXlsx = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

      if (file.type !== isXlsx) {
        this.$message.error('文件格式错误，请导入.xlsx格式的文件');
        return false;
      }
      if (file.size > 2 * 1024 * 1024) {
        this.$message.error('请上传小于2MB的文件');
        return false;
      }
      if (localStorage.getItem('sign')) {
        this.headersUpload.sign = localStorage.getItem('sign');
      } else {
        this.headersUpload.sign = '';
      }
      this.loading = true;
      this.fileName = file.name;
    },
    //上传文件
    uploadFile(file, fileList) {
      if (file.errorCode === 0) {
        this.importMess = true;
        if (file.result !== '') {
          this.importInfo.list = file.result.list;
          this.correctNumber = file.result.correctNumber;
          this.errornumber = file.result.errornumber;
          this.dialogFormVisible = true;
          this.loading = false;
        } else {
          this.errorList = [];
        }
      } else {
        this.loading = false;
        this.$message.error(file.message);
        this.fileName = '';
      }
    },
    showInfo() {
      this.importInfo.dialogVisible = true;
    }
  },
  components: {
    errorList
  }
};
</script>
<style scoped>
.dialog-body {
  display: flex;
  justify-content: center;
  margin-bottom: 25px;

  /* justify-content: space-around; */
}
/*上传文件*/
.upload-btn {
  height: 30px;
  /* text-align: center; */
  border: 1px dashed rgba(192, 196, 204, 1);
  display: inline-block;
  font-size: 14px;
  color: #c0c4cc;
  cursor: pointer;
  margin-right: 10px;
  width: 120px;
  /* text-align: center; */
  border-radius: 4px;
}
.import-info {
  color: #606266;
  margin-top: 10px;
}
.upload-ele .el-button {
  border: none;
  color: #c0c4cc;
}
.upload-ele .el-button--small {
  padding: 7px 15px;
}
.upload-btn .el-icon-upload2 {
  font-size: 16px;
  color: #c0c4cc;
}
/*.upload-btn:hover .el-button,.upload-btn .el-button:focus{
   color: #1890ff;
 }
 .upload-btn .upload-ele:hove .el-button{
    color: #1890ff;
 }
 .upload-btn:hover .el-icon-upload2{
    color: #1890ff;
 }*/
.upload-btn:hover {
  border-color: #1890ff;
}
.line {
  border-top: 1px solid #e4e7ed;
  position: absolute;
  left: 0px;
  top: 15px;
  width: 100%;
}
.upload-rules {
  color: #909399;
  font-size: 13px;
  line-height: 18px;
  margin-top: 30px;
}
.upload-ele .el-upload {
  width: 120px !important;
  display: inline !important;
}
</style>
