package br.fai.backend.donate.backend.main.port.service.util;

import java.io.IOException;

public interface ResourceFileService {
    String read(final String resourcePath) throws IOException;
}
