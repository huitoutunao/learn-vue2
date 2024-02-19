<template>
  <div class="my-toolbar">
    <h4>动态列控制</h4>
    <draggable v-model="proxyColumns" class="draggable">
      <div v-for="(item, index) in proxyColumns" :key="item.prop" class="tool">
        <span class="span">{{ item.label }}</span>
        <el-button size="mini" @click="handlePanel(index)">操作面板</el-button>
        <el-button type="danger" size="mini" @click="handleDel(index)">删除</el-button>
      </div>
    </draggable>
    <div class="form-box">
      <el-form :inline="true" :model="form">
        <el-form-item>
          <el-input placeholder="请输入列名" v-model="form.addInput" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <ActionPanel title="操作面板" :form-data="formData" :visible.sync="drawer" :direction="direction" size="45%" @confirm="confirmPanel" @cancel="drawer = false" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { nanoid } from 'nanoid'
import draggable from 'vuedraggable'
import ActionPanel from '../action-panel/index.vue'

export default defineComponent({
  name: 'MyToolBarV2',
  components: {
    draggable,
    ActionPanel,
  },
  props: {
    columns: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      form: {
        addInput: '',
      },
      formData: {},
      drawer: false,
      direction: 'rtl',
    }
  },
  computed: {
    proxyColumns: {
      get() {
        return this.columns.map(item => {
          const opt = {...item}
          const properties = new Map([
            ['fixed', false],
            ['visiable', true],
            ['slotName', 'el-input']
          ])

          for (let [key, val] of properties) {
            if (!opt.hasOwnProperty(key)) {
              opt[`${key}`] = val
            }
          }

          return opt
        })
      },
      set(v) {
        this.$emit('update:columns', v)
      },
    },
  },
  methods: {
    handlePanel(index) {
      let nOpts = {...this.proxyColumns[index]}
      const nColumns = [...this.proxyColumns]
      this.formData = {...nOpts}
      this.drawer = true
      this.$once('confirmPanel', val => {
        nOpts = {...nOpts, ...val}
        nColumns.splice(index, 1, nOpts)
        this.proxyColumns = nColumns
      })
    },
    confirmPanel(val) {
      this.drawer = false
      this.$emit('confirmPanel', val)
    },

    handleDel(index) {
      const nColumns = [...this.proxyColumns]
      this.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          nColumns.splice(index, 1)
          this.proxyColumns = nColumns
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    handleAdd() {
      const nColumns = [...this.proxyColumns]
      const defaultOption = {
        label: this.form.addInput,
        prop: nanoid(8),
        visiable: true,
        slotName: 'el-input',
        'min-width': '180',
      }
      nColumns.push(defaultOption)
      this.proxyColumns = nColumns
      this.form.addInput = ''
    },
  },
})
</script>

<style lang="scss" scoped>
.my-toolbar {
  min-width: 300px;

  .draggable {
    border: 1px solid #eee;
  }

  .tool {
    padding: 10px;
    border-bottom: 1px solid #eee;

    &:last-child {
      border: 0;
    }

    .el-checkbox {
      margin-right: 15px;
    }

    .span {
      display: inline-block;
      margin-right: 15px;
      font-size: 14px;
    }
  }

  .form-box {
    padding-top: 15px;
  }
}
</style>
