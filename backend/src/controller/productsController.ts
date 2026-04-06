import { Request, Response } from "express"
import DB from "../config/DBconfig"
import ProductsModel from "../model/productsModel"
import * as XLSX from "xlsx"
import { UniqueConstraintError } from "sequelize"

// helpers
const cleanNumber = (value: any) => {
    if (!value) return 0
    return Number(String(value).replace(/[^0-9.-]+/g, ""))
}

const cleanString = (value: any) => value ? String(value).trim() : ""

// llama a todos los productos
export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const allProducts = await ProductsModel.findAll({
            attributes: ["products_id", "name", "price_cost", "price_sale", "price_wholesale", "inventory", "inventory_min"],
            where: { active: true } 
        })

        res.status(200).json(allProducts)
    } catch (error) {
        console.error("Error al obtener los productos:", error)
        res.status(500).json({ error: "Error al obtener los productos" })
    }
}

// crea un nuevo producto
export const createProducts = async (req: Request, res: Response) => {
    try {
        const { 
            name,
            price_cost,
            price_sale,
            price_wholesale,
            inventory,
            inventory_min,
        } = req.body

        if(!name || !price_cost || !price_sale || !inventory || !inventory_min) {
            return res.status(400).json({ message: "Faltan datos obligatorios" })
        }

        await ProductsModel.create({
            name: name.trim(),
            price_cost,
            price_sale,
            price_wholesale,
            inventory,
            inventory_min,
            created_by: req.user?.id
        })

        res.status(201).json({ message: "Producto creado exitosamente" })
    } catch (error) {
        if(error instanceof UniqueConstraintError) {
            return res.status(400).json({
                message: "El producto ya existe"
            })
        }

        console.error("Error al crear el producto:", error)
        res.status(500).json({ error: "Error al crear el producto" })
    }
}

// creacion masiva de productos
export const bulkCreateProducts = async (req: Request, res: Response) => {
    try {
        if(!req.file) {
            return res.status(400).json({ message: "Archivo requerido" })
        }

        const workbook = XLSX.read(req.file.buffer, { type: "buffer" })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const data: any[] = XLSX.utils.sheet_to_json(sheet)


        if(data.length === 0) {
            return res.status(400).json({ message: "El archivo está vacío" })
        }

        if(data.length > 10000) {
            return res.status(400).json({ message: "Archivo demasiado grande" })
        }

        const products: any[] = []
        const invalidRows: any[] = []
        const ignoredProducts: any[] = []
        const productNames: string[] = []

        data.forEach((row, i) => {
            const product = {
                name: cleanString(row["Descripcion"])?.toLowerCase(),
                price_cost: cleanNumber(row["Precio Costo"]),
                price_sale: cleanNumber(row["Precio Venta"]),
                price_wholesale: cleanNumber(row["Precio Mayoreo"]),
                inventory: cleanNumber(row["Inventario"]),
                inventory_min: cleanNumber(row["Inv. Minimo"]),
                department: cleanString(row["Departamento"]),
                created_by: req.user?.id
            }

            const isValid =
                product.name && product.name.trim().length > 0 &&
                !isNaN(product.price_cost) &&
                !isNaN(product.price_sale) &&
                !isNaN(product.inventory) &&
                !isNaN(product.inventory_min)

            if(!isValid) {
                invalidRows.push({ row: i + 1, data: row })
            } else {
                if(productNames.includes(product.name)) {
                    ignoredProducts.push(product)
                } else {
                    productNames.push(product.name)
                    products.push(product)
                }
            }
        })


        if(invalidRows.length > 0) {
            return res.status(400).json({
                message: "Errores en el archivo",
                invalidRows
            })
        }

        const transaction = await DB.transaction()

        const existingProducts = await ProductsModel.findAll({
            where: {
                name: productNames
            }
        })

        const existingProductNames = existingProducts.map(product => product.name)

        const filteredProducts = products.filter(product => !existingProductNames.includes(product.name))
        const newIgnoredProducts = products.filter(product => existingProductNames.includes(product.name))

        await ProductsModel.bulkCreate(filteredProducts, {
            transaction,
            updateOnDuplicate: [
                "price_cost",
                "price_sale",
                "price_wholesale",
                "inventory",
                "inventory_min"
            ]
        })

        await transaction.commit()

        res.status(201).json({
            message: "Carga completada",
            total: products.length,
            errores: invalidRows.length,
            ignoredProducts: newIgnoredProducts
        })
    } catch (error) {
        if(error instanceof UniqueConstraintError) {
            return res.status(400).json({
                message: "El excel contiene productos ya existenten o duplicados"
            })
        }

        console.error("Error en carga masiva:", error)
        res.status(500).json({ error: "Error al cargar productos" })
    }
}

// actualiza un producto
export const updateProducts = async (req: Request, res: Response) => {
    try {
        
    } catch (error) {
        
    }
}