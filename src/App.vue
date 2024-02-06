<template>
  <div>
    <MyTableV2 :data="tableData" :border="true" :columns.sync="columns" style="width: 100%"></MyTableV2>
    <MyToolBarV2 :columns.sync="columns" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
// import MyTable from './components/my-table/index.vue'
import MyTableV2 from './components/my-table-v2/index.vue'
// import MyToolBar from './components/my-toolbar/index.vue'
import MyToolBarV2 from './components/my-toolbar-v2/index.vue'

const getStorage = (key) => {
  try {
    return JSON.parse(sessionStorage.getItem(key))
  } catch (err) {
    return
  }
}

export default defineComponent({
  name: 'App',
  components: {
    // MyTable,
    MyTableV2,
    // MyToolBar,
    MyToolBarV2,
  },
  data() {
    const tableData = getStorage('tableData') ?? [
      {
        title: '标题',
        date: '2024-01-24',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        order: '01',
        total: '10',
      },
    ]
    return {
      columns: [
        {
          prop: 'title',
          label: '标题',
          'min-width': '180',
        },
        {
          prop: 'date',
          label: '日期',
          'min-width': '180',
        },
        {
          prop: 'name',
          label: '姓名',
          'min-width': '180',
        },
        {
          prop: 'address',
          label: '地址',
          'min-width': '180',
        },
        {
          prop: 'order',
          label: '订单号',
          'min-width': '180',
        },
        {
          prop: 'total',
          label: '合计',
          'min-width': '180',
        },
      ],
      tableData,
    }
  },
})
</script>

<style lang="scss" scoped></style>
