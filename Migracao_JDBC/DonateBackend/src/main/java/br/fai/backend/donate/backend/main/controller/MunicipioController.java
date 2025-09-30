package br.fai.backend.donate.backend.main.controller;

import br.fai.backend.donate.backend.main.domain.MunicipioModel;
import br.fai.backend.donate.backend.main.port.service.municipio.MunicipioService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/municipio")
@CrossOrigin(origins = "*")
public class MunicipioController {

    private final MunicipioService municipioService;

    public MunicipioController(MunicipioService municipioService) {
        this.municipioService = municipioService;
    }

    @GetMapping
    public List<MunicipioModel> getAll() {
        return municipioService.findAll();
    }

    @GetMapping("/{id}")
    public MunicipioModel getById(@PathVariable int id) {
        return municipioService.findById(id).orElse(null); // 🔹 corrigi aqui
    }



    @PostMapping
    public int create(@RequestBody MunicipioModel cidade) {
        return municipioService.create(cidade); // 🔹 corrigi aqui
    }

    @PutMapping("/{id}")
    public void update(@PathVariable int id, @RequestBody MunicipioModel cidade) {
        municipioService.update(id, cidade); // 🔹 para atualizar caso precise
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) {
        municipioService.delete(id);
    }
}
