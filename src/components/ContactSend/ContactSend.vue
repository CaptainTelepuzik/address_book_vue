<template src="./template.html"/>

<script>

export default {
  name: "V-Contacts",
  props: ["data"],
  data() {
    return {
      telephone: '',

    }
  },
  methods: {
    removeContact(id) {
      this.$emit('deleted', id)
      this.CloseForm()
    },
    CloseForm() {
      this.$emit('close')
    },
  }
}
</script>

<style scoped src="./style.less" lang="less">
</style>