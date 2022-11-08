import { get, post } from '@/utils/reqMethod'

export const getFirstSearchList = () => {
  return post('/wx/app/everybody_search_query')
}

export const getSearchDetailList = (searchKey, request_class) => {
  return post(`/wx/app/fault-analysis?inputSymptom=${searchKey}&request_class=${request_class}`)
}

export const getTreeEchartData = (searchKey) => {
  return post(`/wx/app/fault_propertity_analysis?gzxx_query=${searchKey}`)
}

export const getSecondSearchList = (searchKey) => {
  return get(`/api/graph/get/param?params=${searchKey}`)
}

export const statisticsSearchNum = (searchKey) => {
  return get(`/api/report/saveSearchReportNumber?name=${searchKey}`)
}

export const getRelRecommend = (searchKey) => {
  return get(`/api/report/selectRelevantReportByName?name=${searchKey}`)
}

// 首页 | 数据统计
export const selectHomeStatistics = () => {
  return get(`/api/report/selectHomeStatistics`)
}

// 首页 | 热门报告
export const selectHotReport = () => {
  return get(`/api/report/selectHotReport`)
}

// 首页 | 大家在搜
export const everybody_search_query = () => {
  return post(`/wx/app/everybody_search_query`)
}

// trouble | 图谱 | 影响范围图谱
export const influencePath = (data) => {
  return post('/api/graph/get/path', data)
}

// trouble | 右上 | 故障影响范围实体
export const nodeList = (data) => {
  return post('/api/graph/get/nodeList', data)
}

// trouble | 右下 | 故障原因图谱一度关系
export const more = (label, name) => {
  return get(`/api/graph/get/more?label=${label}&name=${name}`)
}

// trouble | 右下 | 故障原因相关报告查询
export const reportListByReason = (reasonName) => {
  return get(`/api/graph/get/reportListByReason?reasonName=${reasonName}`)
}

// 报告列表查询
export const getReportList = (data) => {
  return post('/api/graph/get/reportList', data)
}


// /api/earlyWarning

export const earlyWarning = {
  'query/page'(pageNum,pageSize){
    return get(`/api/earlyWarning/query/page?pageNum=${pageNum}&pageSize=${pageSize}`)
  }
}
// /api/earlyWarningDetail/queryByWarningId/{warningId}
export const earlyWarningDetail = {
  'queryByWarningId'(warningId:any){
    return get(`/api/earlyWarningDetail/queryByWarningId/${warningId}`)
  }
}