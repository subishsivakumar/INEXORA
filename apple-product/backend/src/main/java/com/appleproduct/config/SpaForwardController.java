package com.appleproduct.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardController {

    @GetMapping(value = {
        "/products",
        "/product/**",
        "/compare",
        "/cart",
        "/checkout",
        "/account",
        "/admin"
    })
    public String forwardSpaRoutes() {
        return "forward:/index.html";
    }
}
