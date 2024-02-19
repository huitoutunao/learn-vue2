<template>
  <el-table :key="key" v-bind="$attrs" v-on="$listeners">
    <el-table-column
      v-for="option in columnsRender"
      :key="option.prop"
      v-bind="option"
    >
      <template #default="{ row }">
        <component
          v-if="option.slotName"
          :is="option.slotName"
          v-model="row[option.prop]"
        >
          <template v-if="option.slotName === 'el-select'">
            <el-option
              v-for="item in option.selectOptions"
              :key="item.id"
              :label="item.input"
              :value="item.input"
            ></el-option>
          </template>
        </component>
        <el-input v-else v-model="row[option.prop]"></el-input>
      </template>
    </el-table-column>
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
    },
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
  mounted() {
    this.unwatch = this.$watch(
      function () {
        return this.$attrs.data
      },
      function (nVal) {
        setStorage('tableData', nVal)
      },
      {
        deep: true
      }
    )
  },
  beforeDestroy() {
    this.unwatch()
  },
})
</script>

<style lang="scss" scoped></style>
