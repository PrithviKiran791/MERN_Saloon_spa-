import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import PageTitle from "@/components/ui/page-title";
import { Link } from "react-router-dom";
import { backendUrl } from "@/constants";
import type { ISalon } from "@/interfaces";

export default function OwnerSalonsPage() {
    const [loading, setLoading] = useState(true);
    const [salons, setSalons] = useState<ISalon[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchSalons = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = Cookies.get("token");
            const res = await axios.get(`${backendUrl}/salons/get-salons-by-owner-id`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.data?.success) {
                setSalons(res.data.data || []);
            } else {
                setError(res.data?.message || "Failed to load salons");
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSalons();
    }, []);

    const deleteSalon = async (id: string) => {
        try {
            setDeletingId(id);
            const token = Cookies.get("token");
            await axios.delete(`${backendUrl}/salons/delete-salon-by-id/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            await fetchSalons();
        } catch (err) {
            console.error(err);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <PageTitle title="My Salons" />
                <Button asChild>
                    <Link to="/owner/salons/add">Add new salon</Link>
                </Button>
            </div>

            {loading && (
                <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-muted-foreground">Loading salons...</p>
                </div>
            )}

            {error && !loading && (
                <div className="bg-destructive/10 text-destructive border border-destructive/40 rounded-lg p-4">
                    {error}
                </div>
            )}

            {!loading && !error && salons.length === 0 && (
                <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-muted-foreground">No salons yet. Add your first salon.</p>
                </div>
            )}

            {!loading && !error && salons.length > 0 && (
                <div className="grid gap-3">
                    {salons.map((salon) => (
                        <div key={salon._id} className="bg-card border border-border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            <div>
                                <div className="text-lg font-semibold">{salon.name}</div>
                                <div className="text-sm text-muted-foreground">
                                    {salon.city}, {salon.state}
                                </div>
                                <div className="text-xs text-muted-foreground">Offer: {salon.offerStatus}</div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" asChild>
                                    <Link to={`/owner/salons/edit/${salon._id}`}>Edit</Link>
                                </Button>
                                <Button
                                    variant="destructive"
                                    disabled={deletingId === salon._id}
                                    onClick={() => deleteSalon(salon._id!)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}