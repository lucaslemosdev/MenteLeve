package com.menteleve.api.util;

public class ValidationUtil {

    private ValidationUtil() {
        throw new AssertionError("Utility class should not be instantiated");
    }

    public static void validarEmail(String email) {
        String emailRegex = "^[A-Za-z0-9+_.-]+@(.+)$";
        if (email == null || !email.matches(emailRegex)) {
            throw new IllegalArgumentException("Email inválido");
        }
    }

    public static void validarNivelHumor(Integer nivelHumor) {
        if (nivelHumor == null || nivelHumor < 1 || nivelHumor > 5) {
            throw new IllegalArgumentException("Nível de humor deve estar entre 1 e 5");
        }
    }

    public static void validarString(String valor, String nomeCampo) {
        if (valor == null || valor.trim().isEmpty()) {
            throw new IllegalArgumentException(nomeCampo + " não pode ser vazio");
        }
    }
}

