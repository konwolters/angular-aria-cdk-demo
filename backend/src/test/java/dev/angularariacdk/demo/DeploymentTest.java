package dev.angularariacdk.demo;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = {"server.servlet.context-path=/aria-demo", "GUI_PASSWORD=test-password"})
class DeploymentTest {
    @LocalServerPort
    private int port;

    private final HttpClient client = HttpClient.newHttpClient();

    private HttpResponse<String> get(String path) throws Exception {
        return client.send(HttpRequest.newBuilder(URI.create("http://localhost:" + port + path))
                .GET().build(), HttpResponse.BodyHandlers.ofString());
    }

    @Test
    void servesAngularRoutesUnderTheContextPath() throws Exception {
        for (String route : new String[]{"/", "/showcase", "/components", "/components/text-field",
                "/components/data-table-combined"}) {
            var response = get("/aria-demo" + route);
            assertThat(response.statusCode()).as(route).isEqualTo(200);
            assertThat(response.body()).contains("<app-root>", "<base href=\"/aria-demo/\"");
        }
    }

    @Test
    void redirectsTheBareContextOnceAndPreservesQuery() throws Exception {
        var response = get("/aria-demo?x=1");
        assertThat(response.statusCode()).isBetween(300, 399);
        var target = URI.create(response.headers().firstValue("location").orElseThrow());
        assertThat(target.getPath()).isEqualTo("/aria-demo/");
        assertThat(target.getQuery()).isEqualTo("x=1");
    }

    @Test
    void servesApisAndHealthChecksWithoutHtml() throws Exception {
        for (String path : new String[]{"/api/customers", "/api/orders", "/api/projects",
                "/actuator/health/readiness", "/actuator/health/liveness"}) {
            var response = get("/aria-demo" + path);
            assertThat(response.statusCode()).as(path).isEqualTo(200);
            assertThat(response.headers().firstValue("content-type").orElseThrow())
                    .matches("application/(json|[^;]+\\+json)(;.*)?");
            assertThat(response.body()).doesNotContain("<app-root");
        }
    }

    @Test
    void doesNotReturnSpaHtmlForUnknownPaths() throws Exception {
        for (String path : new String[]{"/api/missing", "/missing.js", "/missing", "/components/missing.js"}) {
            var response = get("/aria-demo" + path);
            assertThat(response.statusCode()).as(path).isEqualTo(404);
            assertThat(response.body()).doesNotContain("<app-root");
        }
    }

    @Test
    void protectsGuiAccessWhileKeepingTheRestPublic() throws Exception {
        var denied = get("/aria-demo/api/gui-access");
        assertThat(denied.statusCode()).isEqualTo(401);
        assertThat(denied.headers().firstValue("www-authenticate").orElseThrow()).contains("Basic");
        assertThat(get("/aria-demo/showcase").statusCode()).isEqualTo(200);

        var credentials = Base64.getEncoder().encodeToString("kulturkompass:test-password".getBytes(StandardCharsets.UTF_8));
        var request = HttpRequest.newBuilder(URI.create("http://localhost:" + port + "/aria-demo/api/gui-access"))
                .header("Authorization", "Basic " + credentials).GET().build();
        assertThat(client.send(request, HttpResponse.BodyHandlers.ofString()).statusCode()).isEqualTo(204);

        var invalid = HttpRequest.newBuilder(URI.create("http://localhost:" + port + "/aria-demo/api/gui-access"))
                .header("Authorization", "Basic invalid").GET().build();
        assertThat(client.send(invalid, HttpResponse.BodyHandlers.ofString()).statusCode()).isEqualTo(401);
        assertThat(new GuiAccessController("").access(null, null, null).getStatusCode().value()).isEqualTo(503);
    }
}
