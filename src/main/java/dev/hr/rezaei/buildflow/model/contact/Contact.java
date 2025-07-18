package dev.hr.rezaei.buildflow.model.contact;

import dev.hr.rezaei.buildflow.model.address.Address;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Contact {
    private UUID id;
    private String name;
    private List<ContactLabel> labels;
    private String email;
    private String phone;
    private String notes;
    private Address address;
}
