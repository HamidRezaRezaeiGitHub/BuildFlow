package dev.hr.rezaei.buildflow.user;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserMockDataInitializerTest {

    @Mock
    private UserMockDataProperties mockProperties;

    private UserMockDataInitializer userMockDataInitializer;

    @BeforeEach
    void setUp() {
        // Reset mocks before each test
        reset(mockProperties);
    }

    @Test
    void constructor_shouldNotInitializeMockUsers_whenMockDataIsDisabled() {
        // Given
        when(mockProperties.isEnabled()).thenReturn(false);

        // When
        userMockDataInitializer = new UserMockDataInitializer(mockProperties);

        // Then
        verify(mockProperties).isEnabled();
        assertTrue(userMockDataInitializer.getMockUsers().isEmpty());
    }

    @Test
    void constructor_shouldNotInitializeMockUsers_whenRolesAreNull() {
        // Given
        when(mockProperties.isEnabled()).thenReturn(true);
        when(mockProperties.getRoles()).thenReturn(null);

        // When
        userMockDataInitializer = new UserMockDataInitializer(mockProperties);

        // Then
        verify(mockProperties).isEnabled();
        verify(mockProperties).getRoles();
        assertTrue(userMockDataInitializer.getMockUsers().isEmpty());
    }

    @Test
    void constructor_shouldNotInitializeMockUsers_whenRolesAreEmpty() {
        // Given
        when(mockProperties.isEnabled()).thenReturn(true);
        when(mockProperties.getRoles()).thenReturn(Collections.emptyMap());

        // When
        userMockDataInitializer = new UserMockDataInitializer(mockProperties);

        // Then
        verify(mockProperties).isEnabled();
        verify(mockProperties, times(2)).getRoles(); // Called twice: null check and isEmpty() check
        assertTrue(userMockDataInitializer.getMockUsers().isEmpty());
    }

    @Test
    void constructor_shouldInitializeMockUsers_whenValidRolesProvided() {
        // Given
        UserMockDataProperties.MockUserProps builderProps = new UserMockDataProperties.MockUserProps();
        builderProps.setCount(2);
        UserMockDataProperties.MockUserProps ownerProps = new UserMockDataProperties.MockUserProps();
        ownerProps.setCount(1);

        Map<String, UserMockDataProperties.MockUserProps> roles = Map.of(
                "USER", builderProps,
                "PREMIUM_USER", ownerProps
        );

        when(mockProperties.isEnabled()).thenReturn(true);
        when(mockProperties.getRoles()).thenReturn(roles);

        User mockUser = new User();
        mockUser.setUsername("testuser");

        // When
        userMockDataInitializer = new UserMockDataInitializer(mockProperties);

        // Then
        Map<String, List<User>> mockUsers = userMockDataInitializer.getMockUsers();
        assertEquals(2, mockUsers.size());
        assertEquals(2, mockUsers.get("USER").size());
        assertEquals(1, mockUsers.get("PREMIUM_USER").size());
    }


    @Test
    void generateAddress_shouldReturnValidCanadianAddress_whenCalled() {
        // Given
        when(mockProperties.isEnabled()).thenReturn(false);
        userMockDataInitializer = new UserMockDataInitializer(mockProperties);

        // When
        var address = userMockDataInitializer.generateAddress();

        // Then
        assertNotNull(address);
        assertEquals("Canada", address.getCountry());
        assertNotNull(address.getStateOrProvince());
        assertTrue(Arrays.asList(UserMockDataInitializer.PROVINCES).contains(address.getStateOrProvince()));
        assertNotNull(address.getCity());
        assertNotNull(UserMockDataInitializer.PROVINCE_CITIES_MAP.get(address.getStateOrProvince()));
        assertTrue(Arrays.asList(UserMockDataInitializer.PROVINCE_CITIES_MAP.get(address.getStateOrProvince()))
                .contains(address.getCity()));
        assertNotNull(address.getStreetNumber());
        assertNotNull(address.getStreetName());
        assertNotNull(address.getPostalOrZipCode());
        assertTrue(Pattern.matches("[A-Z]\\d[A-Z] \\d[A-Z]\\d", address.getPostalOrZipCode()));
    }

}
