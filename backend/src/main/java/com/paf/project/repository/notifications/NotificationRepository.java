package com.paf.project.repository.notifications;

import com.paf.project.model.notifications.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByUserIdOrderByCreationTimeDesc(String userId);
    List<Notification> findByUserIdAndReadFalseOrderByCreationTimeDesc(String userId);
    long countByUserIdAndReadFalse(String userId);
    List<Notification> findTop5ByUserIdOrderByCreationTimeDesc(String userId);

    @Query("{ $and: [" +
           "?#{ [0] == null ? { $where: 'true' } : { userId: ?0 } }," +
           "?#{ [1] == null ? { $where: 'true' } : { type: ?1 } }," +
           "?#{ [2] == null ? { $where: 'true' } : { read: ?2 } }" +
           "] }")
    List<Notification> findWithFilters(
            @Param("0") String userId,
            @Param("1") Notification.NotificationType type,
            @Param("2") Boolean isRead
    );
}
