package dev.hr.rezaei.buildflow.model.project;

import dev.hr.rezaei.buildflow.model.address.Address;
import dev.hr.rezaei.buildflow.model.contact.Contact;
import dev.hr.rezaei.buildflow.model.estimate.Estimate;
import dev.hr.rezaei.buildflow.model.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {
    private UUID id;
    private User createdBy;
    private User builder;
    private Contact owner;
    private Address address;
    private List<Estimate> estimates;
}

