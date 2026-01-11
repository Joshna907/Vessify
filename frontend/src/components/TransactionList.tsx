"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function TransactionList({ session }: { session: any }) {
    const [transactions, setTransactions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [cursor, setCursor] = useState<string | null>(null)

    const fetchTransactions = async (nextCursor?: string) => {
        setLoading(true)
        try {
            const params = new URLSearchParams({ limit: "10" })
            if (nextCursor) params.set("cursor", nextCursor)

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
            const res = await fetch(`${apiUrl}/api/transactions?${params}`, {
                headers: { "Authorization": `Bearer ${session?.accessToken || ""}` }
            })

            if (res.ok) {
                const data = await res.json()
                setTransactions(prev => nextCursor ? [...prev, ...data.data] : data.data)
                setCursor(data.nextCursor)
            }
        } catch (e) {
            console.error("Failed to fetch transactions:", e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTransactions()
    }, [])

    return (
        <div className="space-y-4">
            <div className="rounded-lg border border-white/5 overflow-hidden bg-black/20">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-b border-white/5">
                            <TableHead className="text-xs font-medium text-muted-foreground">Date</TableHead>
                            <TableHead className="text-xs font-medium text-muted-foreground">Description</TableHead>
                            <TableHead className="text-xs font-medium text-muted-foreground">Amount</TableHead>
                            <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!loading && transactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground h-32">
                                    No transactions yet. Extract your first one!
                                </TableCell>
                            </TableRow>
                        ) : (
                            transactions.map((txn) => (
                                <TableRow key={txn.id} className="border-b border-white/5">
                                    <TableCell className="text-sm">{new Date(txn.date).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-sm">{txn.description}</TableCell>
                                    <TableCell className="font-mono text-sm">
                                        {txn.currency} {txn.amount}
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                                            {txn.status}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {cursor && (
                <Button
                    variant="outline"
                    onClick={() => fetchTransactions(cursor)}
                    disabled={loading}
                    className="w-full border-white/10 hover:bg-white/5"
                >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Load More Transactions
                </Button>
            )}
        </div>
    )
}