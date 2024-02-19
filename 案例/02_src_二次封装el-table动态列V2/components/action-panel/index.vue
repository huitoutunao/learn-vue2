<template>
  <div>
    <el-drawer v-bind="$attrs" v-on="$listeners">
      <div class="form-box">
        <el-form ref="form" :model="form" label-position="top" label-width="80px">
          <el-form-item label="字段名称">
            <el-input v-model="form.label"></el-input>
          </el-form-item>
          <el-form-item label="显示状态">
            <el-switch v-model="form.visiable"></el-switch>
          </el-form-item>
          <el-form-item label="固定列">
            <el-checkbox-group v-model="form.checkfixeds" @change="changeCheckFixeds">
              <el-checkbox label="left">左固定</el-checkbox>
              <el-checkbox label="right">右固定</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="输入类型">
            <el-select v-model="form.slotName" placeholder="请选择">
              <el-option
                v-for="item in slotNameOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.slotName === 'el-select'" label="选项内容">
            <el-col :span="24">
              <el-button type="primary" size="mini" @click="addSelectOption">新增选项</el-button>
            </el-col>
            <draggable v-model="form.selectOptions" class="draggable">
              <el-col v-for="(selectItem, selectIndex) in form.selectOptions" :key="selectItem.id" :span="24" class="select-col">
                <el-row :gutter="20">
                  <el-col :span="1" style="cursor: pointer;">
                    <i class="el-icon-rank"></i>
                  </el-col>
                  <el-col :span="16">
                    <el-input v-model="selectItem.input" size="small" placeholder="请输入内容"></el-input>
                  </el-col>
                  <el-col :span="4">
                    <el-button type="danger" icon="el-icon-delete" size="small" circle @click="delSelectOption(selectIndex)"></el-button>
                  </el-col>
                </el-row>
              </el-col>
            </draggable>
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
import { nanoid } from 'nanoid'
import draggable from 'vuedraggable'

export default defineComponent({
  name: 'ActionPanel',
  components: {
    draggable,
  },
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
        slotName: '',
        selectOptions: [],
      },

      slotNameOptions: [
        {
          label: 'el-input',
          value: 'el-input',
        },
        {
          label: 'el-select',
          value: 'el-select',
        },
        {
          label: 'el-date-picker',
          value: 'el-date-picker',
        },
        {
          label: '进度条',
          value: 'vue-slider',
        },
      ],
    }
  },
  watch: {
    formData(nVal) {
      this.form = {...this.form, ...nVal}
    },
    'form.slotName': function (nVal) {
      if (nVal === 'el-select') {
        this.form.selectOptions = [
          {
            id: nanoid(8),
            input: '',
          },
        ]
      }
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
    addSelectOption() {
      this.form.selectOptions.push({
        id: nanoid(8),
        input: '',
      })
    },
    delSelectOption(index) {
      this.form.selectOptions.splice(index, 1)
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

  .select-col {
    margin-bottom: 10px;
  }
}
</style>
