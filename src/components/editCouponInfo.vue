<template>
  <el-dialog :title="'编辑' + editInfoModal.type" :visible.sync="editInfoModal.dialogVisible" width="450px" @close="cancelSubmit('editInfoModal')">
    <el-form :model="editInfoModal" ref="editInfoModal" :rules="modalRules">
      <el-form-item label="积分费用" label-width="80px" prop="num" v-if="editInfoModal.type === '积分费用'">
        <el-input-number v-model="editInfoModal.num" style="width:330px" :precision="0" :min="0"> </el-input-number>
      </el-form-item>
      <el-form-item label="现金费用" label-width="80px" prop="num" v-if="editInfoModal.type === '现金费用'">
        <el-input-number v-model="editInfoModal.num" style="width:330px" :precision="2" :min="0"> </el-input-number>
      </el-form-item>
      <el-form-item label="库存" label-width="80px" prop="num" v-if="editInfoModal.type === '库存'">
        <el-input-number v-model="editInfoModal.num" style="width:330px" :precision="0" :min="1"> </el-input-number>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelSubmit('editInfoModal')">取 消</el-button>
      <el-button type="primary" @click="submitProNanme('editInfoModal')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import qs from 'qs';
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
      modalRules: {
        num: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      }
    };
  },
  methods: {
    //确认修改商品名称
    submitProNanme(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            proId: this.editInfoModal.mallProId
          };
          let url = '';
          // proId
          if (this.editInfoModal.type === '积分费用') {
            params.cost = this.editInfoModal.num;
            url = '/api-integral-mall/update-integral-cost';
          } else if (this.editInfoModal.type === '现金费用') {
            params.cost = this.editInfoModal.num;
            // if (Number(this.editInfoModal.num) > Number(this.editInfoModal.costValue)) {
            //   this.$message.error('现金费用不能大于礼品成本');
            //   return false;
            // }
            url = '/api-integral-mall/update-cash-cost';
          } else if (this.editInfoModal.type === '库存') {
            params.stock = this.editInfoModal.num;
            url = '/api-integral-mall/update-stock';
          }

          request.post(url, qs.stringify(params)).then(res => {
            if (res.data.errorCode === 0) {
              this.editInfoModal.dialogVisible = false;
              if (this.editInfoModal.type === '积分费用') {
                this.$message.success('更新成功');
              } else if (this.editInfoModal.type === '现金费用') {
                this.$message.success('更新成功');
              } else if (this.editInfoModal.type === '库存') {
                this.$message.success('积分商城修改库存时，请同步修改对应卡券的库存');
              }
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
