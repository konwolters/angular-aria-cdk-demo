"""Smoke-test the full application under its production URL prefix."""

import argparse
import json
import subprocess
import time
from urllib.error import URLError
from urllib.request import urlopen


def docker(*args):
    return subprocess.check_output(["docker", *args], text=True).strip()


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
    base = "http://" + docker("port", container, "8080/tcp") + "/aria-demo"
    for _ in range(240):
        try:
            with urlopen(base + "/actuator/health/readiness", timeout=3) as response:
                assert json.load(response)["status"] == "UP"
            break
        except (URLError, TimeoutError, ConnectionError):
            time.sleep(0.5)
    else:
        raise RuntimeError("Application did not become ready")

    with urlopen(base + "/gui/veranstaltungsorte", timeout=10) as response:
        html = response.read().decode()
        assert '<base href="/aria-demo/"' in html
        assert "<app-root" in html

    with urlopen(base + "/api/kulturkompass/veranstaltungsorte?size=1", timeout=10) as response:
        result = json.load(response)
        assert result["page"]["totalElements"] > 0
        assert len(result["content"]) == 1

    assert docker("inspect", "--format", "{{.Config.User}}", container) == "10001:10001"
    print("Container checks passed: readiness, Angular route, paginated API, non-root/read-only/512Mi")
except BaseException:
    subprocess.run(["docker", "logs", container], check=False)
    raise
finally:
    subprocess.run(["docker", "rm", "--force", container], check=False, stdout=subprocess.DEVNULL)
