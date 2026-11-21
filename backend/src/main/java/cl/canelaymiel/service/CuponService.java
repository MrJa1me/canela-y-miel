package cl.canelaymiel.service;

import cl.canelaymiel.dto.CuponRequest;
import cl.canelaymiel.dto.CuponResponse;
import cl.canelaymiel.exception.ConflictoException;
import cl.canelaymiel.exception.RecursoNoEncontradoException;
import cl.canelaymiel.model.Cupon;
import cl.canelaymiel.repository.CuponRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CuponService {

    private final CuponRepository cuponRepository;

    @Transactional(readOnly = true)
    public List<CuponResponse> listar() {
        return cuponRepository.findAll().stream().map(CuponResponse::desde).toList();
    }

    @Transactional(readOnly = true)
    public CuponResponse obtener(Long id) {
        return CuponResponse.desde(buscar(id));
    }

    @Transactional
    public CuponResponse crear(CuponRequest request) {
        String codigo = request.codigo().trim().toUpperCase();

        if (cuponRepository.existsByCodigoIgnoreCase(codigo)) {
            throw new ConflictoException("Ya existe un cupón con ese código");
        }

        Cupon cupon = new Cupon(codigo, request.porcentaje(), request.activo() == null || request.activo());
        return CuponResponse.desde(cuponRepository.save(cupon));
    }

    @Transactional
    public CuponResponse actualizar(Long id, CuponRequest request) {
        Cupon cupon = buscar(id);
        String codigo = request.codigo().trim().toUpperCase();

        cuponRepository.findByCodigoIgnoreCase(codigo)
                .filter(otro -> !otro.getId().equals(id))
                .ifPresent(otro -> {
                    throw new ConflictoException("Ya existe un cupón con ese código");
                });

        cupon.setCodigo(codigo);
        cupon.setPorcentaje(request.porcentaje());
        cupon.setActivo(request.activo() == null || request.activo());

        return CuponResponse.desde(cupon);
    }

    @Transactional
    public void eliminar(Long id) {
        cuponRepository.delete(buscar(id));
    }

    private Cupon buscar(Long id) {
        return cuponRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Cupón no encontrado"));
    }
}
