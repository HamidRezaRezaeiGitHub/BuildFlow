package dev.hr.rezaei.buildflow;

import dev.hr.rezaei.buildflow.estimate.EstimateGroupRepository;
import dev.hr.rezaei.buildflow.estimate.EstimateLineRepository;
import dev.hr.rezaei.buildflow.estimate.EstimateRepository;
import dev.hr.rezaei.buildflow.project.ProjectLocationRepository;
import dev.hr.rezaei.buildflow.project.ProjectRepository;
import dev.hr.rezaei.buildflow.user.ContactAddressRepository;
import dev.hr.rezaei.buildflow.user.ContactRepository;
import dev.hr.rezaei.buildflow.user.User;
import dev.hr.rezaei.buildflow.user.UserRepository;
import dev.hr.rezaei.buildflow.workitem.WorkItem;
import dev.hr.rezaei.buildflow.workitem.WorkItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
public abstract class AbstractModelJpaTest extends AbstractModelTest {

    @Autowired
    protected ProjectRepository projectRepository;
    @Autowired
    protected ProjectLocationRepository projectLocationRepository;
    @Autowired
    protected ContactRepository contactRepository;
    @Autowired
    protected ContactAddressRepository contactAddressRepository;
    @Autowired
    protected UserRepository userRepository;
    @Autowired
    protected EstimateRepository estimateRepository;
    @Autowired
    protected EstimateGroupRepository estimateGroupRepository;
    @Autowired
    protected EstimateLineRepository estimateLineRepository;
    @Autowired
    protected WorkItemRepository workItemRepository;

    @BeforeEach
    public void clearDatabase() {
        estimateLineRepository.deleteAll();
        estimateGroupRepository.deleteAll();
        estimateRepository.deleteAll();
        workItemRepository.deleteAll();
        projectRepository.deleteAll();
        projectLocationRepository.deleteAll();
        userRepository.deleteAll();
        contactRepository.deleteAll();
        contactAddressRepository.deleteAll();
    }

    protected void persistWorkItemDependencies(WorkItem workItem) {
        User owner = workItem.getUser();
        if (owner.getId() == null || !userRepository.existsById(owner.getId())) {
            userRepository.save(owner); // It should cascade the save operation to Contact
        }
    }
}

