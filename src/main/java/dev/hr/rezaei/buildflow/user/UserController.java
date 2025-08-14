package dev.hr.rezaei.buildflow.user;

import dev.hr.rezaei.buildflow.user.dto.CreateBuilderRequest;
import dev.hr.rezaei.buildflow.user.dto.CreateBuilderResponse;
import dev.hr.rezaei.buildflow.user.dto.CreateOwnerRequest;
import dev.hr.rezaei.buildflow.user.dto.CreateOwnerResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@Slf4j
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/builders")
    public ResponseEntity<CreateBuilderResponse> createBuilder(@Valid @RequestBody CreateBuilderRequest request) {
        log.info("Creating builder with request: {}", request);

        CreateBuilderResponse response = userService.createBuilder(request);

        log.info("Successfully created builder with ID: {}", response.getUserDto().getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/owners")
    public ResponseEntity<CreateOwnerResponse> createOwner(@Valid @RequestBody CreateOwnerRequest request) {
        log.info("Creating owner with request: {}", request);

        CreateOwnerResponse response = userService.createOwner(request);

        log.info("Successfully created owner with ID: {}", response.getUserDto().getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
