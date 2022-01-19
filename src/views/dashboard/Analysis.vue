<template>
  <div class="analysis-view">
    <div class="box-left">
      <div class="current-num">
        <div class="title">// 工程建设资金总投入 //</div>
        <p>123,456,789</p>
      </div>
      <div class="proportion">
        <div class="title">各工程价格占总投入比例</div>
        <div id="pie" class="echart"></div>
      </div>
      <div class="proportion">
        <div class="title">
          工程现状图
          <p class="select"><img src="../../assets/select_icon.png" alt="" /> 筛选</p>
        </div>
        <div class="filter-wrap">
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
        </div>
        <div class="img-wrap">
          <template>
            <img src="http://47.104.223.189:8080/jeecg-boot/assetsPicture/12-1.png" :preview="0" />
          </template>
        </div>
      </div>
    </div>

    <div class="box-center">
      <div class="title">中心城区河道水利基础设施资产管理决策支持数据库</div>
      <div class="other-wrap">
        <div class="weather-box">
          <div class="data">
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
          </div>
        </div>
        <div class="filter-wrap">
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
        </div>
      </div>
      <div class="map-wrap">
        <div id="map_container" class="map"></div>

        <!-- <baidu-map class="map" center="北京"></baidu-map> -->
      </div>
    </div>
    <div class="box-right"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { test } from '@/api/api'

export default {
  name: 'Analysis',

  data() {
    return {
      indexStyle: 1
    }
  },

  created() {},

  methods: {},

  mounted() {
    var myChart = echarts.init(document.getElementById('pie'))
    // 绘制图表
    myChart.setOption({
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
        bottom: 20,
        textStyle: {
          color: '#fff'
        }
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['30%', '60%'],
          center: ['30%', '50%'], //这个属性调整图像的位置
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          data: [
            { value: 1048, name: 'Search Engine' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' }
          ]
        }
      ]
    })

    

    // 初始化地图
    // var map = initMap({
    //   tilt: 50,
    //   heading: 0,
    //   center: [108.706808, 34.374272],
    //   zoom: 13,
    //   style: purpleStyle
    // })

    // var view = new mapvgl.View({
    //   map: map
    // })

    // view.startAnimation()


    // var lineLayer = new mapvgl.LineTripLayer({
    //   trailLength: 21,
    //   color: 'rgb(0, 255, 255)'
    // })
    // view.addLayer(lineLayer)
    // const data = []
    // lineLayer.setData(data)
  

    // test()
    //   .then(function(rs) {
    //     return rs.text()
    //   })
    //   .then(function(csvstr) {
    //     var dataSet = mapv.csv.getDataSet(csvstr)
    //     var data = dataSet.get()

    //   })
  }
}
</script>

<style lang="less" scoped>
.analysis-view {
  display: flex;
  height: calc(100vh - 111px);
  background: url('../../assets/analysis_bg.png') left top no-repeat;
  background-size: 100% 100%;

  .box-left {
    flex: 0 0 330px;
    padding: 10px;

    .current-num {
      text-align: center;
      padding: 20px 18px;
      color: #fff;
      font-size: 0.46rem;
      background: url('../../assets/num_bg.png') left top no-repeat;
      background-size: 100% 100%;
      margin-bottom: 30px;

      .title {
        color: #0e94ea;
        font-size: 16px;
        margin-bottom: 20px;
      }
    }

    .proportion {
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

      .echart {
        height: 300px;
        width: 100%;
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
        height: 235px;
        overflow: hidden;

        img {
          width: 100%;
        }
      }
    }
  }

  .box-center {
    flex: 2;
    border-left: 1px solid #136aa7;
    border-right: 1px solid #136aa7;

    .title {
      width: 100%;
      height: 8.8%;
      position: relative;
      top: 0;
      left: 0;
      background: url(../../assets/title_border.png) bottom center no-repeat;
      display: flex;
      justify-content: center;
      align-items: center;

      color: #cdddf7;
      font-size: 14px;
      font-weight: 900;
      letter-spacing: 5px;
    }

    .other-wrap {
      display: flex;
      padding: 0 20px;
      margin: 30px 0;

      .weather-box {
        display: flex;
        flex: 1.5;
        font-size: 12px;
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
          margin-top: 10px;
          float: right;
        }
      }
    }

    .map-wrap {
      height: 500px;

      .map {
        height: 500px;
      }
    }
  }

  .box-right {
    flex: 1.5;
  }
}
</style>
