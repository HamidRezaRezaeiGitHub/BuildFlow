package dev.hr.rezaei.buildflow;

import dev.hr.rezaei.buildflow.project.ProjectDto;
import dev.hr.rezaei.buildflow.project.ProjectLocationDto;
import dev.hr.rezaei.buildflow.project.dto.CreateProjectRequest;
import dev.hr.rezaei.buildflow.project.dto.CreateProjectResponse;
import dev.hr.rezaei.buildflow.project.dto.ProjectLocationRequestDto;
import dev.hr.rezaei.buildflow.user.ContactAddressDto;
import dev.hr.rezaei.buildflow.user.ContactDto;
import dev.hr.rezaei.buildflow.user.UserDto;
import dev.hr.rezaei.buildflow.user.UserDtoMapper;
import dev.hr.rezaei.buildflow.user.dto.ContactAddressRequestDto;
import dev.hr.rezaei.buildflow.user.dto.ContactRequestDto;
import dev.hr.rezaei.buildflow.user.dto.CreateUserRequest;
import dev.hr.rezaei.buildflow.user.dto.CreateUserResponse;
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
    protected CreateUserRequest testCreateBuilderRequest;
    protected CreateUserResponse testCreateBuilderResponse;
    protected CreateUserRequest testCreateOwnerRequest;
    protected CreateUserResponse testCreateOwnerResponse;

    // Project DTOs
    protected ProjectLocationRequestDto testProjectLocationRequestDto;
    protected ProjectLocationDto testProjectLocationDto;
    protected ProjectDto testProjectDto;
    protected CreateProjectRequest testCreateProjectRequest;
    protected CreateProjectResponse testCreateProjectResponse;

    // Invalid DTOs for validation testing (using request DTOs)
    protected ContactRequestDto testContactRequestDtoWithBlankFirstName;
    protected ContactRequestDto testContactRequestDtoWithBlankLastName;
    protected ContactRequestDto testContactRequestDtoWithInvalidEmail;
    protected ContactRequestDto testContactRequestDtoWithBlankEmail;
    protected ContactRequestDto testContactRequestDtoWithNullLabels;
    protected ContactRequestDto testContactRequestDtoWithNullAddress;
    protected ContactAddressRequestDto testContactAddressRequestDtoWithLongStreetName;
    protected CreateUserRequest testCreateBuilderRequestWithNullContact;
    protected CreateUserRequest testCreateOwnerRequestWithNullContact;

    // Invalid Project DTOs for validation testing
    protected CreateProjectRequest testCreateProjectRequestWithNullBuilderUserId;
    protected CreateProjectRequest testCreateProjectRequestWithNullLocation;
    protected ProjectLocationRequestDto testProjectLocationRequestDtoWithLongStreetName;

    @BeforeEach
    public void setUpDtoObjects() {
        // Request DTOs (without IDs)
        testBuilderContactAddressRequestDto = ContactAddressRequestDto.builder()
                .streetNumberAndName("123 Main St")
                .city("Test City")
                .stateOrProvince("Test State")
                .country("Test Country")
                .build();

        testOwnerContactAddressRequestDto = ContactAddressRequestDto.builder()
                .streetNumberAndName("456 Oak Ave")
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

        testCreateBuilderRequest = CreateUserRequest.builder()
                .registered(true)
                .contactRequestDto(testBuilderContactRequestDto)
                .username(testBuilderContactRequestDto.getEmail())
                .build();

        testCreateBuilderResponse = CreateUserResponse.builder()
                .userDto(testBuilderUserDto)
                .build();

        testCreateOwnerRequest = CreateUserRequest.builder()
                .registered(false)
                .contactRequestDto(testOwnerContactRequestDto)
                .username(testOwnerContactRequestDto.getEmail())
                .build();

        testCreateOwnerResponse = CreateUserResponse.builder()
                .userDto(testOwnerUserDto)
                .build();

        // Project-specific test data
        testProjectLocationRequestDto = ProjectLocationRequestDto.builder()
                .streetNumberAndName("789 Project Lane")
                .city("Project City")
                .stateOrProvince("Project State")
                .postalOrZipCode("12345")
                .country("Project Country")
                .build();

        testProjectLocationDto = ProjectLocationDto.builder()
                .id(UUID.randomUUID())
                .streetNumberAndName("789 Project Lane")
                .city("Project City")
                .stateOrProvince("Project State")
                .postalOrZipCode("12345")
                .country("Project Country")
                .build();

        testProjectDto = ProjectDto.builder()
                .id(UUID.randomUUID())
                .userId(testBuilderUserDto.getId())
                .role("BUILDER")
                .locationDto(testProjectLocationDto)
                .build();

        testCreateProjectRequest = CreateProjectRequest.builder()
                .userId(testBuilderUserDto.getId())
                .role("BUILDER")
                .locationRequestDto(testProjectLocationRequestDto)
                .build();

        testCreateProjectResponse = CreateProjectResponse.builder()
                .projectDto(testProjectDto)
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
                .streetNumberAndName("a".repeat(221))  // Invalid: exceeds 220-character limit
                .city("Test City")
                .build();

        testCreateBuilderRequestWithNullContact = CreateUserRequest.builder()
                .registered(true)
                .contactRequestDto(null)  // Invalid: null
                .build();

        testCreateOwnerRequestWithNullContact = CreateUserRequest.builder()
                .registered(false)
                .contactRequestDto(null)  // Invalid: null
                .build();

        // Invalid Project DTOs for validation testing
        testCreateProjectRequestWithNullBuilderUserId = CreateProjectRequest.builder()
                .userId(null)  // Invalid: null
                .role("BUILDER")
                .locationRequestDto(testProjectLocationRequestDto)
                .build();

        testCreateProjectRequestWithNullLocation = CreateProjectRequest.builder()
                .userId(testBuilderUserDto.getId())
                .role("BUILDER")
                .locationRequestDto(null)  // Invalid: null
                .build();

        testProjectLocationRequestDtoWithLongStreetName = ProjectLocationRequestDto.builder()
                .streetNumberAndName("a".repeat(221))  // Invalid: exceeds 220-character limit
                .city("Project City")
                .stateOrProvince("Project State")
                .country("Project Country")
                .build();
    }
}
