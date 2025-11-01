<template>
  <div class="page">
    <p>我是子组件：{{ count }}</p>
    <el-button type="primary" size="small" @click="onChange">点我+1</el-button>
    <el-button type="primary" size="small" @click="onHide">点我隐藏孙组件</el-button>
    <el-divider />
    <Son v-if="show" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import Son from './Son.vue'

export default defineComponent({
  name: 'ChildComp',
  components: {
    Son,
  },
  data() {
    return {
      count: 0,
      show: true,
    }
  },
  beforeCreate() {
    console.log('Child beforeCreate')
  },
  created() {
    console.log('Child created')
  },
  beforeMount() {
    console.log('Child beforeMount')
  },
  mounted() {
    console.log('Child mounted')
  },
  beforeUpdate() {
    console.log('Child beforeUpdate')
  },
  updated() {
    console.log('Child updated')
  },
  beforeDestroy() {
    console.log('Child beforeDestroy')
  },
  destroyed() {
    console.log('Child destroyed')
  },
  methods: {
    onChange() {
      this.count++
    },
    onHide() {
      this.show = !this.show
    },
  },
})
</script>

<style lang="scss" scoped></style>
