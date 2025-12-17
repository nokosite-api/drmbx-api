import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button } from "@/components/ui/button"
import { LogOut, Key, User } from 'lucide-react';
import { toast } from 'sonner';

export default function Navbar() {
    const router = useRouter();
    const isActive = (path) => router.pathname === path;

    const logout = () => {
        localStorage.removeItem('admin_password');
        router.push('/');
        toast.info("Anda telah logout.");
    };

    return (
        <nav className="bg-slate-950 border-b border-slate-800 px-6 py-3 flex justify-between items-center sticky top-0 z-10 shadow-md">
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                    <div className="bg-white text-slate-950 p-2 rounded-lg">
                        <Key size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white leading-none">Dramabox Admin</h1>
                        <p className="text-xs text-slate-400 mt-1">API Key Management System</p>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-1">
                    <Link href="/dashboard">
                        <Button variant="ghost" className={`text-sm ${isActive('/dashboard') ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                            API Key
                        </Button>
                    </Link>
                    <Link href="/docs">
                        <Button variant="ghost" className={`text-sm ${isActive('/docs') ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                            DOCS
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 text-sm text-slate-300 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
                    <div className="bg-slate-800 p-1 rounded-full">
                        <User size={12} className="text-slate-300" />
                    </div>
                    <span>Administrator</span>
                </div>
                <div className="h-6 w-px bg-slate-800 hidden md:block"></div>
                <Button variant="ghost" onClick={logout} className="text-red-400 hover:text-red-300 hover:bg-red-950/30 h-9">
                    <LogOut size={16} className="mr-2" />
                    Logout
                </Button>
            </div>
        </nav>
    );
}
