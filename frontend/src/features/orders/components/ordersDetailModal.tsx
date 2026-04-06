import { User, Phone, MapPin, Calendar, Clock, Edit2 } from "lucide-react"
import GenericModal from "../../../shared/components/ui/genericModal"
import type { Order } from "../types/ordersTypes"

interface OrderDetailsModalProps {
    isOpen: boolean
    onClose: () => void
    order: Order | null
    onEdit: (order: Order) => void
    onChangeStatus: (order: Order) => void
}

const OrderDetailsModal = ({
    isOpen,
    onClose,
    order,
    onEdit,
    onChangeStatus
}: OrderDetailsModalProps) => {
    if (!order) return null

    const formatPrice = (price: number | string) => {
        const numPrice = typeof price === 'string' ? parseFloat(price) : price
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(numPrice)
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("es-MX", { 
            day: "2-digit", 
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })
    }

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            "Pendiente": "#E7E79D",
            "En Proceso": "#C0D890",
            "Completado": "#78A890",
            "Cancelado": "#606078"
        }
        return colors[status] || "#606078"
    }

    const actions = [
        {
            label: "Cerrar",
            onClick: onClose,
            variant: "secondary" as const
        },
        {
            label: "Cambiar Estado",
            onClick: () => onChangeStatus(order),
            variant: "secondary" as const
        },
        {
            label: "Editar Pedido",
            onClick: () => onEdit(order),
            variant: "primary" as const,
            icon: <Edit2 className="w-5 h-5" />
        }
    ]

    return (
        <GenericModal
            isOpen={isOpen}
            onClose={onClose}
            title="Detalle del Pedido"
            description={`#${order.orders_id}`}
            actions={actions}
            size="lg"
        >
            <>
                {/* Status Badge */}
                <div className="mb-6">
                    <span 
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                        style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                        <span className="w-2 h-2 bg-white rounded-full"></span>
                        {order.status}
                    </span>
                </div>

                {/* Client Info */}
                <div className="mb-6">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                        Información del Cliente
                    </h4>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 bg-[#78A890]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <User className="w-5 h-5 text-[#78A890]" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Cliente</p>
                                <p className="text-gray-900 font-medium">{order.client_data.name}</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-10 h-10 bg-[#78A890]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Phone className="w-5 h-5 text-[#78A890]" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Teléfono</p>
                                <p className="text-gray-900 font-medium">{order.client_data.tel}</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-10 h-10 bg-[#78A890]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <MapPin className="w-5 h-5 text-[#78A890]" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Dirección</p>
                                <p className="text-gray-900 font-medium">
                                    {order.client_data.street}, {order.client_data.neighborhood}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products */}
                <div className="mb-6">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                        Productos
                    </h4>
                    <div className="bg-gray-50 rounded-xl overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Producto</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Cantidad</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">P. Unitario</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {order.products.map((product) => (
                                    <tr key={product.id}>
                                        <td className="px-4 py-3 text-gray-900 font-medium capitalize">
                                            {product.name}
                                        </td>
                                        <td className="px-4 py-3 text-center text-gray-600">
                                            {product.quantity}
                                        </td>
                                        <td className="px-4 py-3 text-right text-gray-600">
                                            {formatPrice(product.unit_price)}
                                        </td>
                                        <td className="px-4 py-3 text-right font-semibold text-gray-900">
                                            {formatPrice(product.subtotal)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-gray-100">
                                <tr>
                                    <td colSpan={3} className="px-4 py-3 text-right font-bold text-gray-900">
                                        Total
                                    </td>
                                    <td className="px-4 py-3 text-right font-bold text-[#78A890] text-base">
                                        {formatPrice(order.total_amount)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* Order Details */}
                <div className="mb-6">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                        Detalles del Pedido
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 bg-[#78A890]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-5 h-5 text-[#78A890]" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Fecha Pedido</p>
                                <p className="text-gray-900 font-medium text-sm">{formatDate(order.order_date)}</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-10 h-10 bg-[#78A890]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Clock className="w-5 h-5 text-[#78A890]" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Fecha Entrega</p>
                                <p className="text-gray-900 font-medium text-sm">{formatDate(order.delivery_date)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                {order.notes && (
                    <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            Notas
                        </h4>
                        <p className="text-gray-700 bg-orange-50 border border-orange-200 p-4 rounded-lg text-sm">
                            📝 {order.notes}
                        </p>
                    </div>
                )}
            </>
        </GenericModal>
    )
}

export default OrderDetailsModal