package com.kellyflo.portfolio.repository;

import com.kellyflo.portfolio.model.Project;
import com.kellyflo.portfolio.model.ProjectStatus;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    @Query("""
        SELECT p FROM Project p
        WHERE (:query IS NULL OR lower(p.title) LIKE lower(concat('%', :query, '%'))
        OR lower(p.summary) LIKE lower(concat('%', :query, '%'))
        OR lower(p.slug) LIKE lower(concat('%', :query, '%')))
        AND (:status IS NULL OR p.status = :status)
    """)
    Page<Project> search(@Param("query") String query, @Param("status") ProjectStatus status, Pageable pageable);

    List<Project> findByStatusOrderByUpdatedAtDesc(ProjectStatus status);

    List<Project> findByStatusAndFeaturedTrueOrderByUpdatedAtDesc(ProjectStatus status);
}
