import os
import threading
import time
from flask import Flask, render_template, jsonify
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By

app = Flask(__name__)

live_data = {"history": [], "last_result": None, "new_round": False, "signal": "Aguardando...", "confidence": 0}

def monitor_aviator():
    global live_data
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.binary_location = "/usr/bin/google-chrome" # Caminho do Docker

    driver = webdriver.Chrome(service=Service("/usr/local/bin/chromedriver"), options=options)
    
    try:
        driver.get("https://www.elephantbet.co.ao/games/aviator")
        time.sleep(20)
        last_payout = ""

        while True:
            try:
                # Seletor para os multiplicadores do Aviator
                elements = driver.find_elements(By.CSS_SELECTOR, ".payouts-block .bubble-multiplier")
                if elements:
                    current = [el.text.replace('x', '').strip() for el in elements if el.text]
                    if current and current[0] != last_payout:
                        last_payout = current[0]
                        live_data.update({
                            "history": current[:10],
                            "last_result": float(last_payout),
                            "new_round": True,
                            "signal": "2.00x" if float(last_payout) < 1.5 else "1.50x",
                            "confidence": 92
                        })
            except: pass
            time.sleep(2)
    finally:
        driver.quit()

threading.Thread(target=monitor_aviator, daemon=True).start()

@app.route("/")
def login(): return render_template("login.html")

@app.route("/welcome")
def welcome(): return render_template("welcome.html")

@app.route("/get-live-signal")
def get_live_signal():
    res = jsonify(live_data.copy())
    live_data["new_round"] = False
    return res

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
