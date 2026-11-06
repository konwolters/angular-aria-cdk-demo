"""Smoke-test the full application under its production URL prefix."""

import argparse
from html.parser import HTMLParser
import json
import subprocess
import time
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin, urlparse
from urllib.request import HTTPRedirectHandler, build_opener, urlopen


def docker(*args):
    return subprocess.check_output(["docker", *args], text=True).strip()


class Assets(HTMLParser):
    def __init__(self):
        super().__init__()
        self.paths = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "script" and "src" in attrs:
            self.paths.append(attrs["src"])
        if tag == "link" and attrs.get("rel") == "stylesheet":
            self.paths.append(attrs["href"])


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, *args):
        return None


parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("image")
parser.add_argument("--platform")
args = parser.parse_args()
platform = ["--platform", args.platform] if args.platform else []
container = docker(
    "run", "--detach", *platform,
    "--read-only", "--tmpfs", "/tmp:rw,nosuid,size=32m",
    "--cap-drop", "ALL", "--security-opt", "no-new-privileges",
    "--memory", "512m", "--pids-limit", "128",
    "--publish", "127.0.0.1::8080", args.image,
)

try:
    base = "http://" + docker("port", container, "8080/tcp")
    for attempt in range(240):
        try:
            with urlopen(base + "/aria-demo/actuator/health/readiness", timeout=3) as response:
                assert json.load(response)["status"] == "UP"
            break
        except (URLError, TimeoutError, ConnectionError):
            time.sleep(0.5)
    else:
        raise RuntimeError("Application did not become ready")

    for route in ("/", "/showcase", "/components", "/components/text-field", "/components/data-table-combined"):
        with urlopen(base + "/aria-demo" + route, timeout=10) as response:
            html = response.read().decode()
            assert response.status == 200
            assert '<base href="/aria-demo/"' in html
            assert "<app-root" in html

    assets = Assets()
    assets.feed(html)
    assert assets.paths, "No built Angular assets found"
    for path in assets.paths:
        url = urljoin(base + "/aria-demo/", path)
        assert urlparse(url).path.startswith("/aria-demo/")
        with urlopen(url, timeout=10) as response:
            assert response.status == 200
            assert "text/html" not in response.headers["Content-Type"]

    sources = {
        "component-source/text-field/text-field.ts": "TextFieldComponent",
        "component-source/text-field/text-field.html": "<app-field-wrapper",
        "component-source/field-wrapper/field-wrapper.ts": "FieldWrapperComponent",
        "component-source/field-wrapper/field-wrapper.html": "<label",
        "component-source/field-messages/field-messages.html": "showErrors()",
    }
    for path, expected in sources.items():
        with urlopen(base + "/aria-demo/" + path, timeout=10) as response:
            content = response.read().decode()
            assert response.status == 200
            assert "<app-root" not in content
            assert expected in content, f"Unexpected component source at {path}"

    for endpoint in ("customers", "orders", "projects"):
        with urlopen(base + f"/aria-demo/api/{endpoint}", timeout=10) as response:
            page = json.load(response)
            assert page["totalElements"] > 0
            assert page["content"]

    try:
        build_opener(NoRedirect).open(base + "/aria-demo?x=1", timeout=10)
    except HTTPError as response:
        assert 300 <= response.code < 400
        target = urlparse(response.headers["Location"])
        assert target.path == "/aria-demo/" and target.query == "x=1"
    else:
        raise AssertionError("Expected canonical trailing-slash redirect")

    for path in ("/aria-demo/api/missing", "/aria-demo/missing.js", "/aria-demo/missing", "/aria-demo-other/"):
        try:
            urlopen(base + path, timeout=10).close()
        except HTTPError as response:
            assert response.code == 404, (path, response.code)
            assert "<app-root" not in response.read().decode()
        else:
            raise AssertionError(f"Expected 404 at {path}")
    assert docker("inspect", "--format", "{{.Config.User}}", container) == "10001:10001"
    print("Container checks passed: Angular routes/assets, APIs, health, redirect, 404s, non-root/read-only/512Mi")
except BaseException:
    subprocess.run(["docker", "logs", container], check=False)
    raise
finally:
    subprocess.run(["docker", "rm", "--force", container], check=False, stdout=subprocess.DEVNULL)
