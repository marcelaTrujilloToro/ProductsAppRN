/* eslint-disable react-hooks/exhaustive-deps */
import React, {createContext, useEffect, useState} from 'react';
import cafeApi from '../api/cafeApi';
import {Producto, ProductsResponse} from '../types/appInterfaces';

type ProductsContexProps = {
  products: Producto[];
  loadProducts: () => Promise<void>;
  addProduct: (categoryId: string, productName: string) => Promise<Producto>;
  updateProduct: (
    categoryId: string,
    productName: string,
    productId: string,
  ) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  loadProductById: (id: string) => Promise<Producto>;
  uploadImage: (data: any, id: string) => Promise<void>;
};

export const ProductsContext = createContext({} as ProductsContexProps);

export const ProductsProvider = ({children}: any) => {
  const [products, setProducts] = useState<Producto[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const resp = await cafeApi.get<ProductsResponse>('/productos?limite=50');
    // setProducts([...products, ...resp.data.productos]);
    setProducts([...resp.data.productos]);
  };

  const addProduct = async (categoryId: string, productName: string) => {
    const resp = await cafeApi.post<Producto>('/productos', {
      nombre: productName,
      categoria: categoryId,
    });
    setProducts([...products, resp.data]);
  };

  const updateProduct = async (
    categoryId: string,
    productName: string,
    productId: string,
  ): Promise<Producto> => {
    const resp = await cafeApi.put<Producto>(`/productos/${productId}`, {
      nombre: productName,
      categoria: categoryId,
    });
    setProducts(
      products.map(prod => {
        return prod._id === productId ? resp.data : prod;
      }),
    );

    return resp.data;
  };

  const deleteProduct = async (id: string) => {
    const resp = await cafeApi.delete<Producto>(`/productos/${id}`);
    // setProducts(products.filter(item => item._id !== id));
    return resp.data;
  };

  const loadProductById = async (id: string): Promise<Producto> => {
    const resp = await cafeApi.get<Producto>(`/productos/${id}`);

    return resp.data;
  };

  const uploadImage = async (data: any, id: string) => {};

  return (
    <ProductsContext.Provider
      value={{
        products,
        loadProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        loadProductById,
        uploadImage,
      }}>
      {children}
    </ProductsContext.Provider>
  );
};
