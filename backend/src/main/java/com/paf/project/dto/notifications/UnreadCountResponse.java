package com.paf.project.dto.notifications;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UnreadCountResponse {
    private long count;
}
