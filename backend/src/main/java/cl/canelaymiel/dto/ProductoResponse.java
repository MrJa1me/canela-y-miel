package cl.canelaymiel.dto;

import cl.canelaymiel.model.Producto;
import java.math.BigDecimal;

public record ProductoResponse(
        Long id,
        String nombre,
        BigDecimal precio,
        Integer stock,
        String imagen,
        boolean activo,
        Long categoriaId,
        String categoria) {

    public static ProductoResponse desde(Producto producto) {
        return new ProductoResponse(
                producto.getId(),
                producto.getNombre(),
                producto.getPrecio(),
                producto.getStock(),
                producto.getImagen(),
                producto.isActivo(),
                producto.getCategoria().getId(),
                producto.getCategoria().getNombre());
    }
}
