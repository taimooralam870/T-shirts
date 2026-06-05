import { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import productsData from '../data/products.json';

const ProductContext = createContext();

export const useProducts = () => {
  return useContext(ProductContext);
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from Supabase
  const fetchProducts = async () => {
    // If Supabase is not properly configured, use local data immediately
    if (!isSupabaseConfigured) {
      setProducts(productsData);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) throw error;

      // Transform data to match the expected format
      const transformedData = data?.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        color: product.color,
        sizes: product.sizes,
        rating: Number(product.rating),
        reviews: product.reviews,
        image: product.image,
        isNewArrival: product.isNewArrival,
        isPopular: product.isPopular,
        stock: product.stock,
        originalPrice: product.originalPrice
      })) || [];

      // If no data from Supabase, use local data
      if (transformedData.length === 0) {
        setProducts(productsData);
      } else {
        setProducts(transformedData);
      }
    } catch (err) {
      console.error('Error fetching products from Supabase:', err);
      // Fallback to local data
      setProducts(productsData);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Get product by ID
  const getProductById = (id) => {
    return products.find(p => p.id === id);
  };

  // Add new product
  const addProduct = async (product) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select();

      if (error) throw error;

      if (data) {
        setProducts(prev => [...prev, data[0]]);
      }
      return data?.[0];
    } catch (err) {
      console.error('Error adding product:', err);
      // Fallback: add locally
      setProducts(prev => [...prev, product]);
      return product;
    }
  };

  // Update product
  const updateProduct = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;

      if (data) {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data[0] } : p));
      }
      return data?.[0];
    } catch (err) {
      console.error('Error updating product:', err);
      // Fallback: update locally
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
      return { id, ...updates };
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProducts(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting product:', err);
      return false;
    }
  };

  // Get products by category
  const getProductsByCategory = (category) => {
    if (!category || category === 'All') return products;
    return products.filter(p => p.category === category);
  };

  // Get new arrivals
  const getNewArrivals = () => {
    return products.filter(p => p.isNewArrival);
  };

  // Get popular products
  const getPopularProducts = () => {
    return products.filter(p => p.isPopular);
  };

  const value = {
    products,
    loading,
    error,
    fetchProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
    getNewArrivals,
    getPopularProducts
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
