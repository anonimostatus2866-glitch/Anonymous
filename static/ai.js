let currentSignal = null;

let realResult = null;



function generateRound() {

    let base = Math.random();



    if (base < 0.5) return (1 + Math.random()).toFixed(2);

    if (base < 0.8) return (2 + Math.random() * 2).toFixed(2);

    return (4 + Math.random() * 5).toFixed(2);

}



function generateSignal() {

    let value = (1.5 + Math.random() * 2).toFixed(2);

    let confidence = Math.floor(70 + Math.random() * 25);



    return { value: value + "x", confidence };

}



function startCycle() {

    let countdown = 10;

    let status = document.getElementById("status");



    status.innerText = "Next round in: " + countdown + "s";



    let timer = setInterval(() => {

        countdown--;

        status.innerText = "Next round in: " + countdown + "s";



        if (countdown <= 0) {

            clearInterval(timer);

            startRound();

        }

    }, 1000);

}



function startRound() {

    let status = document.getElementById("status");



    status.innerText = "Analyzing next flight...";



    setTimeout(() => {

        currentSignal = generateSignal();

        realResult = generateRound();



        document.getElementById("signal").innerText = currentSignal.value;

        document.getElementById("confidence").innerText =

            "Confidence: " + currentSignal.confidence + "%";



        status.innerText = "Signal sent — waiting result...";



        evaluateResult();

    }, 3000);

}



function evaluateResult() {

    setTimeout(() => {

        let signalValue = parseFloat(currentSignal.value);

        let resultValue = parseFloat(realResult);



        let resultText;



        if (resultValue >= signalValue) {

            resultText = "WIN ✅ (" + realResult + "x)";

        } else {

            resultText = "LOSS ❌ (" + realResult + "x)";

        }



        document.getElementById("time").innerText = resultText;



        addToHistory(currentSignal.value, resultText);



        setTimeout(startCycle, 4000);

    }, 4000);

}



function addToHistory(signal, result) {

    let history = document.getElementById("history");



    let li = document.createElement("li");

    li.innerText = signal + " → " + result;



    history.prepend(li);



    if (history.children.length > 8) {

        history.removeChild(history.lastChild);

    }

}



startCycle();



style.css(se fôr necessário, só não estrague meu visual):

let currentSignal = null;

let realResult = null;



function generateRound() {

    let base = Math.random();



    if (base < 0.5) return (1 + Math.random()).toFixed(2);

    if (base < 0.8) return (2 + Math.random() * 2).toFixed(2);

    return (4 + Math.random() * 5).toFixed(2);

}



function generateSignal() {

    let value = (1.5 + Math.random() * 2).toFixed(2);

    let confidence = Math.floor(70 + Math.random() * 25);



    return { value: value + "x", confidence };

}



function startCycle() {

    let countdown = 10;

    let status = document.getElementById("status");



    status.innerText = "Next round in: " + countdown + "s";



    let timer = setInterval(() => {

        countdown--;

        status.innerText = "Next round in: " + countdown + "s";



        if (countdown <= 0) {

            clearInterval(timer);

            startRound();

        }

    }, 1000);

}



function startRound() {

    let status = document.getElementById("status");



    status.innerText = "Analyzing next flight...";



    setTimeout(() => {

        currentSignal = generateSignal();

        realResult = generateRound();



        document.getElementById("signal").innerText = currentSignal.value;

        document.getElementById("confidence").innerText =

            "Confidence: " + currentSignal.confidence + "%";



        status.innerText = "Signal sent — waiting result...";



        evaluateResult();

    }, 3000);

}



function evaluateResult() {

    setTimeout(() => {

        let signalValue = parseFloat(currentSignal.value);

        let resultValue = parseFloat(realResult);



        let resultText;



        if (resultValue >= signalValue) {

            resultText = "WIN ✅ (" + realResult + "x)";

        } else {

            resultText = "LOSS ❌ (" + realResult + "x)";

        }



        document.getElementById("time").innerText = resultText;



        addToHistory(currentSignal.value, resultText);



        setTimeout(startCycle, 4000);

    }, 4000);

}



function addToHistory(signal, result) {

    let history = document.getElementById("history");



    let li = document.createElement("li");

    li.innerText = signal + " → " + result;



    history.prepend(li);



    if (history.children.length > 8) {

        history.removeChild(history.lastChild);

    }

}



startCycle();
