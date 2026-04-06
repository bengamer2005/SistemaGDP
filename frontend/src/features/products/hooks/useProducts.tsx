import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
// service
import { getAllProducts, createProducts, uploadProductsExcel } from "../services/productsService"
// types
import type { Products, CreateProducts } from "../types/productsTypes"

export const useGetAllProducts = () => {
    return useQuery<Products[], Error>({
        queryKey: ["productsInfo"],
        queryFn: getAllProducts
    })
}

export const useCreateProducts = () => {
    const queryClient = useQueryClient()
    
    return useMutation<void, Error, CreateProducts>({
        mutationFn: createProducts,
        onSuccess: () => {
            toast.success("Producto creado exitosamente"),
            queryClient.invalidateQueries({ queryKey: ["productsInfo"] })
        },
        onError: (error) => {
            toast.error(error ? error.message : "Error al crear el producto"),
            console.error("Error al crear el producto", error)
        }
    })
}

export const useUploadProductsExcel = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (file: File) => uploadProductsExcel(file),
        onSuccess: () => {
            toast.success("Productos importados correctamente"),
            queryClient.invalidateQueries({ queryKey: ["productsInfo"] })
        },
        onError: (error) => {
            toast.error(error ? error.message : "Error al importar los productos"),
            console.error("Error al importar los productos", error)
        }
    })
}