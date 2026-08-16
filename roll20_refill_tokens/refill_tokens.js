// 260216 refill_tokens.js 시작
on("chat:message", function(msg) {
    if (msg.type === "api" && msg.content === "!refillToken") {
        if (!msg.selected || msg.selected.length === 0) {
            sendChat("System", "/w gm 선택된 토큰이 없습니다.", null, {noarchive: true});
            return;
        }

        var count = 0;
        msg.selected.forEach(function(sel) {
            var token = getObj("graphic", sel._id);
            if (!token) return;

            var charId = token.get("represents");
            if (!charId) return; // 캐릭터 저널과 연결되지 않은 토큰은 생략

            for (var i = 1; i <= 4; i++) {
                var linkId = token.get("bar" + i + "_link");
                
                // 해당 바가 저널의 attribute와 연결되어 있는 경우에만 갱신
                if (linkId) {
                    var attr = getObj("attribute", linkId);
                    if (attr) {
                        var currentVal = attr.get("current");
                        var maxVal = attr.get("max");

                        token.set({
                            ["bar" + i + "_value"]: currentVal,
                            ["bar" + i + "_max"]: maxVal
                        });
                    }
                }
            }
            count++;
        });

        sendChat("System", "/w gm " + count + "개 토큰의 바 수치를 저널과 동기화했습니다.", null, {noarchive: true});
    }
});
// 260216 refill_tokens.js 종료