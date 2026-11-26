package cl.canelaymiel.service;

import cl.canelaymiel.dto.ProductoRequest;
import cl.canelaymiel.dto.ProductoResponse;
import cl.canelaymiel.exception.ConflictoException;
import cl.canelaymiel.exception.RecursoNoEncontradoException;
import cl.canelaymiel.model.Categoria;
import cl.canelaymiel.model.Producto;
import cl.canelaymiel.repository.CategoriaRepository;
import cl.canelaymiel.repository.ProductoRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    @Transactional(readOnly = true)
    public List<ProductoResponse> listar() {
        return productoRepository.findAll().stream().map(ProductoResponse::desde).toList();
    }

    @Transactional(readOnly = true)
    public ProductoResponse obtener(Long id) {
        return ProductoResponse.desde(buscar(id));
    }

    @Transactional
    public ProductoResponse crear(ProductoRequest request) {
        String codigo = request.codigo().trim().toUpperCase();
        validarCodigoUnico(codigo, null);

        Producto producto = new Producto(
                request.nombre().trim(),
                request.precio(),
                request.stock(),
                request.imagen().trim(),
                buscarCategoria(request.categoriaId()),
                request.activo() == null || request.activo());

        producto.setCodigo(codigo);
        producto.setDescripcion(request.descripcion().trim());
        producto.setPorciones(request.porciones());

        return ProductoResponse.desde(productoRepository.save(producto));
    }

    @Transactional
    public ProductoResponse actualizar(Long id, ProductoRequest request) {
        Producto producto = buscar(id);
        String codigo = request.codigo().trim().toUpperCase();
        validarCodigoUnico(codigo, id);

        producto.setCodigo(codigo);
        producto.setNombre(request.nombre().trim());
        producto.setDescripcion(request.descripcion().trim());
        producto.setPrecio(request.precio());
        producto.setStock(request.stock());
        producto.setPorciones(request.porciones());
        producto.setImagen(request.imagen().trim());
        producto.setCategoria(buscarCategoria(request.categoriaId()));
        producto.setActivo(request.activo() == null || request.activo());

        return ProductoResponse.desde(producto);
    }

    @Transactional
    public void eliminar(Long id) {
        productoRepository.delete(buscar(id));
    }

    private Producto buscar(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Producto no encontrado"));
    }

    private Categoria buscarCategoria(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Categoría no encontrada"));
    }

    // El código identifica al producto en el catálogo: no puede repetirse.
    private void validarCodigoUnico(String codigo, Long id) {
        productoRepository.findByCodigoIgnoreCase(codigo)
                .filter(otro -> !otro.getId().equals(id))
                .ifPresent(otro -> {
                    throw new ConflictoException("El código " + codigo + " ya está en uso");
                });
    }
}
