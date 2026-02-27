package com.kellyflo.portfolio.controller.admin;

import com.kellyflo.portfolio.model.ServiceItem;
import com.kellyflo.portfolio.repository.ServiceItemRepository;
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
@RequestMapping("/api/admin/services")
public class AdminServiceController {

    private final ServiceItemRepository serviceItemRepository;

    public AdminServiceController(ServiceItemRepository serviceItemRepository) {
        this.serviceItemRepository = serviceItemRepository;
    }

    @GetMapping
    public List<ServiceItem> list() {
        return serviceItemRepository.findAllByOrderByDisplayOrderAsc();
    }

    @PostMapping
    public ResponseEntity<ServiceItem> create(@Valid @RequestBody ServiceItem payload) {
        payload.setId(null);
        return ResponseEntity.status(HttpStatus.CREATED).body(serviceItemRepository.save(payload));
    }

    @PutMapping("/{id}")
    public ServiceItem update(@PathVariable Long id, @Valid @RequestBody ServiceItem payload) {
        ServiceItem existing = serviceItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Service not found"));

        existing.setTitle(payload.getTitle());
        existing.setDescription(payload.getDescription());
        existing.setIcon(payload.getIcon());
        existing.setDisplayOrder(payload.getDisplayOrder());
        return serviceItemRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        ServiceItem existing = serviceItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Service not found"));
        serviceItemRepository.delete(existing);
        return ResponseEntity.noContent().build();
    }
}
