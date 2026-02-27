package com.kellyflo.portfolio.repository;

import com.kellyflo.portfolio.model.Skill;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillRepository extends JpaRepository<Skill, Long> {
    List<Skill> findAllByOrderByCategoryAscNameAsc();
}
