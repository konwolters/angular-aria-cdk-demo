package dev.angularariacdk.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.IntStream;

@RestController
public class DemoTablesController {
    private static final List<String> PEOPLE = List.of(
            "Avery Brooks", "Casey Morgan", "Jordan Lee", "Riley Patel", "Taylor Kim",
            "Morgan Chen", "Alex Rivera", "Jamie Wilson", "Cameron Clark", "Drew Turner");
    private static final List<String> COMPANIES = List.of(
            "Aria Labs", "Acme Studio", "Juniper Works", "Atlas Digital", "Brightside Co.");
    private static final List<String> ORDER_STATUSES = List.of("Bezahlt", "Ausstehend", "Erstattet");
    private static final List<String> PAYMENT_METHODS = List.of("Kreditkarte", "Überweisung", "PayPal");
    private static final List<String> PROJECT_STATUSES = List.of(
            "Aktiv", "Planung", "Abgeschlossen", "Pausiert");
    private static final List<String> PRIORITIES = List.of("Hoch", "Mittel", "Niedrig");

    private static final List<Order> ORDERS = IntStream.rangeClosed(1, 96)
            .mapToObj(DemoTablesController::order)
            .toList();
    private static final List<Project> PROJECTS = IntStream.rangeClosed(1, 64)
            .mapToObj(DemoTablesController::project)
            .toList();

    private static final Map<String, Comparator<Order>> ORDER_SORTS = Map.of(
            "orderNumber", Comparator.comparing(Order::orderNumber),
            "customer", Comparator.comparing(Order::customer, String.CASE_INSENSITIVE_ORDER),
            "orderedAt", Comparator.comparing(Order::orderedAt),
            "total", Comparator.comparing(Order::total));
    private static final Map<String, Comparator<Project>> PROJECT_SORTS = Map.of(
            "code", Comparator.comparing(Project::code),
            "name", Comparator.comparing(Project::name, String.CASE_INSENSITIVE_ORDER),
            "client", Comparator.comparing(Project::client, String.CASE_INSENSITIVE_ORDER),
            "owner", Comparator.comparing(Project::owner, String.CASE_INSENSITIVE_ORDER),
            "priority", Comparator.comparing(Project::priority),
            "updatedAt", Comparator.comparing(Project::updatedAt),
            "progress", Comparator.comparingInt(Project::progress));

    @GetMapping("/api/orders")
    public PageResponse<Order> orders(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(required = false) List<String> status,
            @RequestParam(required = false) List<String> paymentMethod,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size,
            @RequestParam(defaultValue = "orderedAt") String sort,
            @RequestParam(defaultValue = "desc") String direction) {
        Comparator<Order> comparator = ORDER_SORTS.getOrDefault(sort, ORDER_SORTS.get("orderedAt"));
        if ("desc".equalsIgnoreCase(direction)) {
            comparator = comparator.reversed();
        }

        String term = normalize(search);
        List<Order> filtered = ORDERS.stream()
                .filter(order -> matchesFilter(status, order.status()))
                .filter(order -> matchesFilter(paymentMethod, order.paymentMethod()))
                .filter(order -> matchesSearch(term, order.orderNumber(), order.customer()))
                .sorted(comparator)
                .toList();

        return PageResponse.from(filtered, page, size);
    }

    @GetMapping("/api/projects")
    public PageResponse<Project> projects(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(required = false) List<String> status,
            @RequestParam(required = false) List<String> priority,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size,
            @RequestParam(defaultValue = "updatedAt") String sort,
            @RequestParam(defaultValue = "desc") String direction) {
        Comparator<Project> comparator = PROJECT_SORTS.getOrDefault(sort, PROJECT_SORTS.get("updatedAt"));
        if ("desc".equalsIgnoreCase(direction)) {
            comparator = comparator.reversed();
        }

        String term = normalize(search);
        List<Project> filtered = PROJECTS.stream()
                .filter(project -> matchesFilter(status, project.status()))
                .filter(project -> matchesFilter(priority, project.priority()))
                .filter(project -> matchesSearch(term,
                        project.code(), project.name(), project.owner(), project.client()))
                .sorted(comparator)
                .toList();

        return PageResponse.from(filtered, page, size);
    }

    private static Order order(int id) {
        String orderNumber = "ORD-%05d".formatted(202600 + id);
        String customer = PEOPLE.get((id - 1) % PEOPLE.size());
        String paymentMethod = PAYMENT_METHODS.get(((id - 1) / ORDER_STATUSES.size()) % PAYMENT_METHODS.size());
        String status = ORDER_STATUSES.get((id - 1) % ORDER_STATUSES.size());
        BigDecimal total = BigDecimal.valueOf(3_499L + ((id * 1_739L) % 85_000L), 2);
        String orderedAt = LocalDate.of(2025, 1, 1).plusDays(id * 4L).toString();

        return new Order(id, orderNumber, customer, orderedAt, status, paymentMethod, total);
    }

    private static Project project(int id) {
        String code = "PRJ-%03d".formatted(id);
        String name = List.of("Customer Portal", "Mobile Checkout", "Analytics Platform", "Design System")
                .get((id - 1) % 4) + " " + ((id - 1) / 4 + 1);
        String owner = PEOPLE.get((id - 1) % PEOPLE.size());
        String client = COMPANIES.get((id - 1) % COMPANIES.size());
        String status = PROJECT_STATUSES.get((id - 1) % PROJECT_STATUSES.size());
        String priority = PRIORITIES.get(((id - 1) / PROJECT_STATUSES.size()) % PRIORITIES.size());
        String updatedAt = LocalDate.of(2025, 2, 1).plusDays(id * 5L).toString();
        int progress = (id * 17) % 101;

        return new Project(id, code, name, owner, client, status, priority, updatedAt, progress);
    }

    private static boolean matchesFilter(List<String> selectedValues, String value) {
        return selectedValues == null || selectedValues.isEmpty() || selectedValues.contains(value);
    }

    private static boolean matchesSearch(String term, String... values) {
        if (term.isEmpty()) {
            return true;
        }

        for (String value : values) {
            if (normalize(value).contains(term)) {
                return true;
            }
        }

        return false;
    }

    private static String normalize(String value) {
        return value.toLowerCase(Locale.ROOT).trim();
    }

    public record Order(
            int id,
            String orderNumber,
            String customer,
            String orderedAt,
            String status,
            String paymentMethod,
            BigDecimal total) {}

    public record Project(
            int id,
            String code,
            String name,
            String owner,
            String client,
            String status,
            String priority,
            String updatedAt,
            int progress) {}
}
