<template>
  <el-dialog title="新建分类" :visible.sync="addCateModal.dialogVisible" width="450px" @close="cancelSubmit('editInfoModal')">
    <el-form :model="editInfoModal" ref="editInfoModal" :rules="modalRules">
      <el-form-item label="分类名称" label-width="80px" prop="cateName">
        <el-input type="text" v-model="editInfoModal.cateName" style="width:330px" @input="value => proNameLimit(value)"> </el-input>
      </el-form-item>
      <span class="slot-num">{{ goodsInfo.cateNameLen }}/10</span>
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
    addCateModal: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      editInfoModal: {
        cateName: ''
      },
      goodsInfo: {
        cateNameLen: 0
      },
      modalRules: {
        cateName: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      }
    };
  },
  methods: {
    //输入框字数统计
    proNameLimit(value) {
      this.$nextTick(() => {
        this.editInfoModal.cateName = getInputVal.getInputVal(value, 10);
        this.goodsInfo.cateNameLen = getInputVal.getZhLen(this.editInfoModal.cateName);
      });
    },
    //确认修改商品名称
    submitProNanme(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            categoryName: this.editInfoModal.cateName
          };
          request.post('/api-integral-mall/create-gift-category', qs.stringify(params)).then(res => {
            if (res.data.errorCode === 0) {
              this.$message.success('新增成功');
              this.addCateModal.dialogVisible = false;
              this.$emit('getCategoryOptions');
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
      this.addCateModal.dialogVisible = false;
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
