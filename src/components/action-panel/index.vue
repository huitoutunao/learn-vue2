<template>
  <div>
    <el-drawer v-bind="$attrs" v-on="$listeners">
      <div class="form-box">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="列名称">
            <el-input v-model="form.label"></el-input>
          </el-form-item>
          <el-form-item label="是否显示">
            <el-switch v-model="form.visiable"></el-switch>
          </el-form-item>
          <el-form-item label="固定列">
            <el-checkbox-group v-model="form.checkfixeds" @change="changeCheckFixeds">
              <el-checkbox label="left">左固定</el-checkbox>
              <el-checkbox label="right">右固定</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onConfirm">确认</el-button>
            <el-button @click="onCancel">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ActionPanel',
  props: {
    formData: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      form: {
        label: '',
        visiable: false,
        checkfixeds: [],
      },
    }
  },
  watch: {
    formData(nVal) {
      this.form = {...this.form, ...nVal}
    },
  },
  methods: {
    changeCheckFixeds(v) {
      const current = this.form.checkfixeds
      if (current.length > 1) {
        this.form.checkfixeds = v.slice(1)
      }

      this.form.fixed = this.form.checkfixeds.length && this.form.checkfixeds[0] || false
    },
    onConfirm() {
      this.$emit('confirm', this.form)
    },
    onCancel() {
      this.$emit('cancel')
    },
  },
})
</script>

<style lang="scss" scoped>
.form-box {
  padding: 15px;
}
</style>
