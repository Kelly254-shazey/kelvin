package com.kellyflo.portfolio.repository;

import com.kellyflo.portfolio.model.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("""
        SELECT m FROM Message m
        WHERE (:query = '' OR lower(m.name) LIKE concat('%', lower(:query), '%')
        OR lower(m.email) LIKE concat('%', lower(:query), '%')
        OR lower(m.subject) LIKE concat('%', lower(:query), '%'))
        AND (:read IS NULL OR m.isRead = :read)
    """)
    Page<Message> search(@Param("query") String query, @Param("read") Boolean read, Pageable pageable);
}
