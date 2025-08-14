package dev.hr.rezaei.buildflow;

import dev.hr.rezaei.buildflow.user.ContactAddressDto;
import dev.hr.rezaei.buildflow.user.ContactDto;
import dev.hr.rezaei.buildflow.user.UserDto;
import dev.hr.rezaei.buildflow.user.UserDtoMapper;
import dev.hr.rezaei.buildflow.user.dto.*;
import org.junit.jupiter.api.BeforeEach;

import java.util.List;
import java.util.UUID;

import static dev.hr.rezaei.buildflow.user.ContactAddressDtoMapper.toContactAddressDto;
import static dev.hr.rezaei.buildflow.user.ContactDtoMapper.toContactDto;

public abstract class AbstractDtoTest {

    // Request DTOs (without IDs)
    protected ContactAddressRequestDto testBuilderContactAddressRequestDto;
    protected ContactAddressRequestDto testOwnerContactAddressRequestDto;
    protected ContactRequestDto testBuilderContactRequestDto;
    protected ContactRequestDto testOwnerContactRequestDto;

    // Response DTOs (with IDs) - keeping for response validation
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

    // Invalid DTOs for validation testing (using request DTOs)
    protected ContactRequestDto testContactRequestDtoWithBlankFirstName;
    protected ContactRequestDto testContactRequestDtoWithBlankLastName;
    protected ContactRequestDto testContactRequestDtoWithInvalidEmail;
    protected ContactRequestDto testContactRequestDtoWithBlankEmail;
    protected ContactRequestDto testContactRequestDtoWithNullLabels;
    protected ContactRequestDto testContactRequestDtoWithNullAddress;
    protected ContactAddressRequestDto testContactAddressRequestDtoWithLongStreetName;
    protected CreateBuilderRequest testCreateBuilderRequestWithNullContact;
    protected CreateOwnerRequest testCreateOwnerRequestWithNullContact;

    @BeforeEach
    public void setUpDtoObjects() {
        // Request DTOs (without IDs)
        testBuilderContactAddressRequestDto = ContactAddressRequestDto.builder()
                .streetName("123 Main St")
                .city("Test City")
                .stateOrProvince("Test State")
                .country("Test Country")
                .build();

        testOwnerContactAddressRequestDto = ContactAddressRequestDto.builder()
                .streetName("456 Oak Ave")
                .city("Owner City")
                .stateOrProvince("Owner State")
                .country("Owner Country")
                .build();

        testBuilderContactRequestDto = ContactRequestDto.builder()
                .firstName("John")
                .lastName("Builder")
                .email("john.builder@example.com")
                .phone("555-1234")
                .labels(List.of("BUILDER"))
                .addressRequestDto(testBuilderContactAddressRequestDto)
                .build();

        testOwnerContactRequestDto = ContactRequestDto.builder()
                .firstName("Jane")
                .lastName("Owner")
                .email("jane.owner@example.com")
                .phone("555-5678")
                .labels(List.of("OWNER"))
                .addressRequestDto(testOwnerContactAddressRequestDto)
                .build();

        // Response DTOs (with IDs) - keeping for response validation
        testBuilderContactAddressDto = toContactAddressDto(testBuilderContactAddressRequestDto);

        testOwnerContactAddressDto = toContactAddressDto(testOwnerContactAddressRequestDto);

        testBuilderContactDto = toContactDto(testBuilderContactRequestDto);

        testOwnerContactDto = toContactDto(testOwnerContactRequestDto);

        testBuilderUserDto = UserDtoMapper.toUserDto(testBuilderContactDto);
        testBuilderUserDto.setRegistered(true);
        testBuilderUserDto.setId(UUID.randomUUID());

        testOwnerUserDto = UserDtoMapper.toUserDto(testOwnerContactDto);
        testOwnerUserDto.setRegistered(false);
        testOwnerUserDto.setId(UUID.randomUUID());

        testCreateBuilderRequest = CreateBuilderRequest.builder()
                .registered(true)
                .contactRequestDto(testBuilderContactRequestDto)
                .build();

        testCreateBuilderResponse = CreateBuilderResponse.builder()
                .userDto(testBuilderUserDto)
                .build();

        testCreateOwnerRequest = CreateOwnerRequest.builder()
                .registered(false)
                .contactRequestDto(testOwnerContactRequestDto)
                .build();

        testCreateOwnerResponse = CreateOwnerResponse.builder()
                .userDto(testOwnerUserDto)
                .build();

        // Invalid DTOs for validation testing (using request DTOs)
        testContactRequestDtoWithBlankFirstName = ContactRequestDto.builder()
                .firstName("")  // Invalid: blank
                .lastName("Builder")
                .email("john.builder@example.com")
                .labels(List.of("BUILDER"))
                .addressRequestDto(testBuilderContactAddressRequestDto)
                .build();

        testContactRequestDtoWithBlankLastName = ContactRequestDto.builder()
                .firstName("John")
                .lastName("")  // Invalid: blank
                .email("john.builder@example.com")
                .labels(List.of("BUILDER"))
                .addressRequestDto(testBuilderContactAddressRequestDto)
                .build();

        testContactRequestDtoWithInvalidEmail = ContactRequestDto.builder()
                .firstName("John")
                .lastName("Builder")
                .email("invalid-email")  // Invalid: not a valid email format
                .labels(List.of("BUILDER"))
                .addressRequestDto(testBuilderContactAddressRequestDto)
                .build();

        testContactRequestDtoWithBlankEmail = ContactRequestDto.builder()
                .firstName("John")
                .lastName("Builder")
                .email("")  // Invalid: blank
                .labels(List.of("BUILDER"))
                .addressRequestDto(testBuilderContactAddressRequestDto)
                .build();

        testContactRequestDtoWithNullLabels = ContactRequestDto.builder()
                .firstName("John")
                .lastName("Builder")
                .email("john.builder@example.com")
                .labels(null)  // Invalid: null
                .addressRequestDto(testBuilderContactAddressRequestDto)
                .build();

        testContactRequestDtoWithNullAddress = ContactRequestDto.builder()
                .firstName("John")
                .lastName("Builder")
                .email("john.builder@example.com")
                .labels(List.of("BUILDER"))
                .addressRequestDto(null)  // Invalid: null
                .build();

        testContactAddressRequestDtoWithLongStreetName = ContactAddressRequestDto.builder()
                .streetName("a".repeat(201))  // Invalid: exceeds 200-character limit
                .city("Test City")
                .build();

        testCreateBuilderRequestWithNullContact = CreateBuilderRequest.builder()
                .registered(true)
                .contactRequestDto(null)  // Invalid: null
                .build();

        testCreateOwnerRequestWithNullContact = CreateOwnerRequest.builder()
                .registered(false)
                .contactRequestDto(null)  // Invalid: null
                .build();
    }
}
