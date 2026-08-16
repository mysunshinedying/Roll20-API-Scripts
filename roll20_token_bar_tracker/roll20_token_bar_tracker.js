/* 세팅 법, 출력 법 등은 양천일염님의 코드를 수정하였습니다. */
// 260216 bar_tracker.js 코드 시작

const gi_setting = {
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
   check_avatar: false,
    // 양천일염님의 attribute_tracker.js 사용 여부입니다. 체크할 경우 캐릭터 저널과 연결된 바 값은 나타나지 않습니다.
    // 사용 시 true를 설정해주세요.
   check_attribute: false
}

function normalizeImgsrc(src) {
    if (!src || typeof src !== 'string') return "";
    return src.split('?')[0].replace(/(thumb|med|original|max|dotger)/, "max");
}

function findCharByAvatar(imgsrc) {
    if (!imgsrc) return null;
    var tokenNorm = normalizeImgsrc(imgsrc);
    var chars = findObjs({_type: "character"});
    for (var i = 0; i < chars.length; i++) {
        var avatar = chars[i].get("avatar");
        if (avatar && normalizeImgsrc(avatar) === tokenNorm) return chars[i].id;
    }
    return null;
}

on("change:token", function(obj, prev) {
    try {
        let camid = Campaign().get("playerpageid");
        if (camid != obj.get('_pageid')) return;
        if (obj.get('layer') !== "objects") return;

        var name = obj.get('name');
        var check_pl = false;

        const ignore_list = gi_setting.ignore_list.split(/\s*,\s*/g);
        const prior_list = gi_setting.prior_list.split(/\s*,\s*/g);

        if (prior_list.indexOf(name) > -1 || (gi_setting.ignore_list == "" && gi_setting.prior_list == "")) {
            check_pl = true;
        } else if (ignore_list.indexOf(name) > -1) {
            check_pl = false;
        } else if (ignore_list.indexOf('GM') > -1) {
            let controller = (obj.get('controlledby') || "").split(",");
            for (var i = 0; i < controller.length; i++) {
                if (controller[i].length > 0 && !playerIsGM(controller[i])) {
                    check_pl = true;
                    break;
                }
            }
        } else {
            check_pl = true;
        }

        if (!check_pl) return;

        var representsId = obj.get('represents');
        var foundByImgId = (gi_setting.check_avatar && !representsId) ? findCharByAvatar(obj.get('imgsrc')) : null;
        
        var charId = representsId || foundByImgId;
        var speaker = charId ? "character|" + charId : name;

        for (var i = 1; i <= 4; i++) {
            var val = "bar" + i + "_value";
            if (obj.get(val) !== prev[val]) {
                if (obj.get("showplayers_bar" + i) === true && !obj.get('compact_bar')) {
                    if (gi_setting.check_attribute && obj.get("bar" + i + "_link").length > 0) continue;

                    var bName = (i==1 ? gi_setting.bar1_name : i==2 ? gi_setting.bar2_name : i==3 ? gi_setting.bar3_name : gi_setting.bar4_name);
                    
                    var displayName = foundByImgId ? "**[" + name + "] " + bName + "**" : "**" + bName + "**";

                    var msg = displayName + " / <span style='color:#aaaaaa'>" + prev[val] + "</span><span style='color:#777777'> → </span><b>" + obj.get(val) + "</b>";
                    sendChat(speaker, msg, null, {noarchive: false});
                }
            }
        }
    } catch (err) {
        log("BarTracker Error: " + err);
    }
});

// 260216 bar_tracker.js 코드 종료