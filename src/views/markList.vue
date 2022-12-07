<template>
  <div class="markList_container">
    <div class="cup add_btn" @click="addItem()">新建条目</div>
    <div class="fast_btn_container flex">
      <div class="title" style="margin-top: 8px;">快捷添加：</div>
      <div class="cup fast_add_btn"> 公共交通 ￥5 </div>
      <div class="cup fast_add_btn"> 基金定投 ￥80 </div>
      <div class="cup fast_add_btn"> 水 ￥3 </div>
    </div>

    <div class="current_table_container">
      <div class="title" style="margin-top: 8px;margin-bottom: 8px;">今日账单：</div>
      <!-- <el-scrollbar> -->
      <el-table :data="store.currentList" stripe style="width: 100%"  height="500" >
        <el-table-column prop="date" label="日期" />
        <el-table-column prop="type" label="收支类型">
          <template #default="scope">
            <div v-if="scope.row.type === 'revenue'">收入</div>
            <div v-else>支出</div>
          </template>
        </el-table-column>
        <el-table-column prop="revenueType" label="收入类型"/>
        <el-table-column prop="expendituresType" label="支出类型"/>
        <el-table-column prop="amount" label="金额" />
        <el-table-column prop="name" label="详细信息" />
        <el-table-column label="操作">
          <template #default="scope">
            <div class="handleBox">
              <span class="handleSpan cup" @click.stop="editRow(scope.row);">编辑</span>
              <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" icon-color="red"
                title="此操作将永久删除该数据, 是否继续?" @confirm="delRow(scope.row.id)">
                <template #reference>
                  <span class="handleSpan cup">删除</span>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- </el-scrollbar> -->
    </div>

    <el-dialog
      v-model="state.showAddDialog"
      title="新增记账条目"
      width="40%"
      align-center
    >
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm"
          :size="formSize"
          status-icon
        >
          <el-form-item label="具体内容" prop="name">
            <el-input v-model="state.addForm.context" />
          </el-form-item>
          <el-form-item label="金额" prop="amount">
            <el-input v-model="state.addForm.amount" />
          </el-form-item>
          <el-form-item label="收支选择" prop="type">
            <el-select v-model="state.addForm.type" placeholder="请选择收支类型">
              <el-option :label="item.label" :value="item.value"  v-for="item in state.type"/>
            </el-select>
          </el-form-item>
          <el-form-item label="收入项选择" prop="revenue" v-if="state.addForm.type === 'revenue'">
            <el-select v-model="state.addForm.revenueType" placeholder="请选择收入项" >
              <el-option :label="item.label" :value="item.value"  v-for="item in state.type"/>
            </el-select>
          </el-form-item>
          <el-form-item label="支出项选择" prop="expenditures" v-if="state.addForm.type === 'expenditures'">
            <el-select v-model="state.addForm.expendituresType" placeholder="请选择支出项" >
              <el-option :label="item.label" :value="item.value"  v-for="item in state.type"/>
            </el-select>
          </el-form-item>
          <el-form-item label="消费时间" required>
            <el-col :span="11">
              <el-form-item prop="date">
                <el-date-picker
                  v-model="state.addForm.date"
                  type="date"
                  label="Pick a date"
                  placeholder="Pick a date"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm(ruleFormRef)"
              >确定</el-button
            >
            <el-button @click="resetForm(ruleFormRef)">取消</el-button>
          </el-form-item>
        </el-form>
    </el-dialog>
  </div>  
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted, onBeforeUnmount} from "vue";
import { mainStore } from "@/store/index";
import currentList from "@/store/currentList.json"

const ruleFormRef = ref<FormInstance>()

const store = mainStore();

const state = reactive({
  showAddDialog: false,
  addForm: {
    date: '',
    type: '',
    context: '',
    expendituresType: '',
    revenueType: '',
    amount: ''
  },
  type: [
    {label: '收入', value: 'revenue'}, {label: '支出', value: 'expenditures'}
  ]
})

const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入具体消费项', trigger: 'blur' }],
  amount: [{ required: true, message: '请输入具体金额', trigger: 'blur' }],
  date: [
    {
      type: 'date',
      required: true,
      message: '请选择消费日期',
      trigger: 'blur',
    },
  ],
  type: [
    {
      required: true,
      message: '请选择收支类型',
      trigger: 'blur',
    },
  ],
  revenue: [
    {
      required: true,
      message: '请选择收入类型',
      trigger: 'blur',
    },
  ],
  expenditures: [
    {
      required: true,
      message: '请选择支出类型',
      trigger: 'blur',
    },
  ],
})

const addItem = () => {
  state.showAddDialog = true
} 

// 提交新增表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  state.showAddDialog = false
  await formEl.validate((valid, fields) => {
    if (valid) {
      state.showAddDialog = false
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}

// 关闭新增表单弹框 | 点击取消
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  state.showAddDialog = false
}

onMounted(() => {
  store.currentList = currentList
  state.addForm.date = new Date();
  console.log('date', state.addForm.date)
})
</script>


<style scoped lang='scss'>
.markList_container {
  width: 100%;
  height: 100%;
}
.add_btn {
  background: #5f271d;width: 100px;border: 1px solid #410d18;
  color: #fff;height: 30px;font-size: 16px;text-align: center;line-height: 30px;
  &:hover {
    background: #955141;
  }
}
.fast_btn_container {
  margin-top: 10px;border: 1px solid #a58262;padding: 10px;width: calc(100% - 50px);
  .fast_add_btn {
  background: #a58262;border: 1px solid #410d18;padding-left: 10px;padding-right: 10px;
  color: #fff;height: 30px;font-size: 16px;text-align: center;line-height: 30px;margin-right: 5px;
  &:hover {
    background: #c9b097;
  }
}
}
.current_table_container {
  margin-top: 10px;border: 1px solid #a58262;padding: 10px;width: calc(100% - 50px);height: 500px;
}
</style>