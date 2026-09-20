from pathlib import Path

from litestar import Litestar, get
from litestar.response import Template
from litestar.response.base import Response

PAGE = (Path(__file__).parent / "page.html").read_text()


@get("/")
async def index() -> Response:
    return Response(content=PAGE, media_type="text/html")


app = Litestar(route_handlers=[index])
