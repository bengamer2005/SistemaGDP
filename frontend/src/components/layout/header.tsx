import { Search, ChevronDown } from "lucide-react"

interface HeaderProps {
    pageTitle: string,
    username?: string,
    userInitials?: string
}

const Header: React.FC<HeaderProps> = ({ pageTitle, username = "Benito Leonel Garcia Castillo", userInitials = "BG" }) => {
    return (
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
            <div className="px-8 py-4 flex justify-between items-center">
                {/* left */}
                <div className="flex items-center gap-8">
                    <h1 className="text-xl font-semibold text-[#1A202C]">
                        {pageTitle}
                    </h1>
                </div>

                {/* rigth */}
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#F7FAFC] transition-all duration-200">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#78A890] to-[#606078] rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                            {userInitials}
                        </div>
                        <ChevronDown className="w-4 h-4 text-[#718096]" />
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Header