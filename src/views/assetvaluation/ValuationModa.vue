<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    @ok="handleOk"
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
    @cancel="handleCancel"
    cancelText="关闭"
    okText="重新估价"
  >
    <assets-assessment-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit"></assets-assessment-form>

    <div v-if="showResult">
      <a-divider />

      <a-descriptions title="单项资产评估" bordered>
        <a-descriptions-item label="水工建筑物估值" :span="3">
          {{ result.waterAssessment }}
        </a-descriptions-item>
        <a-descriptions-item label="机器设备值评估值" :span="3">
          {{ result.machineAssessment }}
        </a-descriptions-item>
        <a-descriptions-item label="土地资产价值" :span="3">
          {{ result.landAssessment }}
        </a-descriptions-item>
      </a-descriptions>
      <div style="marginTop: 20px">
        <a-descriptions title="整体资产评估" bordered>
          <a-descriptions-item label="整体资产评估值" :span="3">
            {{ result.allAssessment }}
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </div>
  </j-modal>
</template>

<script>
import AssetsAssessmentForm from './ValuationForm'
export default {
  name: 'AssetsAssessmentModal',
  components: {
    AssetsAssessmentForm
  },
  data() {
    return {
      title: '重新估计',
      width: 800,
      visible: false,
      disableSubmit: false,
      showResult: false,
      result: {}
    }
  },
  methods: {
    add() {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.realForm.add()
      })
    },
    edit(record) {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.realForm.edit(record)
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      this.$refs.realForm.submitForm()
    },
    submitCallback(result) {
      this.result = result
      this.showResult = true
      // this.$emit('ok');
      // this.visible = false;
    },
    handleCancel() {
      this.close()
    }
  }
}
</script>
