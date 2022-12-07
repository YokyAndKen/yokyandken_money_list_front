import { defineStore } from "pinia";

export const mainStore = defineStore('main',{
  state:()=>{
    return {
      // 当前日消费清单
      currentList: [],
    }
  },
  getters:{
    revenueAmount(state){
      let count = 0
      state.currentList.map (item => {
        if(item.type === 'revenue') {
          count += parseFloat(item.amount)
        }
      })
      return count
    },
    expendituresAmount(state){
      let count = 0
      state.currentList.map (item => {
        if(item.type === 'expenditures') {
          count += parseFloat(item.amount)
        }
      })
      return count
    },
  },
  actions:{
  }
})