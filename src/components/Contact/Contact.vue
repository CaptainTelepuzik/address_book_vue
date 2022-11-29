<template src="./template.html"/>

<script>

export default {
  name: "V-ContactSend",
  props: ["data"],
  data() {
    return {
      telephone: ''
    }
  },
  methods: {
    removeContact(id) {
      this.$emit('deleted', id)
    },
  }
}
</script>

<style scoped src="./style.less" lang="less">
</style>