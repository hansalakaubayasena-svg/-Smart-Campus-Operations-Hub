package com.paf.project.repository.facilities;

import com.paf.project.model.facilities.Facility;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FacilityRepository extends MongoRepository<Facility, String> {
}
