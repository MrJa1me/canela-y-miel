package cl.canelaymiel.dto;

import cl.canelaymiel.model.Categoria;

public record CategoriaResponse(Long id, String nombre) {

    public static CategoriaResponse desde(Categoria categoria) {
        return new CategoriaResponse(categoria.getId(), categoria.getNombre());
    }
}
