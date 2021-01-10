<template style="background-color: #DADED4">
  <div class="container mt-4 mb-4">
    <div class="d-flex justify-content-space-between">
      <img src='../assets/text.png'  class="mr-2"/>
      <img src='../assets/lamp-logo.png' width="8%" style="border-radius: 100%;" class="mr-2"/>
    </div>
    <block-sites></block-sites>
    <sessions></sessions>
  </div>
</template>

<script>
import BlockSites from '../components/BlockSites';
import Sessions from '../components/Sessions';

export default {
    name: 'App',
    components: {
      BlockSites,
      Sessions
    },
    mounted: () => {
      document.body.style.backgroundColor = '#F7F7F7';
      document.body.style.color = '#7DA2A9';
    }
}
</script>

<style>
  .btn {
    background-color: #A3BCB6 !important;
    border-color: #A3BCB6 !important;
    color: #F7F7F7 !important;
  }
  .custom-control-input:checked ~ .custom-control-label::before {
    color: #fff;
    border-color: #7DA2A9 !important;
    background-color: #7DA2A9 !important;
  }
</style>
