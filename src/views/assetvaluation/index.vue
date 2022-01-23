<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="工程编号">
              <a-input placeholder="请输入工程编号" v-model="queryParam.projectId"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="工程名称">
              <a-input placeholder="请输入工程名称" v-model="queryParam.projectName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('资产评估')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <!-- 高级查询区域 -->
      <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        :scroll="{x:true}"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        class="j-table-force-nowrap"
        @change="handleTableChange">

        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <template slot="imgSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
          <img v-else :src="getImgView(text)" height="25px" alt="" style="max-width:80px;font-size: 12px;font-style: italic;"/>
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
          <a-button
            v-else
            :ghost="true"
            type="primary"
            icon="download"
            size="small"
            @click="downloadFile(text)">
            下载
          </a-button>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
               <a-menu-item>
                <a @click="showAluationForm">重新估值</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="handleDetail(record)">详情</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>

    <assets-assessment-modal ref="modalForm" @ok="modalFormOk"></assets-assessment-modal>

        <valuation-modal ref="aluationForm" @ok="modalFormOk"></valuation-modal>

  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import AssetsAssessmentModal from './AssetsAssessmentModal'
  import ValuationModal from './ValuationModa'

  export default {
    name: 'AssetsAssessmentList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      AssetsAssessmentModal,
      ValuationModal
    },
    data () {
      return {
        description: '资产评估管理页面',
        // 表头
        columns: [
          {
            title:'工程编号',
            align:"center",
            sorter: true,
            dataIndex: 'projectId'
          },
          {
            title:'工程名称',
            align:"center",
            dataIndex: 'projectName'
          },
          {
            title:'工程建设总成本',
            align:"center",
            dataIndex: 'constructionCosts'
          },
          {
            title:'评估基准日',
            align:"center",
            dataIndex: 'assessmentDay',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'成新率',
            align:"center",
            dataIndex: 'newRate'
          },
          {
            title:'水工建筑物评估',
            align:"center",
            dataIndex: 'waterAssessment'
          },
          {
            title:'机器设备评估',
            align:"center",
            dataIndex: 'machineAssessment'
          },
          {
            title:'土地资产价值',
            align:"center",
            dataIndex: 'landAssessment'
          },
          {
            title:'整体资产评估值',
            align:"center",
            dataIndex: 'allAssessment'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width:147,
            scopedSlots: { customRender: 'action' }
          }
        ],

        url: {
          list: "/assets/list",
          delete: "/test/assetsAssessment/delete",
          deleteBatch: "/test/assetsAssessment/deleteBatch",
          exportXlsUrl: "/test/assetsAssessment/exportXls",
          importExcelUrl: "test/assetsAssessment/importExcel",
          
        },
        dictOptions:{},
        superFieldList:[],
      }
    },
    created() {
    this.getSuperFieldList();
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
    },
    methods: {
      initDictConfig(){
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'int',value:'projectId',text:'工程编号',dictCode:''})
        fieldList.push({type:'string',value:'projectName',text:'工程名称',dictCode:''})
        fieldList.push({type:'string',value:'constructionCosts',text:'工程建设总成本',dictCode:''})
        fieldList.push({type:'date',value:'assessmentDay',text:'评估基准日'})
        fieldList.push({type:'string',value:'newRate',text:'成新率',dictCode:''})
        fieldList.push({type:'string',value:'waterAssessment',text:'水工建筑物评估',dictCode:''})
        fieldList.push({type:'string',value:'machineAssessment',text:'机器设备评估',dictCode:''})
        fieldList.push({type:'string',value:'landAssessment',text:'土地资产价值',dictCode:''})
        fieldList.push({type:'string',value:'allAssessment',text:'整体资产评估值',dictCode:''})
        this.superFieldList = fieldList
      },

      showAluationForm(){
        this.$refs.aluationForm.add()
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>