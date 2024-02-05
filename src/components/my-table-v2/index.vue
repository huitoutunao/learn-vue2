<template>
  <el-table :key="key" v-bind="$attrs" v-on="$listeners">
    <el-table-column
      v-for="option in columnsRender"
      :key="option.prop"
      v-bind="option"
    />
  </el-table>
</template>

<script>
import { defineComponent } from 'vue'

// 本地缓存相关
const setStorage = (key, val) => {
  sessionStorage.setItem(key, JSON.stringify(val))
}
const getStorage = (key) => {
  try {
    return JSON.parse(sessionStorage.getItem(key))
  } catch (err) {
    return
  }
}

export default defineComponent({
  name: 'MyTableV2',
  props: {
    columns: {
      type: Array,
      required: true,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      key: 0,
      columnsFromStorage: getStorage('columns') ?? [],
      // columnsRender: [],
    }
  },
  computed: {
    columnsRender() {
      let res
      if (this.columnsFromStorage.length) {
        res = this.columnsFromStorage.filter(item => item.visiable)
        this.$emit('update:columns', this.columnsFromStorage)
      } else {
        res = this.columns
      }
      return res
    }
  },
  watch: {
    columnsRender() {
      this.key += 1
    },
    columns(nVal) {
      if (nVal === this.columnsFromStorage) return
      this.columnsFromStorage = nVal
      setStorage('columns', nVal)
    },
  },
})
</script>

<style lang="scss" scoped></style>
