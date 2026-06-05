const statusEl = document.getElementById("status");
const motdEl = document.getElementById("motd");
const playersEl = document.getElementById("players");
const listEl = document.getElementById("playerList");

function cleanMotd(motd) {
    if (!motd) return "No MOTD";
    return motd.replace(/§./g, "");
}

function getHead(name) {
    return `https://mc-heads.net/avatar/${name}/32`;
}

async function loadServer(IP) {
    document.getElementById("ip").innerText = IP;

    const statusDot = document.getElementById("statusDot");

    try {
        const res = await fetch(`https://api.mcstatus.io/v2/status/java/${IP}`);
        const data = await res.json();

        if (!data.online) {
            statusEl.innerHTML = "Offline / Or Rate Limited";
            statusDot.style.background = "#ff4d4d";
            motdEl.innerText = "No MOTD";
            playersEl.innerText = "";
            listEl.innerHTML = "<li><div class='player-link'>No players online</div></li>";
            return;
        }

        statusEl.innerHTML = "Online";
        statusDot.style.background = "#55ff55";

        motdEl.innerHTML = cleanMotd(data.motd?.clean || data.motd?.html || "No MOTD");

        playersEl.innerText = `Players: ${data.players.online} / ${data.players.max}`;

        listEl.innerHTML = "";

        if (data.players.list?.length > 0) {
            data.players.list.forEach(p => {
                const name = p.name_clean || p.name;

                const li = document.createElement("li");
                li.innerHTML = `
                    <a href="https://namemc.com/profile/${name}" target="_blank" class="player-link">
                        <img src="${getHead(name)}" alt="${name}" />
                        <span>${name}</span>
                    </a>
                `;
                listEl.appendChild(li);
            });
        } else {
            listEl.innerHTML = "<li><div class='player-link'>No players online</div></li>";
        }

    } catch (err) {
        document.getElementById("status").innerText = "Failed to fetch server data";
        console.error(err);
    }
}

function searchServer() {
    statusEl.innerHTML = "Checking Status..."
    motdEl.innerHTML = "Checking MOTD..."
    playersEl.innerHTML = "Checking Player Count..."
    listEl.innerHTML = "Checking Players..."
    const ip = document.getElementById("serverInput").value.trim();
    if (!ip) return;

    loadServer(ip);
}

loadServer("donutsmp.net");