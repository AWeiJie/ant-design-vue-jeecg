<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <!-- <a-col :span="24">
            <a-form-model-item label="工程编号as" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="projectId">
              <a-input-number v-model="model.projectId" placeholder="请输入工程编号" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="工程名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="projectName">
              <a-input v-model="model.projectName" placeholder="请输入工程名称"  ></a-input>
            </a-form-model-item>
          </a-col> -->
          <a-col :span="24">
            <a-form-model-item
              label="工程总造价（元）"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              prop="constructionCosts"
            >
              <a-input v-model="model.constructionCosts" placeholder="请输入工程总造价"></a-input>
            </a-form-model-item>
          </a-col>
          <!-- <a-col :span="24">
            <a-form-model-item label="合理工期（年）" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="assessmentDay">
              <j-date placeholder="请选择评估基准日" v-model="model.assessmentDay"  style="width: 100%" />
            </a-form-model-item>
          </a-col> -->
          <a-col :span="24">
            <a-form-model-item label="成新率（%）" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="newRate">
              <a-input v-model="model.newRate" placeholder="请输入成新率"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              label="合理工期（年）"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              prop="reasonableProject"
            >
              <a-input v-model="model.reasonableProject" placeholder="请输入合理工期"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              label="基准贷款利率（%）"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              prop="lendingRate"
            >
              <a-input v-model="model.lendingRate" placeholder="请输入基准贷款利率"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              label="价格修正系数"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              prop="priceCorrectionFactor"
            >
              <a-input v-model="model.priceCorrectionFactor" placeholder="请输入价格修正系数"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              label="前期及其他费用率（%）"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              prop="otherRate"
            >
              <a-input v-model="model.otherRate" placeholder="请输入前期及其他费用率"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="开发利润率（%）" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="developRate">
              <a-input v-model="model.developRate" placeholder="请输入开发利润率"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              label="设备购置价（元）"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              prop="equipmentPurchasePrice"
            >
              <a-input v-model="model.equipmentPurchasePrice" placeholder="请输入设备购置价"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              label="运杂综合费（元）"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              prop="comprehensivePrice"
            >
              <a-input v-model="model.comprehensivePrice" placeholder="请输入运杂综合费"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              label="安装工程费（元）"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              prop="installationPrice"
            >
              <a-input v-model="model.installationPrice" placeholder="请输入安装工程费"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              label="工程建设其他费用（元）"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              prop="otherPrice"
            >
              <a-input v-model="model.otherPrice" placeholder="请输入工程建设其他费用"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="基准地价（元）" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="basePrice">
              <a-input v-model="model.basePrice" placeholder="请输入基准地价"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              label="地价修正系数"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              prop="basePriceCorrection"
            >
              <a-input v-model="model.basePriceCorrection" placeholder="请输入地价修正系数"></a-input>
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
  components: {},
  props: {
    //表单禁用
    disabled: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data() {
    let checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('该项不能为空'))
      }
      if (!/^[0-9]+.?[0-9]*$/.test(value)) {
        callback(new Error('请填写正数值'))
      } else {
        callback()
      }
    }

    return {
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      confirmLoading: false,
      validatorRules: {
        constructionCosts: [{ validator: checkAge, trigger: 'change' }],
        newRate: [{ validator: checkAge, trigger: 'change' }],
        reasonableProject: [{ validator: checkAge, trigger: 'change' }],
        lendingRate: [{ validator: checkAge, trigger: 'change' }],
        otherRate: [{ validator: checkAge, trigger: 'change' }],
        developRate: [{ validator: checkAge, trigger: 'change' }],
        equipmentPurchasePrice: [{ validator: checkAge, trigger: 'change' }],
        comprehensivePrice: [{ validator: checkAge, trigger: 'change' }],
        installationPrice: [{ validator: checkAge, trigger: 'change' }],
        otherPrice: [{ validator: checkAge, trigger: 'change' }],
        basePrice: [{ validator: checkAge, trigger: 'change' }],
        basePriceCorrection: [{ validator: checkAge, trigger: 'change' }],
        priceCorrectionFactor: [{ validator: checkAge, trigger: 'change' }]
      },
      url: {
        add: '/test/assetsAssessment/add',
        edit: '/test/assetsAssessment/edit',
        queryById: '/test/assetsAssessment/queryById'
      }
    }
  },
  computed: {
    formDisabled() {
      return this.disabled
    }
  },
  created() {
    //备份model原始值
    this.modelDefault = JSON.parse(JSON.stringify(this.model))
  },
  methods: {
    add() {
      this.edit(this.modelDefault)
    },
    edit(record) {
      this.model = Object.assign({}, record)
      this.visible = true
    },
    submitForm() {
      const that = this
      // 触发表单验证
      this.$refs.form.validate(valid => {
        if (valid) {
    
          that.confirmLoading = true
          let httpurl = '/assets/calculate '
          let method = 'post'
          // if (!this.model.id) {
          //   httpurl += this.url.add
          //   method = 'post'
          // } else {
          //   httpurl += this.url.edit
          //   method = 'put'
          // }
          const params = {...this.model}
          params.newRate = params.newRate / 100
          params.lendingRate = params.lendingRate / 100
          params.developRate = params.developRate / 100

          httpAction(httpurl, params, method)
            .then(res => {
              if (res.success) {
                that.$emit('ok', res.result)
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
            })
        }
      })
    }
  }
}
</script>
