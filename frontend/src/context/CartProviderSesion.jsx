import { useAuth } from "./AuthContext";
import { CartProvider } from "./CartContext";

// Carrito conectado a la sesión: si el cliente es Premium, tiene descuento
export default function CartProviderSesion({ children }) {
  const { usuario } = useAuth();

  return (
    <CartProvider esPremium={Boolean(usuario?.premium)}>{children}</CartProvider>
  );
}
