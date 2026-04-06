import { useState } from "react"
import type { UseMutateFunction } from "@tanstack/react-query"
import GenericModal from "../../../shared/components/ui/genericModal"
import Alerts from "../../../shared/components/feedback/alerts"
import { Upload, Plus, Package, DollarSign, TrendingUp, AlertCircle, FileSpreadsheet, CheckCircle2, Loader2, Redo2 } from "lucide-react"
import type { CreateProducts } from "../types/productsTypes"

interface IgnoredProduct {
    name: string
    price_cost: number
    price_sale: number
    price_wholesale: number
    inventory: number
    inventory_min: number
    department: string
}

interface UploadResponse {
    message: string
    total: number
    errores: number
    ignoredProducts: IgnoredProduct[]
}

interface ProductModalProps {
    isOpen: boolean
    onClose: () => void
    createProduct: UseMutateFunction<void, Error, CreateProducts, unknown>
    onUploadExcel: UseMutateFunction<UploadResponse, Error, File, unknown>
    loading?: boolean
}

const ProductModal = ({
    isOpen,
    onClose,
    createProduct,
    onUploadExcel,
    loading = false
}: ProductModalProps) => {
    const [mode, setMode] = useState<"manual" | "excel">("manual")
    const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null)

    // form manual
    const [form, setForm] = useState({
        name: "",
        price_cost: "",
        price_sale: "",
        price_wholesale: "",
        inventory: "",
        inventory_min: ""
    })

    // excel
    const [file, setFile] = useState<File | null>(null)
    const [dragActive, setDragActive] = useState(false)
    const [isloading, setIsLoading] = useState(false)

    // handlers
    const handleChange = (key: string, value: string) => {
        setForm(prev => ({ ...prev, [key]: value }))
    }

    const handleSubmit = async () => {
        const productData: CreateProducts = {
            ...form,
            price_cost: Number(form.price_cost),
            price_sale: Number(form.price_sale),
            price_wholesale: form.price_wholesale ? Number(form.price_wholesale) : 0,
            inventory: Number(form.inventory),
            inventory_min: Number(form.inventory_min)
        }

        createProduct(productData)
        
        // Reset form
        setForm({
            name: "",
            price_cost: "",
            price_sale: "",
            price_wholesale: "",
            inventory: "",
            inventory_min: ""
        })
        onClose()
    }

    const handleUpload = async () => {
        setIsLoading(true)

        if(uploadResult) {
            // Si ya hubo un upload, reiniciar para cargar otro
            setUploadResult(null)
            setFile(null)
            setIsLoading(false)
        } else {
            if(file) {
                onUploadExcel(file, {
                    onSuccess: (data) => {
                        setUploadResult(data)
                    }
                })
            } else {
                alert("Por favor selecciona un archivo primero")
            }
        }
    }

    const handleCloseModal = () => {
        setUploadResult(null)
        setFile(null)
        setForm({
            name: "",
            price_cost: "",
            price_sale: "",
            price_wholesale: "",
            inventory: "",
            inventory_min: ""
        })
        onClose()
    }

    // Drag and drop handlers
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if(e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        
        if(e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0]
            if(droppedFile.name.endsWith(".xlsx") || droppedFile.name.endsWith(".xls") || droppedFile.name.endsWith(".csv")) {
                setFile(droppedFile)
            }
        }
    }

    // Formatear precio
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN"
        }).format(price)
    }

    // Calcular productos importados exitosamente
    const successfulImports = uploadResult 
        ? uploadResult.total - uploadResult.ignoredProducts.length 
        : 0

    const actions = mode === "manual"
        ? [
            { label: "Cancelar", onClick: handleCloseModal, variant: "secondary" as const },
            {
                label: "Guardar Producto",
                onClick: handleSubmit,
                variant: "primary" as const,
                loading,
                icon: <Package className="w-5 h-5" />
            }
        ]
        : uploadResult
        ? [
            {
                label: "Cerrar",
                onClick: handleCloseModal,
                variant: "secondary" as const
            },
            {
                label: "Cargar otro Excel",
                onClick: handleUpload,
                variant: "primary" as const,
                icon: <Redo2 className="w-5 h-5" />
            }
        ]
        : [
            { label: "Cancelar", onClick: handleCloseModal, variant: "secondary" as const },
            {
                label: isloading ? "Procesando" : "Cargar Excel",
                onClick: handleUpload,
                variant: "primary" as const,
                loading,
                disabled: !file,
                icon: isloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />
            }
        ]

    return (
        <GenericModal
            isOpen={isOpen}
            onClose={handleCloseModal}
            title="Nuevo Producto"
            description="Agrega un producto manualmente o carga varios desde Excel"
            actions={actions}
            size="lg"
        >
            <>
                {/* Tabs */}
                <div className="flex gap-3 mb-6 p-1 bg-gray-100 rounded-xl">
                    <button
                        onClick={() => setMode("manual")}
                        className={`flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                            mode === "manual"
                                ? "bg-white text-[#78A890] shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        <Plus className="w-4 h-4" />
                        Ingreso Manual
                    </button>

                    <button
                        onClick={() => setMode("excel")}
                        className={`flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                            mode === "excel"
                                ? "bg-white text-[#78A890] shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        <FileSpreadsheet className="w-4 h-4" />
                        Carga Masiva
                    </button>
                </div>

                {mode === "manual" ? (
                    <div className="space-y-6">
                        {/* Información del Producto */}
                        <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                                Información del Producto
                            </h4>
                            <div className="space-y-4">
                                {/* Nombre */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre del Producto <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Ej: Cemento mty"
                                            value={form.name}
                                            onChange={(e) => handleChange("name", e.target.value)}
                                            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#78A890] focus:ring-4 focus:ring-[#78A890]/10 transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Precios */}
                        <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                                Precios
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Precio Costo */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Precio Costo <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={form.price_cost}
                                            onChange={(e) => handleChange("price_cost", e.target.value)}
                                            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#78A890] focus:ring-4 focus:ring-[#78A890]/10 transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Precio Venta */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Precio Venta <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={form.price_sale}
                                            onChange={(e) => handleChange("price_sale", e.target.value)}
                                            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#78A890] focus:ring-4 focus:ring-[#78A890]/10 transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Precio Mayoreo */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Precio Mayoreo
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00 (Opcional)"
                                            value={form.price_wholesale}
                                            onChange={(e) => handleChange("price_wholesale", e.target.value)}
                                            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#78A890] focus:ring-4 focus:ring-[#78A890]/10 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Inventario */}
                        <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                                Inventario
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Stock Inicial */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Stock Inicial <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={form.inventory}
                                            onChange={(e) => handleChange("inventory", e.target.value)}
                                            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#78A890] focus:ring-4 focus:ring-[#78A890]/10 transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Stock Mínimo */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Stock Mínimo <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={form.inventory_min}
                                            onChange={(e) => handleChange("inventory_min", e.target.value)}
                                            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#78A890] focus:ring-4 focus:ring-[#78A890]/10 transition-all"
                                            required
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Recibirás alertas cuando el stock esté por debajo de este nivel
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : uploadResult ? (
                    // Resultado del Upload
                    <div className="space-y-6">
                        {/* Success Summary */}
                        <div className="bg-[#78A890]/10 border border-[#78A890]/30 rounded-xl p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-[#78A890] rounded-full flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                                        Carga completada
                                    </h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Total procesados</p>
                                            <p className="text-2xl font-bold text-gray-900">{uploadResult.total}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Importados</p>
                                            <p className="text-2xl font-bold text-[#78A890]">{successfulImports}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Ya existían</p>
                                            <p className="text-2xl font-bold text-yellow-500">{uploadResult.ignoredProducts.length}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Ignored Products List */}
                        {uploadResult.ignoredProducts.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <h4 className="text-sm font-semibold text-gray-900">
                                        Productos que ya existían  ({uploadResult.ignoredProducts.length})
                                    </h4>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden max-h-96 overflow-y-auto">
                                    <table className="min-w-full text-sm">
                                        <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Producto
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Departamento
                                                </th>
                                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Precio Venta
                                                </th>
                                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Stock
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {uploadResult.ignoredProducts.map((item, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3">
                                                        <span className="font-medium text-gray-900 capitalize">
                                                            {item.name}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className="text-gray-600 capitalize">
                                                            {item.department || "-"}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <span className="font-semibold text-gray-900">
                                                            {formatPrice(item.price_sale)}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                                                            item.inventory > item.inventory_min
                                                                ? "bg-[#78A890]/15 text-[#78A890]"
                                                                : "bg-red-100 text-red-700"
                                                        }`}>
                                                            {item.inventory} uds
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Success message - All products imported */}
                        {uploadResult.ignoredProducts.length === 0 && (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-[#78A890]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 className="w-8 h-8 text-[#78A890]" />
                                </div>
                                <p className="text-gray-900 font-semibold text-lg mb-1">
                                    ¡Importación exitosa!
                                </p>
                                <p className="text-gray-600">
                                    Todos los productos fueron importados correctamente
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    // Upload Form
                    <div className="space-y-6">
                        {/* Info Banner */}
                        <Alerts 
                            type="info" 
                            title="Formato del archivo Excel" 
                            message="El archivo debe contener las columnas: Descripcion, Precio Costo, Precio Venta, Precio Mayoreo, Inventario, Inv. Minimo, Departamento. Los productos duplicados o que ya existen serán omitidos." 
                            noPadding
                        />

                        {/* Drop Zone */}
                        <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-12 ${
                                dragActive
                                    ? "border-[#78A890] bg-[#78A890]/5"
                                    : file
                                    ? "border-[#78A890] bg-[#78A890]/5"
                                    : "border-gray-300 hover:border-gray-400"
                            }`}
                        >
                            {file ? (
                                <>
                                    <div className="w-16 h-16 bg-[#78A890]/10 rounded-full flex items-center justify-center mb-4">
                                        <FileSpreadsheet className="w-8 h-8 text-[#78A890]" />
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900 mb-1">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500 mb-4">
                                        {(file.size / 1024).toFixed(2)} KB
                                    </p>
                                    <button
                                        onClick={() => setFile(null)}
                                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                                    >
                                        Remover archivo
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <Upload className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <p className="text-gray-900 font-semibold mb-1">
                                        Arrastra tu archivo aquí
                                    </p>
                                    <p className="text-sm text-gray-500 mb-4">
                                        o haz click para seleccionar
                                    </p>
                                    <input
                                        type="file"
                                        accept=".xlsx,.xls"
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <p className="text-xs text-gray-400">
                                        Formatos soportados: .xlsx, .xls (Máx. 10,000 filas)
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Download Template */}
                        <div className="flex justify-center">
                            <button
                                onClick={() => {
                                    // Aquí iría la lógica para descargar la plantilla
                                    console.log("Descargar plantilla")
                                }}
                                className="text-sm text-[#78A890] hover:text-[#C0D890] font-medium flex items-center gap-2"
                            >
                                <FileSpreadsheet className="w-4 h-4" />
                                Descargar plantilla de ejemplo
                            </button>
                        </div>
                    </div>
                )}
            </>
        </GenericModal>
    )
}

export default ProductModal