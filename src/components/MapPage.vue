<template>

  <NavigationBar/>

  <div class="row">
    <MindMap/>
    <NodeDetail/>
  </div>
  <FooterFragment/>


</template>

<script>

import FooterFragment from './shared/TheFooter.vue'
import NavigationBar from './shared/TheHeader.vue'
import MindMap from './fragments/MindMap.vue'
import NodeDetail from './NodeDetail.vue'


export default {
  name: 'App',
  components: {
    MindMap,
    // WelcomePage,
    NavigationBar,
    FooterFragment,
    NodeDetail
  }
}
</script>

<style>

</style>