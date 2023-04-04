<template>
  <div class="listMain_container">
      <div class="top_chooses flex flex_wrap">
        <!-- 选择时间段 -->
        <div class="time_picker">
          <span class="tips">请选择统计时间段：</span>
          <el-date-picker
            v-model="state.countForm.pickData"
            type="daterange"
            unlink-panels
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
            :shortcuts="shortcuts"
            :size="size"
          />          
        </div>

        <!-- 选择统计类型 -->
        <div class="count_type_picker">
          <span class="tips">请选择统计类型：</span> <br>
          <el-select v-model="state.countForm.type" >
            <el-option
              v-for="item in state.typeOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </div>

        <!-- 选择发生人 -->
        <div class="count_person_picker" style="margin-left: 30px;">
          <span class="tips">请选择发生人：</span> <br>
          <el-select v-model="state.countForm.person" >
            <el-option
              v-for="item in state.personOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </div>

        <!-- 选择支出类型 -->
        <div class="expenditures_type_picker flex">
          <span class="tips" style="margin-top: 10px;">请选择支出类型：</span>
            <el-checkbox
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
              style="margin-right: 10px;"
              >全选</el-checkbox
            >
            <el-checkbox-group
              v-model="state.countForm.expendituresType"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox v-for="item in state.expendituresOptions" :key="item" :label="item">{{
                item
              }}</el-checkbox>
            </el-checkbox-group>
        </div>
      </div>
  </div>

</template>

<script setup lang='ts'>
import { ref, reactive, onMounted, onBeforeUnmount, watch } from "vue";
import { mainStore } from "@/store/index";

const checkAll = ref(false)
const isIndeterminate = ref(true)

const state = reactive({
  pickData: '',
  typeOptions: ['收入','支出','平衡收支'],
  personOptions: ['ken','yoky','family'],
  expendituresOptions: ['公共交通','餐饮','刚需支出','购物','游戏','学习','股票基金投资'],
  countForm: {
    pickData: '',type: '', person: '', expendituresType: []
  }
})

const shortcuts = [
  {
    text: 'Last week',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: 'Last month',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: 'Last 3 months',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]

const handleCheckAllChange = (val: boolean) => {
  state.countForm.expendituresType = val ? state.expendituresOptions : []
  isIndeterminate.value = false
}

const handleCheckedCitiesChange = (value: string[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === state.expendituresOptions.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < state.expendituresOptions.length
}

</script>

<style scoped lang='scss'>
.listMain_container {
  // border: 1px solid red;
  height: 100%;
  width: 98%;
  .top_chooses {
    // border: 1px solid black;
    border-bottom: 1px solid #A3A6AD;
    height: 100px;
    .tips {
      color: rgba(9, 17, 30, 1);
      margin-bottom: 10px;
      display: inline-block;
      font-weight: bold;
    }
    .time_picker {
      // border: 1px solid red;
      margin-left: 10px;
      width: 400px;
    }
  }
}
:deep(.el-input__wrapper) {
  border: 1px solid black;
}
:deep(.el-checkbox__input) {
  border: 1px solid rgba(9, 17, 30, 1);
}
</style>
