from django.conf import settings
from django.http import HttpResponse

PAGE = (settings.BASE_DIR / "page.html").read_text(encoding="utf-8")


def index(request):
    return HttpResponse(PAGE, content_type="text/html; charset=utf-8")
