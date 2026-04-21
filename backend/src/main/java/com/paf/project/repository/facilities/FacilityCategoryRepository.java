package com.paf.project.repository.facilities;

import com.paf.project.model.facilities.FacilityCategoryOption;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FacilityCategoryRepository extends MongoRepository<FacilityCategoryOption, String> {
    List<FacilityCategoryOption> findByTypeId(String typeId);

    Optional<FacilityCategoryOption> findByTypeIdAndNameIgnoreCase(String typeId, String name);

    boolean existsByTypeIdAndNameIgnoreCase(String typeId, String name);
}
