from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import HTMLResponse

PAGE = (Path(__file__).resolve().parent / "page.html").read_text(encoding="utf-8")

app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)


@app.get("/", response_class=HTMLResponse)
def index() -> str:
    return PAGE
