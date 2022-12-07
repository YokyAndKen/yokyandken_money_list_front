import { defineStore } from "pinia";

export const mainStore = defineStore('main',{
  state:()=>{
    return {
      // 当前日消费清单
      currentList: [],
    }
  },
  getters:{},
  actions:{
  }
})