package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.dto.CategoryDto;
import org.example.entity.Category;
import org.example.exception.ResourceNotFoundException;
import org.example.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<CategoryDto> getTree() {
        List<Category> roots = categoryRepository.findByParentIsNull();
        return roots.stream().map(this::toDtoTree).toList();
    }

    public CategoryDto create(CategoryDto dto) {
        if (categoryRepository.existsByNom(dto.getNom())) {
            throw new IllegalArgumentException("Category " + dto.getNom() + " exists");
        }
        Category c = new Category();
        c.setNom(dto.getNom());
        c.setDescription(dto.getDescription());
        if (dto.getParentId() != null) {
            c.setParent(categoryRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent " + dto.getParentId() + " not found")));
        }
        return toDto(categoryRepository.save(c));
    }

    public CategoryDto update(Long id, CategoryDto dto) {
        Category c = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category " + id + " not found"));
        c.setNom(dto.getNom());
        c.setDescription(dto.getDescription());
        if (dto.getParentId() != null) {
            c.setParent(categoryRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent " + dto.getParentId() + " not found")));
        } else c.setParent(null);
        return toDto(categoryRepository.save(c));
    }

    public void delete(Long id) {
        Category c = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category " + id + " not found"));
        categoryRepository.delete(c);
    }

    private CategoryDto toDto(Category c) {
        return CategoryDto.builder()
                .id(c.getId())
                .nom(c.getNom())
                .description(c.getDescription())
                .parentId(c.getParent() != null ? c.getParent().getId() : null)
                .build();
    }

    private CategoryDto toDtoTree(Category c) {
        CategoryDto dto = toDto(c);
        dto.setChildren(c.getChildren().stream().map(this::toDtoTree).collect(Collectors.toList()));
        return dto;
    }
}
