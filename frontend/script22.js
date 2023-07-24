MAP_COUNT = 0;
CHIP_DATA = [];
let PARSED_DATA = {
    "maps": {},
};

let CURRENT_PAGINATION = 0;
var button = document.getElementById('button');
var mainBody = document.getElementById('main-body');

var elems = document.querySelectorAll('.chips');
var instances = M.Chips.init(elems,{
    onChipAdd: () => onChipChange(instances),
    onChipDelete: () => onChipChange(instances)
});

function onPaginationChange(clickedId) {
    CURRENT_PAGINATION = clickedId;
    editBody(false);
}

async function editBody(submitted) {
    if (submitted) {
        var checkbox = document.getElementById("h2h");
        if (checkbox.checked) {
            document.getElementById("error").textContent = "Head to head is not supported yet.";
            return;
        } else {
            document.getElementById("loading").style.display = "block";
            PARSED_DATA = await parseMPData(CHIP_DATA.join(","));
            document.getElementById("loading").style.display = "none";
            MAP_COUNT = Object.keys(PARSED_DATA['maps']).length;
        }
    }
    let current_map;
    Object.entries(PARSED_DATA['maps']).forEach(([key, value]) => {
        if (value['id'] == CURRENT_PAGINATION) {
            current_map = value;
        }
    });
    const div = document.createElement('div');
    div.className = "col s12";
    div.innerHTML = makePagination().outerHTML + makeMapInfo(current_map).outerHTML + addTable(current_map).outerHTML + addTeamTable(PARSED_DATA['teams']).outerHTML;
    mainBody.innerHTML = div.innerHTML;
}

async function parseMPData(mps) {
    url = `https://ompcbackend.petrichor.one?mps=${mps}`;
    const response = await fetch(url);
    const data = await response.json();
    MAP_COUNT = data['maps'].length;
    return data;
}

function makePagination() {
    const paginationUl = document.createElement('ul');
    paginationUl.className = 'pagination center';
    if (CURRENT_PAGINATION == 0) {
        paginationUl.innerHTML = `<li class="disabled"><a><i class="material-icons">chevron_left</i></a></li>` // left arrow
    } else {
        paginationUl.innerHTML = `<li class="waves-effect"><a onclick="onPaginationChange(${CURRENT_PAGINATION - 1})"><i class="material-icons">chevron_left</i></a></li>` // left arrow
    }
    for (let i = 0; i < MAP_COUNT; i++) {
        if (i == CURRENT_PAGINATION) {
            paginationUl.innerHTML += `<li class="active"><a onclick="onPaginationChange(${i})">${i + 1}</a></li>`
        } else {
            paginationUl.innerHTML += `<li class="waves-effect"><a onclick="onPaginationChange(${i})">${i + 1}</a></li>`
        }
        
    }
    if ((CURRENT_PAGINATION + 1) == MAP_COUNT) {
        paginationUl.innerHTML += `<li class="disabled"><a><i class="material-icons">chevron_right</i></a></li>`
    } else {
        paginationUl.innerHTML += `<li class="waves-effect"><a onclick="onPaginationChange(${CURRENT_PAGINATION + 1})"><i class="material-icons">chevron_right</i></a></li>`
    }
    return paginationUl;
}

function makeMapInfo(data) {
    const mapInfoDiv = document.createElement('div');
    if (data === undefined) {
        document.getElementById("error").textContent = "No data was returned. Make sure the MP link is formatted correctly, or to press enter after entering the link.";
        return;
    } else {
        document.getElementById("error").textContent = "";
    }
    mapInfoDiv.innerHTML = mapInfoDiv.innerHTML + makeMapBg(data['image']).outerHTML + makeMapData(data).outerHTML;
    return mapInfoDiv;
}

function makeMapBg(mapImgUrl) {
    const mapBgDiv = document.createElement('div');
    mapBgDiv.className = "col s4";
    mapBgDiv.innerHTML = `<img class="responsive-img" src="${mapImgUrl}">`;
    return mapBgDiv;
}

function makeMapData(mapData) {
    const mapInfoDiv = document.createElement('div');
    mapInfoDiv.className = 'col s8';
    mapInfoDiv.innerHTML = `
    <h6>${mapData.title}</h6>
    <h7>${mapData.details}</h7>`;
    return mapInfoDiv;
}

function addTeamTable(data) {
    const table = document.createElement('table');
    table.className = "highlight white-text";
    table.innerHTML = `<hr><thead>
    <tr>
        <th>All Teams</th>
        <th>All Players</th>
    </tr>
    </thead>
    
    <tbody>`
    let tbody = '';
    Object.entries(data).forEach(([team, value]) => {
        tbody += `<tr>
        <td><span style="display: inline-block; width: 10px; height: 10px; margin-right: 5px; background-color: ${team.toLowerCase()};"></span>${team}</td>
        <td>${value.join(", ")}</td>
        </tr>`;
    });
    tbody += "</tbody>"
    table.innerHTML += tbody;
    return table;
}

function addTable(data) {
    const table = document.createElement('table');
    table.className = "white-text";
    table.innerHTML = `<thead>
    <tr>
        <th>Team</th>
        <th>Players</th>
        <th>Combined Score</th>
    </tr>
    </thead>
    
    <tbody>`;
    
    let tbody = '';
    data['scores'].forEach(function(score, index) {
        let bgColor = '';
        if(index === 0) {
            bgColor = '#665D1E';  // Very dark gold
        } else if(index === 1) {
            bgColor = '#3C3C3C';  // Very dark silver
        } else if(index === 2) {
            bgColor = '#614E1A';  // Very dark bronze
        }
        tbody += `<tr>
        <td style="background-color: ${bgColor}; border-radius: 5px; color: white;">
            <span style="display: inline-block; width: 10px; height: 10px; margin-right: 5px; background-color: ${score.team.toLowerCase()};"></span>
            ${score.team}
        </td>
        <td style="border-radius: 5px;">${score.players.join(", ")}</td>
        <td style="border-radius: 5px;">${score.score.toLocaleString()}</td>
        </tr>`;
    });
    
    tbody += "</tbody>";
    table.innerHTML += tbody;
    return table;
}

function onChipChange(i) {
    let chipsInstance = i[0];
    let chipsData = chipsInstance.chipsData;
    let newChipData = [];

    // Iterate over each chip
    chipsData.forEach((chip, index) => {
        const tag = chip.tag;
        // Check if the chip contains a comma
        if (tag.includes(',')) {
            // Remove the chip
            chipsInstance.deleteChip(index);
            // Split the chip and add each item as a new chip
            var items = tag.split(',');
            items.forEach((item) => {
                let trimmedItem = item.trim();
                newChipData.push({tag: trimmedItem});
                const ID = parseInt(getMatchID(trimmedItem));
                if (!(CHIP_DATA.includes(ID))) {
                    CHIP_DATA.push(ID);
                }
            });
        } else {
            const ID = parseInt(getMatchID(tag));
            if (!(CHIP_DATA.includes(ID))) {
                CHIP_DATA.push(ID);
            }
        }
    });

    // Add the new chips
    newChipData.forEach(chip => {
        chipsInstance.addChip(chip);
    });
}

function getMatchID(url) {
    var parts = url.split('/');
    return parts[parts.length - 1];
}