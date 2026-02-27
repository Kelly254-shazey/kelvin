package com.kellyflo.portfolio.controller.admin;

import com.kellyflo.portfolio.model.Message;
import com.kellyflo.portfolio.repository.MessageRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/messages")
public class AdminMessageController {

    private final MessageRepository messageRepository;

    public AdminMessageController(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    @GetMapping
    public Page<Message> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean read) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return messageRepository.search(nullable(search), read, pageable);
    }

    @GetMapping("/{id}")
    public Message get(@PathVariable Long id) {
        Message message = findById(id);
        if (!message.isRead()) {
            message.setRead(true);
            messageRepository.save(message);
        }
        return message;
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Map<String, Object>> setRead(@PathVariable Long id, @RequestParam boolean read) {
        Message message = findById(id);
        message.setRead(read);
        messageRepository.save(message);
        return ResponseEntity.ok(Map.of("id", id, "read", read));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Message message = findById(id);
        messageRepository.delete(message);
        return ResponseEntity.noContent().build();
    }

    private Message findById(Long id) {
        return messageRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Message not found"));
    }

    private String nullable(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
