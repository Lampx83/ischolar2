<template>
  <!--  <div id="myModal" class="modal d-block" tabindex="-1">-->
  <div id="myModal" class="modal " tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <form class="m-2" @submit.prevent="onSubmit">
          <div class="modal-header">
            <h5 class="modal-title mt-3">Generate Document</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <label class="form-label">{{ $t("Template") }}</label>
            <select v-model="form_data.docType" class="form-select" id="report_type" @change="onChange">
              <option v-for='(template,index) in templates' :value="index" :key="index">{{ template }}</option>
            </select>
            <div id="research_info">
              <label for="research_info" class="form-label mt-3">{{ $t("Research title") }}:</label>
              <input :value="title" disabled type="text" name="title" id="title" class="form-control">
              <div id="type1">
                <label class="form-label mt-3">{{ $t("Authors") }}:</label>
                <div class="input-group type1" v-for="(author, index) in authors" :key="index">
                  <div class="input-group-prepend">
<!--                    <span class="input-group-text" style="width: 200px; text-overflow: ellipsis; overflow: hidden; display: block;">{{ author.name }}</span>-->
                    <span class="input-group-text" >{{ author.name }}</span>
                  </div>
<!--                  <input type="text" class="form-control" placeholder="Email" v-model="author.email">-->
<!--                  <input type="text" class="form-control" placeholder="Affiliation" v-model="author.affiliation">-->
                </div>
              </div>
              <div id="type2"  class="mb-3" v-if="this.form_data.docType >= 1">
                <input v-model="form_data.teacher_name" type="text" name="teacher_name" id="teacher_name" :placeholder='$t("Teacher Name")' class="form-control mt-3">
              </div>
            </div>

            <label class="form-label mt-3">{{$t("Number of sample sentences")}}:</label>
            <select v-model="form_data.number_of_sample" class="form-select" id="number_of_sample">
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
            <label class="form-label mt-3">{{$t("Language")}}:</label>
            <select v-model="form_data.language" class="form-select" id="language">
              <option value="en">{{$t("English")}}</option>
              <option value="vn">{{$t("Vietnamese")}}</option>
            </select>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="submit" class="btn btn-primary">Generate!</button>
          </div>
        </form>
      </div>
    </div>
  </div>

</template>

<script>
import $ from "jquery";

export default {
  props: {
    title: String,
    authors: Array
  },
  name: "GenDocModal",
  data() {
    return {
      form_data: {
        docType: 3, //ThuongMai University
        title: this.$props.title,
        authors: [],
        student_name: "",
        teacher_name: "",
        number_of_sample: 2,
        language: this.$route.query.lang
      }
    }
  },
  computed: {
    templates() {
      return [
        this.$t('Templates.0'),
        this.$t('Templates.1'),
        this.$t('Templates.2'),
        this.$t('Templates.3')
      ]
    }
  },
  watch: {
    '$route.query.lang'() {
      this.form_data.language = this.$route.query.lang
    }
  },
  methods: {
    onSubmit() {
      console.log("Submit form")
      let valid = true;
      this.form_data.authors = this.$props.authors
      if (this.form_data.docType === '1') {
        // if (this.form_data.author_affiliation.trim() === "") {
        //   $("#author_affiliation").addClass("is-invalid")
        //   valid = false
        // } else {
        //   $("#author_affiliation").removeClass("is-invalid")
        //   $("#author_affiliation").addClass("is-valid")
        // }
      } else if (this.form_data.docType === 2) {
        // if (this.form_data.student_name.trim() === "") {
        //   $("#student_name").addClass("is-invalid")
        //   valid = false
        // } else {
        //   $("#student_name").removeClass("is-invalid")
        //   $("#student_name").addClass("is-valid")
        // }

        // if (this.form_data.title.trim() === "") {
        //   $("#author_affiliation").addClass("is-invalid")
        //   valid = false
        // } else {
        //   $("#author_affiliation").removeClass("is-invalid")
        //   $("#author_affiliation").addClass("is-valid")
        // }

        if (this.form_data.teacher_name.trim() === "") {
          $("#teacher_name").addClass("is-invalid")
          valid = false
        } else {
          $("#teacher_name").removeClass("is-valid")
        }
      }
      if (valid) {
        this.emitter.emit('genDoc', this.form_data)
      }
    }
  }
}
</script>

<style scoped>

</style>