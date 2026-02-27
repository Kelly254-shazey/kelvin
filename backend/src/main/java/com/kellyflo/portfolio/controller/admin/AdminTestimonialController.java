package com.kellyflo.portfolio.controller.admin;

import com.kellyflo.portfolio.model.Testimonial;
import com.kellyflo.portfolio.repository.TestimonialRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/testimonials")
public class AdminTestimonialController {

    private final TestimonialRepository testimonialRepository;

    public AdminTestimonialController(TestimonialRepository testimonialRepository) {
        this.testimonialRepository = testimonialRepository;
    }

    @GetMapping
    public List<Testimonial> list() {
        return testimonialRepository.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping
    public ResponseEntity<Testimonial> create(@Valid @RequestBody Testimonial payload) {
        payload.setId(null);
        return ResponseEntity.status(HttpStatus.CREATED).body(testimonialRepository.save(payload));
    }

    @PutMapping("/{id}")
    public Testimonial update(@PathVariable Long id, @Valid @RequestBody Testimonial payload) {
        Testimonial existing = testimonialRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Testimonial not found"));

        existing.setName(payload.getName());
        existing.setRole(payload.getRole());
        existing.setQuote(payload.getQuote());
        existing.setAvatarUrl(payload.getAvatarUrl());
        return testimonialRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Testimonial existing = testimonialRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Testimonial not found"));
        testimonialRepository.delete(existing);
        return ResponseEntity.noContent().build();
    }
}
