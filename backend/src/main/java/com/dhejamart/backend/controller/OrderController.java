
package com.dhejamart.backend.controller;

import com.dhejamart.backend.entity.Order;
import com.dhejamart.backend.entity.OrderItem;
import com.dhejamart.backend.entity.User;
import com.dhejamart.backend.repository.OrderRepository;
import com.dhejamart.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Order> getAllOrders(
            @RequestParam(required = false) Long userId) {

        if (userId == null) {
            return orderRepository.findAll();
        }

        return orderRepository.findByUser_Id(userId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Order placeOrder(@RequestBody Order order) {

        if (order.getUser() == null || order.getUser().getId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Buyer user ID is required");
        }

        Long userId = order.getUser().getId();

        User buyer = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Buyer not found"));

        order.setId(null);
        order.setUser(buyer);
        order.setOrderDate(LocalDateTime.now());

        if (order.getStatus() == null || order.getStatus().isBlank()) {
            order.setStatus("PLACED");
        }

        List<OrderItem> items = order.getItems() == null
                ? new ArrayList<>()
                : order.getItems();

        order.setItems(items);

        for (OrderItem item : items) {
            if (item == null) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Order contains an invalid item");
            }

            item.setId(null);
            item.setOrder(order);
        }

        return orderRepository.save(order);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<String> handleInvalidOrder(
            HttpMessageNotReadableException ex) {

        ex.printStackTrace();

        return ResponseEntity.badRequest()
                .body("Invalid order JSON: "
                        + ex.getMostSpecificCause().getMessage());
    }
}