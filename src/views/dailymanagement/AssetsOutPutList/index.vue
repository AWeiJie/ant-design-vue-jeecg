<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="工程编号">
              <a-input placeholder="请输入工程编号" v-model="queryParam.assetRetirementA"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="工程名称">
              <a-input placeholder="请输入工程名称" v-model="queryParam.assetRetirementA"></a-input>
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
      <a-button type="primary" icon="download" @click="handleExportXls('资产 出入库')">导出</a-button>
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
          <a>出库</a>
          <a-divider type="vertical" />
          <a>入库</a>
          <!-- <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
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
          </a-dropdown> -->
        </span>
      </a-table>
    </div>

    <!-- 资产历史出入库记录 -->
    <a-tabs v-model="activeKey">
      <a-tab-pane tab="资产历史出入库记录" :key="1" :forceRender="true">
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
            :dataSource="dataSource2"
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

    <!-- <assets-out-put-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit" /> -->
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import AssetsOutPutModal from './AssetsOutPutModal'

import '@/assets/less/TableExpand.less'

export default {
  name: 'AssetsOutPutList',
  mixins: [JeecgListMixin],
  components: {
    AssetsOutPutModal
  },
  data() {
    return {
      description: '资产 出入库管理页面',
      activeKey: 1,
      dataSource: [
        {
          outPutA: 'zc0030001',
          outPutB: '堤防',
          outPutC: '在库',
          outPutD: '跃龙街道兴海路东侧',
          outPutE: '2022/1/24',
          outPutF: '-',
          outPutG: '工程建成',
          outPutH: '-',
          outPutK: '张三',
          outPutQ: '李四'
        },
        {
          outPutA: 'zc0030002',
          outPutB: '堰坝',
          outPutC: '不在库',
          outPutD: '跃龙街道兴海路东侧',
          outPutE: '2022/1/24',
          outPutF: '2022/1/25',
          outPutG: '工程建成',
          outPutH: '维修',
          outPutK: '张三',
          outPutQ: '李四'
        }
      ],
      dataSource2: [
        {
          outPutA: '2022/1/24',
          outPutB: '入库',
          outPutC: '工程建成',
          outPutD: '张三',
          outPutE: '李四',
        },
        {
          outPutA: '2022/1/25',
          outPutB: '出库',
          outPutC: '维修',
          outPutD: '张三',
          outPutE: '李四',
        }
      ],
      // 表头
      columns: [
        {
          title: '资产编号',
          align: 'center',
          dataIndex: 'outPutA'
        },
        {
          title: '资产名称',
          align: 'center',
          dataIndex: 'outPutB'
        },
        {
          title: '资产状态',
          align: 'center',
          dataIndex: 'outPutC'
        },
        {
          title: '资产所在地',
          align: 'center',
          dataIndex: 'outPutD'
        },
        {
          title: '最近入库时间',
          align: 'center',
          dataIndex: 'outPutE'
        },
        {
          title: '最近出库时间',
          align: 'center',
          dataIndex: 'outPutF'
        },
        {
          title: '入库事由',
          align: 'center',
          dataIndex: 'outPutG'
        },
        {
          title: '出库事由',
          align: 'center',
          dataIndex: 'outPutH'
        },
        {
          title: '经办人',
          align: 'center',
          dataIndex: 'outPutK'
        },
        {
          title: '审批人',
          align: 'center',
          dataIndex: 'outPutQ'
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
          title: '时间',
          align: 'center',
          dataIndex: 'outPutA'
        },
        {
          title: '出/入库',
          align: 'center',
          dataIndex: 'outPutB'
        },
        {
          title: '出入库事由',
          align: 'center',
          dataIndex: 'outPutC'
        },
        {
          title: '经办人',
          align: 'center',
          dataIndex: 'outPutD'
        },
        {
          title: '审批人',
          align: 'center',
          dataIndex: 'outPutE'
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
        list: '/com/assetsOutPut/list',
        delete: '/com/assetsOutPut/delete',
        deleteBatch: '/com/assetsOutPut/deleteBatch',
        exportXlsUrl: '/com/assetsOutPut/exportXls',
        importExcelUrl: 'com/assetsOutPut/importExcel'
      },
      dictOptions: {},
      superFieldList: [],
      disableMixinCreated: true
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
      fieldList.push({ type: 'string', value: 'outPutA', text: '资产编号', dictCode: '' })
      fieldList.push({ type: 'string', value: 'outPutB', text: '资产名称', dictCode: '' })
      fieldList.push({ type: 'string', value: 'outPutC', text: '资产状态', dictCode: '' })
      fieldList.push({ type: 'string', value: 'outPutD', text: '资产所在地', dictCode: '' })
      fieldList.push({ type: 'string', value: 'outPutE', text: '最近入库时间', dictCode: '' })
      fieldList.push({ type: 'string', value: 'outPutF', text: '最近出库时间', dictCode: '' })
      fieldList.push({ type: 'string', value: 'outPutG', text: '入库事由', dictCode: '' })
      fieldList.push({ type: 'string', value: 'outPutH', text: '出库事由', dictCode: '' })
      fieldList.push({ type: 'string', value: 'outPutK', text: '经办人', dictCode: '' })
      fieldList.push({ type: 'string', value: 'outPutQ', text: '审批人', dictCode: '' })
      this.superFieldList = fieldList
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
