package com.orderplatform.service;

import com.orderplatform.dto.ProductRequest;
import com.orderplatform.dto.ProductResponse;
import com.orderplatform.entity.Product;
import com.orderplatform.exception.ResourceNotFoundException;
import com.orderplatform.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProductServiceTest {

    @Mock private ProductRepository productRepository;
    @InjectMocks private ProductService productService;

    @Test
    void testCreateProduct() {
        ProductRequest req = new ProductRequest("Gaming Keyboard", "RGB Mechanical", "Electronics", 89.99, 15, "kb.jpg");
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> {
            Product p = invocation.getArgument(0);
            p.setId(101L);
            return p;
        });

        ProductResponse res = productService.createProduct(req);

        assertNotNull(res);
        assertEquals(101L, res.id());
        assertEquals("Gaming Keyboard", res.name());
        assertEquals(89.99, res.price());
        assertTrue(res.active());
    }

    @Test
    void testGetProductById_NotFound() {
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            productService.getProductById(999L);
        });
    }

    @Test
    void testDeleteProduct_SoftDelete() {
        Product product = new Product(5L, "Headphones", "Audio", "Electronics", 49.99, 10, "audio.jpg", true);
        when(productRepository.findById(5L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));

        productService.deleteProduct(5L);

        assertFalse(product.getActive());
        verify(productRepository).save(product);
    }
}
