package com.kellyflo.portfolio.controller;

import com.kellyflo.portfolio.dto.ContactMessageRequest;
import com.kellyflo.portfolio.model.Message;
import com.kellyflo.portfolio.service.MessageService;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createMessage(@Valid @RequestBody ContactMessageRequest request) {
        Message saved = messageService.createAndNotify(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                        "message", "Message sent successfully",
                        "id", saved.getId()));
    }
}
