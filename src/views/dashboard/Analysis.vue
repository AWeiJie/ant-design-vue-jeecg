<template>
  <div class="analysis-view">
    <div class="box-left">
      <div class="current-num">
        <div class="title">// 工程建设资金总投入 //</div>
        <p>{{ invest }}</p>
      </div>
      <div class="proportion echart-wrap">
        <div class="title">各工程价格占总投入比例</div>
        <div id="pie" class="echart"></div>
      </div>
      <div class="proportion">
        <div class="title">
          工程现状图
          <!-- <p class="select"><img src="../../assets/select_icon.png" alt="" /> 筛选</p> -->
        </div>
        <!-- <div class="filter-wrap">
          <a-select default-value="lucy">
            <a-select-option value="jack">
              Jack
            </a-select-option>
            <a-select-option value="lucy">
              Lucy
            </a-select-option>
            <a-select-option value="disabled" disabled>
              Disabled
            </a-select-option>
            <a-select-option value="Yiminghe">
              yiminghe
            </a-select-option>
          </a-select>
          <a-button type="primary">
            搜索
          </a-button>
        </div> -->
        <div class="img-wrap">
          <template>
            <img
              :src="projectInfo.currentSituationUrl.replace('localhost:8080', 'http://47.104.223.189:8080')"
              :preview="0"
            />
          </template>
        </div>
      </div>
    </div>

    <div class="box-center">
      <div class="title">中心城区河道水利基础设施资产管理决策支持数据库</div>
      <div class="other-wrap">
        <div class="weather-box">
          <iframe
            allowtransparency="true"
            frameborder="0"
            width="410"
            height="98"
            scrolling="no"
            src="//tianqi.2345.com/plugin/widget/index.htm?s=1&z=1&t=1&v=0&d=2&bd=0&k=&f=ffffff&ltf=009944&htf=cc0000&q=1&e=1&a=0&c=60391&w=410&h=98&align=center"
          ></iframe>
          <!-- <div class="data">
            <p class="time" id="time">00:00:00</p>
            <p id="date">
              <span>2022/1/19</span>
              <span>pm</span>
              <span>周3</span>
            </p>
          </div>
          <div class="weather">
            <img
              id="weatherImg"
              src="http://47.104.223.189:8080/jeecg-boot/bigscreen/template2/images/weather/weather_img01.png"
              alt=""
            />
            <div id="weather">
              <p class="active">多云</p>
              <p>16-22℃</p>
              <p>深圳市南山区</p>
            </div>
          </div> -->
        </div>
        <div class="filter-wrap">
          <a-select v-model="projectId">
            <a-select-option :value="item.id" v-for="item in selectList" :key="item.id">
              {{ item.projectName }}
            </a-select-option>
          </a-select>
          <a-button type="primary" @click="feactProjectInfo">
            搜索
          </a-button>
        </div>
      </div>
      <div class="map-wrap">
        <div id="map_container" class="map"></div>
      </div>
    </div>

    <div class="box-right">
      <div class="proportion">
        <div class="title">基础设备数量</div>
        <div id="bar" class="echart"></div>
      </div>

      <div class="proportion">
        <div class="title">相关信息</div>
        <div class="table-wrap">
          <a-descriptions bordered :column="1" v-if="projectInfo.projectName">
            <a-descriptions-item label="名称">
              {{ projectInfo.projectName }}
            </a-descriptions-item>
            <a-descriptions-item label="经纬度">
              {{ projectInfo.latitudeAndLongitude }}
            </a-descriptions-item>
            <a-descriptions-item label="关键设施">
              {{ projectInfo.criticalInfrastructure }}
            </a-descriptions-item>
            <a-descriptions-item label="建设成本"> {{ projectInfo.constructionCosts }}元 </a-descriptions-item>
            <a-descriptions-item label="设计标准">
              {{ projectInfo.designCriteria }}
            </a-descriptions-item>
            <a-descriptions-item label="预期使用寿命">
              {{ projectInfo.expectedServiceLife }}
            </a-descriptions-item>
            <a-descriptions-item label="已使用寿命">
              {{ projectInfo.alreadyServiceLife }}
            </a-descriptions-item>
          </a-descriptions>

          <a-descriptions bordered :column="1" v-else>
            <a-descriptions-item label="名称">
              岭脚岙里河整治工程
            </a-descriptions-item>
            <a-descriptions-item label="经纬度">
              /
            </a-descriptions-item>
            <a-descriptions-item label="关键设施">
              堤防、堰坝、桥梁、景观绿化
            </a-descriptions-item>
            <a-descriptions-item label="建设成本">
              9135845元
            </a-descriptions-item>
            <a-descriptions-item label="设计标准">
              防洪标准：20年一遇4级设防标准<br />
              排涝标准：20年一遇24小时雨量24小时排出
            </a-descriptions-item>
            <a-descriptions-item label="预期使用寿命">
              /
            </a-descriptions-item>
            <a-descriptions-item label="已使用寿命">
              0
            </a-descriptions-item>
          </a-descriptions>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { getProjectList, getStatisticalData, getProjectInfo, getLongitudeLatitude } from '@/api/dashboard'

export default {
  name: 'Analysis',

  data() {
    return {
      selectList: [], // 筛选列表
      statisticalData: [], // 工程饼状图与工程基础设施柱状图
      projectInfo: {
        currentSituationUrl: 'http://47.104.223.189:8080/jeecg-boot/assetsPicture/mian.png'
      }, // 工程信息
      markerList: [], // 所有工程坐标
      lineLayerList: [], // 地图流水坐标
      projectId: null,
      invest: 443461574.25
    }
  },

  methods: {
    // 初始化饼图
    initPieEchart(data) {
      const myChart = echarts.init(document.getElementById('pie'))
      const invest = this.invest
      const pieData = []
      data.map(item => {
        pieData.push({ value: item.constructionCosts, name: item.projectName })
      })
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: 'item',
          position: 'right',
          formatter: function(params) {
            let engineering = {}
            data.map(item => {
              if (item.projectName == params.name) {
                engineering = item
              }
            })

            return `工程名称：${params.name}<br>
            投入资金：${engineering.constructionCosts}<br>
            投入资金占总投入比：${((engineering.constructionCosts / invest) * 100).toFixed(2)}%`
          }
        },
        legend: {
          icon: 'circle',
          orient: 'vertical',
          right: 10,
          top: 'center',
          bottom: 20,
          type: 'scroll',
          textStyle: {
            color: '#fff',
            fontSize: 12
          },
          pageIconColor: '#6495ed', //翻页下一页的三角按钮颜色
          pageIconInactiveColor: '#aaa', //翻页（即翻页到头时）
          pageIconSize: 11, //翻页按钮大小
          pageFormatter: ' ', //隐藏翻页的数字
          formatter: function(name) {
            return name.length > 8 ? name.slice(0, 8) + '...' : name
          }
        },
        series: [
          {
            type: 'pie',
            radius: '50%',
            // radius: ['30%', '100%'],
            center: ['30%', '50%'], //这个属性调整图像的位置
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            data: pieData
          }
        ]
      })
    },

    // 初始化柱状图
    initBarEchart(data) {
      const barChart = echarts.init(document.getElementById('bar'))

      const barData = []
      const categoryList = []
      data.map(item => {
        barData.push(item.baseInstallationAmount)
        categoryList.push(item.projectName)
      })

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
            type: 'bar',
            showBackground: true,
            itemStyle: {
              normal: {
                barBorderRadius: [20, 20, 0, 0]
              }
            },
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            }
          }
        ]
      })
    },

    // 初始化地图
    initMap() {
      const that = this
      var map = initMap({
        tilt: 50,
        heading: 0,
        center: [121.427443055555, 29.2926191666666],
        zoom: 13,
        style: purpleStyle
      })

      // 创建小车图标
      // var myIcon = new BMapGL.Icon('../../assets/dam.svg', new BMapGL.Size(52, 26))
      // 创建Marker标注，使用小车图标
      // var pt = new BMapGL.Point(116.417, 39.909);
      // var marker = new BMapGL.Marker(pt, {
      //     icon: myIcon
      // });
      // // 将标注添加到地图
      // map.addOverlay(marker);

      // 创建点标记
      for (let i = 0; i < this.markerList.length; i++) {
        const item = this.markerList[i]
        const pointList = item.latitudeAndLongitude.split(',')
        const point = new BMapGL.Point(pointList[0], pointList[1])
        const markerObj = new BMapGL.Marker(point)

        // 创建文本标注对象
        const labelopts = {
          position: point, // 指定文本标注所在的地理位置
          offset: new BMapGL.Size(-5, 10) // 设置文本偏移量
        }
        const label = new BMapGL.Label(item.projectName, labelopts)
        label.setStyle({
          color: '#fff',
          fontSize: '14px',
          backgroundColor: '0.05',
          backgroundColor: '#84C1FF',
          border: '0',
          fontWeight: 'bold'
        })
        map.addOverlay(label)

        // 点标记添加点击事件
        markerObj.addEventListener('click', function() {
          console.log(item)
          that.projectId = item.id
          that.feactProjectInfo()
        })
        // 在地图上添加点标记
        map.addOverlay(markerObj)
      }

      var view = new mapvgl.View({
        map: map
      })

      view.startAnimation()

      var lineLayer = new mapvgl.LineTripLayer({
        trailLength: 21,
        color: 'rgb(0, 255, 255)'
      })
      view.addLayer(lineLayer)
      lineLayer.setData(this.lineLayerList)
    },

    // 获取工程详情
    feactProjectInfo() {
      getProjectInfo({
        id: this.projectId
      }).then(res => {
        if (res.code === 200) {
          this.projectInfo = res.result
        }
      })
    }
  },

  created() {
    // 获取工程筛选下拉选择
    getProjectList().then(res => {
      if (res.code === 200) {
        this.selectList = res.result
        this.markerList = res.result
      }
    })

    // 工程饼状图与工程基础设施柱状图
    getStatisticalData().then(res => {
      if (res.code === 200) {
        this.statisticalData = res.result

        this.initPieEchart(res.result)
        this.initBarEchart(res.result)
      }
    })

    getLongitudeLatitude().then(res => {
      // 按照不同河流切割数据
      const obj = {}
      res.result.map(item => {
        const nameList = Object.keys(obj)
        if (!nameList.includes(item.name)) {
          obj[item.name] = []
        }
        obj[item.name].push(item.latitudeAndLongitude.split(',').map(i => i * 1))
      })

      // 组成地图所需格式
      for (let key in obj) {
        this.lineLayerList.push({
          geometry: {
            type: 'LineString',
            coordinates: obj[key]
          }
        })
      }

      this.initMap()
    })
  },

  mounted() {}
}
</script>

<style lang="less" scoped>
.analysis-view {
  display: flex;
  // height: calc(100vh - 130px);
  min-width: 1280px;
  background: url('../../assets/analysis_bg.png') left top no-repeat;
  background-size: 100% 100%;
  // overflow: hidden;
  // overflow-y: auto;

  .box-left {
    width: 28%;
    background: url(../../assets/line_left.png) top right repeat-y;
    padding: 10px 20px 10px 10px;

    .current-num {
      text-align: center;
      padding: 20px 18px;
      color: #fff;
      font-size: 0.46rem;
      background: url('../../assets/num_bg.png') left top no-repeat;
      background-size: 100% 100%;
      margin-bottom: 10px;

      .title {
        color: #0e94ea;
        font-size: 16px;
        margin-bottom: 20px;
      }
    }

    .proportion {
      &.echart-wrap {
        height: 48%;
        min-height: 420px;

        .echart {
          height: calc(100% - 40px);
          min-height: 380px;
          width: 100%;
          margin: 10px 0;
        }
      }

      .title {
        line-height: 30px;
        padding-left: 30px;
        padding-right: 23px;
        color: #fff;
        background: url('../../assets/title.png') left top no-repeat;
        background-size: 100% 100%;

        .select {
          float: right;
          padding: 0 20px;
          height: 24px;
          line-height: 24px;
          margin-top: 3px;
          cursor: pointer;
          border-left: 1px solid #106dac;

          img {
            width: 13px;
            vertical-align: middle;
          }
        }
      }

      .filter-wrap {
        margin: 10px 0;
        height: 33px;

        .ant-select {
          margin-right: 5px;
          width: 80%;

          /deep/.ant-select-selection {
            background-color: #142537;
            color: #fff;

            .ant-select-arrow {
              color: #fff;
            }
          }
        }
      }

      .img-wrap {
        width: 100%;
        // height: 255px;
        overflow: hidden;
        margin-top: 10px;
        padding-bottom: 10px;

        img {
          width: 100%;
        }
      }
    }
  }

  .box-center {
    width: 44%;

    .title {
      width: 100%;
      height: 8.8%;
      position: relative;
      top: 0;
      left: 0;
      // background: url(../../assets/title_border.png) bottom center no-repeat;
      // background-size: contain;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #cdddf7;
      font-size: 20px;
      font-weight: 900;
      letter-spacing: 5px;
      border-bottom: 1px solid #0e94ea;
    }

    .other-wrap {
      width: 100%;
      height: 15.3%;
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
      padding: 0 20px;
      margin: 10px 0;

      .weather-box {
        display: flex;
        flex: 0 0 410px;
        color: #fff;
        padding: 10px 0;
        border: 1px solid #0e94ea;

        .data {
          flex: 1;
          padding: 0 5px;
          border-right: 2px solid #fff;

          .time {
            font-size: 30px;
          }

          span {
            margin-right: 5px;
          }
        }

        .weather {
          flex: 1.1;
          padding: 0 10px;

          img {
            width: 60px;
            vertical-align: middle;
          }

          > div:last-child {
            float: right;
          }
        }
      }

      .filter-wrap {
        flex: 1;
        padding-left: 30px;

        .ant-select {
          width: 100%;

          /deep/.ant-select-selection {
            background-color: #142537;
            color: #fff;

            .ant-select-arrow {
              color: #fff;
            }
          }
        }

        .ant-btn {
          margin-top: 20px;
          float: right;
          width: 100%;
        }
      }
    }

    .map-wrap {
      height: 75.2%;
      padding: 10px;
      box-sizing: border-box;

      .map {
        height: 100%;
      }

      /deep/.anchorBL {
        display: none;
      }
    }
  }

  .box-right {
    // flex: 0 0 400px;
    width: 28%;
    padding: 10px;
    background: url(../../assets/line_left.png) top left repeat-y;

    .proportion {
      padding: 10px;
      height: 50%;

      &:last-child {
        margin-top: 20px;
      }

      .title {
        line-height: 30px;
        padding-left: 30px;
        padding-right: 23px;
        color: #fff;
        background: url('../../assets/title.png') left top no-repeat;
        background-size: 100% 100%;
      }

      .echart {
        height: 100%;
        width: 100%;
      }

      .table-wrap {
        padding: 10px;
        box-sizing: border-box;

        /deep/.ant-descriptions {
          .ant-descriptions-item-label {
            background-color: #143653;
            color: #fff;
            width: 136px;
          }

          .ant-descriptions-item-content {
            color: #fff;
            word-break: break-all;
          }
        }
      }
    }
  }
}
</style>
