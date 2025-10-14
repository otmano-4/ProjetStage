package com.projetstage.backend.model;

import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173"})
public class PingController {

    @GetMapping("/ping")
    public Map<String, String> ping() {
        return Map.of("message", "pong");
    }
}
