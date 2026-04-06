import React, { useState } from "react"
import SideNavbar from "../shared/components/layout/sideNavbar"
import Header from "../shared/components/layout/header"
// componentes
import ReportComponent from "./reports/reportMain"
import ClientsComponent from "./clients/components/clientsComponent"
import ProductsMain from "./products/productsMain"
import OrdersMain from "./orders/ordersMain"

const MainPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"dashboard" | "orders" | "clients" | "reports" | "products">("dashboard")

    const getPageTitle = () => {
        switch (activeTab) {
            case "dashboard":
                return "Sistema Gestor de Pedidos"
            case "orders":
                return "Pedidos"
            case "clients":
                return "Clientes"
            case "reports":
                return "Reportes"
            case "products":
                return "Productos"
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

                    {activeTab === "orders" && <OrdersMain />}
                    {activeTab === "clients" && <ClientsComponent />}
                    {activeTab === "products" && <ProductsMain />}
                    {activeTab === "reports" && <ReportComponent />}
                </main>
            </div>
        </div>
    )
}

export default MainPage