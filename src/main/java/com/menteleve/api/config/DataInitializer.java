package com.menteleve.api.config;

import com.menteleve.api.model.*;
import com.menteleve.api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalTime;

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
        if (exercicioRespiracaoRepository.count() == 0) {
            // Exercício 1: Respiração 4-7-8
            ExercicioRespiracao exercicio1 = ExercicioRespiracao.builder()
                    .nome("Respiração 4-7-8")
                    .descricao("Técnica de respiração para acalmar a mente e corpo")
                    .duracaoSegundos(240)
                    .instrucoes("1. Inspire profundamente pelo nariz contando até 4\n" +
                            "2. Prenda a respiração contando até 7\n" +
                            "3. Expire lentamente pela boca contando até 8\n" +
                            "4. Repita 4 vezes")
                    .ativo(true)
                    .build();

            // Exercício 2: Respiração Abdominal
            ExercicioRespiracao exercicio2 = ExercicioRespiracao.builder()
                    .nome("Respiração Abdominal")
                    .descricao("Respiração profunda focada no abdômen para relaxamento")
                    .duracaoSegundos(300)
                    .instrucoes("1. Sente-se confortavelmente\n" +
                            "2. Coloque uma mão no peito e outra no abdômen\n" +
                            "3. Inspire pelo nariz, deixando o abdômen inchar\n" +
                            "4. Expire lentamente pela boca\n" +
                            "5. Repita por 5 minutos")
                    .ativo(true)
                    .build();

            // Exercício 3: Respiração Alternada
            ExercicioRespiracao exercicio3 = ExercicioRespiracao.builder()
                    .nome("Respiração Alternada")
                    .descricao("Técnica de respiração pelas narinas alternadas para equilibrio")
                    .duracaoSegundos(180)
                    .instrucoes("1. Feche a narina direita com o dedo polegar\n" +
                            "2. Inspire pela narina esquerda\n" +
                            "3. Feche a narina esquerda, solte a direita\n" +
                            "4. Expire pela narina direita\n" +
                            "5. Repita alternando")
                    .ativo(true)
                    .build();

            exercicioRespiracaoRepository.save(exercicio1);
            exercicioRespiracaoRepository.save(exercicio2);
            exercicioRespiracaoRepository.save(exercicio3);
        }
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

