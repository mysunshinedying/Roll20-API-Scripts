/* 세팅 법, 출력 법 등은 양천일염님의 코드를 수정하였습니다. */
/* 260126 bar_tracker.js 코드 시작 */

// define: option
const gi_setting = {
   // option: 변경을 감지할 속성을 목록 형태로 지정합니다.
   bar1_name: "bar1_name", //bar_1 이름
   bar2_name: "bar2_name", //bar_2 이름
   bar3_name: "bar3_name", //bar_3 이름
   bar4_name: "bar4_name", //bar_4 이름
   // option: 필수적으로 변화를 체크할 캐릭터의 이름을 기입합니다.
   // 이 값은 ignore_list보다 우선됩니다. (복수입력시 콤마(,)로 구분)
   prior_list: "",
   // option: 로그 표시에서 제외할 캐릭터의 이름을 기입합니다. (복수입력시 콤마(,)로 구분)
   // "GM"을 넣으면 GM에게만 조작권한이 있는 모든 캐릭터를 일괄적으로 제외합니다.
   ignore_list: "",
   // 토큰이 채팅 아바타로 사용될 지의 여부입니다. 기본은 false입니다.
    // 사용 시 2줄 이상이 되면 오류가 납니다.
   check_avatar: true,
   // 양천일염님의 attribute_tracker.js 사용 여부입니다. 체크할 경우 캐릭터 저널과 연결된 바 값은 나타나지 않습니다.
   // 사용 시 true를 설정해주세요.
   check_attribute: true
}
// /define: option
on('ready', function() {
   show_tracker_notice();
});
// define: global function
function show_tracker_notice() {
   sendChat("bar_tracker.js", "/w gm " + "<br> **" + "플레이어가 보는 페이지와 다른 토큰" + "**" + " 혹은 " + "**" + "혹은 GM 레이어의 토큰" + "**" + "은 뜨지 않습니다.", {
      noarchive: true
   });
}
on("change:token", function(obj, prev) {
   // on.change:token
   check_token(obj, prev);
   // /on.change:token
});

function check_token(obj, prev) {
   try {
      var b1n = gi_setting.bar1_name;
      var b2n = gi_setting.bar2_name;
      var b3n = gi_setting.bar3_name;
      var b4n = gi_setting.bar4_name;
      var check_pl = false;
      var check_attri = false;
      var token_avatar = "";
      
      const ignore_list = gi_setting.ignore_list.split(/\s*,\s*/g);
      const prior_list = gi_setting.prior_list.split(/\s*,\s*/g);
      
      if (gi_setting.check_attribute == true) {
         check_attri = true;
      }
      
      if (gi_setting.check_avatar == true) {
          token_avatar = "<img src=" + obj.get('imgsrc') + " style='height: 28px; position: absolute; left: 4px; top: 4px;'>";
      }
      
      if (prior_list.indexOf(obj.get('name')) > -1 || gi_setting.ignore_list == 0) {
         check_pl = true;
      } else if (ignore_list.indexOf(obj.get('name')) > -1) {
         check_pl = false;
      } else if (ignore_list.indexOf('GM') > -1) {
         let controller = obj.get('controlledby').split(",");
         for (var i = 0; i < controller.length; i++) {
            if (controller[i].length > 0 && !playerIsGM(controller[i])) {
               check_pl = true;
               break;
            }
         }
      }
      if (check_pl) {
         let camid = Campaign().get("playerpageid");
         if (camid == obj.get('_pageid')) {
            if (check_attri) {
               if (obj.get('bar1_value') !== prev["bar1_value"]) {
                  if (obj.get('showplayers_bar1') == true && !obj.get('compact_bar') && obj.get('layer') == "objects") {
                     if (obj.get('bar1_link').length <= 0) {
                        if (obj.get('represents')) {
                           sendChat("character|" + obj.get('represents'),
                              "**" + b1n + "** / <span style='color:#aaaaaa'>" + prev["bar1_value"] + "</span><span style='color:#777777'> → </span><b>" + obj.get('bar1_value') + "</b>", null, {
                                 noarchive: false
                              });
                        } else {
                           sendChat(obj.get('name'), "**" + b1n + "** / <span style='color:#aaaaaa'>" + prev["bar1_value"] + "</span><span style='color:#777777'> → </span><b>" + obj.get('bar1_value') + "</b>" + token_avatar, null, {
                              noarchive: false
                           });
                        }
                     }
                  }
               }
               if (obj.get('bar2_value') !== prev["bar2_value"]) {
                  if (obj.get('showplayers_bar2') == true && !obj.get('compact_bar') && obj.get('layer') == "objects") {
                     if (obj.get('bar2_link').length <= 0) {
                        if (obj.get('represents')) {
                           sendChat("character|" + obj.get('represents'),
                              "**" + b2n + "** / <span style='color:#aaaaaa'>" + prev["bar2_value"] + "</span><span style='color:#777777'> → </span><b>" + obj.get('bar2_value') + "</b>", null, {
                                 noarchive: false
                              });
                        } else {
                           sendChat(obj.get('name'), "**" + b2n + "** / <span style='color:#aaaaaa'>" + prev["bar2_value"] + "</span><span style='color:#777777'> → </span><b>" + obj.get('bar2_value') + "</b>" + token_avatar, null, {
                              noarchive: false
                           });
                        }
                     }
                  }
               }
               if (obj.get('bar3_value') !== prev["bar3_value"]) {
                  if (obj.get('showplayers_bar3') == true && !obj.get('compact_bar') && obj.get('layer') == "objects") {
                     if (obj.get('bar3_link').length <= 0) {
                        if (obj.get('represents')) {
                           sendChat("character|" + obj.get('represents'),
                              "**" + b3n + "** / <span style='color:#aaaaaa'>" + prev["bar3_value"] + "</span><span style='color:#777777'> → </span><b>" + obj.get('bar3_value') + "</b>", null, {
                                 noarchive: false
                              });
                        } else {
                           sendChat(obj.get('name'), "**" + b3n + "** / <span style='color:#aaaaaa'>" + prev["bar3_value"] + "</span><span style='color:#777777'> → </span><b>" + obj.get('bar3_value') + "</b>" + token_avatar, null, {
                              noarchive: false
                           });
                        }
                     }
                  }
               }
               if (obj.get('bar4_value') !== prev["bar4_value"]) {
                  if (obj.get('showplayers_bar4') == true && !obj.get('compact_bar') && obj.get('layer') == "objects") {
                     if (obj.get('bar4_link').length <= 0) {
                        if (obj.get('represents')) {
                           sendChat("character|" + obj.get('represents'),
                              "**" + b4n + "** / <span style='color:#aaaaaa'>" + prev["bar4_value"] + "</span><span style='color:#777777'> → </span><b>" + obj.get('bar4_value') + "</b>", null, {
                                 noarchive: false
                              });
                        } else {
                           sendChat(obj.get('name'), "**" + b4n + "** / <span style='color:#aaaaaa'>" + prev["bar4_value"] + "</span><span style='color:#777777'> → </span><b>" + obj.get('bar4_value') + "</b>" + token_avatar, null, {
                              noarchive: false
                           });
                        }
                     }
                  }
               }               
            } else {
               if (obj.get('bar1_value') !== prev["bar1_value"]) {
                  if (obj.get('showplayers_bar1') == true && !obj.get('compact_bar') && obj.get('layer') == "objects") {
                     if (obj.get('represents')) {
                        sendChat("character|" + obj.get('represents'),
                           "**" + b1n + "** / <span style='color:#aaaaaa'>" + prev["bar1_value"] + "</span><span style='color:#777777'> → </span><b>" + obj.get('bar1_value') + "</b>", null, {
                              noarchive: false
                           });
                     } else {
                        sendChat(obj.get('name'), "**" + b1n + "** / <span style='color:#aaaaaa'>" + prev["bar1_value"] + "</span><span style='color:#777777'> → </span><b>" + obj.get('bar1_value') + "</b>" + token_avatar, null, {
                           noarchive: false
                        });
                     }
                  }
               }
               if (obj.get('bar2_value') !== prev["bar2_value"]) {
                  if (obj.get('showplayers_bar2') == true && !obj.get('compact_bar') && obj.get('layer') == "objects") {
                     if (obj.get('represents')) {
                        sendChat("character|" + obj.get('represents'),
                           "**" + b2n + "** / <span style='color:#aaaaaa'>" + prev["bar2_value"] + "</span><span style='color:#777777'> → </span><b>" + obj.get('bar2_value') + "</b>", null, {
                              noarchive: false
                           });
                     } else {
                        sendChat(obj.get('name'), "**" + b2n + "** / <span style='color:#aaaaaa'>" + prev["bar2_value"] + "</span><span style='color:#777777'> → </span><b>" + obj.get('bar2_value') + "</b>" + token_avatar, null, {
                           noarchive: false
                        });
                     }
                  }
               }
               if (obj.get('bar3_value') !== prev["bar3_value"]) {
                  if (obj.get('showplayers_bar3') == true && !obj.get('compact_bar') && obj.get('layer') == "objects") {
                     if (obj.get('represents')) {
                        sendChat("character|" + obj.get('represents'),
                           "**" + b3n + "** / <span style='color:#aaaaaa'>" + prev["bar3_value"] + "</span><span style='color:#777777'> → </span><b>" + obj.get('bar3_value') + "</b>", null, {
                              noarchive: false
                           });
                     } else {
                        sendChat(obj.get('name'), "**" + b3n + "** / <span style='color:#aaaaaa'>" + prev["bar3_value"] + "</span><span style='color:#777777'> → </span><b>" + obj.get('bar3_value') + "</b>" + token_avatar, null, {
                           noarchive: false
                        });
                     }
                  }
               }
               if (obj.get('bar4_value') !== prev["bar4_value"]) {
                  if (obj.get('showplayers_bar4') == true && !obj.get('compact_bar') && obj.get('layer') == "objects") {
                     if (obj.get('represents')) {
                        sendChat("character|" + obj.get('represents'),
                           "**" + b4n + "** / <span style='color:#aaaaaa'>" + prev["bar4_value"] + "</span><span style='color:#777777'> → </span><b>" + obj.get('bar4_value') + "</b>", null, {
                              noarchive: false
                           });
                     } else {
                        sendChat(obj.get('name'), "**" + b4n + "** / <span style='color:#aaaaaa'>" + prev["bar4_value"] + "</span><span style='color:#777777'> → </span><b>" + obj.get('bar4_value') + "</b>" + token_avatar, null, {
                           noarchive: false
                        });
                     }
                  }
               }               
            }
         }
      }
   } catch (err) {
      sendChat("error", "/w gm " + err, null, {
         noarchive: true
      });
   }
}

/* 230125 bar_tracker.js 코드 종료 */
