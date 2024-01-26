<template>
  <div>
    <MyTable :data="tableData" :columns.sync="columns" style="width: 100%">
      <el-table-column prop="date" label="日期" min-width="180" />
      <el-table-column prop="name" label="姓名" min-width="180" />
      <el-table-column prop="address" label="地址" min-width="240" />
      <el-table-column prop="order" label="订单号" min-width="180" />
      <el-table-column prop="title" label="标题" min-width="180" />
      <el-table-column prop="title2" label="标题2" min-width="180" />
      <el-table-column prop="title3" label="标题3" min-width="180" />
      <el-table-column prop="total" label="合计" min-width="180" />
    </MyTable>
    <MyToolBar :columns.sync="columns" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import MyTable from './components/my-table/index.vue'
import MyToolBar from './components/my-toolbar/index.vue'

export default defineComponent({
  name: 'App',
  components: {
    MyTable,
    MyToolBar,
  },
  data() {
    return {
      columns: [],
      tableData: [
        {
          date: '2024-01-24',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          order: '111',
          title: '111',
          title2: '111',
          title3: '111',
          total: 10,
        },
        {
          date: '2024-01-25',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          order: '222',
          title: '222',
          title2: '222',
          title3: '222',
          total: 20,
        },
        {
          date: '2024-01-26',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          order: '333',
          title: '333',
          title2: '333',
          title3: '333',
          total: 30,
        },
      ],
    }
  },
})
</script>

<style lang="scss" scoped></style>
