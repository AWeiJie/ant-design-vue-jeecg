<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="资产编号">
              <a-input placeholder="请输入资产编号" v-model="queryParam.assetRetirementA"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="资产名称">
              <a-input placeholder="请输入资产名称" v-model="queryParam.assetRetirementB"></a-input>
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
      <a-button type="primary" icon="download" @click="handleExportXls('资产报废')">导出</a-button>
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
                <a @click="handleDetail(record)">详情</a>
              </a-menu-item>
               <a-menu-item>
                <a >报废</a>
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

    <asset-retirement-modal ref="modalForm" @ok="modalFormOk"></asset-retirement-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import AssetRetirementModal from './AssetRetirementModal'

  export default {
    name: 'AssetRetirementList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      AssetRetirementModal
    },
    data () {
      return {
        description: '资产报废管理页面',
        // 表头
        columns: [
          {
            title:'资产编号',
            align:"center",
            dataIndex: 'assetRetirementA'
          },
          {
            title:'资产名称',
            align:"center",
            dataIndex: 'assetRetirementB'
          },
          {
            title:'使用情况',
            align:"center",
            dataIndex: 'assetRetirementC'
          },
          {
            title:'资产所在地点',
            align:"center",
            dataIndex: 'assetRetirementD'
          },
          {
            title:'管理单位',
            align:"center",
            dataIndex: 'assetRetirementE'
          },
          {
            title:'报废原因',
            align:"center",
            dataIndex: 'assetRetirementF'
          },
          {
            title:'技术鉴定书',
            align:"center",
            dataIndex: 'assetRetirementG'
          },
          {
            title:'报废审批单',
            align:"center",
            dataIndex: 'assetRetirementH'
          },
          {
            title:'报废时间',
            align:"center",
            dataIndex: 'assetRetirementK'
          },
          {
            title:'报废申请人',
            align:"center",
            dataIndex: 'assetRetirementU'
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
        dataSource: [
        {
          assetRetirementA: 'zc0150009',
          assetRetirementB: '水电系统',
          assetRetirementC: '已报废',
          assetRetirementD: '桥头胡汶溪',
          assetRetirementE: '桥头胡街道水利站',
          assetRetirementF: '设备损坏，无法维修',
          assetRetirementG: '技术鉴定书.pdf',
          assetRetirementH: '报废审批单.pdf',
          assetRetirementK: '2022/1/24',
          assetRetirementU: '张三'
        },
        {
          assetRetirementA: 'zc0150001',
          assetRetirementB: '堤防',
          assetRetirementC: '使用中',
          assetRetirementD: '桥头胡汶溪',
          assetRetirementE: '桥头胡街道水利站',
          assetRetirementF: '-',
          assetRetirementG: '-',
          assetRetirementH: '-',
          assetRetirementK: '-',
          assetRetirementU: '-'
        }
      ],
        url: {
          list: "/com/assetRetirement/list",
          delete: "/com/assetRetirement/delete",
          deleteBatch: "/com/assetRetirement/deleteBatch",
          exportXlsUrl: "/com/assetRetirement/exportXls",
          importExcelUrl: "com/assetRetirement/importExcel",
          
        },
        dictOptions:{},
        superFieldList:[],
        disableMixinCreated:true
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
        fieldList.push({type:'string',value:'assetRetirementA',text:'资产编号',dictCode:''})
        fieldList.push({type:'string',value:'assetRetirementB',text:'资产名称',dictCode:''})
        fieldList.push({type:'string',value:'assetRetirementC',text:'使用情况',dictCode:''})
        fieldList.push({type:'string',value:'assetRetirementD',text:'资产所在地点',dictCode:''})
        fieldList.push({type:'string',value:'assetRetirementE',text:'管理单位',dictCode:''})
        fieldList.push({type:'string',value:'assetRetirementF',text:'报废原因',dictCode:''})
        fieldList.push({type:'string',value:'assetRetirementG',text:'技术鉴定书',dictCode:''})
        fieldList.push({type:'string',value:'assetRetirementH',text:'报废审批单',dictCode:''})
        fieldList.push({type:'string',value:'assetRetirementK',text:'报废时间',dictCode:''})
        fieldList.push({type:'string',value:'assetRetirementU',text:'报废申请人',dictCode:''})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>