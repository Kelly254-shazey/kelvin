package com.kellyflo.portfolio.controller.admin;

import com.kellyflo.portfolio.model.Skill;
import com.kellyflo.portfolio.repository.SkillRepository;
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
@RequestMapping("/api/admin/skills")
public class AdminSkillController {

    private final SkillRepository skillRepository;

    public AdminSkillController(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    @GetMapping
    public List<Skill> list() {
        return skillRepository.findAllByOrderByCategoryAscNameAsc();
    }

    @PostMapping
    public ResponseEntity<Skill> create(@Valid @RequestBody Skill payload) {
        payload.setId(null);
        return ResponseEntity.status(HttpStatus.CREATED).body(skillRepository.save(payload));
    }

    @PutMapping("/{id}")
    public Skill update(@PathVariable Long id, @Valid @RequestBody Skill payload) {
        Skill existing = skillRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Skill not found"));

        existing.setCategory(payload.getCategory());
        existing.setName(payload.getName());
        existing.setLevel(payload.getLevel());
        return skillRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Skill existing = skillRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Skill not found"));
        skillRepository.delete(existing);
        return ResponseEntity.noContent().build();
    }
}
