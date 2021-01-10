<template>
  <div class="background-color: #F7F7F7">
    <a href='{{ browser.runtime.getURL("page-blocked.html") }}'>Options1</a> 
    <div>Lol</div>
  </div>
</template>

<script>
export default {
  name: 'PopUp',
  mounted () {
    browser.runtime.sendMessage({})
  },
  computed: {
    defaultText () {
      return browser.i18n.getMessage('extName')
    }
  },
  methods: {}
}
</script>

<style scoped>
p {
  font-size: 20px;
}
</style>
