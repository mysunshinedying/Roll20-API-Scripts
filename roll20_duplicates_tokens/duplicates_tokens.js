// 260216 duplicates_tokens.js 시작

on("chat:message", function(msg) {
    var content = (msg.content || "").trim();
    if (content.indexOf("!copyToken") !== 0) return;

    var count = 1;
    var match = content.match(/!copyToken\s*--(\d+)/);
    if (match) {
        count = parseInt(match[1], 10);
        if (isNaN(count) || count < 1) count = 1;
        if (count > 26) count = 26;
    }

    var tokenIds = [];
    if (msg.selected && msg.selected.length > 0) {
        msg.selected.forEach(function(s) {
            if (s._id) tokenIds.push(s._id);
        });
    }

    if (tokenIds.length === 0) {
        sendChat("duplicate_tokens.js", "/w gm 선택된 토큰이 없습니다. 토큰 선택 후 매크로로 !copyToken --개수 를 실행하세요.");
        return;
    }

    var names = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    tokenIds.forEach(function(tid) {
        var token = getObj("graphic", tid);
        if (!token) return;

        var pageId = token.get("pageid");
        var left = parseFloat(token.get("left")) || 0;
        var top = parseFloat(token.get("top")) || 0;
        var width = parseFloat(token.get("width")) || 70;
        var height = parseFloat(token.get("height")) || 70;

        var baseName = (token.get("name") || "").trim() || "토큰";
        var b1val = token.get("bar1_value");
        var b2val = token.get("bar2_value");
        var b3val = token.get("bar3_value");
        var b4val = token.get("bar4_value");
        var b1max = token.get("bar1_max");
        var b2max = token.get("bar2_max");
        var b3max = token.get("bar3_max");
        var b4max = token.get("bar4_max");

        for (var i = 0; i < count; i++) {
            var suffix = names[i] !== undefined ? names[i] : String(i + 1);
            var newName = baseName + " " + suffix;
            var offsetX = (i + 1) * (width + 10);

            var props = {
                name: newName,
                represents: "",
                
                _pageid: pageId,                
                left: left + offsetX,
                top: top,
                width: width,
                height: height,
                scale: token.get("scale") || 1,
                rotation: token.get("rotation") || 0,
                layer: token.get("layer") || "objects",
                imgsrc: token.get("imgsrc") || "",
                
                bar1_link: "",
                bar2_link: "",
                bar3_link: "",
                bar4_link: "",
                
                show_name: true,
                show_bar1: true,
                show_bar2: true,
                show_bar3: true,
                show_bar4: true,
                
                showplayers_name: true,
                showplayers_bar1: true,
                showplayers_bar2: true,
                showplayers_bar3: true,
                showplayers_bar4: true
            };

            if (b1val !== undefined && b1val !== null && b1val !== "")
                props.bar1_value = String(b1val);
                
            if (b2val !== undefined && b2val !== null && b2val !== "")
                props.bar2_value = String(b2val);
                
            if (b3val !== undefined && b3val !== null && b3val !== "")
                props.bar3_value = String(b3val);
                
            if (b4val !== undefined && b4val !== null && b4val !== "")
                props.bar4_value = String(b4val);
                
            if (b1max !== undefined && b1max !== null && b1max !== "")
                props.bar1_max = String(b1max);
                
            if (b2max !== undefined && b2max !== null && b2max !== "")
                props.bar2_max = String(b2max);
                
            if (b3max !== undefined && b3max !== null && b3max !== "")
                props.bar3_max = String(b3max);
                
            if (b4max !== undefined && b4max !== null && b4max !== "")
                props.bar4_max = String(b4max);

            var newToken = createObj("graphic", props);

            if (newToken) {
                var updates = {};
                
                if (b1val !== undefined && b1val !== null)
                    updates.bar1_value = String(b1val);
                    
                if (b1max !== undefined && b1max !== null)
                    updates.bar1_max = String(b1max);
                    
                if (b2val !== undefined && b2val !== null)
                    updates.bar2_value = String(b2val);
                    
                if (b2max !== undefined && b2max !== null)
                    updates.bar2_max = String(b2max);
                    
                if (b3val !== undefined && b3val !== null)
                    updates.bar3_value = String(b3val);
                    
                if (b3max !== undefined && b3max !== null)
                    updates.bar3_max = String(b3max);
                    
                if (b4val !== undefined && b4val !== null)
                    updates.bar4_value = String(b4val);
                if (b4max !== undefined && b4max !== null)
                    updates.bar4_max = String(b4max);
                    
                updates.showplayers_name = true;
                updates.showname = true;                
                updates.showplayers_bar1 = true;
                updates.showplayers_bar2 = true;
                updates.showplayers_bar3 = true;
                updates.showplayers_bar4 = true;
                
                newToken.set(updates);
            }
        }
    });

    sendChat("duplicate_tokens.js", "/w gm 토큰 " + count + "개를 복사하였습니다.", null, {noarchive:true});
});

// 260216 duplicates_tokens.js 종료