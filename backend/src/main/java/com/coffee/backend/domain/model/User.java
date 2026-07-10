package com.coffee.backend.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    private Long id;

    private String fullName;

    @Indexed(unique = true)
    private String email;

    @Indexed(unique = true)
    private String username;

    @com.fasterxml.jackson.annotation.JsonProperty(access = com.fasterxml.jackson.annotation.JsonProperty.Access.WRITE_ONLY)
    private String password;

    private String phone;

    private Role role;

    @Builder.Default
    private Boolean locked = false;

    @Builder.Default
    private Boolean deleted = false;

    public Boolean isLocked() {
        return locked != null && locked;
    }

    public Boolean isDeleted() {
        return deleted != null && deleted;
    }

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
