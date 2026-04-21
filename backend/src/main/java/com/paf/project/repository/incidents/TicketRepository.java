package com.paf.project.repository.incidents;

import com.paf.project.model.incidents.IncidentTicket;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketRepository extends MongoRepository<IncidentTicket, String> {
}
