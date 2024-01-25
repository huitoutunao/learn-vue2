<script>
import { defineComponent } from 'vue'
import TableColumn from 'element-ui/lib/table-column'

// 参考文章链接：https://juejin.cn/post/7138993619955908638

// 判断是否 el-table-column 组件
const isElTableColumn = vnode => {
  return vnode?.componentOptions?.Ctor?.options?.name === TableColumn.name
}

// 获取 vnode 上的属性
const getColumnProps = vnode => {
  const props = vnode.componentOptions.propsData ?? {}
  return {
    prop: props.prop, // 标识
    label: props.label, // 列名称
    fixed: props.fixed, // 固定位置
    visiable: props.visiable ?? true, // 是否可见
  }
}

// 比较当前列数据与原先储存的列数据是否一致
const isSameColumns = (oVal, nVal) => {
  if (oVal.length !== nVal.length) return false

  const keys = oVal[0] ? Object.keys(oVal[0]) : []
  for (let i = 0; i < oVal.length; i++) {
    const _o = oVal[i]
    const _n = nVal[i]
    const isSame = keys.every(key => _o[key] === _n[key])
    if (!isSame) return false
  }
  return true
}

export default defineComponent({
  name: 'MyTable',
  inheritAttrs: false,
  data() {
    return {
      columnsFromSlot: [], // 原始列的数据
      columnsFromStorage: [], // 更新列的数据
      columnsRender: [], // 渲染时完整列数据
    }
  },
  computed: {
    watchColumns() {
      return [this.columnsFromSlot, this.columnsFromStorage]
    }
  },
  watch: {
    watchColumns() {
      // 当 columnsFromSlot 或 columnsFromStorage 有变更，重新生成 columns
      const slot = [...this.columnsFromSlot]
      const storage = [...this.columnsFromStorage]

      let res = []
      storage.forEach((props) => {
        const index = slot.findIndex(({ prop }) => prop === props.prop)
        if (~index) {
          // 匹配到属性进入判断
          const propsFromSlot = slot[index]
          res.push({
            ...propsFromSlot,
            ...props,
          })
          slot.splice(index, 1)
        }
      })
      this.columnsRender = slot.concat(res)
    }
  },
  render(h) {
    const slots = {
      main: [], // el-table-column 且有 prop 属性的
      left: [], // el-table-column 没有 prop 属性，但 fixed="left" 的
      other: [], // 其他的 el-table-column 或不认识的 VNode
    }

    this.$slots.default?.forEach(vnode => {
      if (isElTableColumn(vnode)) {
        const { prop, fixed } = getColumnProps(vnode)
        if (prop !== undefined) return slots.main.push(vnode)
        if (fixed === 'left') return slots.left.push(vnode)
      }
      slots.other.push(vnode)
    })

    // TODO: 这里解构了数组，留意下后面是否改回来
    const children = [...slots.left, ...slots.main, ...slots.other]
    // console.log('@@', children)

    const columnsFromSlot = slots.main.map(vnode => getColumnProps(vnode))
    const isSame = isSameColumns(this.columnsFromSlot, columnsFromSlot)
    if (!isSame) {
      // 更新原始列数据
      this.columnsFromSlot = columnsFromSlot
    }

    return h(
      'el-table',
      {
        attrs: {
          ...this.$attrs,
        },
      },
      children
    )
  },
})
</script>

<style lang="scss" scoped></style>
