package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.FeatureImage;

@Repository
public interface FeatureRepository extends JpaRepository<FeatureImage, Long> {

}
