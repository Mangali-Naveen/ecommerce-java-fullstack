package com.example.demo.controller;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.AddressRequest;
import com.example.demo.entity.Address;
import com.example.demo.service.AddressService;

@RestController
@RequestMapping("/api/address")
public class AddressController {

    @Autowired
    private AddressService addressService;

    @PostMapping("/add")
    public Address addAddress(
            @RequestBody AddressRequest request) {

        return addressService.addAddress(request);
    }
    
    @GetMapping("/get/{userId}")
    public List<Address> getAddresses(
            @PathVariable Long userId) {

        return addressService.getAddresses(userId);
    }
    
    @PutMapping("/update/{userId}/{addressId}")
    public Address updateAddress(
            @PathVariable Long userId,
            @PathVariable Long addressId,
            @RequestBody AddressRequest request) {

        return addressService.updateAddress(
                userId,
                addressId,
                request);
    }
    
    @DeleteMapping("/delete/{userId}/{addressId}")
    public String deleteAddress(
            @PathVariable Long userId,
            @PathVariable Long addressId) {

        return addressService.deleteAddress(
                userId,
                addressId);
    }
}