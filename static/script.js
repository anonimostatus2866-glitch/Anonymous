let historyList = [];

function generateSmartSignal() {
    let base = Math.random();

    let value;
    let confidence;

    if (base < 0.5) {
        value = (1.20 + Math.random()).toFixed(2);
        confidence = Math.floor(60 + Math.random() * 20);
    } else if (base < 0.8) {
        value = (2 + Math.random() * 2).toFixed(2);
        confidence = Math.floor(70 + Math.random() * 20);
    } else {
        value = (4 + Math.random() * 5).toFixed(2);
        confidence = Math.floor(80 + Math.random() * 15);
    }

    return { value: value + "x", confidence };
}

function updateSystem() {
    let progress = 0;
    let bar = document.getElementById("progress");
    let status = document.getElementById("status");

    let interval = setInterval(() => {
        progress += 5;
        bar.style.width = progress + "%";

        if (progress >= 100) {
            clearInterval(interval);

            status.innerText = "Signal ready";

            let signal = generateSmartSignal();

            document.getElementById("signal").innerText = signal.value;
            document.getElementById("confidence").innerText =
                "Confidence: " + signal.confidence + "%";

            let entryTime = Math.floor(Math.random() * 10) + 3;
            document.getElementById("time").innerText =
                "Entry in: " + entryTime + "s";

            addToHistory(signal.value);

            setTimeout(resetSystem, 3000);
        }
    }, 200);
}

function resetSystem() {
    document.getElementById("progress").style.width = "0%";
    document.getElementById("status").innerText = "Analyzing patterns...";
    updateSystem();
}

function addToHistory(value) {
    let history = document.getElementById("history");
    let li = document.createElement("li");
    li.innerText = value;

    history.prepend(li);

    if (history.children.length > 6) {
        history.removeChild(history.lastChild);
    }
}

updateSystem();
