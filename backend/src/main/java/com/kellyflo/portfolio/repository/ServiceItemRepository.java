package com.kellyflo.portfolio.repository;

import com.kellyflo.portfolio.model.ServiceItem;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceItemRepository extends JpaRepository<ServiceItem, Long> {
    List<ServiceItem> findAllByOrderByDisplayOrderAsc();
}
