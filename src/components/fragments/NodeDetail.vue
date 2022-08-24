<template>
  <div class="col-md-3 bg-light border-left p-3" id="rightpanel" tabindex="0" @focus="editing=true"
       @blur="editing=false">
    <div class="form-group">
      <div class="input-group mb-3" v-if="this.node.id&&!this.node.isroot">
        <span class="input-group-text">#</span>
        <input type="text" @focus="editing=true" @blur="editing=false" v-model="node.topic" v-on:change="changeData" class="form-control">
      </div>
      <div v-if="this.node.id&&this.node.isroot">
        <label> {{ $t("Research title") }}:</label>
        <textarea class="form-control mb-3 mt-1" id="ResearchTitle" rows="4" tabindex="-1"
                  @focus="editing=true"
                  @blur="editing=false"
                  v-model="node.data.researchtitle" v-on:change="changeData"/>
      </div>
      <div v-if="this.node.id&&this.node.isroot">
        <label>{{ $t("Authors") }}:</label>
        <div class="input-group mb-3 mt-1" v-for="(author, index) in node.data.authors" :key="index" @change="changeData">
          <input @focus="editing=true" @blur="editing=false" type="text" class="form-control" v-model="node.data.authors[index].name"/>
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button" @click="removeAuthor(index)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                <path
                    d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="input-group mb-3 mt-1">
          <input type="text" class="form-control" v-model="newUser">
          <div class="input-group-append">
            <button @click="addAuthor" class="btn btn-outline-secondary" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div v-if="this.node.id">
        <label>{{ $t("Note") }}:</label>
        <textarea class="form-control mb-3 mt-1" id="UserNotes" rows="6" tabindex="-1"
                  @focus="editing=true"
                  @blur="editing=false"
                  v-model="node.data.usernote" v-on:change="changeData"/>
      </div>
    </div>
    <div class="d-flex justify-content-center ">
      <div v-if="loading" class="spinner-border mt-5" role="status"/>
      <button v-if="genDoc" class='btn btn-primary  mt-3' @click='showGenDocModal'>{{ $t("Generate Document") }}</button>
    </div>
    <div id="nodeContent" class="mt-3">
    </div>
  </div>
  <teleport to="body">
    <GenDocModal :title="node.data.researchtitle" :authors="node.data.authors" resear/>
  </teleport>

</template>

<script>
import $ from "jquery";
import axios from "axios";
import config from "@/config";
import utils from "@/utils";
import {Modal} from 'bootstrap';
import GenDocModal from "@/components/fragments/GenDocModal";

export default {
  name: "NodeDetail",
  components: {
    GenDocModal
  },
  data() {
    return {
      node: {
        data: {
          usernote: "",
          researchtitle: "",
          authors: [],
        },
        id: null
      },
      mainNode: {},
      loading: false,
      editing: false,
      genDoc: false,
      newUser: "",
      newUser1: "123"
    }
  },
  mounted() {
    console.log("NodeDetail mounted")
    this.emitter.on('showNode', (node) => {
      this.node = node;
    })
    // this.emitter.on("loadMapDone", () => {
    //   console.log("loadMapDone")
    //   this.updateNodeDetail()
    // })
  },
  watch: {
    editing() {
      this.emitter.emit('editing', this.editing)
    },
    node() {
      this.updateNodeDetail()
    }
  },
  methods: {
    updateNodeDetail() {
      if (!this.loading || this.node.id !== this.node.id) {
        this.genDoc = false;
        if (this.node != null && this.node.isroot) { //root
          this.loading = false;
          this.genDoc = true;
        }
        if (this.node != null && this.node.data != null && this.node.isroot) { //Root
          $("#authors-div").show();
          $("#nodeContent").empty();  //No content
        } else {
          $("#authors-div").hide();
        }
        this.selectedNode = this.node;
        let mainNode = utils.getMainNode(this.node);
        if (mainNode.id !== this.mainNode.id && mainNode.data.level === 1) {
          this.loading = true;
          $("#nodeContent").empty();
          this.mainNode = mainNode;
          console.log(config.getBaseAPI())
          axios.get(config.getBaseAPI() + "/api/v1/phrases/?sectionID=" + mainNode.id + "&lang=" + this.$route.query.lang).then(
              response => {
                let s = "<div class='panel-group' id='accordion'>";
                for (let i = 0; i <= response.data.length - 1; i++) {
                  const item = response.data[i];
                  s = s + "<div class='panel panel-default'>" +
                      "      <div class='panel-heading'>" +
                      "         <span class='panel-title'>" +
                      "            <a data-bs-toggle='collapse' data-parent='#accordion' href='#collapse" + (i + 1) + "'>" + item.id + "</a>" +
                      "         </span>" +
                      "      </div>" +
                      "      <div id='collapse" + (i + 1) + "' class='panel-collapse collapse'>" +
                      "   <div class='panel-body'><ul>";
                  if (item.phrases != null) {
                    for (let j = 0; j <= item.phrases.length - 1; j++) {
                      s = s + "<li>" + item.phrases[j].option + "</li>";
                    }
                  }
                  s = s + " <ul></div>";
                  s = s + " </div>";
                }
                $("#nodeContent").html(s);
                this.loading = false;
              }
          )
        }
      }
    },
    removeAuthor(index) {
      this.node.data.authors.splice(index, 1)
      this.changeData()
    },
    addAuthor() {
      if (!this.node.data.authors)
        this.node.data.authors = []
      if (this.newUser) {
        this.node.data.authors.push({name: this.newUser})
        this.newUser = ""
        this.changeData()
      }
    },
    showGenDocModal() {
      if (this.node.data.researchtitle && this.node.data.researchtitle.trim() === "") {
        $("#ResearchTitle").addClass("is-invalid")
      } else {
        $("#ResearchTitle").removeClass("is-invalid")
        let myModal = new Modal(document.getElementById('myModal'))
        myModal.show()
        this.emitter.emit('editing', true)
      }

    },
    changeData() {
      console.log("node Changed")
      this.emitter.emit('changeData', this.node)
    }
  }
}
</script>
<style scoped>
</style>