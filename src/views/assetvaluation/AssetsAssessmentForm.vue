<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="工程编号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="projectId">
              <a-input-number v-model="model.projectId" placeholder="请输入工程编号" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="工程名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="projectName">
              <a-input v-model="model.projectName" placeholder="请输入工程名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="工程建设总成本" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="constructionCosts">
              <a-input v-model="model.constructionCosts" placeholder="请输入工程建设总成本"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="评估基准日" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="assessmentDay">
              <j-date placeholder="请选择评估基准日" v-model="model.assessmentDay"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="成新率" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="newRate">
              <a-input v-model="model.newRate" placeholder="请输入成新率"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="水工建筑物评估" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="waterAssessment">
              <a-input v-model="model.waterAssessment" placeholder="请输入水工建筑物评估"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="机器设备评估" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="machineAssessment">
              <a-input v-model="model.machineAssessment" placeholder="请输入机器设备评估"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="土地资产价值" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="landAssessment">
              <a-input v-model="model.landAssessment" placeholder="请输入土地资产价值"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="整体资产评估值" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="allAssessment">
              <a-input v-model="model.allAssessment" placeholder="请输入整体资产评估值"  ></a-input>
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
    name: 'AssetsAssessmentForm',
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
          add: "/test/assetsAssessment/add",
          edit: "/test/assetsAssessment/edit",
          queryById: "/test/assetsAssessment/queryById"
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