var firebaseConfig = {
    apiKey: "AIzaSyB3_V4obMmp-1t4T5yF1mP4hipDpCOrGVE",
    authDomain: "ischolar-ae472.firebaseapp.com",
    databaseURL: "https://ischolar-ae472.firebaseio.com",
    projectId: "ischolar",
    storageBucket: "ischolar.appspot.com",
    messagingSenderId: "732226969363",
    appId: "1:732226969363:web:124050a7ce4c9a007444e6"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var jm = null;
var selectedNode = null;
var dragging = false;
var mindCurrentVer = "";
//let baseAPI = "https://localhost"
let baseAPI = "https://www.vncodelab.com"

$(function () {  //On Ready
    $(document).keydown(function (objEvent) {
        if (objEvent.keyCode == 9) {  //tab pressed
            objEvent.preventDefault(); // stops its action
        }
    })

    $("#upload_link").on('click', function (e) {
        e.preventDefault();
        $("#file_input:hidden").trigger('click');
    });


    $("#create-user").button().on("click", function () {
        dialog.dialog("open");
    });

    $('#btnLogin').click(function (e) {
        openLoginModal();
    });

   

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {  //Neu dang nhap roi
            currentUser = user;
            afterLogin(user);
            presence(user);
        } else { //Neu chua dang nhap
            $('#btnLogin').removeClass("d-none")
            if (((window.location.pathname.startsWith("/room")) || (window.location.pathname.startsWith("/mylabs")))) //Bat buoc phai dang nhap
                $('#loginModal').modal('show')  //Hien form dang nhap

          //  afterNotLogin();
        }
    });


    $(document).mouseup('#dragbar', function (e) {
        if (dragging) {
            var percentage = (e.pageX / window.innerWidth) * 100;
            if (percentage > 95)
                percentage = 95;
            var mainPercentage = 100 - percentage;

            $('#jsmind_container').css("width", percentage + "%");
            $('#rightpanel').css("width", mainPercentage + "%");
            $('#ghostbar').remove();
            $(document).unbind('mousemove');
            dragging = false;
        }
    });

    $("#report_type").on("change", function () {
        $("#type1").hide();
        $("#type2").hide();
        if ($(this).val() === "type1") {
            $("#type1").show();
            jm.docType = 1;
        } else if ($(this).val() === "type2") {
            $("#type2").show();
            jm.docType = 2;
        }
    })
});

function openLoginModal() {
    $('#loginModal .registerBox').fadeOut('fast', function () {
        $('.loginBox').fadeIn('fast');
        $('.register-footer').fadeOut('fast', function () {
            $('.login-footer').fadeIn('fast');
        });
        $('.modal-title').html('Đăng nhập với');
    });
    $('.error').removeClass('alert alert-danger').html('');
    setTimeout(function () {
        $('#loginModal').modal('show');
    }, 230);
}

function createMap() {
    var template = $("#template-select").prop('selectedIndex');
    if (template == 0) {
        jm.show(template_English());
    } else if (template == 1) {
        jm.show(template_Vietnamese());
    }
}


function editingNotes() {
    return $("#UserNotes").is(":focus");
}


function open_file() {
    var file_input = document.getElementById('file_input');
    var files = file_input.files;
    if (files.length > 0) {
        var file_data = files[0];
        jsMind.util.file.read(file_data, function (jsmind_data, jsmind_name) {
            var mind = jsMind.util.json.string2json(jsmind_data);
            if (!!mind) {
                jm.show(mind);
            } else {
                prompt_info('can not open this file as mindmap');
            }
        });
    } else {
        prompt_info('please choose a file first')
    }
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++)
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    return result;
}

function download_file() {
    var mind_data = jm.get_data();
    var mind_name = mind_data.meta.name;
    var mind_str = jsMind.util.json.json2string(mind_data);
    jsMind.util.file.save(mind_str, 'text/jsmind', mind_name + '.json');
}

function zoomIn() {
    if (jm.view.zoomIn()) {
        zoomOutButton.disabled = false;
    } else {
        zoomInButton.disabled = true;
    }
};

function zoomOut() {
    if (jm.view.zoomOut()) {
        zoomInButton.disabled = false;
    } else {
        zoomOutButton.disabled = true;
    }
}

function screen_shot() {
    jm.screenshot.shootDownload();
}



function generateDoc() {
    var myModal = new bootstrap.Modal(document.getElementById('myModal'))
    myModal.show()
}

function genDoc() {

    var valid = true;

    if ($("#title").val().trim() === "") {
        $("#title").addClass("is-invalid")
        valid = false
    } else {
        $("#title").removeClass("is-invalid")
        $("#title").addClass("is-valid")
    }

    if ($("#author_name").val().trim() === "") {
        $("#author_name").addClass("is-invalid")
        valid = false
    } else {
        $("#author_name").removeClass("is-invalid")
        $("#author_name").addClass("is-valid")
    }

    if (valid) {
        var mind_data = jm.get_data();
        mind_data.docType = jm.docType;
        mind_data.meta.title = $("#title").val();
        mind_data.meta.student_name = $("#student_name").val();
        mind_data.meta.teacher_name = $("#teacher_name").val();
        mind_data.meta.author_name = $("#author_name").val();
        mind_data.meta.author_email = $("#author_email").val();
        mind_data.meta.number_of_sample = $("#number_of_sample").val();
        mind_data.meta.language = $("#language").val();
        let oReq = new XMLHttpRequest();
        oReq.open("POST", baseAPI + "/api/v1/mapgendoc", true);
        oReq.responseType = "blob";
        oReq.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        oReq.onload = function () {
            const blob = new Blob([oReq.response]);
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = mind_data.meta.title + ".docx";
            link.click();
        };

        oReq.send(JSON.stringify(mind_data));
    }
}

function showNode(node) {
    $("#nodeContent").empty();
    if (node != null && node.level === undefined) { //root
        // var dialog = $("#dialog-form").dialog({
        //     autoOpen: false,
        //     height: 400,
        //     width: 350,
        //     modal: true,
        //     buttons: {
        //
        //         Cancel: function () {
        //             dialog.dialog("close");
        //         }
        //     },
        //     close: function () {
        //         form[0].reset();
        //         allFields.removeClass("ui-state-error");
        //     }
        // });
        $("#nodeContent").html("<a href = '#' onclick='generateDoc()'>Generate Document</a>");

    }

    if (node != null && node.data != null && node.data.usernote != null)
        $("#UserNotes").val(node.data.usernote);
    else
        $("#UserNotes").val("");
    selectedNode = node;

    let mainNode;
    if (node.level >= 1) {
        if (node.level == 1)
            mainNode = node;
        else
            mainNode = getMainNode(node);
        $.ajax({
            type: "GET",
            url: baseAPI + "/api/v1/phrases/?sectionID=" + mainNode.id,
            crossDomain: true,
            contentType: "application/json",
            dataType: 'json',
            success: function (response) {
                let s = "<div class='panel-group' id='accordion'>";
                for (let i = 0; i <= response.length - 1; i++) {
                    const item = response[i];
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
        });
    }
}

function setLanguage(lang) {
    window.location.replace('?lang=' + lang);
}

function afterLogin(user) {
    $(".user").removeClass("d-none")
    $('#loginModal').modal('hide')
    $('#btnLogin').addClass("d-none")
    if (user.photoURL) {
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

    enterRoom(user);
    // if (window.location.pathname.startsWith("/room"))
    //     enterRoom(user);
    // else if (page === "mymaps")
    //     loadLabs(user);
    // else if (window.location.pathname.startsWith("/map"))
    //     enterLab();
}

function presence(user) {
    var uid = user.uid;
    var userStatusDatabaseRef = firebase.database().ref('/status/' + uid);
    var isOfflineForDatabase = {
        state: 'offline',
        last_changed: firebase.database.ServerValue.TIMESTAMP,
        uname: user.displayName
    };
    var isOnlineForDatabase = {
        state: 'online',
        last_changed: firebase.database.ServerValue.TIMESTAMP,
        uname: user.displayName
    };
    firebase.database().ref('.info/connected').on('value', function (snapshot) {
        if (snapshot.val() == false)
            return;
        userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function () {
            userStatusDatabaseRef.set(isOnlineForDatabase);
        });
    });
}


function time_ago(time1) {
    time = new Date(time1);
    return TimeAgo.inWords(time.getTime());
}

var TimeAgo = (function () {
    var self = {};
    // Public Methods
    self.locales = {
        prefix: '',
        sufix: 'ago',
        seconds: 'less than a min',
        minute: 'about a minute',
        minutes: '%d minutes',
        hour: 'about an hour',
        hours: 'about %d hours',
        day: 'a day',
        days: '%d days',
        month: 'about a month',
        months: '%d months',
        year: 'about a year',
        years: '%d years'
    };

    self.inWords = function (timeAgo) {
        var seconds = Math.floor((new Date() - parseInt(timeAgo)) / 1000),
            separator = this.locales.separator || ' ',
            words = this.locales.prefix + separator,
            interval = 0,
            intervals = {
                year: seconds / 31536000,
                month: seconds / 2592000,
                day: seconds / 86400,
                hour: seconds / 3600,
                minute: seconds / 60
            };

        var distance = this.locales.seconds;

        for (var key in intervals) {
            interval = Math.floor(intervals[key]);

            if (interval > 1) {
                distance = this.locales[key + 's'];
                break;
            } else if (interval === 1) {
                distance = this.locales[key];
                break;
            }
        }

        distance = distance.replace(/%d/i, interval);
        words += distance + separator + this.locales.sufix;

        return words.trim();
    };

    return self;
}());

function logOut() {
    firebase.auth().signOut().then(() => {
        $('.user').addClass("d-none");
        $('#btnLogin').text("Đăng nhập");
        $('#btnLogin').addClass("rounded")
        $('#profilePicture').addClass("d-none")
        $('#btnLogin').removeClass("d-none")
        $('#collapse-profile').removeClass("show")
        var userStatusDatabaseRef = firebase.database().ref('/status/' + currentUser.uid);
        var isOfflineForDatabase = {
            state: 'offline',
            last_changed: firebase.database.ServerValue.TIMESTAMP,
        };
        userStatusDatabaseRef.set(isOfflineForDatabase)
        if (refUsers) {
            logoutRoom();
        }
    });
}


