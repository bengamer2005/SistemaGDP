import React, { useState } from "react"
import SideNavbar from "../components/layout/sideNavbar"
import Header from "../components/layout/header"
// componentes
import ReportComponent from "../components/reportComponent"
import ClientsComponent from "../components/clientsComponent"
import OrdersComponent from "../components/ordersComponent"

const MainPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"dashboard" | "orders" | "clients" | "reports">("clients")

    const getPageTitle = () => {
        switch (activeTab) {
            case "dashboard":
                return "Dashboard de Pedidos"
            case "orders":
                return "Pedidos"
            case "clients":
                return "Clientes"
            case "reports":
                return "Reportes"
            default:
                return "Sistema Gestor de Pedidos"
        }
    }

    return (
        <div className="flex min-h-screen bg-[#F5F7FA]">
            {/* Sidebar */}
            <SideNavbar
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {/* Main Content */}
            <div className="flex-1 ml-[60px]">
                {/* Header */}
                <Header
                    pageTitle={getPageTitle()}
                />

                {/* Page Content */}
                <main className="p-8">
                    {activeTab === "dashboard" && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>

                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                                <p className="text-gray-600">Vista de Dashboard - En construcción</p>
                            </div>
                        </div>
                    )}

                    {activeTab === "orders" && (
                        <div>
                            <OrdersComponent />
                        </div>
                    )}

                    {activeTab === "clients" && (
                        <div>
                            <ClientsComponent />
                        </div>
                    )}

                    {activeTab === "reports" && (
                        <div>
                            <ReportComponent />
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

export default MainPage