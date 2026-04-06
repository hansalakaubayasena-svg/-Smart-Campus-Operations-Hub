package com.paf.project.repository.incidents;

import com.paf.project.model.incidents.IncidentTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketRepository extends JpaRepository<IncidentTicket, Long> {
}
