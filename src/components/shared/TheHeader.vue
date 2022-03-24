<template>
  <nav class="navbar navbar-expand-sm navbar-dark bg-dark" id="header">
    <a class="navbar-brand" :href="'/#/map/' + this.$route.params.id + '?lang='+this.$route.query.lang">
      <img src="../../assets/images/graduation.svg" width="30" height="30" class="mr-2"/>iScholar
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav">
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown1" role="button"
             data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{ $t("File") }}</a>
          <div class="dropdown-menu" aria-labelledby="navbarDropdown1">
            <a class="dropdown-item" id="dropdown-item-new" @click="newMap">{{ $t("New") }}</a>
            <input id="file_input" style="display: none" type="file" @change="open_file"/>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" @click="exportMap">{{ $t("Export") }}</a>
            <a class="dropdown-item" @click="importMap">{{ $t("Import") }}</a>
            <a class="dropdown-item" @click="screenshotMap">{{ $t("Screenshot") }}</a>
          </div>
        </li>

        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown3" role="button"
             data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {{ $t("View") }}
          </a>
          <div class="dropdown-menu" aria-labelledby="navbarDropdown3">
            <a class="dropdown-item" @click="zoomIn">{{ $t("Zoom in") }}</a>
            <a class="dropdown-item" @click="zoomOut">{{ $t("Zoom out") }}</a>
          </div>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown4" role="button"
             data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {{ $t("Journal") }}
          </a>
          <div class="dropdown-menu" aria-labelledby="navbarDropdown3">
            <router-link class="dropdown-item" :to="'/publish/'+ this.$route.params.id + '?lang='+this.$route.query.lang">Scopus</router-link>
            <!--                    <a class="dropdown-item" href="?c=v">Local Journals</a>-->
            <!--                    <a class="dropdown-item" href="?c=c">Top Conferences</a>-->
          </div>
        </li>
      </ul>
      <ul class="navbar-nav ms-auto navbar-right">
        <LocaleSwitcher class="me-3"></LocaleSwitcher>
        <button v-if="currentUser" id="btnRoom" @click="showChat" type="button" class="btn btn-primary" data-bs-toggle="collapse" data-bs-target="#collapse-online">
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-people-fill me-1" viewBox="0 0 16 16">
            <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
            <path d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z"/>
            <path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
          </svg>
          <span class="hideSmall">{{ $t("Chat room") }}</span> <span class="badge badge-secondary bg-secondary" id="numOnline">0</span>
        </button>

        <button id="btnLogin" type="button" class="btn btn-primary me-auto" data-bs-toggle="modal" data-bs-target="#loginModal">Đăng nhập</button>
        <div class="dropdown">
          <img class="ms-2 rounded-circle user d-none p-1 profilePicture1" id="profilePicture" width="41"
               height="41" data-bs-toggle="dropdown">b
          <a href="#" data-bs-toggle="dropdown" data-offset="-90,20" class="profilePicture">
            <div class="ms-2 userName user d-none"></div>
          </a>
          <div class="dropdown-menu shadow-sm dropdown-menu-profile">
            <div class="profile-info">
              <div id="profileName" class="text-primary"></div>
              <div id="profileEmail"></div>
            </div>
            <div class="list-group list-group-flush">
              <a class="list-group-item list-group-item-action">Nghiên cứu của tôi</a>
              <a class="list-group-item list-group-item-action text-danger" id="signout" @click="signOut">Đăng xuất</a>
            </div>
          </div>
        </div>
      </ul>
    </div>

    <div class="modal fade login" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog login animated">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Đăng nhập với</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="close"></button>
          </div>
          <div class="modal-body">
            <div class="box">
              <div class="content">
                <div class="social">
                  <a id="google_login" class="circle google" @click="googleLogin">
                    <i class="bi bi-google"></i>
                  </a>
                  <a class="circle ">
                    <i class="bi bi-facebook"></i>
                  </a>
                  <a class="circle ">
                    <i class="bi bi-twitter"></i>
                  </a>
                </div>
                <div class="division">
                  <div class="line l"></div>
                  <span>hoặc</span>
                  <div class="line r"></div>
                </div>
                <div class="error"></div>
                <div class="form loginBox">
                  <form method="" action="" accept-charset="UTF-8">
                    <input id="email1" class="form-control" type="text" placeholder="Email" name="email">
                    <input id="password1" class="form-control" type="password" placeholder="Password" name="password">
                    <input class="btn btn-default btn-login" type="button" value="Đăng nhập" onclick="loginAjax()">
                  </form>
                </div>
              </div>
            </div>
            <div class="box">
              <div class="content registerBox" style="display:none;">
                <div class="form">
                  <form method="" html="{:multipart=>true}" data-remote="true" action=""
                        accept-charset="UTF-8">
                    <input id="name" class="form-control" type="text" placeholder="Họ và tên" name="name">
                    <input id="email2" class="form-control" type="text" placeholder="Email" name="email">
                    <input id="password2" class="form-control" type="password" placeholder="Mật khẩu"
                           name="password">
                    <input id="password_confirmation" class="form-control" type="password"
                           placeholder="Viết lại mật khẩu" name="password_confirmation">
                    <input class="btn btn-default btn-register" type="button" value="Đăng ký" name="commit"
                           onclick="createAccount()">
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <div class="forgot login-footer">
              <a href="javascript: showRegisterForm();" style="color: #0a53be">Tạo tài khoản</a>
            </div>
            <div class="forgot register-footer" style="display:none">
              <span>Đã có tài khoản</span>
              <a href="javascript: showLoginForm();" style="color: #0a53be">Đăng nhập</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
  <ChatBox/>
</template>
<script>

import 'bootstrap-icons/font/bootstrap-icons.css'
import {onValue, ref, onDisconnect, set, update, off} from "firebase/database";

import {database} from "@/firebase";
import $ from "jquery"
import {getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut} from "firebase/auth";
import utils from "@/utils";
import ChatBox from "@/components/fragments/ChatBox";
import LocaleSwitcher from "@/components/shared/LocaleSwitcher";


let comp = null;
var dbRef;
export default {
  name: 'NavigationBar',
  data() {
    return {
      logged: false,
      currentUser: null
    }
  },
  mounted() {
    comp = this;
    const auth = getAuth();
    onAuthStateChanged(auth, function (user) {
      console.log("onAuthStateChanged")
      comp.emitter.emit('userLogged', user)
      if (user) {  //Neu dang nhap roi
        comp.currentUser = user
        afterLogin(user);
        presence(user);
        comp.enterRoom(user)
      } else { //Neu chua dang nhap
        $('#btnLogin').removeClass("d-none")
      }
    });
    this.emitter.on('chatUpdated', (data) => {
      if (data)
        $('#numOnline').text(Object.keys(data).length)
    })

  },
  methods: {
    enterRoom(user) {
      dbRef = ref(database, 'rooms/' + utils.getMapID(this) + "/users");
      let leave = {};
      leave[user.uid] = null;

      let enter = {};
      enter[user.uid] = {
        //time: firebase.database.ServerValue.TIMESTAMP,
        name: user.displayName,
        photo: user.photoURL
      };

      onValue(ref(database, '.info/connected'), function (snapshot) {
        if (snapshot.val() == false)
          return;
        onDisconnect(dbRef).update(leave).then(function () {
          update(dbRef, enter)
        });
      });
    },
    signOut() {
      const auth = getAuth();
      signOut(auth).then(() => {
        $('.user').addClass("d-none");
        $('#btnLogin').text("Đăng nhập");
        $('#btnLogin').addClass("rounded")
        $('#profilePicture').addClass("d-none")
        $('#btnLogin').removeClass("d-none")
        $('#collapse-profile').removeClass("show")
        var userStatusDatabaseRef = ref(database, '/status/' + this.currentUser.uid);
        var isOfflineForDatabase = {
          state: 'offline',
          // last_changed:  firebase.database.ServerValue.TIMESTAMP,
        };
        set(userStatusDatabaseRef, isOfflineForDatabase)
        if (dbRef) {
          let leave = {};
          leave[this.currentUser.uid] = null;
          update(dbRef, leave);
          // sendNotify("all", null, TOAST_LEAVE_ROOM);
          $('#main').hide();
          $('#drawer').hide();
          $('.room').addClass("d-none")
          if (dbRef)
            off(dbRef)
        }
        this.currentUser = null;
      });
    },
    googleLogin() {
      $('#close').click();
      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      signInWithPopup(auth, provider)
          .then((result) => {
            this.currentUser = result.user;
            presence(result.user)
            afterLogin(result.user);
          }).catch(() => {
      });
    },
    newMap() {
      console.log("New Map")
      let newRoom = utils.makeId(6);
      this.$router.push({path:'/map/' +newRoom, query: {lang: this.$route.query.lang}})
      this.emitter.emit('newMap', newRoom)
    },
    exportMap() {
      this.emitter.emit('exportMap')
    },
    importMap() {
      // this.emitter.emit('importMap')
      $("#file_input:hidden").trigger('click');
    },
    screenshotMap() {
      this.emitter.emit('screenshotMap')
    },
    open_file() {
      let files = document.getElementById('file_input').files;
      if (files.length > 0)
        this.emitter.emit('importMap', files[0])
    },
    zoomIn() {
      this.emitter.emit('zoomIn')
    },
    zoomOut() {
      this.emitter.emit('zoomOut')
    },
    showChat() {
      var firstEnterRoom = true

      if (firstEnterRoom) {
        this.emitter.emit('showChat')
        firstEnterRoom = false;
      }
    }
  },
  components: {
    ChatBox,
    LocaleSwitcher
  }
}


function afterLogin(user) {
  $(".user").removeClass("d-none")
  //$('#loginModal').modal('hide')
  $('#btnLogin').addClass("d-none")
  if (user.photoURL) {
    $('#profilePicture').removeClass("d-none")
    $('#profilePicture').attr("src", user.photoURL)
    $(".userName").hide();
  } else {
    $('#profilePicture').hide();
    $(".userName").show();
    $(".userName").text(user.displayName)
    $(".userName").nameBadge()
  }
  $('#profileName').text(user.displayName)
  $('#profileEmail').text(user.email)

  //enterRoom(user);
  // if (window.location.pathname.startsWith("/room"))
  //     enterRoom(user);
  // else if (page === "mymaps")
  //     loadLabs(user);
  // else if (window.location.pathname.startsWith("/map"))
  //     enterLab();
}


function presence(user) {
  var uid = user.uid;
  var userStatusDatabaseRef = ref(database, '/status/' + uid);
  var isOfflineForDatabase = {
    state: 'offline',
    // last_changed: firebase.database().ServerValue.TIMESTAMP,
    uname: user.displayName
  };
  var isOnlineForDatabase = {
    state: 'online',
    // last_changed: firebase.database.ServerValue.TIMESTAMP,
    uname: user.displayName
  };
  const dbRef = ref(database, '.info/connected')
  onValue(dbRef, function (snapshot) {
    if (snapshot.val() == false)
      return;
    onDisconnect(userStatusDatabaseRef).set(isOfflineForDatabase).then(function () {
      set(userStatusDatabaseRef, isOnlineForDatabase)
    });
  });
}
</script>

<style scoped>


.animated {
  -webkit-animation-duration: 1s;
  -moz-animation-duration: 1s;
  -o-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  -moz-animation-fill-mode: both;
  -o-animation-fill-mode: both;
  animation-fill-mode: both;
}

.animated.hinges {
  -webkit-animation-duration: 2s;
  -moz-animation-duration: 2s;
  -o-animation-duration: 2s;
  animation-duration: 2s;
}

.animated.slow {
  -webkit-animation-duration: 3s;
  -moz-animation-duration: 3s;
  -o-animation-duration: 3s;
  animation-duration: 3s;
}

.animated.snail {
  -webkit-animation-duration: 4s;
  -moz-animation-duration: 4s;
  -o-animation-duration: 4s;
  animation-duration: 4s;
}

@-webkit-keyframes shake {
  0%, 100% {
    -webkit-transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    -webkit-transform: translateX(-10px);
  }
  20%, 40%, 60%, 80% {
    -webkit-transform: translateX(10px);
  }
}

@-moz-keyframes shake {
  0%, 100% {
    -moz-transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    -moz-transform: translateX(-10px);
  }
  20%, 40%, 60%, 80% {
    -moz-transform: translateX(10px);
  }
}

@-o-keyframes shake {
  0%, 100% {
    -o-transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    -o-transform: translateX(-10px);
  }
  20%, 40%, 60%, 80% {
    -o-transform: translateX(10px);
  }
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-10px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(10px);
  }
}

.shake {
  -webkit-animation-name: shake;
  -moz-animation-name: shake;
  -o-animation-name: shake;
  animation-name: shake;
}

.login .modal-dialog {
  width: 350px;
}

.login .modal-footer {
  border-top: 0;
  margin-top: 0px;
  padding: 10px 20px 20px;
}

.login .modal-header {
  border: 0 none;
  padding: 15px 15px 15px;
  /*     padding: 11px 15px; */
}

.login .modal-body {
  /*     background-color: #eeeeee; */
}

.login .division {
  float: none;
  margin: 0 auto 18px;
  overflow: hidden;
  position: relative;
  text-align: center;
  width: 100%;
}

.login .division .line {
  border-top: 1px solid #DFDFDF;
  position: absolute;
  top: 10px;
  width: 34%;
}

.login .division .line.l {
  left: 0;
}

.login .division .line.r {
  right: 0;
}

.login .division span {
  color: #424242;
  font-size: 17px;
}

.login .box .social {
  float: none;
  margin: 0 auto 30px;
  text-align: center;
}

.login .social .circle {
  background-color: #EEEEEE;
  color: #FFFFFF;
  border-radius: 100px;
  width: 60px;
  height: 60px;
  display: inline-block;
  margin: 0 10px;
  padding: 10px;
}

.login .social .circle .bi {
  font-size: 28px;
}

.login .social .facebook {
  background-color: #455CA8;
  color: #FFFFFF;
}

.login .social .google {
  background-color: #F74933;
}

.login .social .github {
  background-color: #403A3A;
}

.login .facebook:hover {
  background-color: #6E83CD;
}

.login .google:hover {
  background-color: #FF7566;
}

.login .github:hover {
  background-color: #4D4D4d;;
}

.login .forgot {
  color: #797979;
  margin-left: 0;
  overflow: hidden;
  text-align: center;
  width: 100%;
}

.login .btn-login, .registerBox .btn-register {
  background-color: #00BBFF;
  border-color: #00BBFF;
  border-width: 0;
  color: #FFFFFF;
  display: block;
  margin: 0 auto;
  padding: 15px 50px;
  text-transform: uppercase;
  width: 100%;
}

.login .btn-login:hover, .registerBox .btn-register:hover {
  background-color: #00A4E4;
  color: #FFFFFF;
}

.login .form-control {
  border-radius: 3px;
  background-color: rgba(0, 0, 0, 0.09);
  box-shadow: 0 1px 0px 0px rgba(0, 0, 0, 0.09) inset;
  color: #FFFFFF;
}

.login .form-control:hover {
  background-color: rgba(0, 0, 0, .16);
}

.login .form-control:focus {
  box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.04) inset;
  background-color: rgba(0, 0, 0, 0.23);
  color: #FFFFFF;
}

.login .box .form input[type="text"], .login .box .form input[type="password"] {
  border-radius: 3px;
  border: none;
  color: #333333;
  font-size: 16px;
  height: 46px;
  margin-bottom: 5px;
  padding: 13px 12px;
  width: 100%;
}


@media (max-width: 400px) {
  .login .modal-dialog {
    width: 100%;
  }
}

.big-login, .big-register {
  background-color: #00bbff;
  color: #FFFFFF;
  border-radius: 7px;
  border-width: 2px;
  font-size: 14px;
  font-style: normal;
  font-weight: 200;
  padding: 16px 60px;
  text-transform: uppercase;
  transition: all 0.3s ease 0s;
}

.big-login:hover {
  background-color: #00A4E4;
  color: #FFFFFF;
}

.big-register {
  background-color: rgba(0, 0, 0, .0);
  color: #00bbff;
  border-color: #00bbff;
}

.big-register:hover {
  border-color: #00A4E4;
  color: #00A4E4;
}

.dropdown-menu-profile {
  left: -140px !important;
  margin-top: 20px !important;

}

.profile-info {
  padding: 10px;
  text-align: center;
}

#profileEmail {
  font-size: 13px;
  margin-bottom: 10px;
}


</style>