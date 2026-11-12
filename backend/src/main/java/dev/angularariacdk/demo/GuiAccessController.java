package dev.angularariacdk.demo;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;

@RestController
public class GuiAccessController {
    private final String password;

    public GuiAccessController(@Value("${GUI_PASSWORD:}") String password) {
        this.password = password;
    }

    @GetMapping("/api/gui-access")
    public ResponseEntity<Void> access(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization,
                                       @RequestParam(value = "login", required = false) String login,
                                       HttpServletRequest request) {
        if (password.isBlank()) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).cacheControl(org.springframework.http.CacheControl.noStore()).build();
        }
        if (!validCredentials(authorization)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .header(HttpHeaders.WWW_AUTHENTICATE, "Basic realm=\"Kulturkompass\", charset=\"UTF-8\"")
                    .cacheControl(org.springframework.http.CacheControl.noStore()).build();
        }
        if (login != null) {
            return ResponseEntity.status(HttpStatus.SEE_OTHER)
                    .location(URI.create(request.getContextPath() + "/gui"))
                    .cacheControl(org.springframework.http.CacheControl.noStore()).build();
        }
        return ResponseEntity.noContent().cacheControl(org.springframework.http.CacheControl.noStore()).build();
    }

    private boolean validCredentials(String authorization) {
        if (authorization == null || !authorization.startsWith("Basic ")) return false;
        try {
            byte[] supplied = Base64.getDecoder().decode(authorization.substring(6));
            byte[] expected = ("kulturkompass:" + password).getBytes(StandardCharsets.UTF_8);
            return MessageDigest.isEqual(expected, supplied);
        } catch (IllegalArgumentException exception) {
            return false;
        }
    }
}
