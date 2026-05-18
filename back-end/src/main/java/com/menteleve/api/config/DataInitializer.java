package com.menteleve.api.config;

import com.menteleve.api.model.*;
import com.menteleve.api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final ExercicioRespiracaoRepository exercicioRespiracaoRepository;
    private final FraseMotivacionalRepository fraseMotivacionalRepository;

    @Override
    public void run(String... args) throws Exception {
        inicializarExerciciosRespiracao();
        inicializarFrasesMotivacionais();
    }

    private void inicializarExerciciosRespiracao() {
        // Limpar exercícios antigos
        exercicioRespiracaoRepository.deleteAll();
        
        // Exercício 1: Respiração 4-7-8 (para acalmar)
        ExercicioRespiracao exercicio1 = ExercicioRespiracao.builder()
                .nome("Respiração 4-7-8")
                .descricao("Técnica clássica para acalmar a mente e reduzir ansiedade rapidamente")
                .duracaoSegundos(120)
                .instrucoes("TIMINGS: inspirar=4,segurar=7,expirar=8\n\n" +
                        "1. Inspire profundamente pelo nariz contando até 4\n" +
                        "2. Prenda a respiração contando até 7\n" +
                        "3. Expire lentamente pela boca contando até 8\n" +
                        "4. Repita até completar o tempo")
                .ativo(true)
                .build();

        // Exercício 2: Box Breathing (Respiração em Caixa) - para foco e clareza
        ExercicioRespiracao exercicio2 = ExercicioRespiracao.builder()
                .nome("Box Breathing")
                .descricao("Técnica usada por militares para melhorar foco. Forma um quadrado: inspire, segure, expire, pausa")
                .duracaoSegundos(120)
                .instrucoes("TIMINGS: inspirar=4,segurar=4,expirar=4,pausar=4\n\n" +
                        "LADO 1 - INSPIRE: Pelo nariz, contando até 4\n" +
                        "LADO 2 - SEGURE: Prenda a respiração, contando até 4\n" +
                        "LADO 3 - EXPIRE: Pela boca, contando até 4\n" +
                        "LADO 4 - PAUSA: Não respire (pulmões vazios), contando até 4\n\n" +
                        "Repita formando um quadrado perfeito. Cada ciclo completo = 16 segundos.")
                .ativo(true)
                .build();

        // Exercício 3: Respiração Alternada (Nadi Shodhana) - para equilíbrio
        ExercicioRespiracao exercicio3 = ExercicioRespiracao.builder()
                .nome("Respiração Alternada")
                .descricao("Técnica yogui que alterna as narinas, equilibrando o corpo e a mente")
                .duracaoSegundos(120)
                .instrucoes("TIMINGS: inspirar=4,segurar=4,expirar=4\n\n" +
                        "1. Feche a narina DIREITA com o dedo polegar\n" +
                        "2. Inspire pela narina ESQUERDA contando até 4\n" +
                        "3. Feche a narina ESQUERDA, segure até 4\n" +
                        "4. Solte a narina DIREITA, expire contando até 4\n" +
                        "5. Inspire pela narina DIREITA e repita alternando")
                .ativo(true)
                .build();

        // Exercício 4: Respiração Energizante (Kapalabhati) - para energia
        ExercicioRespiracao exercicio4 = ExercicioRespiracao.builder()
                .nome("Respiração Energizante")
                .descricao("Técnica dinâmica e rápida para revitalizar e aumentar energia e clareza mental")
                .duracaoSegundos(120)
                .instrucoes("TIMINGS: inspirar=4,expirar=2\n\n" +
                        "1. Inspire profundamente pelo nariz contando até 4\n" +
                        "2. Expire com FORÇA e rapidez pela boca contando até 2\n" +
                        "3. Mantenha um ritmo constante e energético (mais rápido que as outras)\n" +
                        "4. Repita até completar o tempo\n\n" +
                        "NOTA: Esta é a mais intensa e dinâmica. Pratique em um ambiente seguro.")
                .ativo(true)
                .build();

        exercicioRespiracaoRepository.save(exercicio1);
        exercicioRespiracaoRepository.save(exercicio2);
        exercicioRespiracaoRepository.save(exercicio3);
        exercicioRespiracaoRepository.save(exercicio4);
    }

    private void inicializarFrasesMotivacionais() {
        if (fraseMotivacionalRepository.count() == 0) {
            // Frases de Motivação
            FraseMotivacional frase1 = FraseMotivacional.builder()
                    .texto("A única forma de fazer um ótimo trabalho é amar o que você faz.")
                    .autor("Steve Jobs")
                    .categoria("MOTIVACAO")
                    .ativo(true)
                    .build();

            FraseMotivacional frase2 = FraseMotivacional.builder()
                    .texto("O sucesso é a soma de pequenos esforços repetidos dia após dia.")
                    .autor("Robert Collier")
                    .categoria("MOTIVACAO")
                    .ativo(true)
                    .build();

            // Frases de Ansiedade
            FraseMotivacional frase3 = FraseMotivacional.builder()
                    .texto("A ansiedade é o preço que pagamos pelo privilégio de estar vivo.")
                    .autor("Rollo May")
                    .categoria("ANSIEDADE")
                    .ativo(true)
                    .build();

            FraseMotivacional frase4 = FraseMotivacional.builder()
                    .texto("Você não pode controlar os pensamentos que vêm à sua mente, mas pode controlar aqueles que nela permanecem.")
                    .autor("Unknown")
                    .categoria("ANSIEDADE")
                    .ativo(true)
                    .build();

            // Frases de Gratidão
            FraseMotivacional frase5 = FraseMotivacional.builder()
                    .texto("A gratidão é o antídoto para o medo e a ansiedade.")
                    .autor("Stephen Richards")
                    .categoria("GRATIDAO")
                    .ativo(true)
                    .build();

            FraseMotivacional frase6 = FraseMotivacional.builder()
                    .texto("Quando você focá em ser grato, o medo desaparece e a criatividade surge.")
                    .autor("Tony Schwartz")
                    .categoria("GRATIDAO")
                    .ativo(true)
                    .build();

            // Frases de Autoconfiança
            FraseMotivacional frase7 = FraseMotivacional.builder()
                    .texto("Você é mais corajoso do que acredita, mais forte do que parece e mais inteligente do que pensa.")
                    .autor("A.A. Milne")
                    .categoria("AUTOCONFIANCA")
                    .ativo(true)
                    .build();

            FraseMotivacional frase8 = FraseMotivacional.builder()
                    .texto("Acredite em si mesmo. Você é bravo, você é forte, você consegue fazer isso.")
                    .autor("Unknown")
                    .categoria("AUTOCONFIANCA")
                    .ativo(true)
                    .build();

            // Frases de Resiliência
            FraseMotivacional frase9 = FraseMotivacional.builder()
                    .texto("A resiliência é a capacidade de recuperação. É sobre como você volta ao jogo.")
                    .autor("Sheryl Sandberg")
                    .categoria("RESILIENCIA")
                    .ativo(true)
                    .build();

            FraseMotivacional frase10 = FraseMotivacional.builder()
                    .texto("As maiores glórias na vida não são nunca cair, mas levantar toda vez que caímos.")
                    .autor("Oliver Goldsmith")
                    .categoria("RESILIENCIA")
                    .ativo(true)
                    .build();

            fraseMotivacionalRepository.saveAll(java.util.Arrays.asList(
                    frase1, frase2, frase3, frase4, frase5,
                    frase6, frase7, frase8, frase9, frase10
            ));
        }
    }
}


