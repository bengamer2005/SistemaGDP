import { useState, useEffect } from "react"
import { User, Calendar, Clock, Plus, Trash2, Package, AlertCircle } from "lucide-react"
import GenericModal from "../../../shared/components/ui/genericModal"
import { useCreateOrder, useUpdateOrder } from "../hooks/userAllOrdersService"
import { useGetAllProducts } from "../../products/hooks/useProducts"
import { useAllClients } from "../../clients/hooks/useAllClientsService"
import type { Order, CreateOrderProduct } from "../types/ordersTypes"
import { toast } from "sonner"

interface OrderFormModalProps {
    isOpen: boolean
    onClose: () => void
    order: Order | null
    mode: "create" | "edit"
}

const OrderFormModal = ({ isOpen, onClose, order, mode }: OrderFormModalProps) => {
    const { data: productsData } = useGetAllProducts()
    const { data: clientsData } = useAllClients()

    const createOrderMutation = useCreateOrder()
    const updateOrderMutation = useUpdateOrder()

    // from state
    const [formData, setFormData] = useState({
        clients_id: 0,
        order_date: "",
        delivery_date: "",
        notes: "",
        order_status_id: 1
    })

    const [selectedProducts, setSelectedProducts] = useState<CreateOrderProduct[]>([])
    const [showProductSelector, setShowProductSelector] = useState(false)

    // initialize form with order data in edit mode
    useEffect(() => {
        if (isOpen) {
            if (mode === "edit" && order) {
                setFormData({
                    clients_id: order.client_data.id,
                    order_date: order.order_date.split('T')[0],
                    delivery_date: order.delivery_date.split('T')[0],
                    notes: order.notes || "",
                    order_status_id: order.order_status_id
                })
                
                setSelectedProducts(
                    order.products.map(p => ({
                        products_id: p.id,
                        quantity: p.quantity,
                        unit_price: p.unit_price
                    }))
                )
            } else {
                // Reset form for create mode
                const today = new Date().toISOString().split('T')[0]
                setFormData({
                    clients_id: 0,
                    order_date: today,
                    delivery_date: today,
                    notes: "",
                    order_status_id: 1
                })
                setSelectedProducts([])
            }
        }
    }, [isOpen, mode, order])

    const calculateTotal = () => {
        return selectedProducts.reduce((sum, p) => sum + (p.quantity * p.unit_price), 0)
    }

    // handlers
    const handleAddProduct = (productId: number) => {
        const product = productsData?.find(p => p.products_id === productId)
        if (!product) return

        const exists = selectedProducts.find(p => p.products_id === productId)
        if (exists) return

        setSelectedProducts([
            ...selectedProducts,
            {
                products_id: productId,
                quantity: 1,
                unit_price: product.price_sale
            }
        ])
        setShowProductSelector(false)
    }

    const handleUpdateProductQuantity = (productId: number, quantity: number) => {
        setSelectedProducts(
            selectedProducts.map(p =>
                p.products_id === productId
                    ? { ...p, quantity: Math.max(1, quantity) }
                    : p
            )
        )
    }

    const handleUpdateProductPrice = (productId: number, price: number) => {
        setSelectedProducts(
            selectedProducts.map(p =>
                p.products_id === productId
                    ? { ...p, unit_price: Math.max(0, price) }
                    : p
            )
        )
    }

    const handleRemoveProduct = (productId: number) => {
        setSelectedProducts(selectedProducts.filter(p => p.products_id !== productId))
    }

    const handleSubmit = async () => {
        if (formData.clients_id === 0 || selectedProducts.length === 0) {
            toast.warning("Por favor selecciona un cliente y al menos un producto")
            return
        }

        const orderData = {
            ...formData,
            total_amount: calculateTotal(),
            products: selectedProducts
        }

        if (mode === "create") {
            await createOrderMutation.mutateAsync(orderData)
        } else if (order) {
            await updateOrderMutation.mutateAsync({
                orders_id: order.orders_id,
                ...formData,
                total_amount: calculateTotal(),
                products: selectedProducts
            })
        }

        onClose()
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(price)
    }

    const getProductName = (productId: number) => {
        return productsData?.find(p => p.products_id === productId)?.name || "Producto"
    }

    const availableProducts = productsData?.filter(
        p => !selectedProducts.some(sp => sp.products_id === p.products_id)
    )

    const actions = [
        {
            label: "Cancelar",
            onClick: onClose,
            variant: "secondary" as const
        },
        {
            label: mode === "create" ? "Crear Pedido" : "Actualizar Pedido",
            onClick: handleSubmit,
            variant: "primary" as const,
            loading: createOrderMutation.isPending || updateOrderMutation.isPending,
            icon: <Package className="w-5 h-5" />
        }
    ]

    return (
        <GenericModal
            isOpen={isOpen}
            onClose={onClose}
            title={mode === "create" ? "Nuevo Pedido" : "Editar Pedido"}
            description={mode === "edit" && order ? `#${order.orders_id}` : "Completa la información del pedido"}
            actions={actions}
            size="lg"
        >
            <div className="space-y-6">
                {/* Client Selection */}
                <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                        Cliente
                    </h4>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                            value={formData.clients_id}
                            onChange={(e) => setFormData({ ...formData, clients_id: parseInt(e.target.value) })}
                            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#78A890] focus:ring-4 focus:ring-[#78A890]/10 transition-all appearance-none bg-white"
                            required
                        >
                            <option value={0}>Seleccionar cliente</option>
                            {clientsData?.map((client) => (
                                <option key={client.clientsId} value={client.clientsId}>
                                    {client.name} - {client.telephones[0].telephone}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Dates */}
                <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                        Fechas
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Fecha Pedido
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="date"
                                    value={formData.order_date}
                                    onChange={(e) => setFormData({ ...formData, order_date: e.target.value })}
                                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#78A890] focus:ring-4 focus:ring-[#78A890]/10 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Fecha Entrega
                            </label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="date"
                                    value={formData.delivery_date}
                                    onChange={(e) => setFormData({ ...formData, delivery_date: e.target.value })}
                                    min={formData.order_date}
                                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#78A890] focus:ring-4 focus:ring-[#78A890]/10 transition-all"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Productos
                        </h4>
                        <button
                            type="button"
                            onClick={() => setShowProductSelector(!showProductSelector)}
                            className="px-4 py-2 bg-[#78A890] text-white rounded-lg text-sm font-medium hover:bg-[#6B8E23] transition-all flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Agregar Producto
                        </button>
                    </div>

                    {/* Product Selector */}
                    {showProductSelector && availableProducts && availableProducts.length > 0 && (
                        <div className="mb-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
                            <p className="text-sm font-medium text-gray-700 mb-3">Seleccionar producto:</p>
                            <div className="grid grid-cols-2 gap-2">
                                {availableProducts.map((product) => (
                                    <button
                                        key={product.products_id}
                                        type="button"
                                        onClick={() => handleAddProduct(product.products_id)}
                                        className="p-3 bg-white border border-gray-200 rounded-lg hover:border-[#78A890] hover:bg-[#78A890]/5 transition-all text-left"
                                    >
                                        <p className="font-medium text-sm text-gray-900">{product.name}</p>
                                        <p className="text-xs text-gray-500">{formatPrice(product.price_sale)} - Stock: {product.inventory}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Selected Products Table */}
                    {selectedProducts.length > 0 ? (
                        <div className="bg-gray-50 rounded-xl overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Producto</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Cantidad</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">P. Unit.</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Subtotal</th>
                                        <th className="px-4 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {selectedProducts.map((product) => (
                                        <tr key={product.products_id}>
                                            <td className="px-4 py-3 text-gray-900 font-medium capitalize">
                                                {getProductName(product.products_id)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={product.quantity}
                                                    onChange={(e) => handleUpdateProductQuantity(product.products_id, parseInt(e.target.value))}
                                                    className="w-20 px-2 py-1 border border-gray-200 rounded text-center focus:outline-none focus:border-[#78A890]"
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={product.unit_price}
                                                    onChange={(e) => handleUpdateProductPrice(product.products_id, parseFloat(e.target.value))}
                                                    className="w-28 px-2 py-1 border border-gray-200 rounded text-right focus:outline-none focus:border-[#78A890]"
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-right font-semibold text-gray-900">
                                                {formatPrice(product.quantity * product.unit_price)}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveProduct(product.products_id)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-100">
                                    <tr>
                                        <td colSpan={3} className="px-4 py-3 text-right font-bold text-gray-900">
                                            Total
                                        </td>
                                        <td className="px-4 py-3 text-right font-bold text-[#78A890] text-lg">
                                            {formatPrice(calculateTotal())}
                                        </td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    ) : (
                        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No hay productos agregados</p>
                            <p className="text-sm text-gray-400 mt-1">Haz clic en "Agregar Producto" para comenzar</p>
                        </div>
                    )}
                </div>

                {/* Notes */}
                <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Notas (Opcional)
                    </h4>
                    <div className="relative">
                        <AlertCircle className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Agrega notas sobre el pedido..."
                            rows={3}
                            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#78A890] focus:ring-4 focus:ring-[#78A890]/10 transition-all resize-none"
                        />
                    </div>
                </div>
            </div>
        </GenericModal>
    )
}

export default OrderFormModal