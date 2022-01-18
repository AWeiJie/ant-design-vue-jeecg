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
    </div>
    <div class="box-center"></div>
    <div class="box-right"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

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
        top: "center",
        bottom: 20,
        textStyle:{
          color:'#fff'
        },
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['30%', '60%'],
          center: ["30%", "50%"], 　　　　//这个属性调整图像的位置
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
    flex: 1.5;
    padding: 10px;

    .current-num {
      text-align: center;
      padding: 20px 18px;
      color: #fff;
      font-size: 30px;
      background: url('../../assets/num_bg.png') left top no-repeat;
      background-size: 100% 100%;

      .title {
        color: #0e94ea;
        font-size: 16px;
        margin-bottom: 20px;
      }
    }

    .proportion {
      margin-top: 30px;
      .title {
        line-height: 30px;
        padding-left: 30px;
        color: #fff;
        background: url('../../assets/title.png') left top no-repeat;
        background-size: 100% 100%;
      }

      .echart {
        height: 300px;
        width: 100%;
      }
    }
  }

  .box-center {
    flex: 2;
    border-left: 1px solid #136aa7;
    border-right: 1px solid #136aa7;
  }

  .box-right {
    flex: 1.5;
  }
}
</style>
