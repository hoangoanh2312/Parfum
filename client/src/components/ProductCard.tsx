import ProductCardBase, { ProductCardBaseData } from "./ProductCardBase";

export interface ProductCardData extends ProductCardBaseData {
  id: string;
  gender?: string;
}

interface ProductCardProps {
  item: ProductCardData;
  liked?: boolean;
  onWishlist?: (id: string) => void;
}

export default function ProductCard({ item }: ProductCardProps) {
  return <ProductCardBase product={item} cartMode="always" compact />;
}
