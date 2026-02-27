package com.kellyflo.portfolio.repository;

import com.kellyflo.portfolio.model.BlogDocument;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlogDocumentRepository extends JpaRepository<BlogDocument, Long> {
    List<BlogDocument> findAllByOrderByDisplayOrderAscIdAsc();

    List<BlogDocument> findByVisibleTrueOrderByDisplayOrderAscIdAsc();
}
