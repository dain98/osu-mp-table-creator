var sample = [
    {
        "team": "Red",
        "players": [
            "Dain",
            "Seegii",
            "Exarch",
            "M I L E S"
        ],
        "score": "3,234,192"
    },
    {
        "team": "Blue",
        "players": [
            "DigitalHypno",
            "Cookiezi",
            "Toy",
            "Apraxia"
        ],
        "score": "4,293,232"
    },
    {
        "team": "Green",
        "players": [
            "test1",
            "test2",
            "test3",
            "test4"
        ],
        "score": "2,234,192"
    },
    {
        "team": "Yellow",
        "players": [
            "test5",
            "test6",
            "test7",
            "test8"
        ],
        "score": "8,234,128"
    }
]
var button = document.getElementById('button');
var mainBody = document.getElementById('main-body');

var elems = document.querySelectorAll('.chips');
var instances = M.Chips.init(elems,{
    onChipAdd: () => onChipChange(instances),
    onChipDelete: () => onChipChange(instances)
});

function editBody() {
    const div = document.createElement('div');

    div.className = "col s12";

    div.innerHTML = 
    `
    <!-- Pagination -->
    <ul class="pagination center">
        <li class="disabled"><a href="#!"><i class="material-icons">chevron_left</i></a></li>
        <li class="active"><a href="#!">1</a></li>
        <li class="waves-effect"><a href="#!">2</a></li>
        <li class="waves-effect"><a href="#!">3</a></li>
        <li class="waves-effect"><a href="#!">4</a></li>
        <li class="waves-effect"><a href="#!">5</a></li>
        <li class="waves-effect"><a href="#!"><i class="material-icons">chevron_right</i></a></li>
    </ul>
    </div>`
    
    div.innerHTML = div.innerHTML + makeMapInfo().outerHTML + addTable().outerHTML;
    mainBody.innerHTML = div.innerHTML;
}

function makeMapInfo() {
    const mapData = {
        "title": "xi - FREEDOM DIVE [FOUR DIMENSIONS] by Nakagawa-Kanon",
        "metadata": "AR9, CS4, OD8, 7.58*"
    }
    const mapImgUrl = "https://assets.ppy.sh/beatmaps/39804/covers/cover.jpg";
    const mapInfoDiv = document.createElement('div');

    mapInfoDiv.innerHTML = mapInfoDiv.innerHTML + makeMapBg(mapImgUrl).outerHTML + makeMapData(mapData).outerHTML;
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
    <h7>${mapData.metadata}</h7>`;
    return mapInfoDiv;
}

function addTable() {
    const table = document.createElement('table');
    table.className = "highlight white-text";
    table.innerHTML = `<thead>
    <tr>
        <th>Team</th>
        <th>Players</th>
        <th>Combined Score</th>
    </tr>
    </thead>
    
    <tbody>`
    let tbody = ''
    sample.forEach(row => {
        tbody += `<tr>
        <td>${row.team}</td>
        <td>${row.players.join(", ")}</td>
        <td>${row.score}</td>
        </tr>`;
    });
    tbody += "</tbody>"
    table.innerHTML += tbody;
    return table;
}

function onChipChange(i) {
    let a;
    let chipsData = i[0].chipsData;
    console.log(chipsData);
    chipsData.forEach(chip => {
        a += chip.tag + ", ";
    })
    console.log(a);
}

