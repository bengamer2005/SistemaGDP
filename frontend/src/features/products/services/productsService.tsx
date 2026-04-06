import type { Products, CreateProducts } from "../types/productsTypes"
const APIs = import.meta.env.VITE_API_URL
const token = localStorage.getItem("token")

export const getAllProducts = async (): Promise<Products[]> => {
    const response = await fetch(`${APIs}/products`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    
    if(!response.ok) throw new Error("Fallo llamada a los productos")

    return await response.json() as Promise<Products[]>
}

export const createProducts = async (body: CreateProducts): Promise<void> => {
    const response = await fetch(`${APIs}/products`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body)
    })

    if(!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Fallo al crear el producto")
    }
}

export const uploadProductsExcel = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`${APIs}/products/bulk`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: formData
    })

    if(!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al importar los productos")
    }

    return response.json()
}