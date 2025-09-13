<template>
  <div class="page">
    <p>我是孙组件：{{ count }}</p>
    <el-button type="primary" size="small" @click="onChange">点我+1</el-button>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SonComp',
  data() {
    return {
      count: 0,
    }
  },
  beforeCreate() {
    console.log('Son beforeCreate')
  },
  created() {
    console.log('Son created')
  },
  beforeMount() {
    console.log('Son beforeMount')
  },
  mounted() {
    console.log('Son mounted')
  },
  beforeUpdate() {
    console.log('Son beforeUpdate')
  },
  updated() {
    console.log('Son updated')
  },
  beforeDestroy() {
    console.log('Son beforeDestroy')
  },
  destroyed() {
    console.log('Son destroyed')
  },
  methods: {
    onChange() {
      this.count++
    },
  },
})
</script>

<style lang="scss" scoped></style>
