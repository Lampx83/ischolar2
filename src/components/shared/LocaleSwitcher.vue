<template>
  <div class="btn-group">
    <button type="button" class="btn btn-warning dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
      {{ currentLang.name }}
    </button>
    <ul class="dropdown-menu">
      <li v-for="(lang,index) in languages" v-bind:key="index">
        <a class="dropdown-item" @click="callSetLangActions(lang)">{{ lang.name }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
import {languages} from "../../lang/i18n"

export default {
  data() {
    return {
      languages,
      currentLang: languages[1]
    }
  },
  mounted() {
    if (this.$route.query.lang === "en")
      this.callSetLangActions(languages[0])
    else
      this.callSetLangActions(languages[1])

    this.emitter.on('changeLang', (language) => {
      if (language === "en")
        this.callSetLangActions(languages[0])
      else
        this.callSetLangActions(languages[1])
    })

  },
  methods: {
    callSetLangActions(lang) {
      this.currentLang = lang
      this.$i18n.locale = lang.code
      this.$router.push({query: {lang: lang.code}})
    }
  },
  name: "LocaleSwitcher"
}
</script>

<style scoped>

</style>