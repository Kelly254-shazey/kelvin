package com.kellyflo.portfolio.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "messages")
public class Message extends BaseEntity {

    @NotBlank
    @Size(max = 120)
    @Column(nullable = false, length = 120)
    private String name;

    @NotBlank
    @Email
    @Size(max = 180)
    @Column(nullable = false, length = 180)
    private String email;

    @NotBlank
    @Size(max = 180)
    @Column(nullable = false, length = 180)
    private String subject;

    @NotBlank
    @Size(max = 3000)
    @Column(nullable = false, length = 3000, name = "message_text")
    private String body;

    @Column(nullable = false)
    private boolean isRead = false;
}
