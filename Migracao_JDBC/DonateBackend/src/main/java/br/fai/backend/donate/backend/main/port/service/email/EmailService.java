package br.fai.backend.donate.backend.main.port.service.email;

import java.time.LocalDate;
import java.time.LocalTime;

public interface EmailService {

    /**
     * Envia e-mail simples em texto.
     *
     * @param to      Destinatário
     * @param assunto Assunto do e-mail
     * @param corpo   Corpo do e-mail
     */
    void enviarEmailSimples(String to, String assunto, String corpo);

    /**
     * Envia e-mail em HTML.
     *
     * @param to      Destinatário
     * @param assunto Assunto do e-mail
     * @param corpo   Corpo do e-mail em HTML
     */
    void enviarEmailHtml(String to, String assunto, String corpo);
    void enviarEmailAgendamento(String to, String nomeUsuario, String status, LocalDate data, LocalTime horario);

}