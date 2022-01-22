<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="资产编号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="assetRetirementA">
              <a-input v-model="model.assetRetirementA" placeholder="请输入资产编号"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="资产名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="assetRetirementB">
              <a-input v-model="model.assetRetirementB" placeholder="请输入资产名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="使用情况" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="assetRetirementC">
              <a-input v-model="model.assetRetirementC" placeholder="请输入使用情况"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="资产所在地点" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="assetRetirementD">
              <a-input v-model="model.assetRetirementD" placeholder="请输入资产所在地点"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="管理单位" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="assetRetirementE">
              <a-input v-model="model.assetRetirementE" placeholder="请输入管理单位"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="报废原因" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="assetRetirementF">
              <a-input v-model="model.assetRetirementF" placeholder="请输入报废原因"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="技术鉴定书" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="assetRetirementG">
              <a-input v-model="model.assetRetirementG" placeholder="请输入技术鉴定书"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="报废审批单" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="assetRetirementH">
              <a-input v-model="model.assetRetirementH" placeholder="请输入报废审批单"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="报废时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="assetRetirementK">
              <a-input v-model="model.assetRetirementK" placeholder="请输入报废时间"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="报废申请人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="assetRetirementU">
              <a-input v-model="model.assetRetirementU" placeholder="请输入报废申请人"  ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>

  import { httpAction, getAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'

  export default {
    name: 'AssetRetirementForm',
    components: {
    },
    props: {
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      }
    },
    data () {
      return {
        model:{
         },
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        validatorRules: {
        },
        url: {
          add: "/com/assetRetirement/add",
          edit: "/com/assetRetirement/edit",
          queryById: "/com/assetRetirement/queryById"
        }
      }
    },
    computed: {
      formDisabled(){
        return this.disabled
      },
    },
    created () {
       //备份model原始值
      this.modelDefault = JSON.parse(JSON.stringify(this.model));
    },
    methods: {
      add () {
        this.edit(this.modelDefault);
      },
      edit (record) {
        this.model = Object.assign({}, record);
        this.visible = true;
      },
      submitForm () {
        const that = this;
        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            httpAction(httpurl,this.model,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            })
          }
         
        })
      },
    }
  }
</script>