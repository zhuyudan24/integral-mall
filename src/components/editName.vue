<template>
  <el-dialog title="修改礼品名称" :visible.sync="editInfoModal.dialogVisible" width="450px" @close="cancelSubmit('editInfoModal')">
    <el-form :model="editInfoModal" ref="editInfoModal" :rules="modalRules">
      <el-form-item label="商品名称" label-width="80px" prop="proName">
        <el-input type="textarea" :row="2" v-model="editInfoModal.proName" style="width:330px" @input="value => proNameLimit(value)"> </el-input>
      </el-form-item>
      <span class="slot-num">{{ editInfoModal.proNameLen }}/30</span>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelSubmit('editInfoModal')">取 消</el-button>
      <el-button type="primary" @click="submitProNanme('editInfoModal')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import qs from 'qs';
import getInputVal from '../utils/common.js';
import request from '../service/request.js';
export default {
  props: {
    editInfoModal: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      goodsInfo: {
        proNameLen: 0
      },
      modalRules: {
        proName: [{ required: true, message: '请输入礼品名称', trigger: 'blur' }]
      }
    };
  },
  methods: {
    //输入框字数统计
    proNameLimit(value) {
      this.$nextTick(() => {
        this.editInfoModal.proName = getInputVal.getInputVal(value, 30);
        this.editInfoModal.proNameLen = getInputVal.getZhLen(this.editInfoModal.proName);
      });
    },
    //确认修改商品名称
    submitProNanme(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            integralMallProId: this.editInfoModal.mallProId,
            name: this.editInfoModal.proName
          };
          request.post('/api-integral-mall/update-integral-name', qs.stringify(params)).then(res => {
            if (res.data.errorCode === 0) {
              this.$message.success('修改成功');
              this.editInfoModal.dialogVisible = false;
              this.$emit('getList');
            } else {
              this.$message.error(res.data.message);
            }
          });
        } else {
          return false;
        }
      });
    },
    //取消修改
    cancelSubmit(formName) {
      this.$refs[formName].resetFields();
      this.editInfoModal.dialogVisible = false;
    }
  }
};
</script>
<style scoped>
.slot-num {
  float: right;
  margin-top: -20px;
  font-size: 13px;
}
</style>
