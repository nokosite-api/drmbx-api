import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Loader2, Trash2, LogOut, Key, Copy, Plus } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

export default function Dashboard() {
    const [keys, setKeys] = useState([]);
    const [owner, setOwner] = useState('');
    const [permissions, setPermissions] = useState(['dramabox', 'goodshort']);
    const [isCreating, setIsCreating] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchKeys();
    }, []);

    const fetchKeys = async () => {
        const password = localStorage.getItem('admin_password');
        if (!password) {
            router.push('/');
            return;
        }

        try {
            const res = await fetch('/api/admin/keys', {
                headers: { 'x-admin-password': password }
            });

            if (res.status === 401) {
                router.push('/');
                return;
            }

            const data = await res.json();
            setKeys(Array.isArray(data) ? data : []);
        } catch (e) {
            toast.error("Gagal mengambil data user.");
        } finally {
            setLoading(false);
        }
    };

    const generateKey = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        for (let i = 0; i < 32; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return `MK-${result}`;
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setIsCreating(true);
        const password = localStorage.getItem('admin_password');
        const newKey = generateKey();

        const res = await fetch('/api/admin/keys', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-admin-password': password
            },
            body: JSON.stringify({ owner, key: newKey, permissions })
        });

        setIsCreating(false);
        if (res.ok) {
            setOwner('');
            setPermissions(['dramabox', 'goodshort']);
            fetchKeys();
            toast.success("API Key berhasil dibuat!");
        } else {
            toast.error("Gagal membuat key. Pastikan Service Role Key benar.");
        }
    };

    const handleDelete = async (id) => {
        const password = localStorage.getItem('admin_password');
        const res = await fetch(`/api/admin/keys?id=${id}`, {
            method: 'DELETE',
            headers: { 'x-admin-password': password }
        });

        if (res.ok) {
            toast.success("User berhasil dihapus.");
            fetchKeys();
        } else {
            toast.error("Gagal menghapus user.");
        }
    };

    const logout = () => {
        localStorage.removeItem('admin_password');
        router.push('/');
        toast.info("Anda telah logout.");
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Key tersalin ke clipboard!");
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            <main className="max-w-5xl mx-auto p-6 space-y-8">

                {/* Create Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Generate New Access</CardTitle>
                        <CardDescription>Buat API Key baru untuk pembeli.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="flex gap-4 items-end">
                            <div className="flex-1 space-y-2">
                                <label className="text-sm font-medium">Nama Owner</label>
                                <Input
                                    placeholder="Contoh: Budi Santoso"
                                    value={owner}
                                    onChange={(e) => setOwner(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex-1 space-y-2">
                                <label className="text-sm font-medium">Access Scope</label>
                                <div className="flex gap-4 pt-2">
                                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={permissions.includes('dramabox')}
                                            onChange={(e) => {
                                                if (e.target.checked) setPermissions([...permissions, 'dramabox']);
                                                else setPermissions(permissions.filter(p => p !== 'dramabox'));
                                            }}
                                            className="accent-slate-900"
                                        />
                                        Dramabox
                                    </label>
                                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={permissions.includes('goodshort')}
                                            onChange={(e) => {
                                                if (e.target.checked) setPermissions([...permissions, 'goodshort']);
                                                else setPermissions(permissions.filter(p => p !== 'goodshort'));
                                            }}
                                            className="accent-slate-900"
                                        />
                                        Goodshort
                                    </label>
                                </div>
                            </div>
                            <Button type="submit" disabled={isCreating} className="w-40">
                                {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                                {isCreating ? "Generating" : "Generate Key"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* List Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Active Users</CardTitle>
                        <CardDescription>Total {keys.length} user aktif.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Owner</TableHead>
                                        <TableHead>API Key</TableHead>
                                        <TableHead>Permissions</TableHead>
                                        <TableHead>Created At</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {keys.map((k) => (
                                        <TableRow key={k.id}>
                                            <TableCell className="font-medium">{k.owner}</TableCell>
                                            <TableCell>
                                                <code className="bg-slate-100 px-2 py-1 rounded text-xs font-mono border flex items-center gap-2 w-fit">
                                                    {k.key}
                                                    <Copy
                                                        size={12}
                                                        className="cursor-pointer text-slate-400 hover:text-slate-600"
                                                        onClick={() => copyToClipboard(k.key)}
                                                    />
                                                </code>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-1 flex-wrap">
                                                    {(k.permissions || []).map(p => (
                                                        <span key={p} className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100 font-medium uppercase tracking-tighter">
                                                            {p}
                                                        </span>
                                                    ))}
                                                    {(!k.permissions || k.permissions.length === 0) && (
                                                        <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-full border">ALL (Legacy)</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-slate-500">
                                                {new Date(k.created_at).toLocaleDateString("id-ID", {
                                                    year: 'numeric', month: 'long', day: 'numeric'
                                                })}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Hapus User?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Aksi ini tidak bisa dibatalkan. Kunci API milik <b>{k.owner}</b> akan berhenti berfungsi selamanya.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Batal</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDelete(k.id)}
                                                                className="bg-red-600 hover:bg-red-700"
                                                            >
                                                                Hapus
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {keys.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                                                Belum ada data. Silakan generate baru.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
