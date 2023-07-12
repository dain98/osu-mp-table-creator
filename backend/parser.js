import('dotenv').then((dotenv) => dotenv.config());
const colors = require('./tools/teamnames.js');
const { modsToString } = require('./tools/bitwisemods.js');

CURRENT_ID = 0;
RETURNED_DATA = {
    "maps": {},
    "teams": {}
};

async function parse_mps(mps) {
    CURRENT_ID = 0;
    RETURNED_DATA = {
        "maps": {},
        "teams": {}
    };
    let id = -1;
    for (let mp of mps) {
        await fetch_from_api(mp, id);
        id += 2;
    }
    return RETURNED_DATA;
}

async function fetch_from_api(mp, id) {
    const url = `${process.env.URL}/get_match?k=${process.env.API_KEY}&mp=${mp}`;
    const response = await fetch(url);
    const json = await response.json();
    await convert_api_data(json, id);
}

async function convert_api_data(data, id) {
    for (let game of data['games']) {
        if (!(game['beatmap_id'] in RETURNED_DATA['maps'])) {
            await initialize_beatmap(game['beatmap_id'], game['mods']);
        }
        for (let score of game['scores']) {
            await append_score_to_json(score, id, game['beatmap_id']);
        }
    }
}

async function initialize_beatmap(beatmap_id, mods) {
    const url = `${process.env.URL}/get_beatmaps?k=${process.env.API_KEY}&b=${beatmap_id}`;
    const response = await fetch(url);
    const json = await response.json();
    const beatmapset = json[0];
    if (beatmapset == null) {
        RETURNED_DATA['maps'][beatmap_id] = {
            "id": CURRENT_ID,
            "image": "http://cdn.petrichor.one/u/FzLCHi.png",
            "title": "BEATMAP NOT FOUND",
            "details": `${modsToString(mods).join(", ")}`,
            "scores": {}
        }
    } else {
        RETURNED_DATA['maps'][beatmap_id] = {
            "id": CURRENT_ID,
            "image": `https://assets.ppy.sh/beatmaps/${beatmapset['beatmapset_id']}/covers/cover.jpg`,
            "title": beatmapset['artist'] + " - " + beatmapset['title'] + " [" + beatmapset['version'] + "]" + " by " + beatmapset['creator'],
            "details": `AR${beatmapset['diff_approach']}, CS${beatmapset['diff_size']}, OD${beatmapset['diff_overall']}, ${parseFloat(beatmapset['difficultyrating']).toFixed(2)}* | <b>+${modsToString(mods).join(", ")}</b>`,
            "scores": {}
        };
    }
    CURRENT_ID++;
}

async function append_score_to_json(score, id, beatmap_id) {
    const teamColor = colors[parseInt(score['team']) + id];
    const playerName = await fetch_player_name(score['user_id']);
    if (!(teamColor in RETURNED_DATA['teams'])) {
        RETURNED_DATA['teams'][teamColor] = [];
    }
    if (!(RETURNED_DATA['teams'][teamColor].includes(playerName))) {
        RETURNED_DATA['teams'][teamColor].push(playerName);
    }

    if (!(teamColor in RETURNED_DATA['maps'][beatmap_id]['scores'])) {
        RETURNED_DATA['maps'][beatmap_id]['scores'][teamColor] = {
            "players": [],
            "score": 0
        }
    }
    RETURNED_DATA['maps'][beatmap_id]['scores'][teamColor]['players'].push(playerName);
    RETURNED_DATA['maps'][beatmap_id]['scores'][teamColor]['score'] += parseInt(score['score']);
    // append FM to mods if enabled_mods isn't null
    if (score['enabled_mods'] != null && !(RETURNED_DATA['maps'][beatmap_id]['details'].includes("FM"))) {
        RETURNED_DATA['maps'][beatmap_id]['details'] += "<b>FM</b>";
    }
}

async function fetch_player_name(id) {
    const url = `${process.env.URL}/get_user?k=${process.env.API_KEY}&u=${id}`;
    const response = await fetch(url);
    const json = await response.json();
    if (json.length == 0) {
        return "<b>RESTRICTED</b>";
    }
    return json[0]['username'];
}

module.exports = { parse_mps };