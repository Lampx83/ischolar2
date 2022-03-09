<template>
  <div class="container row rounded-lg overflow-hidden shadow collapse" id="collapse-online" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <!-- Users box-->
    <div class="col-4 px-0 chat-leftside">
      <div class="messages-box">
        <div class="list-group rounded-0">
          <a class="list-group-item list-group-item-action active text-white rounded-0 media uchat" id="chat0">
            <img src="../../assets/images/people-fill.svg" alt="user" width="50" class="rounded-circle">
            <span class="media-body text-small">All</span>
          </a>
          <div id="usersChat">
            <template v-for="user in users" :key="user.key">
              <a class="list-group-item list-group-item-action rounded-0 media uchat"><img :src='user.photo' alt='user' width='40' height='40' class='rounded-circle'><span class="media-body text-small ps-1">{{
                  user.name
                }}</span></a>
            </template>
          </div>
        </div>
      </div>

    </div>
    <!-- Chat Box-->
    <div class="col-8 px-0 main-chat">
      <div class="px-4 pt-4 chat-box bg-white" id="chatMessages">
      </div>
      <!-- Typing area -->
      <div class="bg-light input-group">
        <input id="txtMessage" v-on:keyup.enter="sendMessage" type="text" autocomplete="off" placeholder="Type a message" aria-describedby="button-addon2" class="form-control rounded-0 border-0 bg-light">
        <div class="input-group-append">
          <button id="button-addon2" class="btn btn-link" @click="sendMessage">
            <img width="30" height="30" src="../../assets/images/send-button.svg"/>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery"

// var refChat;
// var sendTo;
import {database} from "@/firebase";
import {ref, onChildAdded, push, child, update, onValue, off} from "firebase/database";
import utils from "@/utils";

let comp = null;
let refChat;
let refUsers;
export default {
  name: "ChatBox",
  data() {
    return {
      currentUser: {},
      users: []
    }
  },
  mounted() {

    this.emitter.on('userLogged', (user) => {
      this.currentUser = user
      if (user) {  //Logged in
        comp = this;
        refUsers = ref(database, 'rooms/' + utils.getMapID(this) + "/users");
        onValue(refUsers, (snapshot) => {
          console.log("onValue")
          const data = snapshot.val();
          if (data) {
            this.users = data
            this.emitter.emit('chatUpdated', comp.users)
            // for (var uid in data) {
            //   let avatar = "<img src='" + data[uid].photo + "' alt='user' width='40' height='40'  class='rounded-circle'>";
            //   if (!data[uid].photo && data[uid].name) {
            //     avatar = "<div><div class='friend'>" + data[uid].name + "</div></div>"
            //   }
            //   $('#usersChat').append("<a onclick='showChat(this,\"" + uid + "\")' class=\"list-group-item list-group-item-action rounded-0 media uchat\">" + avatar + "<span class=\"media-body text-small ps-1\">" + data[uid].name + "</span></a>")
            //   if (!data[uid].photo && data[uid].name) {
            //     $('.friend').nameBadge();
            //   }
            // }
          }
        });
        if(refChat==null) {
          refChat = ref(database, 'rooms/' + utils.getMapID(this) + "/chats");
          onChildAdded(refChat, (data) => {
            this.showMessage(data.val());
          });
        }
      } else {
        if (refUsers) {
          off(refUsers)
          refUsers = null;
        }
        if (refChat) {
          off(refChat)
          refChat = null;
        }
      }
    })

  },
  methods: {
    showMessage(data) {
      if (this.currentUser.uid === data.uid)
        $('#chatMessages').append("<div class=\"ml-auto d-flex justify-content-end\"><div class=\"chat-body\"><div class=\"bg-primary rounded-pill py-2 px-3  text-white text-small\">" + data.message + "</div><span class=\"text-muted d-flex justify-content-end chat-time\">" + utils.time_ago(data.time) + "</span></div></div>\n")
      else {
        let avatar = "<img src=\"" + data.photo + "\" alt=\"user\" width=\"40\" height=\"40\"  class=\"rounded-circle\">";
        if (!data.photo && data.name) {
          avatar = "<div><div class=\"friend\">" + data.name + "</div></div>"
        }
        $('#chatMessages').append("<div class=\"media w-75 \">" + avatar + "<span class=\"media-body ml-3\"><span class=\"bg-light rounded-pill py-2 px-3\"><span class=\"text-small mb-0 text-muted\">" + data.message + "</span></span><p class=\"text-muted chat-time\">" + utils.time_ago(data.time) + "</p></span></div>");
        if (!data.photo && data.name) {
          $('.friend').nameBadge();
        }
      }
      var objDiv = document.getElementById("chatMessages");
      objDiv.scrollTop = objDiv.scrollHeight;
    },
    sendMessage() {
      if ($('#txtMessage').val().trim() !== "") {
        let updates = {};
        let key = push(child(ref(database), 'post')).key;
        updates['/rooms/' + utils.getMapID(this) + '/chats/' + key] = {
          uid: this.currentUser.uid,
          name: this.currentUser.displayName,
          photo: this.currentUser.photoURL,
          //time: firebase.database.ServerValue.TIMESTAMP,
          message: $('#txtMessage').val()
        };

        update(ref(database), updates);

        //if (sendTo === "all") {
        // var refUpdate = ref(database, '/maps/' + utils.getMapID(this) + '/notifies/all')
        // // } else {
        // //   refUpdate = ref(database, '/notifies/' + sendTo)
        // // }
        // set(refUpdate, {
        //   //  uid: this.currentUser.uid,
        //   // uname: this.currentUser.displayName,
        //   message: $('#txtMessage').val(),
        //   //time: firebase.database.ServerValue.TIMESTAMP
        // });
        $('#txtMessage').val("")

        // REMOVE OLD CHAT
        // const MAX_COUNT = 99;  //Keep 100 recent
        // refChat.once('value', function (snapshot) {
        //   if (snapshot.
        //   numChildren() > MAX_COUNT) {
        //     var childCount = 0;
        //     var updates = {};
        //     snapshot.forEach(function (child) {
        //       if (++childCount < snapshot.numChildren() - MAX_COUNT) {
        //         updates[child.key] = null;
        //       }
        //     });
        //     refChat.update(updates);
        //   }
        // });
      }
    }
  }
}


</script>

<style scoped>
#collapse-online {
  position: absolute;
  top: 80px;
  right: 30px;
  width: 660px;
  border-radius: 0.5rem;
  padding-left: 0px !important;
  padding-right: 0px !important;
  z-index: 1002;
}

.chat-leftside {
  background: #f5f5f5;
}

#collapse-online {
  position: absolute;
  top: 80px;
  right: 30px;
  width: 660px;
  border-radius: 0.5rem;
  padding-left: 0px !important;
  padding-right: 0px !important;
  z-index: 1002;
}

#collapse-profile {
  position: absolute;
  top: 80px;
  right: 30px;
  width: 350px;
  border-radius: 0.5rem;
  z-index: 1003;
  background: white;
}

@media (max-width: 600px) {
  #collapse-online {
    width: 100%;
    right: 0px;


  }
}


.profile {
  display: flex;
  flex-wrap: wrap;
}

.profile-info {
  margin-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
}

::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-track {
  width: 5px;
  background: #f5f5f5;
}

::-webkit-scrollbar-thumb {
  width: 1em;
  background-color: #ddd;
  outline: 1px solid slategrey;
  border-radius: 1rem;
}

.media {
  display: flex;
}

.ml-auto, .mx-auto {
  margin-left: auto !important;
}

.chat-time {
  font-size: 12px;
}

.media-body {
  width: 100%;
  margin: auto;
  padding-left: 10px;

}

.chat-body {
  text-align: right;
}

.chat-75 {
  max-width: 55%
}


.messages-box,
.chat-box {
  height: 510px;
  overflow-y: scroll;
}


input::placeholder {
  font-size: 0.9rem;
  color: #999;
}

.speech-bubble {
  position: fixed;
  background: #007bff;
  border-radius: 10px;
  padding: 10px;
  color: white;
}

.speech-bubble:after {
  content: '';
  position: absolute;
  left: 0;
  top: 15px;
  width: 0;
  height: 0;
  border: 8px solid transparent;
  border-right-color: #007bff;
  border-left: 0;
  border-top: 0;
  margin-top: -4px;
  margin-left: -8px;
}
</style>