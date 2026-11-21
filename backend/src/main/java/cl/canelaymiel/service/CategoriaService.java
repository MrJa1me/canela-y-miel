package cl.canelaymiel.service;

import cl.canelaymiel.dto.CategoriaRequest;
import cl.canelaymiel.dto.CategoriaResponse;
import cl.canelaymiel.exception.ConflictoException;
import cl.canelaymiel.exception.RecursoNoEncontradoException;
import cl.canelaymiel.model.Categoria;
import cl.canelaymiel.repository.CategoriaRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    @Transactional(readOnly = true)
    public List<CategoriaResponse> listar() {
        return categoriaRepository.findAll().stream().map(CategoriaResponse::desde).toList();
    }

    @Transactional(readOnly = true)
    public CategoriaResponse obtener(Long id) {
        return CategoriaResponse.desde(buscar(id));
    }

    @Transactional
    public CategoriaResponse crear(CategoriaRequest request) {
        if (categoriaRepository.existsByNombreIgnoreCase(request.nombre().trim())) {
            throw new ConflictoException("Ya existe una categoría con ese nombre");
        }

        return CategoriaResponse.desde(categoriaRepository.save(new Categoria(request.nombre().trim())));
    }

    @Transactional
    public CategoriaResponse actualizar(Long id, CategoriaRequest request) {
        Categoria categoria = buscar(id);

        categoriaRepository.findByNombreIgnoreCase(request.nombre().trim())
                .filter(otra -> !otra.getId().equals(id))
                .ifPresent(otra -> {
                    throw new ConflictoException("Ya existe una categoría con ese nombre");
                });

        categoria.setNombre(request.nombre().trim());
        return CategoriaResponse.desde(categoria);
    }

    @Transactional
    public void eliminar(Long id) {
        categoriaRepository.delete(buscar(id));
    }

    private Categoria buscar(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Categoría no encontrada"));
    }
}
