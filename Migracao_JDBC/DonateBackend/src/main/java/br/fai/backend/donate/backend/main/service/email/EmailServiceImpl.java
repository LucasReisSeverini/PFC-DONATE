package br.fai.backend.donate.backend.main.service.email;

import br.fai.backend.donate.backend.main.port.service.email.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;


@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void enviarEmailSimples(String to, String assunto, String corpo) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(assunto);
        message.setText(corpo);
        message.setFrom("donateavisos@gmail.com"); // altere para seu e-mail real
        mailSender.send(message);
    }

    @Override
    public void enviarEmailAgendamento(String to, String nomeUsuario, String status, LocalDate data, LocalTime horario) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);

        // Assunto do e-mail
        message.setSubject("Atualização sobre seu agendamento");

        // Formatar data e horário
        String dataFormatada = data.format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy"));
        String horarioFormatado = horario.format(java.time.format.DateTimeFormatter.ofPattern("HH:mm"));

        // Monta o corpo do e-mail dependendo do status
        String corpo;
        switch (status.trim().toLowerCase()) {
            case "aceito":
                corpo = String.format(
                        "Olá %s,\n\nSeu agendamento para o dia %s às %s foi aceito.\n\nAgradecemos pela sua atenção.\n\nAtenciosamente,\nEquipe Donate",
                        nomeUsuario, dataFormatada, horarioFormatado
                );
                break;
            case "recusado":
                corpo = String.format(
                        "Olá %s,\n\nInfelizmente, seu agendamento para o dia %s às %s foi recusado.\n\nPor favor, entre em contato para reagendar.\n\nAtenciosamente,\nEquipe Donate",
                        nomeUsuario, dataFormatada, horarioFormatado
                );
                break;
            case "reagendado":
                corpo = String.format(
                        "Olá %s,\n\nSeu agendamento foi reagendado para o dia %s às %s.\n\nAgradecemos pela compreensão.\n\nAtenciosamente,\nEquipe Donate",
                        nomeUsuario, dataFormatada, horarioFormatado
                );
                break;
            case "reagendamento solicitado":
                corpo = String.format(
                        "Olá %s,\n\nFoi solicitado um reagendamento do seu agendamento para o dia %s às %s.\n\nAguarde a confirmação.\n\nAtenciosamente,\nEquipe Donate",
                        nomeUsuario, dataFormatada, horarioFormatado
                );
                break;
            case "reagendamento solicitado pelo profissional de saúde":
                corpo = String.format(
                        "Olá %s,\n\nUm profissional de saúde solicitou a alteração da data do seu agendamento para o dia %s às %s.\n\nPor favor, acesse o sistema Doante para confirmar ou sugerir uma nova data que seja conveniente para você.\n\nAguardamos sua resposta.\n\nAtenciosamente,\nEquipe Donate",
                        nomeUsuario, dataFormatada, horarioFormatado
                );
                break;
            case "pendente":
                corpo = String.format(
                        "Olá %s,\n\nSeu agendamento para o dia %s às %s está pendente de confirmação.\n\nAtenciosamente,\nEquipe Donate",
                        nomeUsuario, dataFormatada, horarioFormatado
                );
                break;
            default:
                corpo = String.format(
                        "Olá %s,\n\nHá uma atualização no seu agendamento para o dia %s às %s.\n\nAtenciosamente,\nEquipe Donate",
                        nomeUsuario, dataFormatada, horarioFormatado
                );
        }


        message.setText(corpo);
        message.setFrom("donateavisos@gmail.com");

        mailSender.send(message);
    }





    @Override
    public void enviarEmailHtml(String to, String assunto, String corpo) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(assunto);
            helper.setText(corpo, true); // true = HTML
            helper.setFrom("donateavisos@gmail.com"); // altere para seu e-mail real
            mailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
            throw new RuntimeException("Erro ao enviar e-mail HTML", e);
        }
    }
}
