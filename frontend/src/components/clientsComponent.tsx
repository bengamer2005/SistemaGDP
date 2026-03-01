import { Plus, Eye, Edit2, ChevronLeft, ChevronRight } from "lucide-react"
// hooks
import { useAllClients } from "../hooks/useAllClientsService"
// components
import ClientDetailsModal from "./utilities/modal"
import { SkeletonLoader } from "./utilities/loaders"
import Alerts from "./utilities/alerts"
// types
import type { Clients } from "../types/clientsTypes"
import { useState } from "react"

const ClientsComponent = () => {
    const { data, isLoading, isError } = useAllClients()
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedClient, setSelectedClient] = useState<Clients | null>(null)
    const [showModal, setShowModal] = useState(false)
    const [modalMode, setModalMode] = useState<"view" | "edit" | "create">("view")

    // estados para paginacion
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)

    // filtrar clientes
    const filteredClients = data?.filter(client => 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.telephones.some(tel => tel.telephone.includes(searchTerm)) ||
        client.address?.city.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []

    // paginacion
    const totalPages = Math.ceil(filteredClients.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedClients = filteredClients.slice(startIndex, endIndex)

    // handles
    // para regresar a página 1 cuando cambia el filtro
    const handleSearchChange = (value: string) => {
        setSearchTerm(value)
        setCurrentPage(1)
    }

    // para cambio página
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    // para cambiar items por página
    const handleItemsPerPageChange = (value: number) => {
        setItemsPerPage(value)
        setCurrentPage(1) // Resetear a página 1
    }

    // para modal
    const handleViewClient = (mode: string, client?: Clients) => {
        if(mode !== "create") setSelectedClient(client!)
        setShowModal(true)
        setModalMode(mode as "view" | "edit" | "create")
    }

    // iniciales
    const getInitials = (name: string) => {
        const words = name.split(" ")
        if(words.length >= 2) {
            return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase()
        }
        return name.charAt(0).toUpperCase()
    }

    // regresa los clientes nuevos de este mes
    const getNewClientsThisMonth = () => {
        if(!data) return 0

        const now = new Date()
        return data.filter(client => {
            const createdAt = new Date(client.created_at)
            return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear()
        }).length
    }

    return (
        <>
            <div>
                {/* stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                        <p className="text-sm text-gray-500">Total Clientes</p>
                        <p className="text-3xl font-bold">{data?.length || 0}</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                        <p className="text-sm text-gray-500">Nuevos este mes</p>
                        <p className="text-3xl font-bold text-emerald-500">{getNewClientsThisMonth()}</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                        <p className="text-sm text-gray-500">Clientes activos</p>
                        <p className="text-3xl font-bold text-lime-400">{data?.length || 0}</p>
                    </div>
                </div>

                {/* controls */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="relative flex-1 max-w-md w-full">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>

                        <input
                            type="text"
                            placeholder="Buscar por nombre, teléfono o ciudad..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#78A890] focus:ring-3 focus:ring-[#78A890]/10 transition-all"
                        />
                    </div>

                    <button onClick={() => handleViewClient("create")} className="px-6 py-3 bg-gradient-to-r from-[#78A890] to-[#C0D890] text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Nuevo Cliente
                    </button>
                </div>

                {/* table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Cliente</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Teléfono</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Calle</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Pedidos</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Fecha Registro</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {isLoading && <SkeletonLoader columns={6}/>}
                                {isError && (
                                    <tr>
                                        <td colSpan={6}>{<Alerts type="error" message="Ocurrió un error al cargar los clientes. Por favor, intenta nuevamente." noPadding/>}</td>
                                    </tr>
                                )}
                                {!isLoading && !isError && filteredClients?.length === 0 &&(
                                    <tr>
                                        <td colSpan={6}>{<Alerts type={searchTerm ? "info" : "warning"} message={searchTerm ? "No se encontraron clientes con ese criterio de búsqueda." : "No se encontraron clientes."} noPadding/>}</td>
                                    </tr>
                                )}
                                        
                                {!isLoading && !isError && paginatedClients?.map((client) => (
                                    <tr key={client.clientsId} className="border-b hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-[#78A890] to-[#C0D890] rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                                    {getInitials(client.name)}
                                                </div>
                                                <span className="font-semibold text-gray-900">{client.name}</span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-gray-600">
                                            {client.telephones.length > 0 ? (
                                                <span>{client.telephones[0].telephone}</span>
                                            ) : (
                                                <span className="text-gray-400 italic">Sin teléfono</span>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-gray-600">
                                            {client.address ? (
                                                <span>{client.address.street} #{client.address.exterior_number ?? ""}</span>
                                            ) : (
                                                <span className="text-gray-400 italic">Sin calle</span>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-gray-500 text-sm">
                                            0
                                        </td>

                                        <td className="px-6 py-4 text-gray-500 text-sm">
                                            {new Date(client.created_at).toLocaleDateString("es-MX")}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleViewClient("view", client)}
                                                    title="Ver detalles"
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-[#78A890] hover:text-[#78A890] hover:bg-[#78A890]/5 transition-all"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleViewClient("edit", client)}
                                                    title="Editar"
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-[#78A890] hover:text-[#78A890] hover:bg-[#78A890]/5 transition-all"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* paginacion */}
                    {!isLoading && !isError && filteredClients.length > 0 && (
                        <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-between items-center">
                            <p className="text-sm text-gray-600">
                                Mostrando {startIndex + 1}-{Math.min(endIndex, filteredClients.length)} de {filteredClients.length}
                            </p>

                            {/* botones */}
                            <div className="flex items-center gap-2">
                                <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className={`px-4 py-2 flex items-center gap-2 rounded-lg border transition-all ${
                                    currentPage === 1
                                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                                }`}>
                                    <ChevronLeft className="w-4 h-4" />
                                    Anterior
                                </button>

                                <span className="px-4 py-2 text-sm text-gray-700">
                                    Página {currentPage} de {totalPages}
                                </span>

                                <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className={`px-4 py-2 flex items-center gap-2 rounded-lg border transition-all ${
                                    currentPage === totalPages
                                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                                }`}>
                                    Siguiente
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {showModal && (
                    <ClientDetailsModal
                        mode={modalMode}
                        client={selectedClient}
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                    />
                )}
            </div>
        </>
    )
}

export default ClientsComponent