<template>

  <div class="masthead d-flex bg-dark" style="position: absolute">
    <div class="container text-center my-auto">
      <img src="../assets/images/graduation.svg" width="120" height="120"/>
      <h1 class="ml-3 d-inline font-weight-bold"><strong>iScholar</strong></h1>
      <h4 class="mb-5" id="quote">
        <span v-html='$t("Quotes[" + Math.floor(Math.random() * 10) + "]")'></span>
      </h4>
      <button class="btn btn-primary btn-lg js-scroll-trigger" @click="newMap" style="text-transform: uppercase;">{{ $t("Start") }}</button>
    </div>
    <div class="overlay"></div>
  </div>
  <div class="d-flex bg-dark justify-content-end w-100" style="position: absolute">
    <LocaleSwitcher class="m-4"/>
  </div>
</template>

<script>
import utils from "@/utils";
import LocaleSwitcher from "@/components/shared/LocaleSwitcher";

export default {
  name: 'HelloWorld',
  data() {
    return {}
  },
  methods: {
    newMap() {
      this.$router.push({path: '/map/' + utils.makeId(6), query: {lang: this.$route.query.lang}})
    },
    callSetLangActions(event) {
      this.$i18n.locale = event.target.value
      // this.$router.push({params: {lang: event.target.value}})
    }
  },
  components: {
    LocaleSwitcher
  }
}
</script>

<style scoped>

.masthead {
  min-height: 30rem;
  position: relative;
  display: table;
  width: 100%;
  padding-top: 8rem;
  padding-bottom: 8rem;
  height: 100vh
}

.masthead h1 {
  font-weight: 500;
  font-size: 4rem;
  color: white;
}

h4 {
  color: whitesmoke;
  padding: 20px;
}

</style>

