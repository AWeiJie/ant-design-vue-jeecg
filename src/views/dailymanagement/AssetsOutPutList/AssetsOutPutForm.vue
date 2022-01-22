<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <!-- 主表单区域 -->
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24" >
            <a-form-model-item label="资产编号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="outPutA">
              <a-input v-model="model.outPutA" placeholder="请输入资产编号" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="资产名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="outPutB">
              <a-input v-model="model.outPutB" placeholder="请输入资产名称" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="资产状态" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="outPutC">
              <a-input v-model="model.outPutC" placeholder="请输入资产状态" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="资产所在地" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="outPutD">
              <a-input v-model="model.outPutD" placeholder="请输入资产所在地" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="最近入库时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="outPutE">
              <a-input v-model="model.outPutE" placeholder="请输入最近入库时间" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="最近出库时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="outPutF">
              <a-input v-model="model.outPutF" placeholder="请输入最近出库时间" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="入库事由" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="outPutG">
              <a-input v-model="model.outPutG" placeholder="请输入入库事由" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="出库事由" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="outPutH">
              <a-input v-model="model.outPutH" placeholder="请输入出库事由" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="经办人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="outPutK">
              <a-input v-model="model.outPutK" placeholder="请输入经办人" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="审批人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="outPutQ">
              <a-input v-model="model.outPutQ" placeholder="请输入审批人" ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
      <!-- 子表单区域 -->
    <a-tabs v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="资产历史出入库记录" :key="refKeys[0]" :forceRender="true">
        <j-editable-table
          :ref="refKeys[0]"
          :loading="assetsOutPutChildTable.loading"
          :columns="assetsOutPutChildTable.columns"
          :dataSource="assetsOutPutChildTable.dataSource"
          :maxHeight="300"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="true"
          :actionButton="true"/>
      </a-tab-pane>
    </a-tabs>
  </a-spin>
</template>

<script>

  import { getAction } from '@/api/manage'
  import { FormTypes,getRefPromise,VALIDATE_NO_PASSED } from '@/utils/JEditableTableUtil'
  import { JEditableTableModelMixin } from '@/mixins/JEditableTableModelMixin'
  import { validateDuplicateValue } from '@/utils/util'

  export default {
    name: 'AssetsOutPutForm',
    mixins: [JEditableTableModelMixin],
    components: {
    },
    data() {
      return {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        labelCol2: {
          xs: { span: 24 },
          sm: { span: 3 },
        },
        wrapperCol2: {
          xs: { span: 24 },
          sm: { span: 20 },
        },
        model:{
        },
        // 新增时子表默认添加几行空数据
        addDefaultRowNum: 1,
        validatorRules: {
        },
        refKeys: ['assetsOutPutChild', ],
        tableKeys:['assetsOutPutChild', ],
        activeKey: 'assetsOutPutChild',
        // 资产历史出入库记录
        assetsOutPutChildTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '时间',
              key: 'time',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '出/入库',
              key: 'outPut',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '出入库事由',
              key: 'outPutInfo',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '经办人',
              key: 'people',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '审批人',
              key: 'checkPeople',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
          ]
        },
        url: {
          add: "/com/assetsOutPut/add",
          edit: "/com/assetsOutPut/edit",
          queryById: "/com/assetsOutPut/queryById",
          assetsOutPutChild: {
            list: '/com/assetsOutPut/queryAssetsOutPutChildByMainId'
          },
        }
      }
    },
    props: {
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      }
    },
    computed: {
      formDisabled(){
        return this.disabled
      },
    },
    created () {
    },
    methods: {
      addBefore(){
        this.assetsOutPutChildTable.dataSource=[]
      },
      getAllTable() {
        let values = this.tableKeys.map(key => getRefPromise(this, key))
        return Promise.all(values)
      },
      /** 调用完edit()方法之后会自动调用此方法 */
      editAfter() {
        this.$nextTick(() => {
        })
        // 加载子表数据
        if (this.model.id) {
          let params = { id: this.model.id }
          this.requestSubTableData(this.url.assetsOutPutChild.list, params, this.assetsOutPutChildTable)
        }
      },
      //校验所有一对一子表表单
      validateSubForm(allValues){
          return new Promise((resolve,reject)=>{
            Promise.all([
            ]).then(() => {
              resolve(allValues)
            }).catch(e => {
              if (e.error === VALIDATE_NO_PASSED) {
                // 如果有未通过表单验证的子表，就自动跳转到它所在的tab
                this.activeKey = e.index == null ? this.activeKey : this.refKeys[e.index]
              } else {
                console.error(e)
              }
            })
          })
      },
      /** 整理成formData */
      classifyIntoFormData(allValues) {
        let main = Object.assign(this.model, allValues.formValue)
        return {
          ...main, // 展开
          assetsOutPutChildList: allValues.tablesValue[0].values,
        }
      },
      validateError(msg){
        this.$message.error(msg)
      },

    }
  }
</script>

<style scoped>
</style>