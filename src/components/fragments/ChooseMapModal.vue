<template>
  <div id="chooseMapModal" class="modal" tabindex="-1" data-bs-keyboard="false" data-bs-backdrop="static">
    <div class="modal-dialog  modal-lg">
      <div class="modal-content">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title mt-3">{{ $t("Template") }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" v-if="chosen"></button>
          </div>
          <div class="modal-body container">
            <div class="row">
              <div class="col-sm  text-center">
                <img class="border p-2 rounded" width="222" height="140" src="../../assets/images/Research1.png"/>
                <button @click="loadMap(1)" class="btn btn-success mt-4">Nghiên cứu tiếng Việt</button>
              </div>
              <div class="col-sm text-center">
                <img class="border p-2 rounded" width="222" height="140" src="../../assets/images/Research0.png"/>
                <button @click="loadMap(0)" class="btn btn-primary mt-4">Mindmap rỗng</button>
              </div>
              <div class="col-sm  text-center">
                <img class="border  p-2 rounded" width="222" height="140" src="../../assets/images/Research2.png"/>
                <button @click="loadMap(2)" class="btn btn-danger mt-4">English Research</button>
              </div>
            </div>
          </div>
          <div class="modal-footer" v-if="chosen">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" >{{ $t("Close") }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseModal",
  props: {
    title: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      chosen: false
    }
  },
  methods: {
    loadMap(mapType) {
      this.emitter.emit('loadMap', mapType)
      this.chosen = true;
    }
  }
}
</script>

<style scoped>

</style>