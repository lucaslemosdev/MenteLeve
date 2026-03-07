package com.menteleve.api.service;

import com.menteleve.api.model.Diario;
import com.menteleve.api.repository.DiarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DiarioService {

    @Autowired
    private DiarioRepository repository;

    public List<Diario> listarTodos() {
        return repository.findAll();
    }

    public Diario salvar(Diario diario) {
        return repository.save(diario);
    }
}