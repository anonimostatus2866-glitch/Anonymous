let texts = [
    "Initializing AI...",
    "Connecting to server...",
    "Analyzing patterns...",
    "Loading signals..."
];

let i = 0;

function updateLoading() {
    if (i < texts.length) {
        document.getElementById("loading-text").innerText = texts[i];
        i++;
        setTimeout(updateLoading, 1000);
    } else {
        document.getElementById("loader").style.display = "none";
    }
}

updateLoading();

/* FAKE PROFIT COUNTER */
let money = 1023;

setInterval(() => {
    money += Math.floor(Math.random() * 10);
    document.getElementById("money").innerText = "$" + money;
}, 2000);
