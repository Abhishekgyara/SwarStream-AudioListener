window.onload = function () {

    loadProfile();

    renderHistory();

    renderDownloads();
};


function saveProfile() {

    let profile = {

        name:
            document.getElementById(
                "username"
            ).value,

        purpose:
            document.getElementById(
                "purpose"
            ).value
    };

    localStorage.setItem(
        "userProfile",
        JSON.stringify(profile)
    );

    document.getElementById(
        "profileModal"
    ).style.display = "none";

    showProfile();
}


function loadProfile() {

    let profile =
        JSON.parse(
            localStorage.getItem(
                "userProfile"
            )
        );

    if (!profile) {

        document.getElementById(
            "profileModal"
        ).style.display = "flex";

        return;
    }

    showProfile();
}


function showProfile() {

    let profile =
        JSON.parse(
            localStorage.getItem(
                "userProfile"
            )
        );

    document.getElementById(
        "welcomeText"
    ).innerHTML =
        "Welcome " + profile.name;

    document.getElementById(
        "purposeText"
    ).innerHTML =
        "Purpose: " + profile.purpose;
}


async function searchVideos() {

    let query =
        document.getElementById(
            "searchInput"
        ).value;

    saveSearch(query);

    let response =
        await fetch(
            `/search?q=${query}`
        );

    let data =
        await response.json();

    let results =
        document.getElementById(
            "results"
        );

    results.innerHTML = "";

    data.forEach(video => {

        results.innerHTML += `
        <div class="card">

            <img
            src="https://i.ytimg.com/vi/${video.id}/hqdefault.jpg">

            <h3>${video.title}</h3>

            <button
            onclick="playAudio('${video.id}')">
                Play
            </button>

            <a
            href="/download/${video.id}"
            onclick="saveDownload('${video.title}')">

                Download MP3

            </a>

        </div>
        `;
    });
}


async function playAudio(videoId) {

    let response =
        await fetch(
            `/play/${videoId}`
        );

    let data =
        await response.json();

    let player =
        document.getElementById(
            "player"
        );

    player.src =
        data.audio_url;

    player.play();
}


function saveSearch(query) {

    let history =
        JSON.parse(
            localStorage.getItem(
                "searchHistory"
            )
        ) || [];

    history.unshift(query);

    history = history.slice(0, 20);

    localStorage.setItem(
        "searchHistory",
        JSON.stringify(history)
    );

    renderHistory();
}


function renderHistory() {

    let history =
        JSON.parse(
            localStorage.getItem(
                "searchHistory"
            )
        ) || [];

    let html = "";

    history.forEach(item => {

        html += `
        <div
        class="historyItem"
        onclick="searchAgain('${item}')">

            ${item}

        </div>
        `;
    });

    document.getElementById(
        "history"
    ).innerHTML = html;
}


function searchAgain(query) {

    document.getElementById(
        "searchInput"
    ).value = query;

    searchVideos();
}


function clearHistory() {

    localStorage.removeItem(
        "searchHistory"
    );

    renderHistory();
}


function saveDownload(title) {

    let downloads =
        JSON.parse(
            localStorage.getItem(
                "downloads"
            )
        ) || [];

    downloads.unshift({

        title: title,

        date:
            new Date()
                .toLocaleString()
    });

    downloads = downloads.slice(0, 20);

    localStorage.setItem(
        "downloads",
        JSON.stringify(downloads)
    );

    renderDownloads();
}


function renderDownloads() {

    let downloads =
        JSON.parse(
            localStorage.getItem(
                "downloads"
            )
        ) || [];

    let html = "";

    downloads.forEach(item => {

        html += `
        <div class="historyItem">

            ${item.title}

            <br>

            <small>
                ${item.date}
            </small>

        </div>
        `;
    });

    document.getElementById(
        "downloads"
    ).innerHTML = html;
}


function clearDownloads() {

    localStorage.removeItem(
        "downloads"
    );

    renderDownloads();
}