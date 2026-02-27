package com.kellyflo.portfolio.service;

import com.kellyflo.portfolio.dto.ContactMessageRequest;
import com.kellyflo.portfolio.model.Message;
import com.kellyflo.portfolio.repository.MessageRepository;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class MessageService {

    private static final Logger log = LoggerFactory.getLogger(MessageService.class);

    private final MessageRepository messageRepository;
    private final JavaMailSender mailSender;

    @Value("${app.mail.to}")
    private String mailTo;

    @Value("${app.mail.from}")
    private String mailFrom;

    @Value("${spring.mail.username:}")
    private String smtpUsername;

    public MessageService(MessageRepository messageRepository, JavaMailSender mailSender) {
        this.messageRepository = messageRepository;
        this.mailSender = mailSender;
    }

    @Transactional
    public Message createAndNotify(ContactMessageRequest request) {
        Message message = new Message();
        message.setName(request.name().trim());
        message.setEmail(request.email().trim());
        message.setSubject(request.subject().trim());
        message.setBody(request.body().trim());
        Message saved = messageRepository.save(message);

        if (StringUtils.hasText(smtpUsername) && StringUtils.hasText(mailTo)) {
            try {
                sendEmail(saved);
            } catch (Exception ex) {
                log.warn("Message {} saved but email notification failed: {}", saved.getId(), ex.getMessage());
            }
        }

        return saved;
    }

    private void sendEmail(Message message) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
            helper.setTo(mailTo);
            helper.setFrom(mailFrom);
            helper.setReplyTo(message.getEmail());
            helper.setSubject("[KELLYFLO Portfolio] New message: " + message.getSubject());
            helper.setText(buildMailBody(message), false);
            mailSender.send(mimeMessage);
        } catch (Exception ex) {
            throw new IllegalStateException("Email notification failed", ex);
        }
    }

    private String buildMailBody(Message message) {
        return "New contact form submission:\n\n"
                + "Name: " + message.getName() + "\n"
                + "Email: " + message.getEmail() + "\n"
                + "Subject: " + message.getSubject() + "\n\n"
                + "Message:\n" + message.getBody();
    }
}
