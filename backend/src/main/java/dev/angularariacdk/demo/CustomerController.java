package dev.angularariacdk.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.IntStream;

@RestController
public class CustomerController {
    private static final List<String> FIRST_NAMES = List.of(
            "Jordan", "Alex", "Taylor", "Morgan", "Casey",
            "Riley", "Jamie", "Avery", "Drew", "Cameron");
    private static final List<String> LAST_NAMES = List.of(
            "Davis", "Morgan", "Chen", "Patel", "Miller",
            "Garcia", "Kim", "Wilson", "Brown", "Taylor");
    private static final List<String> COMPANIES = List.of(
            "Acme Studio", "Northwind Labs", "Brightside Co.",
            "Juniper Works", "Atlas Digital", "Clearwater Group");
    private static final List<String> REGIONS = List.of(
            "North America", "Europe", "Asia Pacific", "Latin America", "Africa",
            "Middle East", "Caribbean", "Oceania", "Northern Europe", "Southern Europe",
            "Western Europe", "Eastern Europe", "Central Europe", "Southeast Asia", "East Asia",
            "South Asia", "Central Asia", "West Asia", "North Africa", "West Africa",
            "East Africa", "Southern Africa", "Central Africa", "Central America", "South America",
            "Australia", "New Zealand", "Japan", "South Korea", "China", "India", "Singapore",
            "Hong Kong", "Taiwan", "Thailand", "Vietnam", "Malaysia", "Indonesia",
            "Philippines", "Brazil", "Mexico", "Argentina", "Chile", "Colombia", "Peru",
            "United States", "Canada", "United Kingdom", "Germany", "France");
    private static final List<String> STATUSES = List.of("Active", "Pending", "Inactive");

    private static final List<Customer> CUSTOMERS = IntStream.rangeClosed(1, 75)
            .mapToObj(CustomerController::customer)
            .toList();

    private static final Map<String, Comparator<Customer>> SORTS = Map.of(
            "name", Comparator.comparing(Customer::name, String.CASE_INSENSITIVE_ORDER),
            "company", Comparator.comparing(Customer::company, String.CASE_INSENSITIVE_ORDER),
            "region", Comparator.comparing(Customer::region, String.CASE_INSENSITIVE_ORDER),
            "joined", Comparator.comparing(Customer::joined));

    @GetMapping("/api/customers")
    public PageResponse<Customer> customers(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(required = false) List<String> status,
            @RequestParam(required = false) List<String> region,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size,
            @RequestParam(defaultValue = "name") String sort,
            @RequestParam(defaultValue = "asc") String direction) {
        Comparator<Customer> comparator = SORTS.getOrDefault(sort, SORTS.get("name"));
        if ("desc".equalsIgnoreCase(direction)) {
            comparator = comparator.reversed();
        }

        String term = search.toLowerCase(Locale.ROOT).trim();
        List<Customer> filtered = CUSTOMERS.stream()
                .filter(customer -> status == null || status.isEmpty() || status.contains(customer.status()))
                .filter(customer -> region == null || region.isEmpty() || region.contains(customer.region()))
                .filter(customer -> matchesSearch(customer, term))
                .sorted(comparator)
                .toList();

        return PageResponse.from(filtered, page, size);
    }

    private static boolean matchesSearch(Customer customer, String term) {
        if (term.isEmpty()) {
            return true;
        }

        String searchableText = customer.name() + " " + customer.email() + " " + customer.company();
        return searchableText.toLowerCase(Locale.ROOT).contains(term);
    }

    private static Customer customer(int id) {
        String firstName = FIRST_NAMES.get((id - 1) % FIRST_NAMES.size());
        String lastName = LAST_NAMES.get(((id - 1) / FIRST_NAMES.size() + id - 1) % LAST_NAMES.size());
        String fullName = firstName + " " + lastName;
        String email = firstName.toLowerCase(Locale.ROOT)
                + "."
                + lastName.toLowerCase(Locale.ROOT)
                + id
                + "@example.com";

        return new Customer(
                id,
                fullName,
                email,
                COMPANIES.get((id - 1) % COMPANIES.size()),
                STATUSES.get((id - 1) % STATUSES.size()),
                REGIONS.get((id - 1) % REGIONS.size()),
                LocalDate.of(2023, 1, 1).plusDays(id * 11L).toString());
    }

    public record Customer(
            int id,
            String name,
            String email,
            String company,
            String status,
            String region,
            String joined) {}
}
