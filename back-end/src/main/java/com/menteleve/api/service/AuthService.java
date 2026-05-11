package com.menteleve.api.service;

import com.menteleve.api.dto.AuthDTO;
import com.menteleve.api.model.Usuario;
import com.menteleve.api.repository.UsuarioRepository;
import com.menteleve.api.model.PasswordResetToken;
import com.menteleve.api.repository.PasswordResetTokenRepository;
import com.menteleve.api.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import java.time.LocalDateTime;
import java.util.UUID;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    public AuthDTO.AuthResponse registrar(AuthDTO.RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Este e-mail já está cadastrado.");
        }

        Usuario usuario = Usuario.builder()
                .nome(request.getNome())
                .email(request.getEmail())
                .senha(passwordEncoder.encode(request.getSenha()))
                .ativo(true)
                .build();

        Usuario usuarioSalvo = usuarioRepository.save(usuario);

        String token = jwtUtil.gerarToken(usuarioSalvo.getEmail(), usuarioSalvo.getId());

        return AuthDTO.AuthResponse.builder()
                .token(token)
                .tipo("Bearer")
                .usuarioId(usuarioSalvo.getId())
                .nome(usuarioSalvo.getNome())
                .email(usuarioSalvo.getEmail())
                .build();
    }

    public AuthDTO.AuthResponse login(AuthDTO.LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getSenha())
            );

            String email = authentication.getName();
            Usuario usuario = usuarioRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

            String token = jwtUtil.gerarToken(email, usuario.getId());

            return AuthDTO.AuthResponse.builder()
                    .token(token)
                    .tipo("Bearer")
                    .usuarioId(usuario.getId())
                    .nome(usuario.getNome())
                    .email(usuario.getEmail())
                    .build();

        } catch (BadCredentialsException e) {
            throw new IllegalArgumentException("E-mail ou senha incorretos.");
        }
    }

    public void solicitarRecuperacaoSenha(AuthDTO.ForgotPasswordRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Se este e-mail estiver cadastrado, enviaremos instruções."));

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .usuario(usuario)
                .dataExpiracao(LocalDateTime.now().plusHours(1))
                .usado(false)
                .build();
        
        passwordResetTokenRepository.save(resetToken);

        // Simulando envio de e-mail no console
        log.info("=========================================================");
        log.info("📧 SIMULAÇÃO DE E-MAIL DE RECUPERAÇÃO DE SENHA");
        log.info("Para: {}", usuario.getEmail());
        log.info("Token de recuperação: {}", token);
        log.info("=========================================================");
    }

    public void redefinirSenha(AuthDTO.ResetPasswordRequest request) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new IllegalArgumentException("Token inválido ou expirado."));

        if (resetToken.getUsado()) {
            throw new IllegalArgumentException("Este token já foi utilizado.");
        }

        if (resetToken.getDataExpiracao().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Este token expirou.");
        }

        Usuario usuario = resetToken.getUsuario();
        usuario.setSenha(passwordEncoder.encode(request.getNovaSenha()));
        usuarioRepository.save(usuario);

        resetToken.setUsado(true);
        passwordResetTokenRepository.save(resetToken);
    }
}
