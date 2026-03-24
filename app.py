import os
import threading
import time
from flask import Flask, render_template, jsonify
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By

app = Flask(__name__)

# Memória compartilhada para os dados reais
live_data = {
    "history": [],
    "last_result": None,
    "new_round": False,
    "signal": "Aguardando...",
    "confidence": 0
}

def monitor_aviator():
    global live_data
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    
    # Inicializa o navegador
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
    
    try:
        # Acessa o site oficial
        driver.get("https://www.elephantbet.co.ao/games/aviator")
        time.sleep(15) # Tempo para carregar o jogo e frames

        last_checked_payout = ""

        while True:
            try:
                # Localiza os elementos de histórico (multiplicadores coloridos)
                # O seletor '.payouts-block' é o padrão do fornecedor Spribe
                elements = driver.find_elements(By.CLASS_NAME, "payouts-block")
                if elements:
                    current_history = [el.text.replace('x', '').strip() for el in elements if el.text]
                    
                    if current_history and current_history[0] != last_checked_payout:
                        # Detectou um novo round finalizado
                        last_checked_payout = current_history[0]
                        live_data["history"] = current_history[:10]
                        live_data["last_result"] = float(last_checked_payout)
                        live_data["new_round"] = True
                        
                        # Lógica de Análise: Se o último foi baixo (< 1.5), gera sinal maior
                        if live_data["last_result"] < 1.5:
                            live_data["signal"] = "2.00x"
                            live_data["confidence"] = 95
                        else:
                            live_data["signal"] = "1.50x"
                            live_data["confidence"] = 88
                        
                        print(f"Novo Resultado Real: {last_checked_payout}x | Sinal Gerado: {live_data['signal']}")
                
            except Exception as e:
                print(f"Erro na captura de DOM: {e}")
            
            time.sleep(3) # Frequência de verificação
    finally:
        driver.quit()

# Inicia o robô em segundo plano
threading.Thread(target=monitor_aviator, daemon=True).start()

@app.route("/")
def login():
    return render_template("login.html")

@app.route("/welcome")
def welcome():
    return render_template("welcome.html")

@app.route("/get-live-signal")
def get_live_signal():
    global live_data
    # Retorna os dados e reseta o sinal de 'novo round' após o consumo
    data = jsonify({
        "history": live_data["history"],
        "signal": live_data["signal"],
        "confidence": live_data["confidence"],
        "new_round": live_data["new_round"],
        "last_result": live_data["last_result"]
    })
    live_data["new_round"] = False 
    return data

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
