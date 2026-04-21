package com.paf.project.repository.facilities;

import com.paf.project.model.facilities.FacilityTypeOption;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FacilityTypeRepository extends MongoRepository<FacilityTypeOption, String> {
    Optional<FacilityTypeOption> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);
}
