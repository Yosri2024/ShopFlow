package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.dto.ProductRequest;
import org.example.dto.ProductResponse;
import org.example.entity.Category;
import org.example.entity.Product;
import org.example.exception.ResourceNotFoundException;
import org.example.mapper.ProductMapper;
import org.example.repository.CategoryRepository;
import org.example.repository.ProductRepository;
import org.example.repository.ProductSpecifications;
import org.example.repository.ReviewRepository;
import org.example.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final ProductMapper productMapper;

    // p.5 GET /api/products - liste paginée + filtres (categorie, prix, vendeur, promo) p.3 pagination obligatoire
    @Transactional(readOnly = true)
    public Page<ProductResponse> getProducts(Long categoryId, Long sellerId, BigDecimal prixMin, BigDecimal prixMax, Boolean promo, String q, Pageable pageable) {
        Specification<Product> spec = Specification.where(ProductSpecifications.isActif(true))
                .and(ProductSpecifications.hasCategory(categoryId))
                .and(ProductSpecifications.hasSeller(sellerId))
                .and(ProductSpecifications.priceBetween(prixMin, prixMax))
                .and(ProductSpecifications.isPromo(promo))
                .and(ProductSpecifications.search(q));
        return productRepository.findAll(spec, pageable).map(this::toResponseWithRating);
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product " + id + " not found"));
        return toResponseWithRating(p);
    }

    // p.5 POST /api/products - créer (SELLER/ADMIN)
    public ProductResponse createProduct(ProductRequest req, Long sellerId) {
        var seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new ResourceNotFoundException("Seller " + sellerId + " not found"));
        Product p = productMapper.toEntity(req);
        p.setSeller(seller);
        p.setActif(true);
        if (req.getCategoryIds() != null) {
            var cats = new HashSet<Category>(categoryRepository.findAllById(req.getCategoryIds()));
            p.setCategories(cats);
        }
        p = productRepository.save(p);
        return toResponseWithRating(p);
    }

    // p.5 PUT /api/products/{id} - modifier
    public ProductResponse updateProduct(Long id, ProductRequest req) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product " + id + " not found"));
        p.setNom(req.getNom());
        p.setDescription(req.getDescription());
        p.setPrix(req.getPrix());
        p.setPrixPromo(req.getPrixPromo());
        p.setStock(req.getStock());
        if (req.getCategoryIds() != null) {
            p.setCategories(new HashSet<>(categoryRepository.findAllById(req.getCategoryIds())));
        }
        if (req.getImages() != null) p.setImages(req.getImages());
        return toResponseWithRating(productRepository.save(p));
    }

    // p.5 DELETE /api/products/{id} - désactiver (soft delete)
    public void deactivateProduct(Long id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product " + id + " not found"));
        p.setActif(false);
        productRepository.save(p);
    }

    // p.5 GET /api/products/search?q=
    @Transactional(readOnly = true)
    public Page<ProductResponse> search(String q, Pageable pageable) {
        return productRepository.search(q, pageable).map(this::toResponseWithRating);
    }

    // p.5 GET /api/products/top-selling - top 10
    @Transactional(readOnly = true)
    public List<ProductResponse> getTopSelling() {
        List<Long> ids = productRepository.findTopSellingProductIds();
        if (ids.isEmpty()) return productRepository.findByActifTrue(org.springframework.data.domain.PageRequest.of(0, 10))
                .stream().map(this::toResponseWithRating).toList();
        return productRepository.findAllById(ids).stream().map(this::toResponseWithRating).toList();
    }

    private ProductResponse toResponseWithRating(Product p) {
        ProductResponse dto = productMapper.toResponse(p);
        Double avg = reviewRepository.findAverageRatingByProductId(p.getId());
        dto.setNoteMoyenne(avg);
        return dto;
    }
}
