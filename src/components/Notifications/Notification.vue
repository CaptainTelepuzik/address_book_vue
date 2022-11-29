<template src="./template.html">

</template>

<script>


export default {
  name: "NotificationPage",
  props: {
    messages: {
      type: Array,
      default: () => {
        return []
      }
    },
    rightButton: {
      type: String,
      default: ''
    },
    leftButton: {
      type: String,
      default: ''
    },
  },
  data() {
    return {}
  },
  methods: {}
}
</script>


<style scoped lang="less" src="./style.less">

</style>