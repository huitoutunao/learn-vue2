<template>
  <div class="my-toolbar">
    <h4>动态列控制</h4>
    <draggable v-model="proxyColumns" class="draggable">
      <div v-for="(item, index) in proxyColumns" :key="item.prop" class="tool">
        <el-checkbox :value="item.visiable" @change="toggleVisiable(item, index)">
          {{ item.label }}
        </el-checkbox>
        <el-button
          :type="item.fixed === 'left' ? 'primary' : 'default'"
          size="mini"
          @click="setFixed(item, index, 'left')"
        >
          左固定
        </el-button>
        <el-button
          :type="item.fixed === 'right' ? 'primary' : 'default'"
          size="mini"
          @click="setFixed(item, index, 'right')"
        >
          右固定
        </el-button>
      </div>
    </draggable>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import draggable from 'vuedraggable'

export default defineComponent({
  name: 'MyToolBar',
  components: {
    draggable,
  },
  props: {
    columns: {
      type: Array,
      default() {
        return []
      },
    },
  },
  computed: {
    proxyColumns: {
      get() {
        return this.columns
      },
      set(v) {
        this.$emit('update:columns', v)
      },
    },
  },
  methods: {
    toggleVisiable(options, index) {
      const nOpts = {...options}
      const nColumns = [...this.proxyColumns]
      nOpts.visiable = !nOpts.visiable
      nColumns.splice(index, 1, nOpts)
      this.proxyColumns = nColumns
    },

    setFixed(options, index, fixedVal) {
      const nOpts = {...options}
      const nColumns = [...this.proxyColumns]
      const oldFixed = nOpts.fixed

      if (oldFixed) {
        if (oldFixed === fixedVal) {
          nOpts.fixed = false
        } else {
          nOpts.fixed = oldFixed === 'left' ? 'right' : 'left'
        }
      } else {
        nOpts.fixed = fixedVal
      }

      nColumns.splice(index, 1, nOpts)
      this.proxyColumns = nColumns
    },
  },
})
</script>

<style lang="scss" scoped>
.my-toolbar {
  width: 300px;

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
  }
}
</style>
