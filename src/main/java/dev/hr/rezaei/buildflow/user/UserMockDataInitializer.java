package dev.hr.rezaei.buildflow.user;

import dev.hr.rezaei.buildflow.user.dto.ContactAddressRequestDto;
import dev.hr.rezaei.buildflow.user.dto.ContactRequestDto;
import dev.hr.rezaei.buildflow.user.dto.CreateUserRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Component;

import java.util.*;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(value = "app.users.mock.enabled", havingValue = "true")
@DependsOn("adminUserInitializer")
public class UserMockDataInitializer implements ApplicationRunner {

    private final UserMockDataProperties properties;
    private final UserService userService;
    
    private final Map<String, List<User>> mockUsers = new HashMap<>();
    private final Random random = new Random();

    // Arrays for generating random data - Updated with Canadian data
    private static final String[] FIRST_NAMES = {
            "John", "Jane", "Michael", "Sarah", "David", "Emily", "Robert", "Lisa",
            "James", "Jennifer", "William", "Ashley", "Christopher", "Amanda", "Daniel", "Jessica"
    };

    private static final String[] LAST_NAMES = {
            "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
            "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Taylor"
    };

    private static final String[] CITIES = {
            "Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton", "Ottawa",
            "Winnipeg", "Quebec City", "Hamilton", "Kitchener", "London", "Victoria"
    };

    private static final String[] PROVINCES = {
            "ON", "QC", "BC", "AB", "MB", "SK", "NS", "NB", "NL", "PE", "YT", "NT", "NU"
    };

    private static final String[] COUNTRIES = {
            "Canada"
    };

    @Override
    public void run(ApplicationArguments args) {
        if (!properties.isEnabled()) {
            log.info("Mock user initialization is disabled.");
            return;
        }

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

    private User createUser(String role) {
        String firstName = FIRST_NAMES[random.nextInt(FIRST_NAMES.length)];
        String lastName = LAST_NAMES[random.nextInt(LAST_NAMES.length)];

        // Generate username starting with role's first letter
        String username = role.toLowerCase().charAt(0) + firstName.toLowerCase() +
                         lastName.toLowerCase() + random.nextInt(1000);

        // Generate email
        String email = firstName.toLowerCase() + "." + lastName.toLowerCase() +
                      random.nextInt(1000) + "@" + role.toLowerCase() + "example.com";

        // Generate phone number (Canadian format)
        String phone = "+1-" + (200 + random.nextInt(800)) + "-" +
                      (200 + random.nextInt(800)) + "-" +
                      (1000 + random.nextInt(9000));

        // Create address using Canadian data
        ContactAddressRequestDto addressDto = ContactAddressRequestDto.builder()
                .unitNumber(random.nextBoolean() ? "Unit " + (1 + random.nextInt(999)) : null)
                .streetNumber(String.valueOf(1 + random.nextInt(9999)))
                .streetName(generateStreetName())
                .city(CITIES[random.nextInt(CITIES.length)])
                .stateOrProvince(PROVINCES[random.nextInt(PROVINCES.length)])
                .postalOrZipCode(generateCanadianPostalCode())
                .country(COUNTRIES[0]) // Always Canada
                .build();

        // Create labels for the contact (use valid ContactLabel enum values)
        List<String> labels = new ArrayList<>();
        
        // Map role to valid ContactLabel enums
        switch (role.toUpperCase()) {
            case "BUILDER":
                labels.add(ContactLabel.BUILDER.name());
                break;
            case "OWNER":
                labels.add(ContactLabel.OWNER.name());
                break;
            case "SUPPLIER":
                labels.add(ContactLabel.SUPPLIER.name());
                break;
            case "SUBCONTRACTOR":
                labels.add(ContactLabel.SUBCONTRACTOR.name());
                break;
            default:
                // For roles like "TESTER" that don't have a direct enum mapping,
                // use OTHER and add a comment that this could be extended
                labels.add(ContactLabel.OTHER.name());
                break;
        }
        
        // Add additional random labels
        if (random.nextBoolean()) {
            labels.add(ContactLabel.SUBCONTRACTOR.name());
        }

        // Create contact request DTO
        ContactRequestDto contactDto = ContactRequestDto.builder()
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .phone(phone)
                .labels(labels)
                .addressRequestDto(addressDto)
                .build();

        // Create user request DTO
        CreateUserRequest request = CreateUserRequest.builder()
                .username(username)
                .registered(random.nextBoolean())
                .contactRequestDto(contactDto)
                .build();

        // Create and return the user
        try {
            userService.createUser(request);
            // Retrieve the created user by username
            return userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Failed to retrieve created user: " + username));
        } catch (Exception e) {
            log.error("Failed to create mock user for role {}: {}", role, e.getMessage());
            throw new RuntimeException("Failed to create mock user", e);
        }
    }

    private String generateCanadianPostalCode() {
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

    private String generateStreetName() {
        String[] streetTypes = {"Street", "Avenue", "Boulevard", "Drive", "Lane", "Road", "Way", "Court"};
        String[] streetNames = {"Main", "First", "Second", "Third", "Oak", "Pine", "Maple", "Cedar",
                               "Elm", "Park", "King", "Queen", "Yonge", "Bloor"};

        return streetNames[random.nextInt(streetNames.length)] + " " +
               streetTypes[random.nextInt(streetTypes.length)];
    }

    public Map<String, List<User>> getMockUsers() {
        return Collections.unmodifiableMap(mockUsers);
    }
}