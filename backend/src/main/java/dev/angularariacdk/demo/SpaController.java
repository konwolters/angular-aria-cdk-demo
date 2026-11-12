package dev.angularariacdk.demo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/** Only real Angular routes fall back to HTML; unknown APIs and assets stay 404. */
@Controller
public class SpaController {
    @GetMapping({"/", "/showcase", "/components", "/components/{slug:[a-z0-9-]+}",
            "/gui", "/gui/{page:[a-z0-9-]+}", "/gui/{page:[a-z0-9-]+}/{id:[a-zA-Z0-9-]+}"})
    public String index() {
        return "forward:/index.html";
    }
}
