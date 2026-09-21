package org.example.mapper;

import org.example.dto.CategoryDto;
import org.example.dto.ProductRequest;
import org.example.dto.ProductResponse;
import org.example.dto.ProductVariantDto;
import org.example.entity.Category;
import org.example.entity.Product;
import org.example.entity.ProductVariant;
import org.mapstruct.*;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "seller", ignore = true)
    @Mapping(target = "categories", ignore = true)
    @Mapping(target = "variants", ignore = true)
    @Mapping(target = "dateCreation", ignore = true)
    Product toEntity(ProductRequest dto);

    @Mapping(target = "sellerId", source = "seller.id")
    @Mapping(target = "sellerNom", source = "seller.prenom")
    @Mapping(target = "categories", source = "categories")
    ProductResponse toResponse(Product entity);

    ProductVariantDto toVariantDto(ProductVariant entity);

    CategoryDto toCategoryDto(Category entity);

    default Set<CategoryDto> toCategoryDtoSet(Set<Category> categories) {
        if (categories == null) return null;
        return categories.stream().map(this::toCategoryDto).collect(Collectors.toSet());
    }
}
