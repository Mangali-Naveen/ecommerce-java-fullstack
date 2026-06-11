package com.example.demo.service;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.AddressRequest;
import com.example.demo.entity.Address;
import com.example.demo.repository.AddressRepository;

@Service
public class AddressService {

    @Autowired
    private AddressRepository addressRepository;

    public Address addAddress(AddressRequest request) {

        Address address = new Address();

        address.setUserId(request.getUserId());
        address.setAddress(request.getAddress());
        address.setCity(request.getCity());
        address.setPincode(request.getPincode());
        address.setPhone(request.getPhone());
        address.setNotes(request.getNotes());

        return addressRepository.save(address);
    }
    
    public List<Address> getAddresses(Long userId) {

        return addressRepository.findByUserId(userId);
    }
    
    public Address updateAddress(
            Long userId,
            Long addressId,
            AddressRequest request) {

        Address address = addressRepository
                .findById(addressId)
                .orElse(null);

        if (address == null) {
            return null;
        }

        if (!address.getUserId().equals(userId)) {
            return null;
        }

        address.setAddress(request.getAddress());
        address.setCity(request.getCity());
        address.setPincode(request.getPincode());
        address.setPhone(request.getPhone());
        address.setNotes(request.getNotes());

        return addressRepository.save(address);
    }
    
    public String deleteAddress(
            Long userId,
            Long addressId) {

        Address address = addressRepository
                .findById(addressId)
                .orElse(null);

        if (address == null) {
            return "Address not found";
        }

        if (!address.getUserId().equals(userId)) {
            return "Address not found";
        }

        addressRepository.delete(address);

        return "Address deleted successfully";
    }
}