package com.kellyflo.portfolio.repository;

import com.kellyflo.portfolio.model.SiteContent;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SiteContentRepository extends JpaRepository<SiteContent, Long> {
    Optional<SiteContent> findTopByOrderByIdAsc();
}
