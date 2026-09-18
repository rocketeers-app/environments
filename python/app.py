from pathlib import Path

PAGE = (Path(__file__).resolve().parent / "page.html").read_bytes()


def app(environ, start_response):
    if environ.get("PATH_INFO", "/") != "/":
        body = b"Not Found"
        start_response("404 Not Found", [("Content-Type", "text/plain"), ("Content-Length", str(len(body)))])
        return [body]

    start_response("200 OK", [("Content-Type", "text/html; charset=utf-8"), ("Content-Length", str(len(PAGE)))])
    return [PAGE]
