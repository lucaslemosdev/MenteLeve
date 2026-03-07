package com.menteleve.api.controller;

import com.menteleve.api.model.Diario;
import com.menteleve.api.service.DiarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/diario")
public class DiarioController {

    @Autowired
    private DiarioService service;

    @GetMapping
    public List<Diario> listar() {
        return service.listarTodos();
    }

    @PostMapping
    public Diario criar(@RequestBody Diario diario) {
        return service.salvar(diario);
    }
}