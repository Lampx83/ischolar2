<template>
  <footer class="text-center text-lg-start bg-light text-muted">
<!--    <section class="d-flex justify-content-center justify-content-lg-between p-2 border-top">-->
<!--      <div class="container text-center text-md-start mt-4 mb-4">-->
<!--        &lt;!&ndash; Grid row &ndash;&gt;-->
<!--        <div class="row">-->
<!--          &lt;!&ndash; Grid column &ndash;&gt;-->
<!--          <div class="col-md-2">-->
<!--            <img src="../../assets/images/graduation.svg" width="70" height="70"/>-->
<!--            <h5>-->
<!--              iScholar-->
<!--            </h5>-->
<!--          </div>-->

<!--          &lt;!&ndash; Grid column &ndash;&gt;-->
<!--          <div class="row col-md-3 align-items-center"><i>"Helpful tool for brainstorming, planning, and-->
<!--            writing..."</i>-->
<!--          </div>-->
<!--          &lt;!&ndash; Grid column &ndash;&gt;-->
<!--          <div class="col-md-3">-->
<!--            <h6 class="text-uppercase fw-bold mb-4">Help</h6>-->
<!--            <a href="#!" class="text-reset">Paper</a><br/>-->
<!--            <a href="#!" class="text-reset">Dissertation</a>-->
<!--          </div>-->
<!--          &lt;!&ndash; Grid column &ndash;&gt;-->
<!--          <div class="col-md-3">-->
<!--            <h6 class="text-uppercase fw-bold mb-4">Language </h6>-->
<!--            <a href="#!" class="text-reset">English</a><br/>-->
<!--            <a href="#!" class="text-reset">Vietnamese</a>-->
<!--          </div>-->
<!--          &lt;!&ndash; Grid column &ndash;&gt;-->
<!--        </div>-->
<!--        &lt;!&ndash; Grid row &ndash;&gt;-->
<!--      </div>-->
<!--    </section>-->
    <TheCopyright/>
  </footer>
</template>

<script>
import TheCopyright from './TheCopyright.vue'

export default {
  name: "FooterFragment",
  components: {
    TheCopyright
  }
}
</script>

<style scoped>

</style>