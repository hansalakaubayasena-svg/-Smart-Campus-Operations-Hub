package com.paf.project.repository.facilities;

import com.paf.project.model.facilities.Facility;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FacilityRepository extends MongoRepository<Facility, String> {
	Optional<Facility> findByResourceId(String resourceId);

	boolean existsByResourceId(String resourceId);

	void deleteByResourceId(String resourceId);
}
