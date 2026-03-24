let lastSignalReceived = "";

async function syncWithElephantBet() {
    const status = document.getElementById("status");
    const signalDisplay = document.getElementById("signal");
    const confidenceDisplay = document.getElementById("confidence");
    const historyList = document.getElementById("history");
    const resultDisplay = document.getElementById("time");

    try {
        const response = await fetch('/get-live-signal');
        const data = await response.json();

        // Se houver um novo round finalizado no site oficial
        if (data.new_round) {
            // 1. Mostra o resultado do round que acabou de fechar
            const lastVal = parseFloat(data.last_result);
            const targetVal = parseFloat(lastSignalReceived);
            
            if (lastSignalReceived !== "") {
                if (lastVal >= targetVal) {
                    resultDisplay.innerText = `WIN ✅ (${lastVal}x)`;
                    resultDisplay.style.color = "#00ff88";
                } else {
                    resultDisplay.innerText = `LOSS ❌ (${lastVal}x)`;
                    resultDisplay.style.color = "#ff4444";
                }
            }

            // 2. Atualiza para o NOVO sinal sugerido pela IA
            status.innerText = "NOVA OPORTUNIDADE IDENTIFICADA!";
            signalDisplay.innerText = data.signal;
            confidenceDisplay.innerText = "Confiança: " + data.confidence + "%";
            lastSignalReceived = data.signal;

            // 3. Atualiza a lista visual de histórico real
            historyList.innerHTML = "";
            data.history.forEach(val => {
                let li = document.createElement("li");
                li.innerText = val + "x";
                li.style.color = parseFloat(val) > 2 ? "#b042ff" : "#fff";
                historyList.prepend(li);
            });
        } else {
            if (status.innerText === "Initializing AI...") {
                status.innerText = "Sincronizado. Aguardando próximo voo...";
            }
        }
    } catch (error) {
        console.error("Erro na sincronização:", error);
        status.innerText = "Erro de conexão...";
    }

    // Consulta o servidor a cada 2 segundos para precisão
    setTimeout(syncWithElephantBet, 2000);
}

// Inicia o ciclo de sincronização
syncWithElephantBet();
