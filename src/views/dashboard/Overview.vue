<template>
  <div class="overview-view">
    <a-row :gutter="24">
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="资产评估总价值" :total="`￥${overviewInfo.totalAssetAppraisal}`">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <!-- <div>
            <trend flag="up" style="margin-right: 16px;">
              <span slot="term">周同比</span>
              12%
            </trend>
            <trend flag="down">
              <span slot="term">日同比</span>
              11%
            </trend>
          </div>
          <template slot="footer">日均销售额<span>￥ 234.56</span></template> -->
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="工程建设资金总投入" :total="`￥${overviewInfo.totalConstructionCosts}`">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <!-- <div>
            <mini-area />
          </div>
          <template slot="footer">日订单量<span> {{ '1234' | NumberFormat }}</span></template> -->
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="各工程成新率" total="--">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div id="bar" style="height:40px">
            <v-chart
              :forceFit="width == null"
              :height="40"
              :data="miniBarData"
              padding="0"
              :scale="[
                {
                  dataKey: 'y',
                  alias: '成新率：'
                }
              ]"
            >
              <!-- :htmlContent="tooltipPercentageShow" -->
              <v-tooltip />
              <v-bar position="x*y" />
            </v-chart>
            <!-- <mini-bar :height="40" :dataSource="miniBarData" yaxisText="成新率"/> -->
          </div>
          <!-- <template slot="footer">转化率 <span>60%</span></template> -->
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="完成工程占比" :total="overviewInfo.completeRate">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div v-if="overviewInfo.completeRate">
            <mini-progress
              color="rgb(19, 194, 194)"
              :target="80"
              :percentage="Number(overviewInfo.completeRate.replace('%', ''))"
              :height="8"
            />
          </div>
          <!-- <template slot="footer">
            <trend flag="down" style="margin-right: 16px;">
              <span slot="term">同周比</span>
              12%
            </trend>
            <trend flag="up">
              <span slot="term">日环比</span>
              80%
            </trend>
          </template> -->
        </chart-card>
      </a-col>
    </a-row>

    <a-card :bordered="false" :body-style="{ padding: '0' }">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{ marginBottom: '24px', paddingLeft: '16px' }">
          <!-- <div class="extra-wrapper" slot="tabBarExtraContent">
            <div class="extra-item">
              <a>今日</a>
              <a>本周</a>
              <a>本月</a>
              <a>本年</a>
            </div>
            <a-range-picker :style="{ width: '256px' }" />
          </div> -->
          <a-tab-pane tab="各工程资产整体评估值" key="1">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <bar :dataSource="assetAppraisalBar" height="600" />
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="各工程效益排行榜" :list="rankList" />
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane tab="各工程建设总成本" key="2">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <bar :dataSource="constructionCostsBar" height="700" />
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="各工程效益排行榜" :list="rankList" />
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>

    <a-row>
      <a-col :span="24">
        <a-card :loading="loading" :bordered="false" title="本月资产维保计划" :style="{ marginTop: '24px' }">
          <a-row>
            <a-col :span="6">
              <head-info title="今日IP" :content="loginfo.todayIp"></head-info>
            </a-col>
            <a-col :span="2">
              <a-spin class="circle-cust">
                <a-icon slot="indicator" type="environment" style="font-size: 24px" />
              </a-spin>
            </a-col>
            <a-col :span="6">
              <head-info title="今日访问" :content="loginfo.todayVisitCount"></head-info>
            </a-col>
            <a-col :span="2">
              <a-spin class="circle-cust">
                <a-icon slot="indicator" type="team" style="font-size: 24px" />
              </a-spin>
            </a-col>
            <a-col :span="6">
              <head-info title="总访问量" :content="loginfo.totalVisitCount"></head-info>
            </a-col>
            <a-col :span="2">
              <a-spin class="circle-cust">
                <a-icon slot="indicator" type="rise" style="font-size: 24px" />
              </a-spin>
            </a-col>
          </a-row>
          <line-chart-multid :fields="visitFields" :dataSource="visitInfo"></line-chart-multid>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import ChartCard from '@/components/ChartCard'
import ACol from 'ant-design-vue/es/grid/Col'
import ATooltip from 'ant-design-vue/es/tooltip/Tooltip'
import MiniArea from '@/components/chart/MiniArea'
import MiniBar from '@/components/chart/MiniBar'
import MiniProgress from '@/components/chart/MiniProgress'
import RankList from '@/components/chart/RankList'
import Bar from '@/components/chart/Bar'
import LineChartMultid from '@/components/chart/LineChartMultid'
import HeadInfo from '@/components/tools/HeadInfo.vue'

import Trend from '@/components/Trend'

import { getSummarize } from '@/api/dashboard'
import { getLoginfo, getVisitInfo } from '@/api/api'

const barData = []
for (let i = 0; i < 12; i += 1) {
  barData.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200
  })
}
export default {
  name: 'IndexChart',
  components: {
    ATooltip,
    ACol,
    ChartCard,
    MiniArea,
    MiniBar,
    MiniProgress,
    RankList,
    Bar,
    Trend,
    LineChartMultid,
    HeadInfo
  },

  data() {
    return {
      loading: true,
      overviewInfo: {},
      miniBarData: [],
      assetAppraisalBar: [],
      constructionCostsBar: [],
      rankList: [],

      center: null,
      barData,
      loginfo: {},
      visitFields: ['ip', 'visit'],
      visitInfo: [],
      indicator: <a-icon type="loading" style="font-size: 24px" spin />
    }
  },

  methods: {
    // 初始化 各工程资产整体评估值 柱状图
    initBarEchart(data) {
      const barChart = echarts.init(document.getElementById('bar'))

      const barData = []
      const categoryList = []
      data.map(item => {
        barData.push(Number(item.assetAppraisal))
        categoryList.push(item.projectName)
      })

      console.log(barChart)

      // 绘制图表
      barChart.setOption({
        tooltip: {},
        grid: {
          top: '5%'
        },
        xAxis: {
          type: 'category',
          data: categoryList,
          axisLabel: {
            interval: 0,
            rotate: 60
          }
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: false //去掉网格线
          }
        },
        series: [
          {
            data: barData,
            type: 'bar'
          }
        ]
      })
    },

    tooltipPercentageShow(title, items, all = true) {
      var html = '<div class="g2-tooltip">'
      var titleDom = '<div class="g2-tooltip-title" style="margin-bottom: 4px;">' + title + '</div>'
      var listDom = '<ul class="g2-tooltip-list">'
      for (var i = 0; i < items.length; i++) {
        var item = items[i]
        var itemDom =
          '<span style="background-color:' +
          item.color +
          ';width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>' +
          '<span style="margin-right: 20px">' +
          title +
          '</span>' +
          '<span class="g2-tooltip-value">' +
          item.value +
          '%' +
          '</span>' +
          '</li>'
        listDom += itemDom
      }
      listDom += '</ul>'
      return html + listDom + '</div>'
    }
  },

  created() {
    getSummarize().then(res => {
      if (res.code == 200) {
        this.overviewInfo = res.result
        if (this.overviewInfo.summarizeDetails.length) {
          this.loading = false

          this.overviewInfo.summarizeDetails.map(item => {
            let rate = item.newRate
            if (rate && rate.indexOf('%') > -1) {
              rate = Number(rate.replace('%', ''))
            } else {
              rate = 0
            }
            this.miniBarData.push({
              x: item.projectName,
              y: rate
            })
            this.assetAppraisalBar.push({
              x: item.projectName,
              y: Number(item.assetAppraisal)
            })
            this.constructionCostsBar.push({
              x: item.projectName,
              y: Number(item.constructionCosts)
            })
          })

          this.overviewInfo.summarizeDetails.reverse().map(item => {
            this.rankList.push({
              name: item.projectName,
              total: item.assetAppraisal || 0
            })
          })
        }
      }
    })

    getVisitInfo().then(res => {
      if (res.success) {
        this.visitInfo = res.result
      }
    })
  }
}
</script>

<style lang="less" scoped>
.overview-view {
  .bar {
    height: 345px;
  }
}
.circle-cust {
  position: relative;
  top: 28px;
  left: -100%;
}
.extra-wrapper {
  line-height: 55px;
  padding-right: 24px;

  .extra-item {
    display: inline-block;
    margin-right: 24px;

    a {
      margin-left: 24px;
    }
  }
}

/* 首页访问量统计 */
.head-info {
  position: relative;
  text-align: left;
  padding: 0 32px 0 0;
  min-width: 125px;

  &.center {
    text-align: center;
    padding: 0 32px;
  }

  span {
    color: rgba(0, 0, 0, 0.45);
    display: inline-block;
    font-size: 0.95rem;
    line-height: 42px;
    margin-bottom: 4px;
  }
  p {
    line-height: 42px;
    margin: 0;
    a {
      font-weight: 600;
      font-size: 1rem;
    }
  }
}
</style>

<style lang="less">
.ytd_chart_container_toltip,
.ytd_modal_chart_container_tooltip {
  .g2-tooltip {
    position: absolute;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 3px;
    color: rgb(87, 87, 87);
    font-size: 12px;
    line-height: 20px;
    padding: 10px 10px 6px 10px;
    z-index: 999;
    .g2-tooltip-title {
      white-space: nowrap;
    }
  }

  .g2-tooltip-list {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }
  .g2-tooltip-list-li-display {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .g2-tooltip-statistic {
    font-size: 14px;
    padding-bottom: 10px;
    margin-top: 10px;
    list-style-type: none;
  }

  .g2-tooltip-statistic-value {
    font-weight: 'bold';
    display: 'inline-block';
    float: right;
    margin-left: 30px;
  }
}
</style>
