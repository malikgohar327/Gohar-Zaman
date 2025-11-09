import { useLocalStorage } from './useLocalStorage';
import { Product } from '../types';

const DEFAULT_PRODUCTS: Product[] = [
    { name: 'Full Chicken Sajji', price: 1200 },
    { name: 'Fish per KG', price: 1500 },
    { name: '1.5L Cold Drink', price: 150 },
    { name: 'Raita', price: 50 },
    { name: 'Roti', price: 20 },
    { name: 'Regular Bottle', price: 200 },
];

export function useProducts() {
    const [products, setProducts] = useLocalStorage<Product[]>('products', DEFAULT_PRODUCTS);

    const updateProductPrice = (name: string, newPrice: number) => {
        setProducts(currentProducts => 
            currentProducts.map(p => 
                p.name === name ? { ...p, price: newPrice } : p
            )
        );
    };

    return { products, updateProductPrice };
}