<template>
  <div class="page">
    <p>我是父组件：{{ count }}</p>
    <el-button type="primary" size="small" @click="onChange">点我+1</el-button>
    <el-button type="primary" size="small" @click="onHide">点我隐藏子组件</el-button>
    <el-divider />
    <Child v-if="show" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import Child from '@/components/Child.vue'

export default defineComponent({
  name: 'App',
  components: {
    Child,
  },
  data() {
    return {
      count: 0,
      show: true,
    }
  },
  beforeCreate() {
    console.log('App beforeCreate')
  },
  created() {
    console.log('App created')
  },
  beforeMount() {
    console.log('App beforeMount')
  },
  mounted() {
    console.log('App mounted')
  },
  beforeUpdate() {
    console.log('App beforeUpdate')
  },
  updated() {
    console.log('App updated')
  },
  beforeDestroy() {
    console.log('App beforeDestroy')
  },
  destroyed() {
    console.log('App destroyed')
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
