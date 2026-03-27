package org.example.dmy.controller;

import org.example.dmy.model.Product;
import org.example.dmy.model.User;
import org.example.dmy.repository.UserRepository;
import org.example.dmy.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/user/{userId}")
    public List<Product> getByUser(@PathVariable Long userId) {
        return productService.getProductsByUserId(userId);
    }

    @PostMapping("/add/{userId}")
    public Product add(@PathVariable Long userId, @RequestBody Product product) {
        User user = userRepository.findById(userId).orElseThrow();
        product.setUser(user);
        return productService.addProduct(product);
    }

    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @RequestBody Product product) {
        return productService.updateProduct(id, product);
    }

    @GetMapping("/{id}")
    public Product getById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        productService.deleteProduct(id);
    }

    @PutMapping("/sold/{id}")
    public Product markAsSold(@PathVariable Long id) {
        return productService.markAsSold(id);
    }
}
