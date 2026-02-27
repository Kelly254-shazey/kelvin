package com.kellyflo.portfolio.repository;

import com.kellyflo.portfolio.model.Video;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface VideoRepository extends JpaRepository<Video, Long> {

    @Query("""
        SELECT v FROM Video v
        WHERE (:query = '' OR lower(v.title) LIKE concat('%', lower(:query), '%')
        OR lower(v.description) LIKE concat('%', lower(:query), '%'))
        AND (:category = '' OR lower(v.category) = lower(:category))
        AND (:published IS NULL OR v.published = :published)
    """)
    Page<Video> search(@Param("query") String query, @Param("category") String category,
            @Param("published") Boolean published, Pageable pageable);

    List<Video> findByPublishedTrueOrderByCreatedAtDesc();
}
