<template>
  <!--  <WelcomePage msg="Measuring engagement and engaging consumers are two sides of the same coin."/>-->
  <NavigationBar/>

  <div class="row m-0">

    <MindMap/>

    <div class="col-md-3 bg-light border-left pt-2" id="rightpanel">
      <div class="form-group">
        <label>Note:</label>
        <textarea class="form-control" id="UserNotes" rows="5"></textarea>
      </div>
      <div id="nodeContent" class="mt-3">
      </div>
    </div>
  </div>
  <TheFooter/>


</template>

<script>
// import WelcomePage from './components/WelcomePage.vue'
import TheFooter from './components/TheFooter.vue'
import NavigationBar from './components/NavigationBar.vue'
import MindMap from './components/MindMap.vue'

export default {
  name: 'App',
  components: {
    // WelcomePage,
    NavigationBar,
    TheFooter,
    MindMap
  }
}
</script>

<style>

</style>