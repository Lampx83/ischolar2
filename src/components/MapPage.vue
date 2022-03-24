<template>
  <TheHeader/>
  <div class="row g-0">
    <MindMap/>
    <NodeDetail/>
  </div>
  <FooterFragment/>
</template>

<script>
import FooterFragment from './shared/TheFooter.vue'
import TheHeader from './shared/TheHeader.vue'
import MindMap from './fragments/MindMap.vue'
import NodeDetail from './fragments/NodeDetail.vue'

export default {
  name: 'App',
  components: {
    MindMap,
    TheHeader,
    FooterFragment,
    NodeDetail
  }
}
</script>

<style>

.text-small {
  font-size: 0.9rem;
}
jmnode{
  tabindex:-1
}
</style>