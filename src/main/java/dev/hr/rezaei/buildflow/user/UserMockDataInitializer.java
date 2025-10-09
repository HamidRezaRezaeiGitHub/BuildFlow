package dev.hr.rezaei.buildflow.user;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Component;

import java.util.*;

@Slf4j
@Component
@ConditionalOnProperty(value = "app.users.mock.enabled", havingValue = "true")
@DependsOn("adminUserInitializer")
public class UserMockDataInitializer {

    public static final String MOCK_USER_PREFIX = "mock";

    private final UserMockDataProperties properties;
    private final Map<String, List<User>> mockUsers = new HashMap<>();
    private final Random random = new Random();

    public UserMockDataInitializer(UserMockDataProperties properties) {
        this.properties = properties;

        if (!properties.isEnabled()) {
            log.info("Mock user initialization is disabled.");
            return;
        }
        initializeMockUsers();
    }

    // Arrays for generating random data - Updated with Canadian data
    public static final String[] FIRST_NAMES = {
            "John", "Jane", "Michael", "Sarah", "David", "Emily", "Robert", "Lisa",
            "James", "Jennifer", "William", "Ashley", "Christopher", "Amanda", "Daniel", "Jessica"
    };

    public static final String[] LAST_NAMES = {
            "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
            "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Taylor"
    };

    public static final String[] STREET_TYPES = {
            "Street", "Avenue", "Boulevard", "Drive", "Lane", "Road", "Way", "Court"
    };

    public static final String[] STREET_NAMES = {
            "Main", "First", "Second", "Third", "Oak", "Pine", "Maple", "Cedar",
            "Elm", "Park", "King", "Queen", "Yonge", "Bloor"
    };

    public static final String[] COUNTRIES = {
            "Canada"
    };

    // Map of Canadian provinces to their cities
    public static final Map<String, String[]> PROVINCE_CITIES_MAP = Map.of(
            "ON", new String[]{"Toronto", "Hamilton", "Ottawa", "London", "Kitchener"},
            "QC", new String[]{"Montreal", "Quebec City", "Laval", "Gatineau"},
            "BC", new String[]{"Vancouver", "Victoria", "Surrey", "Burnaby"},
            "AB", new String[]{"Calgary", "Edmonton", "Red Deer", "Lethbridge"},
            "MB", new String[]{"Winnipeg", "Brandon", "Steinbach"},
            "SK", new String[]{"Saskatoon", "Regina", "Prince Albert"},
            "NS", new String[]{"Halifax", "Sydney", "Dartmouth"},
            "NB", new String[]{"Saint John", "Moncton", "Fredericton"},
            "NL", new String[]{"St. John's", "Corner Brook", "Mount Pearl"},
            "PE", new String[]{"Charlottetown", "Summerside", "Stratford"}
    );

    public static final String[] PROVINCES = PROVINCE_CITIES_MAP.keySet().toArray(new String[0]);

    protected void initializeMockUsers() {
        if (properties.getRoles() == null || properties.getRoles().isEmpty()) {
            log.info("No mock user roles configured.");
            return;
        }

        for (Map.Entry<String, UserMockDataProperties.MockUserProps> entry : properties.getRoles().entrySet()) {
            String role = entry.getKey();
            UserMockDataProperties.MockUserProps props = entry.getValue();
            log.info("Initializing {} mock users with role: {}", props.getCount(), role);
            for (int i = 1; i <= props.getCount(); i++) {
                User user = createUser(role);
                mockUsers.putIfAbsent(role, new ArrayList<>());
                mockUsers.get(role).add(user);
            }
        }
    }

    protected User createUser(String role) {
        String firstName = generateFirstName();
        String lastName = generateLastName();
        String username = generateUsername(firstName, lastName, role);
        String email = generateEmail(firstName, lastName, role);
        String phone = generatePhoneNumber();
        ContactAddress address = generateAddress();

        // Create labels for the contact - randomly choose between BUILDER and OWNER only
        List<ContactLabel> labels = new ArrayList<>();
        if (random.nextBoolean()) {
            labels.add(ContactLabel.BUILDER);
        } else {
            labels.add(ContactLabel.OWNER);
        }

        // Create contact
        Contact contact = Contact.builder()
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .phone(phone)
                .labels(labels)
                .address(address)
                .build();

        return User.builder()
                .username(username)
                .email(email)
                .registered(random.nextBoolean())
                .contact(contact)
                .build();
    }

    protected String generateFirstName() {
        return FIRST_NAMES[random.nextInt(FIRST_NAMES.length)];
    }

    protected String generateLastName() {
        return LAST_NAMES[random.nextInt(LAST_NAMES.length)];
    }

    protected String generateUsername(String firstName, String lastName, String role) {
        return MOCK_USER_PREFIX + role.toLowerCase().charAt(0) + firstName.toLowerCase() +
                lastName.toLowerCase() + random.nextInt(1000);
    }

    protected String generateEmail(String firstName, String lastName, String role) {
        return firstName.toLowerCase() + "." + lastName.toLowerCase() +
                random.nextInt(1000) + "@" + role.toLowerCase() + "example.com";
    }

    protected String generatePhoneNumber() {
        // Canadian phone number format: +1-XXX-XXX-XXXX
        return "+1-" + (200 + random.nextInt(800)) + "-" +
                (200 + random.nextInt(800)) + "-" +
                (1000 + random.nextInt(9000));
    }

    protected ContactAddress generateAddress() {
        String selectedProvince = PROVINCES[random.nextInt(PROVINCES.length)];
        String[] citiesInProvince = PROVINCE_CITIES_MAP.get(selectedProvince);
        String selectedCity = citiesInProvince[random.nextInt(citiesInProvince.length)];

        return ContactAddress.builder()
                .unitNumber(random.nextBoolean() ? "Unit " + (1 + random.nextInt(999)) : null)
                .streetNumberAndName(String.valueOf(1 + random.nextInt(9999)) + " " + generateStreetName())
                .city(selectedCity)
                .stateOrProvince(selectedProvince)
                .postalOrZipCode(generateCanadianPostalCode())
                .country(COUNTRIES[0]) // Always Canada
                .build();
    }

    protected String generateCanadianPostalCode() {
        // Canadian postal code format: A1A 1A1
        char[] letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toCharArray();
        char[] digits = "0123456789".toCharArray();

        return "" + letters[random.nextInt(letters.length)] +
                digits[random.nextInt(digits.length)] +
                letters[random.nextInt(letters.length)] + " " +
                digits[random.nextInt(digits.length)] +
                letters[random.nextInt(letters.length)] +
                digits[random.nextInt(digits.length)];
    }

    protected String generateStreetName() {
        return STREET_NAMES[random.nextInt(STREET_NAMES.length)] + " " +
                STREET_TYPES[random.nextInt(STREET_TYPES.length)];
    }

    public Map<String, List<User>> getMockUsers() {
        return Collections.unmodifiableMap(mockUsers);
    }
}
