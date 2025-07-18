package dev.hr.rezaei.buildflow.model.user;

import dev.hr.rezaei.buildflow.model.contact.Contact;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    private UUID id;
    private String username;
    private String email;
    private Contact contact;
}
