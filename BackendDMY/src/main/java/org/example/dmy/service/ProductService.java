package org.example.dmy.service;

import org.example.dmy.model.Product;
import org.example.dmy.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getProductsByUserId(Long userId) {
        return productRepository.findByUserId(userId);
    }

    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product details) {
        Product p = productRepository.findById(id).orElseThrow();
        p.setProductName(details.getProductName());
        p.setQuantity(details.getQuantity());
        p.setPrice(details.getPrice());
        return productRepository.save(p);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id).orElseThrow();
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public Product markAsSold(Long id) {
        Product p = productRepository.findById(id).orElseThrow();
        p.setStatus(org.example.dmy.enums.ProductStatus.SOLD);
        return productRepository.save(p);
    }
}
