<template>
  <div class="markList_container">
    <div class="flex">
      <div class="cup add_btn" @click="submitTable()" style="width: 120px;">提交今日账单</div>
    </div>
    <div class="fast_btn_container flex">
      <div class="title" style="margin-top: 8px;">快捷添加：</div>
      <div class="cup fast_add_btn" @click="fastAddList(1)"> 公共交通 ￥10 </div>
    </div>

    <!-- 今日账单表格 -->
    <div class="current_table_container" v-if="store.currentList.length !== 0">
      <div class="flex flex-space-between" style="margin-bottom: 10px;">
        <div class="title" style="margin-top: 8px;margin-bottom: 8px;">今日账单：</div>
        <div class="cup add_btn flex flex-center" @click="addItem()" style="align-items: center">
          <span>新建条目</span> 										
          <el-icon style="color: #fff;"><CirclePlus /></el-icon>
        </div>
      </div>
      <el-table :data="store.currentList" stripe style="width: 100%;height: calc(100% - 40px)">
        <el-table-column type="index" width="60" label="编号"/>
        <el-table-column prop="date" label="日期" />
        <el-table-column prop="revenueType" label="发生人" >
          <template #default="scope">
            <span :class="scope.row.person==='ken'?'dark_green_square':scope.row.person==='yoky'?'dark_blue_square':'white_square'">
              {{scope.row.person}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="收支类型">
          <template #default="scope">
            <div v-if="scope.row.type === 'revenue'">收入</div>
            <div v-else>支出</div>
          </template>
        </el-table-column>
        <el-table-column prop="revenueType" label="收入类型" >
          <template #default="scope">
            <span v-if="scope.row.revenueType" :class="scope.row.revenueType==='工资'?'green_square':scope.row.revenueType==='红包'?'yellow_square':'blue_square'">
              {{scope.row.revenueType}}
            </span>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column prop="expendituresType" label="支出类型">
          <template #default="scope">
            <div v-if="scope.row.expendituresType">
              <span v-if="scope.row.expendituresType==='刚需支出'||scope.row.expendituresType==='餐饮'" class="green_square">{{scope.row.expendituresType}}</span>
              <span v-if="scope.row.expendituresType==='公共交通'||scope.row.expendituresType==='学习'" class="yellow_square">{{scope.row.expendituresType}}</span>
              <span v-if="scope.row.expendituresType==='购物'||scope.row.expendituresType==='股票基金投资'" class="red_square">{{scope.row.expendituresType}}</span>
            </div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额" />
        <el-table-column prop="context" label="详细信息" />
        <el-table-column label="操作">
          <template #default="scope">
            <div class="handleBox">
              <span class="handleSpan cup" @click.stop="editRow(scope.row);">编辑</span>
              <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" icon-color="red"
                title="此操作将永久删除该数据, 是否继续?" @confirm="delRow(scope.row)">
                <template #reference>
                  <span class="handleSpan cup">删除</span>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 今日收支 | echarts统计 -->
    <div class="current_table_container" v-else>
      
    </div>

    <!-- 统计框 -->
    <div class="amount_count_container flex">
      <div class="title" style="margin-top: 8px;margin-bottom: 8px;">收入总计：<span class="count_number" style="color: #A3A6AD">{{store.revenueAmount}}</span></div>
      <div class="title" style="margin-top: 8px;margin-bottom: 8px;">支出总计：<span class="count_number" style="color: #A3A6AD">{{store.expendituresAmount}}</span></div>
      <div class="title" style="margin-top: 8px;margin-bottom: 8px;">平衡收支：<span class="count_number" style="color: #A3A6AD">{{store.revenueAmount - store.expendituresAmount}}</span></div>
    </div>

    <!-- 新增项 | 编辑项弹框 -->
    <el-dialog
      v-model="state.showAddDialog"
      :title="state.dialogTitle"
      width="40%"
      align-center
      :show-close="false"
    >
        <el-form
          ref="ruleFormRef"
          :model="state.addForm"
          label-width="120px"
          :rules="serverFormRules"
          status-icon
        >
          <el-form-item label="具体内容" prop="context">
            <el-input v-model="state.addForm.context" clearable placeholder="请输入具体内容"/>
          </el-form-item>
          <el-form-item label="金额" prop="amount">
            <el-input v-model="state.addForm.amount" clearable placeholder="请输入金额"/>
          </el-form-item>
          <el-form-item label="条目发生人" prop="person">
            <el-select v-model="state.addForm.person" placeholder="请选择收支类型">
              <el-option :label="item" :value="item"  v-for="item in state.personOptopms"/>
            </el-select>
          </el-form-item>
          <el-form-item label="收支选择" prop="type">
            <el-select v-model="state.addForm.type" placeholder="请选择收支类型">
              <el-option :label="item.label" :value="item.value"  v-for="item in state.type"/>
            </el-select>
          </el-form-item>
          <el-form-item label="收入项选择" prop="revenue" v-if="state.addForm.type === 'revenue'">
            <el-select v-model="state.addForm.revenueType" placeholder="请选择收入项" >
              <el-option :label="item" :value="item"  v-for="item in state.revenueOptions"/>
            </el-select>
          </el-form-item>
          <el-form-item label="支出项选择" prop="expenditures" v-if="state.addForm.type === 'expenditures'">
            <el-select v-model="state.addForm.expendituresType" placeholder="请选择支出项" >  
              <el-option :label="item" :value="item"  v-for="item in state.expendituresOptions"/>
            </el-select>
          </el-form-item>
          <el-form-item label="消费时间">
            <el-col :span="11">
              <el-form-item prop="date">
                <el-date-picker
                  v-model="state.addForm.date"
                  type="date"
                  label="Pick a date"
                  placeholder="Pick a date"
                  style="width: 100%"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button plain @click="submitForm(ruleFormRef)"
              >确定</el-button
            >
            <el-button @click="resetForm(ruleFormRef)" type="info">取消</el-button>
          </el-form-item>
        </el-form>
    </el-dialog>
  </div>  
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted, onBeforeUnmount, watch } from "vue";
import type { FormInstance, FormRules } from 'element-plus'
import { mainStore } from "@/store/index";
import currentList from "@/store/currentList.json"
import { CirclePlus } from '@element-plus/icons-vue';

const ruleFormRef = ref<FormInstance>()

const store = mainStore();

let serverFormRules = reactive<FormRules>({
  context: [{ required: true, message: '请输入具体内容', trigger: 'blur'}],
  type: [{ required: true, message: '请选择类型', trigger: ['blur', 'change']}],
  amount: [{ required: true, message: '请输入金额', trigger: 'blur' }],
  date: [{ required: true, message: '请选择日期', trigger: ['blur', 'change']}],
})

const state = reactive({
  showAddDialog: false,
  addForm: {
    date: new Date(),
    type: '',
    context: '',
    expendituresType: '',
    revenueType: '',
    amount: '',
    person: ''
  },
  type: [{label: '收入', value: 'revenue'}, {label: '支出', value: 'expenditures'}],
  dialogTitle: '新增记账条目',
  editIndex: '',
  revenueOptions: ['工资', '红包', '其他收入'],
  personOptopms: ['yoky', 'ken', 'family'],
  expendituresOptions: ['公共交通', '餐饮', '刚需支出', '购物', '游戏', '学习', '股票基金投资'],
  revenueCount: 0,
  expendituresCount: 0,
})

const addItem = () => {
  state.showAddDialog = true
} 

// dialog | 新增表格行
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  if(state.dialogTitle === '新增记账条目'){
    state.showAddDialog = false
    console.log('form', state.addForm.date)
    store.currentList.push(state.addForm)
    cleanAddForm()
  } else if (state.dialogTitle === '编辑记账条目'){
    state.showAddDialog = false
    store.currentList[state.editIndex] = state.addForm
    cleanAddForm()
  }
}

// table | 编辑表格行
const editRow = (row) => {
  state.dialogTitle = '编辑记账条目'
  state.editIndex = store.currentList.indexOf(row)
  state.addForm = store.currentList[state.editIndex]
  state.showAddDialog = true
}

// table | 删除表格行
const delRow = (row) => {
  let index = store.currentList.indexOf(row)
  store.currentList.splice(index, 1)
}

// 关闭新增表单弹框 | 点击取消
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  cleanAddForm()
  state.showAddDialog = false
}

// 快速添加
const fastAddList = (type) => {
  if (type==1) {
    store.currentList.push({date: state.addForm.date, type: 'expenditures', context: '公共交通',expendituresType: '公共交通',revenueType: '',amount: '5', person: 'yoky'})
  }
}

// 清空表格
const cleanAddForm = () => {
  state.addForm = {
    date: new Date(),
    type: '',
    context: '',
    expendituresType: '',
    revenueType: '',
    amount: ''
  }
}

onMounted(() => {
  store.currentList = currentList
  state.addForm.date = new Date();
})
</script>


<style scoped lang='scss'>
.markList_container {
  width: 100%;
  height: 100%;
}
.add_btn {
  background: #141414;width: 100px;border: 1px solid #A3A6AD;margin-right: 10px;
  color: #fff;height: 30px;font-size: 16px;text-align: center;line-height: 30px;
  &:hover {
    background: #303030;
  }
}
.fast_btn_container {
  margin-top: 10px;border: 1px solid grey;padding: 10px;width: calc(100% - 50px);
  .fast_add_btn {
  background: #141414;border: 1px solid #A3A6AD;padding-left: 10px;padding-right: 10px;
  color: #fff;height: 30px;font-size: 16px;text-align: center;line-height: 30px;margin-right: 5px;
  &:hover {
    background: #303030;
  }
}
}
.current_table_container {
  margin-top: 10px;border: 1px solid grey;padding: 10px;width: calc(100% - 50px);height: 500px;
}
.amount_count_container {
  margin-top: 10px;border: 1px solid grey;padding: 10px;width: calc(100% - 50px);height: 60px;
}
.title {
  margin-right: 10px;
}
.count_number {
  display: inline-block;margin-left: 10px;
}
</style>