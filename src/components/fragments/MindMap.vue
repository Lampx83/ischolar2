<template>
  <div id="jsmind_container" class="col-md-9"></div>
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
import axios from "axios";
import utils from "@/utils";
//let baseAPI = "https://localhost"
let baseAPI = "https://www.vncodelab.com"
let mindCurrentVer = "";

let jm = null

export default {
  name: "MindMap",
  data() {
    return {
      currentUser: {},
      id: this.$route.params.id,
      selectedNode: {},
      mind: {
        "meta": {},
        "data": {
          "id": "root",
          "topic": "...",
        }
      }
    }
  },
  watch: {
    '$route'(to) {
      this.id = to.params.id
      this.loadLab(utils.getMapID(this));
    }
  },
  mounted() {
    let comp = this;
    const options = {
      container: 'jsmind_container',
      editable: true,

      theme: 'primary',
      keep_center: false
    }
    jm = jsMind.show(options, this.mind);

    jm.add_event_listener((data) => {
      if (data == jsMind.event_type.show)
        console.log("show")
      else if (data == jsMind.event_type.resize)
        console.log("resize")
      else if (data == jsMind.event_type.select)
        console.log("select")
      else if (data == jsMind.event_type.edit) {
        console.log("edit")
        this.savetoCloud()
      }
    })
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if (params['action'] === "new") {
      //$('#addMapModal').modal('show')
    } else {
      this.loadLab(utils.getMapID(this));
    }

    $("#UserNotes").change(function () {
      comp.selectedNode.data.usernote = $("#UserNotes").val();
      comp.savetoCloud();
    })
    this.emitter.on('userLogged', (user) => {
      this.currentUser = user;

    })
    this.emitter.on('exportMap', () => {
      jsMind.util.file.save(jsMind.util.json.json2string(jm.get_data()), 'text/jsmind', jm.get_data().meta.name + '.json');
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


  },
  methods: {

    showNode(nodeElement) {
      let node = jm.get_node(nodeElement.getAttribute("nodeid"))
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


      let mainNode;
      // if (node.level >= 1) {
      //   if (node.level == 1)
      //     mainNode = node;
      //   else
      mainNode = getMainNode(node);

      if (getNodeLevel(mainNode) == 2) {
        console.log("Enter")
        axios.get(baseAPI + "/api/v1/phrases/?sectionID=" + mainNode.id).then(
            response => {
              console.log("Enter2")
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
            }
        )
      }
    },
    loadLab(mapID) {
      let com = this;
      let dbRef = ref(database, 'maps/' + mapID);
      onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        this.mind = data;
        if (this.mind) {
          if (this.mind.meta.version !== mindCurrentVer) {
            jm.show(this.mind);
            jm.docType = this.mind.docType;
          }
        } else {
          jm.show(template_English());
        }
        $("jmnode").click(function () {
          com.showNode(this)
        })
      });
    },
    savetoCloud(save = 1) {
      mindCurrentVer = utils.makeId(10);
      if (save === 1) {
        var mind_data = jm.get_data();
        mind_data.meta.version = mindCurrentVer;
        var dbRef = ref(database, 'maps/' + utils.getMapID(this));
        set(dbRef, mind_data)
      }
    }
  }
}


function template_English() {
  return {
    "meta": {
      "name": "Research",
      "author": "Lampx",
      "version": "3svOUT8K7Y"
    },
    "format": "node_tree",
    "data": {
      "id": "root",
      "topic": "Research name",
      "usernote": "Research topic",
      "level": 0,
      "children": [
        {
          "id": "keyword",
          "topic": "Keywords",
          "direction": "right",
        },
        {
          "id": "Problems",
          "topic": "Problems",
          "direction": "right",
          "children": [
            {
              "id": "problem1",
              "topic": "Problem 1",
            },
            {
              "id": "problem2",
              "topic": "Problem 2",
            },
            {
              "id": "problem3",
              "topic": "Problem 3",
            }
          ]
        },
        {
          "id": "method",
          "topic": "Solutions",
          "direction": "right",
          "children": [
            {
              "id": "method1",
              "topic": "Solution 1"
            },
            {
              "id": "method2",
              "topic": "Solution 2"
            },
            {
              "id": "method3",
              "topic": "Solution 3"
            }
          ]
        },
        {
          "id": "Findings",
          "topic": "Findings",
          "direction": "right"
        },
        {
          "id": "Abstract",
          "topic": "Abstract",
          "direction": "left"
        },
        {
          "id": "Introduction",
          "topic": "Introduction",
          "direction": "left"
        },
        {
          "id": "Literature",
          "topic": "Literature",
          "direction": "left"
        },
        {
          "id": "Methodology",
          "topic": "Methodology",
          "direction": "left"
        },
        {
          "id": "Results and Discussion",
          "topic": "Results and Discussion",
          "direction": "left"
        },
        {
          "id": "Conclusion",
          "topic": "Conclusion",
          "direction": "left"
        }
      ]
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
function getMainNode(node) {
  while (getNodeLevel(node) != 2) {
    node = node.parent;
  }
  return node;
}

function getNodeLevel(node) {
  let depth = 1;
  while (!node.isroot) {
    depth++;
    node = node.parent;
  }
  return depth;
}


</script>

<style scoped>

#jsmind_container {
  min-height: 75vh;
}

</style>