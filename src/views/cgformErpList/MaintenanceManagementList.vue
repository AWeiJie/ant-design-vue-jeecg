<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="工程编号">
              <a-input placeholder="请输入工程编号" v-model="queryParam.projectNub"></a-input>
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
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
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
      <a-button type="primary" icon="download" @click="handleExportXls('维保管理')">导出</a-button>
      <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="importExcelUrl"
        @change="handleImportExcel"
      >
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <!-- 高级查询区域 -->
      <j-super-query
        :fieldList="superFieldList"
        ref="superQueryModal"
        @handleSuperQuery="handleSuperQuery"
      ></j-super-query>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete" />删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down"/></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
        <a style="font-weight: 600">{{ selectedRowKeys.length }}</a
        >项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        class="j-table-force-nowrap"
        :scroll="{ x: true }"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <template slot="imgSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
          <img
            v-else
            :src="getImgView(text)"
            height="25px"
            alt=""
            style="max-width:80px;font-size: 12px;font-style: italic;"
          />
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
          <a-button v-else :ghost="true" type="primary" icon="download" size="small" @click="downloadFile(text)">
            下载
          </a-button>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
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

    <!-- 子级 -->
    <a-tabs v-model="activeKey2">
      <a-tab-pane tab="资产维保概况" :key="tableKeys2[0]" :forceRender="true">
        <div class="table-operator">
          <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
          <a-button type="primary" icon="download" @click="handleExportXls('维保管理')">导出</a-button>
          <a-upload
            name="file"
            :showUploadList="false"
            :multiple="false"
            :headers="tokenHeader"
            :action="importExcelUrl"
            @change="handleImportExcel"
          >
            <a-button type="primary" icon="import">导入</a-button>
          </a-upload>
          <!-- 高级查询区域 -->
          <j-super-query
            :fieldList="superFieldList"
            ref="superQueryModal"
            @handleSuperQuery="handleSuperQuery"
          ></j-super-query>
          <a-dropdown v-if="selectedRowKeys.length > 0">
            <a-menu slot="overlay">
              <a-menu-item key="1" @click="batchDel"><a-icon type="delete" />删除</a-menu-item>
            </a-menu>
            <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down"/></a-button>
          </a-dropdown>
        </div>
        <div>
          <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
            <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
            <a style="font-weight: 600">{{ selectedRowKeys.length }}</a
            >项
            <a style="margin-left: 24px" @click="onClearSelected">清空</a>
          </div>

          <a-table
            ref="table"
            size="middle"
            bordered
            rowKey="id"
            class="j-table-force-nowrap"
            :scroll="{ x: true }"
            :columns="columns2"
            :dataSource="dataSource"
            :pagination="ipagination"
            :loading="loading"
            :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            @change="handleTableChange"
          >
            <template slot="htmlSlot" slot-scope="text">
              <div v-html="text"></div>
            </template>
            <template slot="imgSlot" slot-scope="text">
              <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
              <img
                v-else
                :src="getImgView(text)"
                height="25px"
                alt=""
                style="max-width:80px;font-size: 12px;font-style: italic;"
              />
            </template>
            <template slot="fileSlot" slot-scope="text">
              <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
              <a-button v-else :ghost="true" type="primary" icon="download" size="small" @click="downloadFile(text)">
                下载
              </a-button>
            </template>

            <span slot="action" slot-scope="text, record">
              <a @click="handleEdit(record)">编辑</a>

              <a-divider type="vertical" />
              <a-dropdown>
                <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
                <a-menu slot="overlay">
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
      </a-tab-pane>
    </a-tabs>

    <a-tabs v-model="activeKey3">
      <a-tab-pane tab="资产维保管理" :key="tableKeys2[1]" :forceRender="true">
        <div class="table-operator">
          <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
          <a-button type="primary" icon="download" @click="handleExportXls('维保管理')">导出</a-button>
          <a-upload
            name="file"
            :showUploadList="false"
            :multiple="false"
            :headers="tokenHeader"
            :action="importExcelUrl"
            @change="handleImportExcel"
          >
            <a-button type="primary" icon="import">导入</a-button>
          </a-upload>
          <!-- 高级查询区域 -->
          <j-super-query
            :fieldList="superFieldList"
            ref="superQueryModal"
            @handleSuperQuery="handleSuperQuery"
          ></j-super-query>
          <a-dropdown v-if="selectedRowKeys.length > 0">
            <a-menu slot="overlay">
              <a-menu-item key="1" @click="batchDel"><a-icon type="delete" />删除</a-menu-item>
            </a-menu>
            <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down"/></a-button>
          </a-dropdown>
        </div>
        <div>
          <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
            <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
            <a style="font-weight: 600">{{ selectedRowKeys.length }}</a
            >项
            <a style="margin-left: 24px" @click="onClearSelected">清空</a>
          </div>

          <a-table
            ref="table"
            size="middle"
            bordered
            rowKey="id"
            class="j-table-force-nowrap"
            :scroll="{ x: true }"
            :columns="columns3"
            :dataSource="dataSource"
            :pagination="ipagination"
            :loading="loading"
            :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            @change="handleTableChange"
          >
            <template slot="htmlSlot" slot-scope="text">
              <div v-html="text"></div>
            </template>
            <template slot="imgSlot" slot-scope="text">
              <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
              <img
                v-else
                :src="getImgView(text)"
                height="25px"
                alt=""
                style="max-width:80px;font-size: 12px;font-style: italic;"
              />
            </template>
            <template slot="fileSlot" slot-scope="text">
              <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
              <a-button v-else :ghost="true" type="primary" icon="download" size="small" @click="downloadFile(text)">
                下载
              </a-button>
            </template>

            <span slot="action" slot-scope="text, record">
              <a @click="handleEdit(record)">编辑</a>

              <a-divider type="vertical" />
              <a-dropdown>
                <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
                <a-menu slot="overlay">
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
      </a-tab-pane>
    </a-tabs>
    <maintenance-management-modal ref="modalForm" @ok="modalFormOk" />
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import MaintenanceManagementModal from './MaintenanceManagementModal'
import MaintenanceManagement from './MaintenanceManagement'

import '@/assets/less/TableExpand.less'

export default {
  name: 'MaintenanceManagementList',
  mixins: [JeecgListMixin],
  components: {
    MaintenanceManagementModal,
    MaintenanceManagement
  },
  data() {
    return {
      description: '维保管理管理页面',
      disableMixinCreated: true,
      tableKeys2: ['maintenanceManagementChild', 'maintenanceManagementTwo'],
      activeKey2: 'maintenanceManagementChild',
      activeKey3: 'maintenanceManagementTwo',
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '工程编号',
          align: 'center',
          dataIndex: 'projectNub'
        },
        {
          title: '工程名称',
          align: 'center',
          dataIndex: 'projectName'
        },
        {
          title: '工程建设单位',
          align: 'center',
          dataIndex: 'developmentOrganization'
        },
        {
          title: '工程管理机构/单位',
          align: 'center',
          dataIndex: 'managementOrganization'
        },
        {
          title: '维护管养承包单位',
          align: 'center',
          dataIndex: 'maintenanceDan'
        },
        {
          title: '监理单位',
          align: 'center',
          dataIndex: 'maintenanceJan'
        },
        {
          title: '维保合同',
          align: 'center',
          dataIndex: 'maintenanceHt'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 147,
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 表头
      columns2: [
        {
          title: '资产编码',
          align: 'center',
          dataIndex: 'projectNub'
        },
        {
          title: '资产名称',
          align: 'center',
          dataIndex: 'projectName'
        },
        {
          title: '资产类别',
          align: 'center',
          dataIndex: 'developmentOrganization'
        },
        {
          title: '维保标准',
          align: 'center',
          dataIndex: 'managementOrganization'
        },
        {
          title: '维保周期',
          align: 'center',
          dataIndex: 'maintenanceDan'
        },
        {
          title: '上次维保时间',
          align: 'center',
          dataIndex: 'maintenanceJan'
        },
        {
          title: '下次维保时间',
          align: 'center',
          dataIndex: 'maintenanceHt'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 147,
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 表头
      columns3: [
        {
          title: '维修保养编号',
          align: 'center',
          dataIndex: 'projectNub'
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'projectName'
        },
        {
          title: '维修/保养',
          align: 'center',
          dataIndex: 'developmentOrganization'
        },
        {
          title: '维保项目',
          align: 'center',
          dataIndex: 'managementOrganization'
        },
        {
          title: '计划日期',
          align: 'center',
          dataIndex: 'maintenanceDan'
        },
        {
          title: '检查记录表',
          align: 'center',
          dataIndex: 'maintenanceJan'
        },
        {
          title: '维保单位通知单',
          align: 'center',
          dataIndex: 'maintenanceHt'
        },
        {
          title: '承包单位申请表',
          align: 'center',
          dataIndex: 'maintenanceHt'
        },
        {
          title: '维保回执单',
          align: 'center',
          dataIndex: 'maintenanceHt'
        },
        {
          title: '验收单',
          align: 'center',
          dataIndex: 'maintenanceHt'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 147,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/test/maintenanceManagement/list',
        delete: '/test/maintenanceManagement/delete',
        deleteBatch: '/test/maintenanceManagement/deleteBatch',
        exportXlsUrl: '/test/maintenanceManagement/exportXls',
        importExcelUrl: 'test/maintenanceManagement/importExcel'
      },
      dictOptions: {},
      superFieldList: [],
      dataSource: [
        {
          projectNub: 11,
          projectName: 11,
          developmentOrganization: 11,
          managementOrganization: 1,
          maintenanceDan: 1,
          maintenanceJan: 1,
          maintenanceHt: 1
        }
      ]
    }
  },
  created() {
    this.getSuperFieldList()
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    initDictConfig() {},
    getSuperFieldList() {
      let fieldList = []
      fieldList.push({ type: 'string', value: 'projectNub', text: '工程编号', dictCode: '' })
      fieldList.push({ type: 'string', value: 'projectName', text: '工程名称', dictCode: '' })
      fieldList.push({ type: 'string', value: 'developmentOrganization', text: '工程建设单位', dictCode: '' })
      fieldList.push({ type: 'string', value: 'managementOrganization', text: '工程管理机构/单位', dictCode: '' })
      fieldList.push({ type: 'string', value: 'maintenanceDan', text: '维护管养承包单位', dictCode: '' })
      fieldList.push({ type: 'string', value: 'maintenanceJan', text: '监理单位', dictCode: '' })
      fieldList.push({ type: 'string', value: 'maintenanceHt', text: '维保合同', dictCode: '' })
      this.superFieldList = fieldList
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
