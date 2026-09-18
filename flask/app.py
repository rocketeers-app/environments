from pathlib import Path

from flask import Flask

PAGE = (Path(__file__).resolve().parent / "page.html").read_text(encoding="utf-8")

app = Flask(__name__)


@app.get("/")
def index():
    return PAGE, 200, {"Content-Type": "text/html; charset=utf-8"}
