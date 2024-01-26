<script>
import { defineComponent } from 'vue'
// import { cloneVNode } from '/node_modules/vue/src/core/vdom/vnode'
import TableColumn from 'element-ui/lib/table-column'

// 参考文章链接：https://juejin.cn/post/7138993619955908638

// 克隆 vnode 准备后续更新
const cloneVNode = vnode => {
  const VNode = vnode.constructor

  const cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  )
  cloned.ns = vnode.ns
  cloned.isStatic = vnode.isStatic
  cloned.key = vnode.key
  cloned.isComment = vnode.isComment
  cloned.fnContext = vnode.fnContext
  cloned.fnOptions = vnode.fnOptions
  cloned.fnScopeId = vnode.fnScopeId
  cloned.asyncMeta = vnode.asyncMeta
  cloned.isCloned = true
  return cloned
}

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

// 本地缓存相关
const setStorage = (key, val) => {
  localStorage.setItem(key, JSON.stringify(val))
}
const getStorage = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key))
  } catch (err) {
    return
  }
}

export default defineComponent({
  name: 'MyTable',
  inheritAttrs: false,
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
      key: 0,
      columnsFromSlot: [], // 从 slots 中获取
      columnsFromStorage: getStorage('columns') ?? [], // 本地存储
      columnsRender: [], // 渲染用的
    }
  },
  computed: {
    watchColumns() {
      return [this.columnsFromSlot, this.columnsFromStorage]
    }
  },
  watch: {
    columns(nVal) {
      if (nVal === this.columnsRender) return
      this.columnsFromStorage = nVal
      setStorage('columns', nVal)
    },
    columnsRender() {
      this.key += 1
    },
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

      this.$emit('update:columns', this.columnsRender)
    }
  },
  beforeDestroy() {
    this.$emit('update:columns', [])
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

    const columnsFromSlot = slots.main.map(vnode => getColumnProps(vnode))
    const isSame = isSameColumns(this.columnsFromSlot, columnsFromSlot)
    if (!isSame) {
      // 更新原始列数据
      this.columnsFromSlot = columnsFromSlot
    }

    // 对列进行筛选与排序
    const refactorySlot = () => {
      const { main } = slots
      const columnsProp = main.map(vnode => getColumnProps(vnode).prop)

      const refactorySlot = []
      this.columnsRender.forEach(({prop, visiable, fixed}) => {
        if (!visiable) return

        let vnode = main.find((_, index) => prop === columnsProp[index])
        if (!vnode) return

        let cloneVnode = cloneVNode(vnode)
        cloneVnode.componentOptions = { ...vnode.componentOptions }
        cloneVnode.componentOptions.propsData = {
          ...vnode.componentOptions.propsData,
        }

        const propsData = cloneVnode.componentOptions.propsData

        if (fixed !== undefined) propsData.fixed = fixed

        refactorySlot.push(cloneVnode)
      })

      return refactorySlot
    }

    const children = [...slots.left, ...refactorySlot(), ...slots.other]
    // console.log('@@', children)

    return h(
      'el-table',
      {
        props: {
          ...this.$attrs,
        },
        key: this.key,
      },
      children
    )
  },
})
</script>

<style lang="scss" scoped></style>
