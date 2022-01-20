import api from './index'
import { axios } from '@/utils/request'

// 获取面板工程筛选下拉选择
export function getProjectList(params) {
  return axios({
    url: '/assets/getProjectList',
    method: 'get',
    params
  })
}

// 获取面板工程饼状图与工程基础设施柱状图
export function getStatisticalData(params) {
  return axios({
    url: '/assets/getStatisticalData',
    method: 'get',
    params
  })
}

