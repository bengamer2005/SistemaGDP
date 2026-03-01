import { Home, Package, Users, BarChart3 } from "lucide-react"

interface SideNavbar {
    activeTab: "dashboard" | "orders" | "clients" | "reports",
    onTabChange: (tab: "dashboard" | "orders" | "clients" | "reports") => void
}

const SideNavbar: React.FC<SideNavbar> = ({ activeTab, onTabChange }) => {
    const navItems = [
        { id: "dashboard" as const, label: "Dashboard", icon: Home },
        { id: "orders" as const, label: "Pedidos", icon: Package },
        { id: "clients" as const, label: "Clientes", icon: Users },
        { id: "reports" as const, label: "Reportes", icon: BarChart3 },
    ]
    
    return (
        <>
            <aside className="fixed left-0 top-0 bottom-0 w-[60px] bg-[#1A202C] flex flex-col items-center py-6 z-50">
                {/* logo */}
                <div className="w-9 h-9 bg-gradient-to-br from-[#78A890] to-[#C0D890] rounded-[10px] flex items-center justify-center text-white font-extrabold text-lg mb-8">
                    P
                </div>

                {/* nav icons */}
                <nav className="flex flex-col gap-6 flex-1">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = activeTab === item.id

                        return (
                            <button key={item.id} onClick={() => onTabChange(item.id)} title={item.label} className={`w-10 h-10 flex items-center justify-center rounded-[10px] transition-all duration-200 relative group
                                ${isActive ? "bg-[#78A890] text-white" : "text-[#718096] hover:bg-[#78A890]/10 hover:text-[#78A890]"
                            }`}>
                                <Icon className="w-5 h-5"/>

                                {isActive && (
                                    <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-1 h-6 bg-[#C0D890] rounded-r"></div>
                                )}

                                <span className="absolute left-[60px] ml-2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    {item.label}
                                </span>
                            </button>
                        )
                    })}
                </nav>
            </aside>
        </>
    )
}

export default SideNavbar