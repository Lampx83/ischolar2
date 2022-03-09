<template>
  <div class="col-md-3 bg-light border-left pt-2" id="rightpanel">
    <div class="form-group">
      <label>Note:</label>
      <textarea class="form-control" id="UserNotes" rows="5"
                @focus="editing=false"
                @blur="editing=true"
      ></textarea>
    </div>
    <div v-if="loading" class="d-flex justify-content-center">
      <div class="spinner-border mt-5" role="status"/>
    </div>
    <div id="nodeContent" class="mt-3">
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import axios from "axios";
import config from "@/config";
import utils from "@/utils";

export default {
  name: "NodeDetail",
  mounted() {
    this.emitter.on('showNode', (node) => {
      this.showNode(node)
    })

  },
  data() {
    return {
      node: {},
      loading: false,
      editing:false
    }
  },
  watch:{
    editing(){
      this.emitter.emit('editing', this.editing)
    }
  },
  methods: {
    showNode(node) {
      if (!this.loading || this.node.id !== node.id) {
        this.loading = true;
        this.node = node;
        $("#nodeContent").empty();
        if (node != null && node.isroot) { //root
          // var dialog = $("#dialog-form").dialog({
          //   autoOpen: false,
          //   height: 400,
          //   width: 350,
          //   modal: true,
          //   buttons: {
          //     Cancel: function () {
          //       dialog.dialog("close");
          //     }
          //   },
          //   close: function () {
          //     //form[0].reset();
          //   //  allFields.removeClass("ui-state-error");
          //   }
          // });
          $("#nodeContent").html("<a href = '#' onclick='generateDoc()'>Generate Document</a>");
        }

        if (node != null && node.data != null && node.data.usernote != null)
          $("#UserNotes").val(node.data.usernote);
        else
          $("#UserNotes").val("");



        this.selectedNode = node;

        let mainNode = utils.getMainNode(node);
        if (mainNode.data.level == 1) {
          console.log("axios")
          axios.get(config.baseAPI + "/api/v1/phrases/?sectionID=" + mainNode.id).then(
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
    }
  }
}


</script>

<style scoped>

</style>