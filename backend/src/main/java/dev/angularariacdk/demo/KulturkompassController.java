package dev.angularariacdk.demo;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import tools.jackson.databind.json.JsonMapper;

import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/kulturkompass")
public class KulturkompassController {
    private final MockData data;

    public KulturkompassController(JsonMapper mapper) throws IOException {
        try (var input = new ClassPathResource("kulturkompass-demo.json").getInputStream()) {
            data = mapper.readValue(input, MockData.class);
        }
    }

    @GetMapping("/veranstaltungsorte")
    public Page<Map<String, String>> veranstaltungsorte(
            @RequestParam(defaultValue = "") String search,
            @RequestParam MultiValueMap<String, String> filters,
            @PageableDefault(size = 8) Pageable pageable) {
        return search(data.veranstaltungsorte(), search, filters, Function.identity(),
                List.of("name", "kundennummer", "bereichnummer", "alertId", "akronym", "lei"),
                List.of("status"), pageable);
    }

    @GetMapping("/angebote")
    public Page<Map<String, String>> angebote(
            @RequestParam(defaultValue = "") String search,
            @RequestParam MultiValueMap<String, String> filters,
            @PageableDefault(size = 8) Pageable pageable) {
        return search(data.angebote(), search, filters, this::mitStandort,
                List.of("name", "kundennummer", "lei", "bereichnummer", "isin", "agentBic", "konto", "bic", "zusatzinfo"),
                List.of("land", "geschaeft", "wertpapier"), pageable);
    }

    @GetMapping("/antraege")
    public Page<Map<String, String>> antraege(
            @RequestParam(defaultValue = "") String search,
            @RequestParam MultiValueMap<String, String> filters,
            @PageableDefault(size = 8) Pageable pageable) {
        return search(data.antraege(), search, filters, this::mitStandort,
                List.of("id", "kundennummer", "bereichnummer"), List.of("status", "bereich"), pageable);
    }

    @GetMapping("/import/vorschau")
    public Page<Map<String, String>> importVorschau(
            @RequestParam(defaultValue = "angebot") String datenart,
            @PageableDefault(size = 8) Pageable pageable) {
        var rows = switch (datenart) {
            case "angebot" -> angebotsvorschau();
            case "veranstaltungsort" -> veranstaltungsortvorschau();
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unbekannte Datenart");
        };
        return MockPages.from(rows, pageable);
    }

    private List<Map<String, String>> angebotsvorschau() {
        List<Map<String, String>> rows = new ArrayList<>();
        for (var angebot : data.angebote()) {
            Map<String, String> row = new LinkedHashMap<>(angebot);
            row.put("loeschen", "");
            addPreviewRow(rows, row);
        }
        return rows;
    }

    private List<Map<String, String>> veranstaltungsortvorschau() {
        List<Map<String, String>> rows = new ArrayList<>();
        for (var ort : data.veranstaltungsorte()) {
            for (String nummer : ort.get("bereichnummer").split(", ")) {
                var bereich = data.bereiche().stream()
                        .filter(item -> nummer.equals(item.get("bereichnummer")))
                        .findFirst().orElse(Map.of());
                Map<String, String> row = new LinkedHashMap<>(ort);
                row.put("bereichnummer", nummer);
                row.put("bereichbezeichnung", bereich.getOrDefault("bezeichnung", "Bereich"));
                row.put("bereichstatus", bereich.getOrDefault("status", "Aktiv"));
                row.put("kommentar", bereich.getOrDefault("kommentar", ""));
                row.put("zusatzdaten", data.bereichZusatzdaten().getOrDefault(nummer, List.of()).stream()
                        .map(entry -> ("KONTAKT".equals(entry.art()) ? "Kontakt" : entry.art()) + ": " + entry.wert())
                        .collect(Collectors.joining(", ")));
                addPreviewRow(rows, row);
            }
        }
        return rows;
    }

    private static void addPreviewRow(List<Map<String, String>> rows, Map<String, String> row) {
        row.put("zeile", String.valueOf(rows.size() + 1));
        row.put("aktion", "Ändern");
        row.put("fehler", "");
        rows.add(row);
    }

    private Map<String, String> mitStandort(Map<String, String> row) {
        var values = new LinkedHashMap<String, String>();
        data.veranstaltungsorte().stream()
                .filter(ort -> ort.get("name").equals(row.get("name")))
                .findFirst().ifPresent(values::putAll);
        values.putAll(row);
        return values;
    }

    private static Page<Map<String, String>> search(
            List<Map<String, String>> rows, String search, MultiValueMap<String, String> filters,
            Function<Map<String, String>, Map<String, String>> filterValues,
            List<String> textFields, List<String> choiceFields, Pageable pageable) {
        String term = normalize(search);
        var filtered = rows.stream()
                .filter(row -> term.isEmpty() || row.values().stream().anyMatch(value -> normalize(value).contains(term)))
                .filter(row -> {
                    var values = filterValues.apply(row);
                    return textFields.stream().allMatch(key -> matches(values, filters, key, false))
                            && choiceFields.stream().allMatch(key -> matches(values, filters, key, true));
                })
                .toList();
        return MockPages.from(filtered, pageable);
    }

    private static boolean matches(Map<String, String> values, MultiValueMap<String, String> filters,
                                   String key, boolean exact) {
        var criteria = filters.getOrDefault(key, List.of()).stream()
                .map(KulturkompassController::normalize)
                .filter(value -> !value.isEmpty())
                .toList();
        if (criteria.isEmpty()) return true;
        var actual = normalize(values.getOrDefault(key, ""));
        return criteria.stream().anyMatch(exact ? actual::equals : actual::contains);
    }

    private static String normalize(String value) {
        return value.strip().toLowerCase(Locale.GERMAN);
    }

    private record MockData(
            List<Map<String, String>> veranstaltungsorte,
            List<Map<String, String>> angebote,
            List<Map<String, String>> bereiche,
            Map<String, List<Zusatzdatum>> bereichZusatzdaten,
            List<Map<String, String>> antraege) {
    }

    private record Zusatzdatum(int id, String art, String wert, String beschreibung) {
    }
}
