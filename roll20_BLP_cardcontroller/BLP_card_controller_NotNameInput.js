//(BLP_card_controller.js) 241208@생성 260507@수정.
// 코드의 기본 골자는 양천일염(@trpg_kibkibe)님의 것을 사용했습니다.

// define: option
let dt_setting = {
	// option: 인원 수를 적어주세요.
    palying_person: 4,
	// option: 사용할 카드덱의 이름을 지정합니다.
    deck_names: ['Bloodpath', 'Bloodpath_2'],
	// option: 카드를 놓을 시에 자동배치 기능을 사용할지(true) 사용하지 않을지(false)의 여부를 설정합니다.
	use_snap_deck: true,
};
on("ready", function() {
    on("add:graphic", function(obj) {
        try {
            if (dt_setting.use_snap_deck && obj.get('subtype') === 'card') {
                let decks = [];
                
                // 배열로 지정한 덱을 모두 찾음
                dt_setting.deck_names.forEach(function(deck_name) {
                    let deck = findObjs({
                        _type: 'deck',
                        name: deck_name
                    })[0];
                    if (deck) {
                        decks.push(deck); // 찾은 덱을 배열에 추가
                    }
                });

                if (decks.length === 0) {
                    sendChat('BLP_card_controller.js', '/w GM 이름이 **' + dt_setting.deck_names.join(', ') + '**인 덱이 없습니다.', null, {
                        noarchive: true
                    });
                    return;
                }

                // 각 덱에서 카드 처리
                decks.forEach(function(deck) {
                    let model = findObjs({
                        _type: "card",
                        _deckid: deck.get('_id'),
                        _id: obj.get('_cardid')
                    })[0];

                    if (model) {
                        state.current_plot_page = obj.get('_pageid');
                        let areas = getPlotAreas();
                        if (!areas) {
                            return;
                        }

                        let obj_coord = {
                            left: obj.get('left') - (obj.get('width') / 2),
                            top: obj.get('top') - (obj.get('height') / 2),
                            width: obj.get('width'),
                            height: obj.get('height')
                        };

                        let i = 0, j = 0;
                        let stacked_dice = 0;
                        let shorttest_dis = {
                            x_dis: 99999,
                            y_dis: 99999
                        };
                        let dice = findObjs({
                            _type: 'graphic',
                            _subtype: 'card',
                            gmnotes: 'Dice',
                            _pageid: obj.get('_pageid')
                        });

                        const margin = 10;

                        for (let z = 0; z < areas.length; z++) {
                            for (let x = 0; x < areas[z].length; x++) {
                                let spot = areas[z][x];
                                let spot_coord = {
                                    left: spot.get('left') - (spot.get('width') / 2),
                                    top: spot.get('top') - (spot.get('height') / 2),
                                    width: spot.get('width'),
                                    height: spot.get('height')
                                };

                                let current_dis = {
                                    x_dis: 0,
                                    y_dis: 0
                                };

                                if (spot_coord.left < obj_coord.left && spot_coord.left + spot_coord.width > obj_coord.left) {
                                    current_dis.x_dis = 0;
                                } else {
                                    current_dis.x_dis = Math.min(Math.abs(spot_coord.left - obj_coord.left), Math.abs(spot_coord.left + spot_coord.width - obj_coord.left - obj_coord.width));
                                }

                                if (spot_coord.top < obj.top && spot_coord.top + spot_coord.height > obj.top) {
                                    current_dis.y_dis = 0;
                                } else {
                                    current_dis.y_dis = Math.min(Math.abs(spot_coord.top - obj_coord.top), Math.abs(spot_coord.top + spot_coord.height - obj_coord.top - obj_coord.height));
                                }

                                if (current_dis.x_dis + current_dis.y_dis < shorttest_dis.x_dis + shorttest_dis.y_dis) {
                                    shorttest_dis = current_dis;
                                    i = z;
                                    j = x;
                                    stacked_dice = 0;

                                    dice.forEach(die => {
                                        if (spot_coord.left - margin <= die.get('left') - die.get('width') / 2 && spot_coord.top - margin <= die.get('top') - die.get('height') / 2 && spot_coord.left + spot_coord.width + margin >= die.get('left') + die.get('width') / 2 && spot_coord.top + spot_coord.height + margin >= die.get('top') + die.get('height') / 2) {
                                            stacked_dice++;
                                        }
                                    });
                                }
                            }
                        }

                        let nearest_area = areas[i][j];
                        let is_area_landscape = nearest_area.get('width') > nearest_area.get('height');

                        obj.set({
                            gmnotes: 'Dice',
                            left: Math.floor(nearest_area.get('left') - (nearest_area.get('width') / 2) + (obj.get('width') / 2)) + (is_area_landscape ? stacked_dice * obj.get('width') : 0),
                            top: Math.floor(nearest_area.get('top') - (nearest_area.get('height') / 2) + (obj.get('height') / 2)) + (!is_area_landscape ? stacked_dice * obj.get('height') : 0),
                            showname: false,
                            showplayers_name: false,
                            controlledby: "all"
                        });

                        let card_id = findObjs({
                            _type: "card",
                            _id: obj.get('_cardid')
                        })[0];

                        let card_name = card_id.get('name');
                        let card_lower = card_name.toLowerCase();
                        let card_style = "color: white; border-radius: 4px; font-weight: bold; padding: 0 4px;";
                        let area_name = nearest_area.get('name');
                        let word_pharse = "";
                        let c_name = "";
                        let cha = "";

                        if (card_lower.includes('club') || card_lower.includes('spade')) {
                            card_style += 'background: black;';
                        } else if (card_lower.includes('heart') || card_lower.includes('dia') || card_lower.includes('♥') || card_lower.includes('◆')) {
                            card_style += 'background: crimson;';
                        } else {
                            card_style += 'background: #111;';
                        }

                        if (area_name.indexOf('A_deck') !== -1) {
                          c_name = getCharacterNameFromToken('Character_A');
                        } else if (area_name.indexOf('B_deck') !== -1) {
                          c_name = getCharacterNameFromToken('Character_B');
                        } else if (area_name.indexOf('C_deck') !== -1) {
                          c_name = getCharacterNameFromToken('Character_C');
                        } else if (area_name.indexOf('D_deck') !== -1) {
                          c_name = getCharacterNameFromToken('Character_D');
                        }
                        
                        if (c_name) {
                            cha = findObjs({
                                name: c_name,
                                type: 'character'
                            });
                        }

                        let includesChars = ['1', '3', '6', '7', '8', '10', 'Q'];
                        word_pharse += includesChars.some(char => card_name.includes(char)) ? "을" : "를";

                        let result = "";
                        if (area_name.indexOf('A_deck') != -1 || area_name.indexOf('B_deck') != -1 || area_name.indexOf('C_deck') != -1 || area_name.indexOf('D_deck') != -1 || area_name.indexOf('Draw') != -1) {
                            if (c_name) {
                                result += "<b>";
                                result += c_name;
                                result += "</b>";
                                result += "<span style='color:crimson'> ▶ </span>";
                            }
                            result += "<span style='";
                            result += card_style + "'>";
                            result += card_name;
                            result += "</span>";
                            result += word_pharse;
                            result += "&nbsp;뽑았습니다.";
                        }

                        sendChat("", result);
                    }
                });
            }
        } catch (err) {
            sendChat('error', '/w GM ' + err, null, {
                noarchive: true
            });
        }
    });
});

//on chat 
on("chat:message", function(msg) {
    if (msg.type == "api") {
        if (msg.content.startsWith("!Discard") || msg.content.startsWith("!PutDeck")) {
            try {
                let decks = [];
                
                // 배열로 지정한 덱을 모두 찾음
                dt_setting.deck_names.forEach(function(deck_name) {
                    let deck = findObjs({
                        _type: 'deck',
                        name: deck_name
                    })[0];
                    if (deck) {
                        decks.push(deck); // 찾은 덱을 배열에 추가
                    }
                });

                if (decks.length === 0) {
                    sendChat("BLP_card_controller.js", "/w gm 덱이 Card에 없습니다.", null, {
                        noarchive: true
                    });
                    return false;
                }

                let objects = findObjs({
                    _type: 'graphic',
                    _subtype: 'card',
                    layer: 'objects',
                    _pageid: state.current_plot_page
                });

                let areas = getPlotAreas();
                let cha = findObjs({
                    name: msg.who,
                    type: 'character'
                });

                for (var i = 0; i < msg.selected.length; i++) {
                    if (msg.selected[i]._type == "graphic") {
                        let model = getObj("graphic", msg.selected[i]._id);
                        if (model && model.get("_subtype") == "card") {
                            let card = getObj("card", model.get('_cardid'));
                            let card_style = "color: white; border-radius: 4px; font-weight: bold; padding: 0 4px;";
                            let word_pharse = "";
                            let card_name = card.get('name');
                            let card_lower = card_name.toLowerCase();
                            let includesChars = ['1', '3', '6', '7', '8', '10', 'Q'];
                            word_pharse += includesChars.some(char => card_name.includes(char)) ? "을" : "를";

                            if (card_lower.includes('club') || card_lower.includes('spade')) {
                                card_style += 'background: black;';
                            } else if (card_lower.includes('heart') || card_lower.includes('dia') || card_lower.includes('♥') || card_lower.includes('◆')) {
                                card_style += 'background: crimson;';
                            } else {
                                card_style += 'background: #111;';
                            }

                            // !Discard 처리
                            if (msg.content.startsWith("!Discard")) {
                                if (findObjs({
                                    name: 'Discard',
                                    _pageid: state.current_plot_page
                                }).length > 0) {
                                    
                                    let discard_area = areas.filter(area => area[0].get('name') === 'Discard');
                                    let discardX = discard_area[0][0].get('left') - (discard_area[0][0].get('width') / 2) + (model.get('width') / 2);
                                    let discardY = discard_area[0][0].get('top') - (discard_area[0][0].get('height') / 2) + (model.get('height') / 2);

                                    let suitablePosition = findAvailablePosition(discardX, discardY, model);
                                    if (suitablePosition !== null) {
                                        model.set({
                                            left: suitablePosition.x,
                                            top: suitablePosition.y
                                        });
                                    } else {
                                        model.set({
                                            left: discardX,
                                            top: discardY
                                        });
                                    }
                                    toFront(model);

                                    let result = "";
                                    if (cha.length > 0) {
                                        result += "<b>" + msg.who + "</b>";
                                    }
                                    result += "<span style='color:crimson'> ▶ </span>";
                                    result += "<span style='" + card_style + "'>" + card_name + "</span>";
                                    result += word_pharse + "&nbsp;버립니다.";
                                    sendChat("", result);
                                } else {
                                    sendChat("BLP_card_controller.js", "/w gm Discard 영역이 없습니다.", null, {
                                        noarchive: true
                                    });
                                    return false;
                                }
                            }

                            // !PutDeck 처리
                            if (msg.content.startsWith("!PutDeck")) {
                                let position = null;

                                if (msg.who === getCharacterNameFromToken('Character_A')) {
                                    position = getNextAvailablePosition('A_deck', model);
                                } else if (msg.who === getCharacterNameFromToken('Character_B')) {
                                    position = getNextAvailablePosition('B_deck', model);
                                } else if (msg.who === getCharacterNameFromToken('Character_C')) {
                                    position = getNextAvailablePosition('C_deck', model);
                                } else if (msg.who === getCharacterNameFromToken('Character_D')) {
                                    position = getNextAvailablePosition('D_deck', model);
                                }

                                if (position !== null) {
                                    model.set({
                                        left: position.x,
                                        top: position.y
                                    });
                                    
                                    let result = "";
                                    if (cha.length > 0) {
                                        result += "<b>" + msg.who + "</b>";
                                    }
                                    result += "<span style='color:crimson'> ▶ </span>";
                                    result += "<span style='" + card_style + "'>" + card_name + "</span>";
                                    result += word_pharse + "&nbsp;손패에 넣습니다.";
                                    sendChat("", result);
                                } else {
                                    sendChat("error", "/w gm 손패에 카드를 넣을 수 없습니다.");
                                }
                            }
                        }
                    }
                }
            } catch (err) {
                sendChat('error', '/w GM ' + err, null, {
                    noarchive: true
                });
            }
        }
    }
});


function getNextAvailablePosition(deckName, model) {
    let areas = getPlotAreas();

    let deckAreas = areas.filter(area => area[0].get('name') === deckName);

    // deckAreas가 비어 있으면 에러를 출력하고 종료
    if (deckAreas.length === 0) {
        sendChat("BLP_card_controller.js", "/w gm " + deckName + " 영역이 없습니다.", null, {
            noarchive: true
        });
        return null;
    }

    let sortedAreas = deckAreas[0].slice(0).sort((a, b) => {
        if (a.get('top') !== b.get('top')) {
            return a.get('top') - b.get('top'); 
        } else {
            return a.get('left') - b.get('left');
        }
    });

    
    let tolerance = 5; // 좌표 비교 시 허용 오차

    for (let area of sortedAreas) {
        let left = area.get('left');
        let top = area.get('top');

        // 로그를 통해 좌표와 카드 확인 결과를 출력
        log(`Checking position - X: ${left}, Y: ${top}`);

        let already_card = findObjs({
            _type: 'graphic',
            _subtype: 'card',
            layer: 'objects',
            _pageid: state.current_plot_page
        }).filter(obj => {
            return Math.abs(obj.get('left') - left) <= tolerance && Math.abs(obj.get('top') - top) <= tolerance;
        });

        // 카드가 없으면 이 위치를 반환합니다.
        if (already_card.length === 0) {
            log(`Position found - X: ${left}, Y: ${top}`);
            return { x: left, y: top };
        }
    }

    // 모든 위치에 카드가 있는 경우 null 반환
    sendChat("error", "/w gm 카드가 전부 차 있습니다.", null, {noarchive: true});
    return null;
}



function findAvailablePosition(x, y, model) {
	let areas = getPlotAreas();
	let discard_area = areas.filter(area => area[0].get('name') === 'Discard');
	let availableX = x;
	let availableY = y;
	let xOffset = 20;
	let yOffset = 35;
	
	//reorganizeCards(discard_area, xOffset, yOffset, model);
	//카드 재정리 함수 사용 보류, 사유: 카드가 뽑은 순으로 재정렬되는 문제.

    if(model.get('width') >= discard_area[0][0].get('width')) {
	   // discard의 영역이 카드와 일치하거나 작을 경우 그대로 return한다.
	    return {x: x, y: y};
	}
	
	while (true) {
    log(`Checking position - X: ${availableX}, Y: ${availableY}`);
    let already_card = findObjs({
        _type: 'graphic',
        _subtype: 'card',
        layer: 'objects',
        _pageid: state.current_plot_page,
        left: availableX,
        top: availableY
    });
    
    if (already_card.length === 0) {
        // 카드가 없으면 위치가 사용 가능하다고 판단
        return {
            x: availableX,
            y: availableY
        };
    }

    // availableX가 discard_area의 범위를 넘어가면 discardY를 아래로 이동
    if (availableX + model.get('width') / 2 > discard_area[0][0].get('left') + discard_area[0][0].get('width') / 2) {
        availableX = x; // 초기 X 위치로 되돌림
        availableY += yOffset;
    } else {
        // 카드가 이미 있는 경우, availableX를 xOffset만큼 증가시키고 다시 시도
        availableX += xOffset;
    }

    log(`availableX: ${availableX}, cardWidth: ${model.get('width')}, discardLeft: ${discard_area[0][0].get('left')}, discardwidth:${discard_area[0][0].get('width') / 2}`);

    // discardY가 discard_area의 영역을 넘어가면 종료
    if (availableY + model.get('height') > discard_area[0][0].get('top') + discard_area[0][0].get('height')) {
        sendChat("error", "/w gm 위치를 찾기 어렵습니다.", null, {
            noarchive: true
        });
        return false;
    }
}
}

function reorganizeCards(discard_area, xOffset, yOffset, model) {
    let startX = discard_area[0][0].get('left') - discard_area[0][0].get('width') / 2 + model.get('width') / 2;
    let startY = discard_area[0][0].get('top') - discard_area[0][0].get('height') / 2 + model.get('height') / 2;
    let newxOffset = xOffset;
    let newyOffset = yOffset;
    let discardLeft = discard_area[0][0].get('left') - discard_area[0][0].get('width') / 2;
    let discardRight = discard_area[0][0].get('left') + discard_area[0][0].get('width') / 2;
    let discardTop = discard_area[0][0].get('top') - discard_area[0][0].get('height') / 2;
    let discardBottom = discard_area[0][0].get('top') + discard_area[0][0].get('height') / 2;

    
    let cardsObj = findObjs({
        _type: 'graphic',
        _subtype: 'card',
        layer: 'objects',
        _pageid: state.current_plot_page
    });
    
    let cards = findObjs({
    _type: 'graphic',
    _subtype: 'card',
    layer: 'objects',
    _pageid: state.current_plot_page
}).filter(card => 
    card.get('left') >= discardLeft &&
    card.get('left') <= discardRight &&
    card.get('top') >= discardTop &&
    card.get('top') <= discardBottom
);
    
    let currentX = startX;
    let currentY = startY;
    
    cards.forEach(card => {
        card.set({
            left: currentX,
            top: currentY
        });
        
        if (currentX + card.get('width') > discard_area[0][0].get('left') + (discard_area[0][0].get('width') / 2)) {
            currentX = startX;
            currentY += newyOffset;
        }
        else {currentX += newxOffset;}
        toFront(card);
    });
}

function getPlotAreas() {
	var areas = [];
	if(findObjs({
			name: 'A_deck',
			_pageid: state.current_plot_page
		}).length > 0) {
		areas.push(findObjs({
			name: 'A_deck',
			_pageid: state.current_plot_page
		}));
	} else {
		sendChat("BLP_card_controller.js", "/w gm A_deck 영역이 없습니다.", null, {
			noarchive: true
		});
		return false;
	}
	if(findObjs({
			name: 'B_deck',
			_pageid: state.current_plot_page
		}).length > 0) {
		areas.push(findObjs({
			name: 'B_deck',
			_pageid: state.current_plot_page
		}));
	} else {
		sendChat("BLP_card_controller.js", "/w gm B_deck 영역이 없습니다.", null, {
			noarchive: true
		});
		return false;
	}
	if(findObjs({
			name: 'C_deck',
			_pageid: state.current_plot_page
		}).length > 0) {
		areas.push(findObjs({
			name: 'C_deck',
			_pageid: state.current_plot_page
		}));
	} else if(dt_setting.palying_person >= 3) {
		sendChat("BLP_card_controller.js", "/w gm C_deck 영역이 없습니다.", null, {
			noarchive: true
		});
		return false;
	}
	if(findObjs({
			name: 'D_deck',
			_pageid: state.current_plot_page
		}).length > 0) {
		areas.push(findObjs({
			name: 'D_deck',
			_pageid: state.current_plot_page
		}));
	} else if(dt_setting.palying_person >= 4) {
		sendChat("BLP_card_controller.js", "/w gm D_deck 영역이 없습니다.", null, {
			noarchive: true
		});
		return false;
	}
	if(findObjs({
			name: 'Draw',
			_pageid: state.current_plot_page
		}).length > 0) {
		areas.push(findObjs({
			name: 'Draw',
			_pageid: state.current_plot_page
		}));
	} else {
		sendChat("BLP_card_controller.js", "/w gm Draw 영역이 없습니다.", null, {
			noarchive: true
		});
		return false;
	}
	if(findObjs({
			name: 'Discard',
			_pageid: state.current_plot_page
		}).length > 0) {
		areas.push(findObjs({
			name: 'Discard',
			_pageid: state.current_plot_page
		}));
	} else {
		sendChat("BLP_card_controller.js", "/w gm Discard 영역이 없습니다.", null, {
			noarchive: true
		});
		return false;
	}
	if(findObjs({
			name: 'E_deck',
			_pageid: state.current_plot_page
		}).length > 0) {
		areas.push(findObjs({
			name: 'E_deck',
			_pageid: state.current_plot_page
		}));
	} else {
		sendChat("BLP_card_controller.js", "/w gm E_deck 영역이 없습니다.", null, {
			noarchive: true
		});
		return false;
	}
	return areas;
}

function getCharacterNameFromToken(areaName) {
  const pageid = state.current_plot_page || Campaign().get('playerpageid');

  const area = findObjs({ _type: 'graphic', name: areaName, _pageid: pageid })[0];
  if (!area) return null;

  const l = area.get('left') - area.get('width') / 2;
  const r = area.get('left') + area.get('width') / 2;
  const t = area.get('top')  - area.get('height') / 2;
  const b = area.get('top')  + area.get('height') / 2;

  const token = findObjs({ _type: 'graphic', _subtype: 'token', _pageid: pageid, layer:'objects' })
    .find(tok => {
      const x = tok.get('left'), y = tok.get('top');
      return x >= l && x <= r && y >= t && y <= b;
    });

  if (!token) return null;

  const charId = token.get('represents');
  const ch = charId ? getObj('character', charId) : null;
  return (ch && ch.get('name')) || token.get('name') || null;
}



// /define: global function
// (BLP_card_controller.js) @260507 코드 종료