<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <!-- 主表单区域 -->
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24" >
            <a-form-model-item label="工程编号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="projectNub">
              <a-input v-model="model.projectNub" placeholder="请输入工程编号" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="工程名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="projectName">
              <a-input v-model="model.projectName" placeholder="请输入工程名称" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="工程建设单位" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="developmentOrganization">
              <a-input v-model="model.developmentOrganization" placeholder="请输入工程建设单位" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="工程管理机构/单位" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="managementOrganization">
              <a-input v-model="model.managementOrganization" placeholder="请输入工程管理机构/单位" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="维护管养承包单位" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="maintenanceDan">
              <a-input v-model="model.maintenanceDan" placeholder="请输入维护管养承包单位" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="监理单位" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="maintenanceJan">
              <a-input v-model="model.maintenanceJan" placeholder="请输入监理单位" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="维保合同" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="maintenanceHt">
              <a-input v-model="model.maintenanceHt" placeholder="请输入维保合同" ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
      <!-- 子表单区域 -->
    <a-tabs v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="资产维保概况" :key="refKeys[0]" :forceRender="true">
        <j-editable-table
          :ref="refKeys[0]"
          :loading="maintenanceManagementChildTable.loading"
          :columns="maintenanceManagementChildTable.columns"
          :dataSource="maintenanceManagementChildTable.dataSource"
          :maxHeight="300"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="true"
          :actionButton="true"/>
      </a-tab-pane>
      <a-tab-pane tab="资产维保管理" :key="refKeys[1]" :forceRender="true">
        <j-editable-table
          :ref="refKeys[1]"
          :loading="maintenanceManagementTwoTable.loading"
          :columns="maintenanceManagementTwoTable.columns"
          :dataSource="maintenanceManagementTwoTable.dataSource"
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
    name: 'MaintenanceManagementForm',
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
        refKeys: ['maintenanceManagementChild', 'maintenanceManagementTwo', ],
        tableKeys:['maintenanceManagementChild', 'maintenanceManagementTwo', ],
        activeKey: 'maintenanceManagementChild',
        // 资产维保概况
        maintenanceManagementChildTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '资产编码',
              key: 'projectNub',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '资产名称',
              key: 'projectName',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '资产类别',
              key: 'projectType',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '维保标准',
              key: 'maintenanceTime',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '维保周期',
              key: 'maintenanceZq',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '上次维保时间',
              key: 'maintenanceUp',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '下次维保时间',
              key: 'maintenanceDown',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
          ]
        },
        // 资产维保管理
        maintenanceManagementTwoTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '维修保养编号',
              key: 'maintenanceNub',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '状态',
              key: 'status',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '维修/保养',
              key: 'type',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '维保项目',
              key: 'maintenanceProject',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '计划日期',
              key: 'coDay',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '检查记录表',
              key: 'checkInfo',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '维保单位通知单',
              key: 'checkMsg',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '承包单位申请表',
              key: 'dwInfo',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '维保回执单',
              key: 'maintenanceRe',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '验收单',
              key: 'maintenanceCheck',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
          ]
        },
        url: {
          add: "/test/maintenanceManagement/add",
          edit: "/test/maintenanceManagement/edit",
          queryById: "/test/maintenanceManagement/queryById",
          maintenanceManagementChild: {
            list: '/test/maintenanceManagement/queryMaintenanceManagementChildByMainId'
          },
          maintenanceManagementTwo: {
            list: '/test/maintenanceManagement/queryMaintenanceManagementTwoByMainId'
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
        this.maintenanceManagementChildTable.dataSource=[]
        this.maintenanceManagementTwoTable.dataSource=[]
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
          this.requestSubTableData(this.url.maintenanceManagementChild.list, params, this.maintenanceManagementChildTable)
          this.requestSubTableData(this.url.maintenanceManagementTwo.list, params, this.maintenanceManagementTwoTable)
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
          maintenanceManagementChildList: allValues.tablesValue[0].values,
          maintenanceManagementTwoList: allValues.tablesValue[1].values,
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