<template>
  <div id="jsmind_container" class="col-md-9"></div>
</template>

<script>
import "jsmind/style/jsmind.css";
import jsMind from "jsmind"
import {database} from "@/firebase";
import {ref, onValue} from "firebase/database";


var mindCurrentVer = "";
var jm = null;
export default {
  name: "MindMap",
  setup() {

  },

  mounted() {
    var mind = {
      "meta": {},
      "data": {
        "id": "root",
        "topic": "...",
      }
    };
    var options = {
      container: 'jsmind_container',
      editable: true,
      theme: 'primary',
      keep_center: false
    }
    jm = jsMind.show(options, mind);
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if (params['action'] === "new") {
      //$('#addMapModal').modal('show')
    } else {
      loadLab(getMapID());
    }

    // var firstEnterRoom = true
    // $('#btnRoom').click(function () {
    //   if (firstEnterRoom) {
    //     showChat($('#chat0'), "all")
    //     firstEnterRoom = false;
    //   }
    // })

    // $("#UserNotes").change(function () {
    //   selectedNode.data.usernote = $("#UserNotes").val();
    //   savetoCloud();
    // })

    // var options = {
    //   container: "jsmind_container",
    //   editable: true,
    //   theme: "primary",
    // };
    // var jm = jsMind.show(options, mind);
    // jm.add_node("sub2", "sub23", "new node", {"background-color": "red"});
    // jm.set_node_color("sub21", "green", "#ccc");
  }
}

function loadLab(mapID) {






  var dbRef = ref(database,'maps/' + mapID);
  onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    if (data != null) {
      if (data.meta.version !== mindCurrentVer) {
        jm.show(data);
        jm.docType = data.docType;
      }
    } else {
      jm.show(template_English());
    }
  });
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


function getMapID() {
  // return "2M73DO"; //TODO test
  // return (new URL(window.location.href)).searchParams.get('room')
  var arr = (new URL(window.location.href)).pathname.split("/");
  var mapID = arr[arr.length - 1]
  if (mapID === "map.html")
    mapID = "2M73DO"
  return "2M73DO"
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
  min-height: 75vh;
}

</style>