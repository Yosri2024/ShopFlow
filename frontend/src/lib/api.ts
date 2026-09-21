import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Intercepteur JWT - injecte Bearer token (Spec 4.3)
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Refresh automatique du token expiré (Spec 4.3)
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_URL}/api/auth/refresh`, { refreshToken });
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
          original.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(original);
        } catch {
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Types miroir des DTO Spring Boot
export type Role = "ADMIN" | "SELLER" | "CUSTOMER";
export type OrderStatus = "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export interface Product {
  id: number;
  nom: string;
  description: string;
  prix: number;
  prixPromo?: number;
  stock: number;
  actif: boolean;
  sellerId: number;
  categories: { id: number; nom: string }[];
  images: string[];
  variants: { id: number; attribut: string; valeur: string; stockSupplementaire: number; prixDelta: number }[];
  noteMoyenne?: number;
  pourcentageRemise?: number;
}

export interface Cart {
  id: number;
  lignes: { id: number; productId: number; productNom: string; quantite: number; prixUnitaire: number }[];
  sousTotal: number;
  fraisLivraison: number;
  totalTTC: number;
  couponCode?: string;
}

export interface Order {
  id: number;
  numeroCommande: string;
  statut: OrderStatus;
  totalTTC: number;
  dateCommande: string;
  lignes: { productNom: string; quantite: number; prixUnitaire: number }[];
}
