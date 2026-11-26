import { useAuth } from "./AuthContext";
import { CartProvider } from "./CartContext";
import { beneficiosDeUsuario } from "../utils/descuentos";

// Carrito conectado a la sesión: aplica los descuentos del caso (50%, FELICES50 y cumpleaños Duoc).
export default function CartProviderSesion({ children }) {
  const { usuario } = useAuth();

  return (
    <CartProvider beneficios={beneficiosDeUsuario(usuario)}>
      {children}
    </CartProvider>
  );
}
