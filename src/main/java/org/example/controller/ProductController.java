package org.example.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.dto.ProductRequest;
import org.example.dto.ProductResponse;
import org.example.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // GET /api/products - liste paginée + filtres (categorie, prix, vendeur, promo) - p.5
    @GetMapping
    public Page<ProductResponse> getProducts(
            @RequestParam(required = false) Long categorie,
            @RequestParam(required = false) Long vendeur,
            @RequestParam(required = false) BigDecimal prixMin,
            @RequestParam(required = false) BigDecimal prixMax,
            @RequestParam(required = false) Boolean promo,
            @RequestParam(required = false) String q,
            @PageableDefault(size = 10, sort = "dateCreation") Pageable pageable) {
        return productService.getProducts(categorie, vendeur, prixMin, prixMax, promo, q, pageable);
    }

    // GET /api/products/{id} - détail + variantes + avis + note moyenne
    @GetMapping("/{id}")
    public ProductResponse getProduct(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    // POST /api/products - créer (SELLER/ADMIN) - @Valid p.4
    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest req,
                                                         @RequestParam(defaultValue = "1") Long sellerId) {
        // sellerId sera remplacé par JWT plus tard (Spec 3.4)
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.createProduct(req, sellerId));
    }

    // PUT /api/products/{id} - modifier
    @PutMapping("/{id}")
    public ProductResponse updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest req) {
        return productService.updateProduct(id, req);
    }

    // DELETE /api/products/{id} - désactiver (soft delete)
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@PathVariable Long id) {
        productService.deactivateProduct(id);
    }

    // GET /api/products/search?q= - recherche full-text
    @GetMapping("/search")
    public Page<ProductResponse> search(@RequestParam String q, Pageable pageable) {
        return productService.search(q, pageable);
    }

    // GET /api/products/top-selling - top 10 meilleures ventes
    @GetMapping("/top-selling")
    public List<ProductResponse> topSelling() {
        return productService.getTopSelling();
    }
}
