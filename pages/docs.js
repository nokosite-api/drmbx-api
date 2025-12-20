import Navbar from '@/components/Navbar';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Docs() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />
            <main className="max-w-4xl mx-auto p-6 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>API Documentation</CardTitle>
                    </CardHeader>
                    <CardContent className="prose prose-slate max-w-none">
                        <div className="bg-slate-900 text-slate-300 p-4 rounded-lg mb-6">
                            <p className="text-sm font-mono mb-1">Base URL:</p>
                            <code className="text-green-400 font-bold">https://api-dramabox.mkstore.id</code>
                        </div>

                        <h3>Authentication</h3>
                        <p>All API requests must include the <code>x-api-key</code> header.</p>

                        <h3>Endpoints</h3>
                        <ul>
                            <li>
                                <strong>GET /api/search</strong> - Search for dramas
                                <pre className="bg-slate-100 p-2 rounded mt-2 text-xs">GET /api/search?q=Love&lang=en</pre>
                            </li>
                            <li>
                                <strong>GET /api/home</strong> - Get homepage data
                                <pre className="bg-slate-100 p-2 rounded mt-2 text-xs">GET /api/home?lang=in</pre>
                            </li>
                            <li>
                                <strong>GET /api/movie</strong> - Get movie details & chapters
                                <pre className="bg-slate-100 p-2 rounded mt-2 text-xs">GET /api/movie?id=42000000577&slug=the-lost-heir&lang=en</pre>
                            </li>
                            <li>
                                <strong>GET /api/genre</strong> - Get movies by genre
                                <pre className="bg-slate-100 p-2 rounded mt-2 text-xs">GET /api/genre?id=260&lang=en</pre>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
