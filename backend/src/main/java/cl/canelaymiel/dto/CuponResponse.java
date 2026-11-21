package cl.canelaymiel.dto;

import cl.canelaymiel.model.Cupon;

public record CuponResponse(Long id, String codigo, Integer porcentaje, boolean activo) {

    public static CuponResponse desde(Cupon cupon) {
        return new CuponResponse(cupon.getId(), cupon.getCodigo(), cupon.getPorcentaje(), cupon.isActivo());
    }
}
