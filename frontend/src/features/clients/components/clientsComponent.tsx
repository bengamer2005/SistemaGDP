import { Plus, Eye, Edit2 } from "lucide-react"
import { useState } from "react"
// hooks
import { useAllClients } from "../hooks/useAllClientsService"
import { useSearch } from "../../../shared/hooks/useSearch"
import { usePagination } from "../../../shared/hooks/usePagination"
// components
import ClientDetailsModal from "../../../shared/components/ui/modal"
import GenericTable from "../../../shared/components/ui/genericTable"
// types
import type { Column, TableAction } from "../../../shared/components/ui/genericTable"
import type { Clients } from "../types/clientsTypes"

const ClientsComponent = () => {
    const { data, isLoading, isError } = useAllClients()
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedClient, setSelectedClient] = useState<Clients | null>(null)
    const [showModal, setShowModal] = useState(false)
    const [modalMode, setModalMode] = useState<"view" | "edit" | "create">("view")

    // filter clients
    const filteredClients = useSearch(data || [], searchTerm, (client, term) =>
        client.name.toLowerCase().includes(term.toLowerCase())
    )

    // pagination
    const {
        paginatedData,
        currentPage,
        totalPages,
        handlePageChange,
        itemsPerPage
    } = usePagination(filteredClients)
    
    // modal
    const handleViewClient = (mode: string, client?: Clients) => {
        if(mode !== "create") setSelectedClient(client!)

        setShowModal(true)
        setModalMode(mode as "view" | "edit" | "create")
    }

    // returns new clients in month
    const getNewClientsThisMonth = () => {
        if(!data) return 0

        const now = new Date()
        
        return data.filter(client => {
            const createdAt = new Date(client.created_at)
            return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear()
        }).length
    }

    // table
    const columns: Column<Clients>[] = [
        {
            key: "name",
            header: "Cliente",
            render: (client) => <span className="font-semibold text-gray-900">{client.name}</span>
        },
        {
            key: "telephone",
            header: "Teléfono",
            render: (client) =>
                client.telephones.length > 0
                    ? client.telephones[0].telephone
                    : <span className="text-gray-400 italic">Sin teléfono</span>
        },
        {
            key: "street",
            header: "Calle",
            render: (client) =>
                client.address
                    ? `${client.address.street} #${client.address.exterior_number ?? ""}`
                    : <span className="text-gray-400 italic">Sin calle</span>
        },
        {
            key: "orders",
            header: "Pedidos",
            align: "center",
            render: () => "0"
        },
        {
            key: "created_at",
            header: "Fecha Registro",
            render: (client) =>
                new Date(client.created_at).toLocaleDateString("es-MX")
        }
    ]

    const actions: TableAction<Clients>[] = [
        {
            icon: <Eye className="w-4 h-4" />,
            label: "Ver detalles",
            variant: "primary",
            onClick: (client) => handleViewClient("view", client)
        },
        {
            icon: <Edit2 className="w-4 h-4" />,
            label: "Editar",
            variant: "primary",
            onClick: (client) => handleViewClient("edit", client)
        }
    ]

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
                            className="w-96 pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#78A890] focus:ring-3 focus:ring-[#78A890]/10 transition-all"
                        />
                    </div>

                    <button onClick={() => handleViewClient("create")} className="px-6 py-3 bg-[#78A890] text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Nuevo Cliente
                    </button>
                </div>

                {/* table */}
                <GenericTable
                    data={paginatedData}
                    columns={columns}
                    actions={actions}
                    keyExtractor={(client) => client.clientsId}

                    isLoading={isLoading}
                    isError={isError}

                    emptyMessage={
                        searchTerm
                            ? "No se encontraron clientes con ese criterio de búsqueda."
                            : "No se encontraron clientes."
                    }
                    emptyType={searchTerm ? "info" : "warning"}
                    errorMessage="Ocurrió un error al cargar los clientes. Por favor, intenta nuevamente."

                    pagination={{
                        currentPage,
                        totalPages,
                        onPageChange: handlePageChange,
                        itemsPerPage,
                        totalItems: filteredClients.length
                    }}
                />

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