package dev.hr.rezaei.buildflow;

import dev.hr.rezaei.buildflow.user.ContactAddressDto;
import dev.hr.rezaei.buildflow.user.ContactDto;
import dev.hr.rezaei.buildflow.user.UserDto;
import dev.hr.rezaei.buildflow.user.dto.CreateBuilderRequest;
import dev.hr.rezaei.buildflow.user.dto.CreateBuilderResponse;
import dev.hr.rezaei.buildflow.user.dto.CreateOwnerRequest;
import dev.hr.rezaei.buildflow.user.dto.CreateOwnerResponse;
import org.junit.jupiter.api.BeforeEach;

import java.util.List;
import java.util.UUID;

public abstract class AbstractDtoTest {

    protected ContactAddressDto testBuilderContactAddressDto;
    protected ContactAddressDto testOwnerContactAddressDto;
    protected ContactDto testBuilderContactDto;
    protected ContactDto testOwnerContactDto;
    protected UserDto testBuilderUserDto;
    protected UserDto testOwnerUserDto;
    protected CreateBuilderRequest testCreateBuilderRequest;
    protected CreateBuilderResponse testCreateBuilderResponse;
    protected CreateOwnerRequest testCreateOwnerRequest;
    protected CreateOwnerResponse testCreateOwnerResponse;

    // Invalid DTOs for validation testing
    protected ContactDto testContactDtoWithBlankFirstName;
    protected ContactDto testContactDtoWithBlankLastName;
    protected ContactDto testContactDtoWithInvalidEmail;
    protected ContactDto testContactDtoWithBlankEmail;
    protected ContactDto testContactDtoWithNullLabels;
    protected ContactDto testContactDtoWithNullAddress;
    protected ContactAddressDto testContactAddressDtoWithLongStreetName;
    protected CreateBuilderRequest testCreateBuilderRequestWithNullContact;
    protected CreateOwnerRequest testCreateOwnerRequestWithNullContact;

    @BeforeEach
    public void setUpDtoObjects() {
        testBuilderContactAddressDto = ContactAddressDto.builder()
                .streetName("123 Main St")
                .city("Test City")
                .stateOrProvince("Test State")
                .country("Test Country")
                .build();

        testOwnerContactAddressDto = ContactAddressDto.builder()
                .streetName("456 Oak Ave")
                .city("Owner City")
                .stateOrProvince("Owner State")
                .country("Owner Country")
                .build();

        testBuilderContactDto = ContactDto.builder()
                .firstName("John")
                .lastName("Builder")
                .email("john.builder@example.com")
                .phone("555-1234")
                .labels(List.of("BUILDER"))
                .addressDto(testBuilderContactAddressDto)
                .build();

        testOwnerContactDto = ContactDto.builder()
                .firstName("Jane")
                .lastName("Owner")
                .email("jane.owner@example.com")
                .phone("555-5678")
                .labels(List.of("OWNER"))
                .addressDto(testOwnerContactAddressDto)
                .build();

        testBuilderUserDto = UserDto.builder()
                .id(UUID.randomUUID())
                .email("john.builder@example.com")
                .registered(true)
                .contactDto(testBuilderContactDto)
                .build();

        testOwnerUserDto = UserDto.builder()
                .id(UUID.randomUUID())
                .email("jane.owner@example.com")
                .registered(false)
                .contactDto(testOwnerContactDto)
                .build();

        testCreateBuilderRequest = CreateBuilderRequest.builder()
                .registered(true)
                .contactDto(testBuilderContactDto)
                .build();

        testCreateBuilderResponse = CreateBuilderResponse.builder()
                .userDto(testBuilderUserDto)
                .build();

        testCreateOwnerRequest = CreateOwnerRequest.builder()
                .registered(false)
                .contactDto(testOwnerContactDto)
                .build();

        testCreateOwnerResponse = CreateOwnerResponse.builder()
                .userDto(testOwnerUserDto)
                .build();

        // Invalid DTOs for validation testing
        testContactDtoWithBlankFirstName = ContactDto.builder()
                .firstName("")  // Invalid: blank
                .lastName("Builder")
                .email("john.builder@example.com")
                .labels(List.of("BUILDER"))
                .addressDto(testBuilderContactAddressDto)
                .build();

        testContactDtoWithBlankLastName = ContactDto.builder()
                .firstName("John")
                .lastName("")  // Invalid: blank
                .email("john.builder@example.com")
                .labels(List.of("BUILDER"))
                .addressDto(testBuilderContactAddressDto)
                .build();

        testContactDtoWithInvalidEmail = ContactDto.builder()
                .firstName("John")
                .lastName("Builder")
                .email("invalid-email")  // Invalid: not a valid email format
                .labels(List.of("BUILDER"))
                .addressDto(testBuilderContactAddressDto)
                .build();

        testContactDtoWithBlankEmail = ContactDto.builder()
                .firstName("John")
                .lastName("Builder")
                .email("")  // Invalid: blank
                .labels(List.of("BUILDER"))
                .addressDto(testBuilderContactAddressDto)
                .build();

        testContactDtoWithNullLabels = ContactDto.builder()
                .firstName("John")
                .lastName("Builder")
                .email("john.builder@example.com")
                .labels(null)  // Invalid: null
                .addressDto(testBuilderContactAddressDto)
                .build();

        testContactDtoWithNullAddress = ContactDto.builder()
                .firstName("John")
                .lastName("Builder")
                .email("john.builder@example.com")
                .labels(List.of("BUILDER"))
                .addressDto(null)  // Invalid: null
                .build();

        testContactAddressDtoWithLongStreetName = ContactAddressDto.builder()
                .streetName("a".repeat(201))  // Invalid: exceeds 200 character limit
                .city("Test City")
                .build();

        testCreateBuilderRequestWithNullContact = CreateBuilderRequest.builder()
                .registered(true)
                .contactDto(null)  // Invalid: null
                .build();

        testCreateOwnerRequestWithNullContact = CreateOwnerRequest.builder()
                .registered(false)
                .contactDto(null)  // Invalid: null
                .build();
    }
}
