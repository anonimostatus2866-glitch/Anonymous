from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

# fake user validation
def validate_user(username, password):
    if len(username) > 3 and len(password) > 3:
        return True
    return False

@app.route("/", methods=["GET", "POST"])
def login():
    message = ""
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]

        if validate_user(username, password):
            return redirect(url_for("welcome"))
        else:
            message = "Invalid account, try again"

    return render_template("login.html", message=message)

@app.route("/welcome")
def welcome():
    return render_template("welcome.html")

if __name__ == "__main__":
    app.run(debug=True)
