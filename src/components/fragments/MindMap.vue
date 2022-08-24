<template>
  <div id="jsmind_container" class="col-md-9"></div>
  <teleport to="body">
    <ChooseMapModal/>
  </teleport>
</template>
<script>

import "jsmind/style/jsmind.css";

global.jsMind = require('jsmind');
require('jsmind/js/jsmind.draggable');
require('jsmind/js/jsmind.screenshot');

import jsMind from "jsmind"
import {database} from "@/firebase";
import {ref, onValue, set} from "firebase/database";
import $ from "jquery"
import config from "@/config";
import utils from "@/utils";
import {Modal} from 'bootstrap';

import ChooseMapModal from "@/components/fragments/ChooseMapModal";

let mindCurrentVer = "";

let jm = null

function checkNode(node, level) {
  node.level = level
  if (node.children) {
    level++;
    for (let child of node.children) {
      checkNode(child, level)
    }
  }
  changeNodeColor(node, false)
}

function changeNodeColor(node, justAdded) {
  if (!node.level) {
    node.level = utils.getNodeLevel(node)
  }
  if (node.level === 0) {
    node['background-color'] = "#3781c0";
  } else if (node.level === 1) {
    node['background-color'] = "#428bca";
  } else if (node.level === 2) {
    node['background-color'] = "#E76F51";
  } else if (node.level === 3) {
    node['background-color'] = "#4d9a4e";
  } else if (node.level === 4) {
    node['background-color'] = "#ed9c28";//
  } else if (node.level === 5) {
    node['background-color'] = "#39b3d7";//
  }
  if (justAdded) {
    jm.set_node_color(jm.get_selected_node().id, node['background-color'], null);
  }
}

export default {
  name: "MindMap",
  components: {
    ChooseMapModal
  },
  data() {
    return {
      firstTime: true,
      currentUser: {},
      id: this.$route.params.id,
      selectedNode: {},
      mind: {
        "meta": {
          "name": "Mind map",
          "version": "3svOUT8K7Y",
          "author": ""
        },
        "format": "node_tree",
        "data": {
          "id": "root",
          "topic": "Mind map",
          "researchtitle": "",
          "authors": [{"name": this.$t("Author name")}],
          "usernote": "",
          "isroot": true,
        }
      }
    }
  },
  watch: {
    // '$route'(to) {
    //   this.id = to.params.id
    //   this.loadMap(utils.getMapID(this));
    // }
  },
  mounted() {
    console.log("MindMap mounted")
    let comp = this;
    const options = {
      container: 'jsmind_container',
      editable: true,
      theme: 'primary',
      keep_center: false,
      shortcut: {
        enable: true, 		// whether to enable shortcut
        handles: {}, 			// Named shortcut key event processor
        mapping: { 			// shortcut key mapping
          addchild: 9, 	// <Insert>
          addbrother: 13, // <Enter>
          editnode: 113, 	// <F2>
          delnode: 46, 	// <Delete>
          toggle: 32, 	// <Space>
          left: 37, 		// <Left>
          up: 38, 		// <Up>
          right: 39, 		// <Right>
          down: 40, 		// <Down>
        }
      },
    }

    jm = jsMind.show(options, this.mind);


    jm.add_event_listener((data) => {
      if (data == jsMind.event_type.edit) {
        this.savetoCloud()
      }
    })

    if (this.$route.query.action === "new") { //Nếu chưa tạo map bao giờ thì hiện modal chọn kèm theo hướng dẫn
      this.showChooseMap();
    } else {  //Nếu map này đã có rồi thì tiến hành tải map từ cloud
      this.loadMap();
    }

    $("#UserNotes").change(function () {
      comp.selectedNode.data.usernote = $("#UserNotes").val();
      comp.savetoCloud();
    })
    $("#ResearchTitle").change(function () {
      comp.selectedNode.data.researchtitle = $("#ResearchTitle").val();
      comp.savetoCloud();
    })

    this.emitter.on('newMap', () => {
      this.showChooseMap();
    })
    this.emitter.on('changeData', (node) => {
      this.selectedNode = node;
      comp.savetoCloud();
    })

    this.emitter.on('loadMap', (mapType) => {
      console.log("loadMap: " + mapType)
      this.loadMap(mapType)
    })

    this.emitter.on('userLogged', (user) => {
      this.currentUser = user;
    })
    this.emitter.on('exportMap', () => {
      jsMind.util.file.save(jsMind.util.json.json2string(jm.get_data()), 'text/jsmind', jm.get_data().meta.name + '.json');
    })
    this.emitter.on('editing', (data) => {
      console.log("Editing: " + data)
      jm.options.shortcut.enable = !data
    })
    this.emitter.on('genDoc', (data) => {
      this.genDoc(data)
    })


    this.emitter.on('importMap', (data) => {
      jsMind.util.file.read(data, function (jsmind_data) {
        let mind = jsMind.util.json.string2json(jsmind_data);
        if (mind) {
          jm.show(mind);
          comp.savetoCloud();
        } else {
          // prompt_info('can not open this file as mindmap');
        }
      });
    })
    this.emitter.on('screenshotMap', () => {
      jm.screenshot.shootDownload()
    })
    this.emitter.on('zoomIn', () => {
      jm.view.zoomIn()
    })
    this.emitter.on('zoomOut', () => {
      jm.view.zoomOut()
    })
  }
  ,
  methods: {
    dataChange() {
      console.log("Changed")
      if (this.selectedNode.data) {
        this.selectedNode.data.usernote = $("#UserNotes").val();
        this.savetoCloud();
      }
    },
    showChooseMap() {
      this.loadMap(0)
      let modal = new Modal(document.getElementById('chooseMapModal'))
      modal.show({backdrop: 'static', keyboard: false})
    },
    loadMap(newmapType) {
      let mapID = utils.getMapID(this)
      let com = this;
      com.emitter.emit('showNode', jm.get_node('root'))
      com.emitter.emit('loadMapDone')
      if (newmapType != null) { //Create new Map
        if (newmapType == 0) {
          this.mind = this.template_Empty();
        } else if (newmapType == 1) {
          this.$i18n.locale = "vn"
          this.$router.push({query: {lang: this.$i18n.locale}})
          this.mind = this.template_Research();
          this.emitter.emit('changeLang', this.$i18n.locale)
        } else if (newmapType == 2) {
          this.$i18n.locale = "en"
          this.$router.push({query: {lang: this.$i18n.locale}})
          this.mind = this.template_Research();
          this.emitter.emit('changeLang', this.$i18n.locale)
        }
        checkNode(this.mind.data, 0)
        jm.show(this.mind);
      } else {
        let dbRef = ref(database, 'maps/' + mapID);
        onValue(dbRef, (snapshot) => {
          const data = snapshot.val();
          this.mind = data;
          if (this.mind) {
            if (this.mind.meta.version !== mindCurrentVer) {
              checkNode(this.mind.data, 0)
              jm.docType = this.mind.docType;
              jm.show(this.mind);
            }
          } else {  //Nếu chưa có
            this.showChooseMap();
          }
          if (this.firstTime) {
            this.firstTime = false;
          }
          this.addEventNode()
        });
      }
      this.addEventNode()
    },
    addEventNode() {
      let com = this;
      $("jmnode").click(function () {
        com.emitter.emit('showNode', jm.get_selected_node())
        com.selectedNode = jm.get_selected_node()
        jm.options.shortcut.enable = true
      })
      $("jmnode").on('keypress', function () {
        changeNodeColor(jm.get_selected_node(), true)
      });
    },
    savetoCloud(save = 1) {
      mindCurrentVer = utils.makeId(10);
      if (save === 1) {
        console.log("savetoCloud")
        let mind_data = jm.get_data();
        mind_data.meta.version = mindCurrentVer;
        let dbRef = ref(database, 'maps/' + utils.getMapID(this));
        set(dbRef, mind_data)
      }
    },
    copy_data(obj, data) {
      obj.docType = data.docType;
      obj.researchtitle = $("#title").val();
      obj.teacher_name = data.teacher_name;
      obj.authors = data.authors;
      obj.number_of_sample = data.number_of_sample;
      obj.language = data.language;
    },
    genDoc(data) {
      jm.get_node('root').data.authors = data.authors
      let root = jm.mind.get_node("root").data;
      this.copy_data(root, data)
      this.savetoCloud()
      let mind_data = jm.get_data();
      this.copy_data(mind_data.meta, data)

      let oReq = new XMLHttpRequest();
      oReq.open("POST", config.getBaseAPI() + "/api/v1/mapgendoc", true);
      oReq.responseType = "blob";
      oReq.setRequestHeader('Content-type', 'application/json; charset=utf-8');
      oReq.onload = function () {
        const blob = new Blob([oReq.response]);
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = root.researchtitle + ".docx";
        link.click();
      };
      oReq.send(JSON.stringify(mind_data));

    },
    template_Empty() {
      return {
        "meta": {
          "name": "Mind map",
          "version": "3svOUT8K7Y",
          "author": ""
        },
        "format": "node_tree",
        "data": {
          "id": "root",
          "topic": "Mind map",
          "researchtitle": "",
          "authors": [{"name": this.$t("Author name")}],
          "usernote": "",
          "isroot": true,
        }
      }
    },
    template_Research() {
      return {
        "meta": {
          "name": "Research",
          "version": "3svOUT8K7Y",
          "author": ""
        },
        "format": "node_tree",
        "data": {
          "id": "root",
          "topic": this.$t("Research name"),
          "researchtitle": "",
          "authors": [{"name": this.$t("Author name")}],
          "usernote": "",
          "isroot": true,
          "children": [
            {
              "id": "Keywords",
              "topic": this.$t("Keywords"),
              "direction": "right",
            },
            {
              "id": "Problems",
              "topic": this.$t("Problems"),
              "direction": "right",
              "children": [
                {
                  "id": "Problem 1",
                  "topic": this.$t("Problem") + " 1",
                },
                {
                  "id": "Problem 2",
                  "topic": this.$t("Problem") + " 2",
                },
                {
                  "id": "Problem 3",
                  "topic": this.$t("Problem") + " 3",
                }
              ]
            },
            {
              "id": "Solutions",
              "topic": this.$t("Solutions"),
              "direction": "right",
              "children": [
                {
                  "id": "Solution 1",
                  "topic": this.$t("Solution") + " 1"

                },
                {
                  "id": "Solution 2",
                  "topic": this.$t("Solution") + " 2"

                },
                {
                  "id": "Solution 3",
                  "topic": this.$t("Solution") + " 3"
                }
              ]
            },
            {
              "id": "Expected Findings",
              "topic": this.$t("Expected Findings"),
              "direction": "right"
            },
            {
              "id": "Abstract",
              "topic": this.$t("Abstract"),
              "direction": "left"
            },
            {
              "id": "Introduction",
              "topic": this.$t("Introduction"),
              "direction": "left"
            },
            {
              "id": "Literature",
              "topic": this.$t("Literature"),
              "direction": "left"
            },
            {
              "id": "Methodology",
              "topic": this.$t("Methodology"),
              "direction": "left"
            },
            {
              "id": "Results and Discussion",
              "topic": this.$t("Results and Discussion"),
              "direction": "left"
            },
            {
              "id": "Conclusion",
              "topic": this.$t("Conclusion"),
              "direction": "left"
            }
          ]
        }
      }
    }
  }
}


// function afterLogin(user) {
//   $(".user").removeClass("d-none")
//   $('#loginModal').modal('hide')
//   $('#btnLogin').addClass("d-none")
//   if (user.photoURL) {
//     $('#profilePicture').attr("src", user.photoURL)
//     $(".userName").hide();
//   } else {
//     $('#profilePicture').hide();
//     $(".userName").show();
//     $(".userName").text(user.displayName)
//     $(".userName").nameBadge()
//   }
//
//   $('#profileName').text(user.displayName)
//   $('#profileEmail').text(user.email)
//
//   enterRoom(user);
//   // if (window.location.pathname.startsWith("/room"))
//   //     enterRoom(user);
//   // else if (page === "mymaps")
//   //     loadLabs(user);
//   // else if (window.location.pathname.startsWith("/map"))
//   //     enterLab();
// }
// function enterRoom(user) {
//   realtime(user);
// }
// function realtime(user) {
//   //Check realtime
//
//   refUsers = firebase.database().ref('/maps/' + getMapID() + '/users');
//
//   refUsers.on('value', (snapshot) => {
//     const data = snapshot.val();
//     var count = []
//     var totalUser = 0;
//     $('#usersChat').empty()
//     var userinStep = "";
//     for (var uid in data) {
//       var step = data[uid].step;
//       if (count[step] == undefined)
//         count[step] = {count: 0, user: ""};
//       count[step].count++;
//       count[step].user = count[step].user + data[uid].name + "<br>";
//       totalUser++;
//
//       if (teacher) {  //For Teacher only
//         $('[id^=' + uid + ']').removeClass("yellow")
//         if (data[uid].isRaise) {
//           $("#" + uid + "_" + step).addClass("yellow")
//         }
//       }
//
//       //Add to chat room
//       // if (currentUser.uid != uid) {  //Kh
//       var avatar = "<img src='" + data[uid].photo + "' alt='user' width='40' height='40'  class='rounded-circle'>";
//       if (!data[uid].photo && data[uid].name) {
//         var avatar = "<div><div class='friend'>" + data[uid].name + "</div></div>"
//       }
//       $('#usersChat').append("<a href='#' onclick='showChat(this,\"" + uid + "\")' class=\"list-group-item list-group-item-action rounded-0 media uchat\">" + avatar + "<div class=\"media-body\">" + data[uid].name + "</div></a>")
//       if (!data[uid].photo && data[uid].name) {
//         $('.friend').nameBadge();
//       }
//       // }
//     }
//     // for (let i = 1; i <= getNumberOfSteps(); i++) {
//     //     if (count[i - 1] == undefined)
//     //         $('li:nth-child(' + i + ') > a > span.badge').addClass("invisible")
//     //     else {
//     //         $('li:nth-child(' + i + ') > a > span.badge').removeClass("invisible")
//     //         $('li:nth-child(' + i + ') > a > span.badge').text(count[i - 1].count);
//     //         $('li:nth-child(' + i + ') > a > span.badge').attr("user", count[i - 1].user)
//     //     }
//     // }
//
//     $('#numOnline').text(totalUser)
//   });
//
//   var leave = {};
//   leave[currentUser.uid] = null;
//   refUsers.onDisconnect().update(leave).then(function () {
//     console.log("update exit")
//   });
//   updateStep(getSelectedStep());
//   //Listen to Notification
//   var first = true;
//   firebase.database().ref('/notifies/' + currentUser.uid).on('value', (snapshot) => {
//     if (!first) {
//       const data = snapshot.val();
//       if (!$("#collapse-online").hasClass("show") || ($("#collapse-online").hasClass("show") && sendTo !== data.uid)) {
//         $("#toastTitle").text(data.uname);
//         $("#toastBody").text(data.message);
//         $('.toast').toast('show');
//       }
//     }
//     first = false;
//   });
//
//   var firstAll = true;
//   firebase.database().ref('/labs/' + getMapID() + '/notifies/all').on('value', (snapshot) => {
//     if (!firstAll) {
//       if (!$("#collapse-online").hasClass("show") || ($("#collapse-online").hasClass("show") && sendTo !== "all")) {
//         const data = snapshot.val();
//         $("#toastTitle").text("Chat room");
//         $("#toastBody").text(data.message);
//         $('.toast').toast('show');
//       }
//     }
//     firstAll = false;
//   });
//   // refUsers = firebase.database().ref('/labs/' + currentDocID + '/' + getRoomID() + '/users');
//   var leave = {};
//   leave[user.uid] = null;
//   var enter = {};
//   var curStep = new URL(window.location.href).hash.split("#")[1];
//   if (!curStep)
//     curStep = -1;
//
//   enter[user.uid] = {
//     step: curStep,
//     time: firebase.database.ServerValue.TIMESTAMP,
//     name: $("#profileName").text(),
//     photo: user.photoURL
//   };
//
//   firebase.database().ref('.info/connected').on('value', function (snapshot) {
//     if (snapshot.val() == false)
//       return;
//     refUsers.onDisconnect().update(leave).then(function () {
//       refUsers.update(enter)
//     });
//   });
// }


</script>

<style scoped>

#jsmind_container {
  min-height: 93vh;
}

</style>