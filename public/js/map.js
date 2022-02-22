var refUsers;
var refChat;
var chatroom;
var sendTo;

var teacher = false;

function savetoCloud(save = 1) {
    mindCurrentVer = makeid(10);
    if (save === 1) {
        var mind_data = jm.get_data();
        mind_data.meta.version = mindCurrentVer;
        var db = firebase.database();
        db.ref('maps/' + getMapID()).set(mind_data);
    }
}

function sendMessage() {
    if ($('#txtMessage').val().trim() !== "") {
        var change = {};
        change[refChat.push().key] = {
            uid: currentUser.uid,
            name: currentUser.displayName,
            photo: currentUser.photoURL,
            time: firebase.database.ServerValue.TIMESTAMP,
            message: $('#txtMessage').val()
        };
        refChat.update(change);
        var ref;
        if (sendTo === "all") {
            ref = firebase.database().ref('/maps/' + getMapID() + '/notifies/all')
        } else {
            ref = firebase.database().ref('/notifies/' + sendTo)
        }
        ref.set({
            uid: currentUser.uid,
            uname: currentUser.displayName,
            message: $('#txtMessage').val(),
            time: firebase.database.ServerValue.TIMESTAMP
        });
        $('#txtMessage').val("")

        //REMOVE OLD CHAT
        const MAX_COUNT = 99;  //Keep 100 recent
        refChat.once('value', function (snapshot) {
            if (snapshot.numChildren() > MAX_COUNT) {
                var childCount = 0;
                var updates = {};
                snapshot.forEach(function (child) {
                    if (++childCount < snapshot.numChildren() - MAX_COUNT) {
                        updates[child.key] = null;
                    }
                });
                refChat.update(updates);
            }
        });
    }
}
$(function () {

    page = "map";

    var options = {
        container: 'jsmind_container',
        editable: true,
        theme: 'primary',
        keep_center: false
    }
   var jm = jsMind.show(options, null);

    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if (params['action'] === "new") {
        $('#addMapModal').modal('show')
    } else {
        loadLab(getMapID());
    }

    var firstEnterRoom = true
    $('#btnRoom').click(function () {
        if (firstEnterRoom) {
            showChat($('#chat0'), "all")
            firstEnterRoom = false;
        }
    })

    $("#UserNotes").change(function () {
        selectedNode.data.usernote = $("#UserNotes").val();
        savetoCloud();
    })
});


function showChat(me, uid) {
    sendTo = uid;
    if (refChat != null)
        refChat.off()
    $('#chatMessages').empty();
    if (uid === "all") {
        refChat = firebase.database().ref('/maps/' + getMapID() + '/chats/all/');
        chatroom = uid;
    } else {
        if (uid > currentUser.uid)
            chatroom = uid + "-" + currentUser.uid;
        else
            chatroom = currentUser.uid + "-" + uid
        refChat = firebase.database().ref('/chats/' + chatroom);  //Private chat
    }
    refChat.on('child_added', (data) => {
        showMessage(data.val());
    });
    $(".uchat").removeClass("active text-white")
    $(me).addClass("active text-white")
}


function realtime(user) {
    //Check realtime

    refUsers = firebase.database().ref('/maps/' + getMapID() + '/users');

    refUsers.on('value', (snapshot) => {
        const data = snapshot.val();
        var count = []
        var totalUser = 0;
        $('#usersChat').empty()
        var userinStep = "";
        for (var uid in data) {
            var step = data[uid].step;
            if (count[step] == undefined)
                count[step] = {count: 0, user: ""};
            count[step].count++;
            count[step].user = count[step].user + data[uid].name + "<br>";
            totalUser++;

            if (teacher) {  //For Teacher only
                $('[id^=' + uid + ']').removeClass("yellow")
                if (data[uid].isRaise) {
                    $("#" + uid + "_" + step).addClass("yellow")
                }
            }

            //Add to chat room
            // if (currentUser.uid != uid) {  //Kh
            var avatar = "<img src='" + data[uid].photo + "' alt='user' width='40' height='40'  class='rounded-circle'>";
            if (!data[uid].photo && data[uid].name) {
                var avatar = "<div><div class='friend'>" + data[uid].name + "</div></div>"
            }
            $('#usersChat').append("<a href='#' onclick='showChat(this,\"" + uid + "\")' class=\"list-group-item list-group-item-action rounded-0 media uchat\">" + avatar + "<div class=\"media-body\">" + data[uid].name + "</div></a>")
            if (!data[uid].photo && data[uid].name) {
                $('.friend').nameBadge();
            }
            // }
        }
        // for (let i = 1; i <= getNumberOfSteps(); i++) {
        //     if (count[i - 1] == undefined)
        //         $('li:nth-child(' + i + ') > a > span.badge').addClass("invisible")
        //     else {
        //         $('li:nth-child(' + i + ') > a > span.badge').removeClass("invisible")
        //         $('li:nth-child(' + i + ') > a > span.badge').text(count[i - 1].count);
        //         $('li:nth-child(' + i + ') > a > span.badge').attr("user", count[i - 1].user)
        //     }
        // }

        $('#numOnline').text(totalUser)
    });

    var leave = {};
    leave[currentUser.uid] = null;
    refUsers.onDisconnect().update(leave).then(function () {
        console.log("update exit")
    });
    updateStep(getSelectedStep());
    //Listen to Notification
    var first = true;
    firebase.database().ref('/notifies/' + currentUser.uid).on('value', (snapshot) => {
        if (!first) {
            const data = snapshot.val();
            if (!$("#collapse-online").hasClass("show") || ($("#collapse-online").hasClass("show") && sendTo !== data.uid)) {
                $("#toastTitle").text(data.uname);
                $("#toastBody").text(data.message);
                $('.toast').toast('show');
            }
        }
        first = false;
    });

    var firstAll = true;
    firebase.database().ref('/labs/' + getMapID() + '/notifies/all').on('value', (snapshot) => {
        if (!firstAll) {
            if (!$("#collapse-online").hasClass("show") || ($("#collapse-online").hasClass("show") && sendTo !== "all")) {
                const data = snapshot.val();
                $("#toastTitle").text("Chat room");
                $("#toastBody").text(data.message);
                $('.toast').toast('show');
            }
        }
        firstAll = false;
    });
    // refUsers = firebase.database().ref('/labs/' + currentDocID + '/' + getRoomID() + '/users');
    var leave = {};
    leave[user.uid] = null;
    var enter = {};
    var curStep = new URL(window.location.href).hash.split("#")[1];
    if (!curStep)
        curStep = -1;

    enter[user.uid] = {
        step: curStep,
        time: firebase.database.ServerValue.TIMESTAMP,
        name: $("#profileName").text(),
        photo: user.photoURL
    };

    firebase.database().ref('.info/connected').on('value', function (snapshot) {
        if (snapshot.val() == false)
            return;
        refUsers.onDisconnect().update(leave).then(function () {
            refUsers.update(enter)
        });
    });
}



function enterRoom(user) {
    realtime(user);
}

function getMapID() {
    // return "2M73DO"; //TODO test
    // return (new URL(window.location.href)).searchParams.get('room')
    var arr = (new URL(window.location.href)).pathname.split("/");
    var mapID = arr[arr.length - 1]
    if (mapID === "map.html")
        mapID = "2M73DO"
    return mapID
}



function new_map() {
    $('#addMapModal').modal('show')
}

function showMessage(data) {
    if (currentUser.uid === data.uid)
        $('#chatMessages').append("<div class=\"ml-auto d-flex justify-content-end\"><div class=\"chat-body\"><div class=\"bg-primary rounded-pill py-2 px-3  text-white text-small\">" + data.message + "</div><span class=\"text-muted d-flex justify-content-end chat-time\">" + time_ago(data.time) + "</span></div></div>\n")
    else {
        var avatar = "<img src=\"" + data.photo + "\" alt=\"user\" width=\"40\" height=\"40\"  class=\"rounded-circle\">";
        if (!data.photo && data.name) {
            var avatar = "<div><div class=\"friend\">" + data.name + "</div></div>"
        }
        $('#chatMessages').append("<div class=\"media w-75 \">" + avatar + "<div class=\"media-body ml-3\"><div class=\"bg-light rounded-pill py-2 px-3\"><span class=\"text-small mb-0 text-muted\">" + data.message + "</span></div><p class=\"text-muted chat-time\">" + time_ago(data.time) + "</p></div></div>");
        if (!data.photo && data.name) {
            $('.friend').nameBadge();
        }
    }
    var objDiv = document.getElementById("chatMessages");
    objDiv.scrollTop = objDiv.scrollHeight;
}

function loadLab(mapID) {
    var db = firebase.database();
    var ref = db.ref('maps/' + mapID);
    ref.on('value', (snapshot) => {
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

var oldStep = -1;
var oldTime = 0;

function updateStep(step) {
    var db = firebase.firestore();
    var newTime = Math.floor(Date.now() / 1000);
    var duration = newTime - oldTime;

    if (duration > 15 && duration < 1800) {
        var userRef = db.collection("maps").doc(getMapID()).collection("logs").doc(currentUser.uid).collection("steps")
        userRef.add({
            time: firebase.firestore.FieldValue.serverTimestamp(),
            enter: step,
            leave: oldStep,
            duration: duration
        })
    }

    if (currentUser != null) {
        var change = {};
        change[currentUser.uid] = {
            step: step,
            time: firebase.database.ServerValue.TIMESTAMP,
            name: $("#profileName").text(),
            photo: currentUser.photoURL
        };

        refUsers.update(change);
    }
    oldStep = step
    oldTime = Math.floor(Date.now() / 1000);
}

function getSelectedStep() {
    return 1;
}
