package com.example.taskservice.client;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "employee-service", url = "${employee.service.url}")
public interface EmployeeClient {
    @GetMapping("/employees/{id}")
    Object getEmployeeById(@PathVariable Long id, @RequestHeader("Authorization") String token);
}