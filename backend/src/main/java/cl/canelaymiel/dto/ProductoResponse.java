package cl.canelaymiel.dto;

import cl.canelaymiel.model.Producto;
import java.math.BigDecimal;

public record ProductoResponse(
        Long id,
        String codigo,
        String nombre,
        String descripcion,
        BigDecimal precio,
        Integer stock,
        Integer porciones,
        String imagen,
        boolean activo,
        Long categoriaId,
        String categoria) {

    public static ProductoResponse desde(Producto producto) {
        return new ProductoResponse(
                producto.getId(),
                producto.getCodigo(),
                producto.getNombre(),
                producto.getDescripcion(),
                producto.getPrecio(),
                producto.getStock(),
                producto.getPorciones(),
                producto.getImagen(),
                producto.isActivo(),
                producto.getCategoria().getId(),
                producto.getCategoria().getNombre());
    }
}
