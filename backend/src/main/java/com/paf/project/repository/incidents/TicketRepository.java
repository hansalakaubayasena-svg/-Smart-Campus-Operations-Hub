package com.paf.project.repository.incidents;

import com.paf.project.model.incidents.IncidentTicket;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends MongoRepository<IncidentTicket, String> {
    List<IncidentTicket> findAllByOrderByCreatedAtDesc();
}
