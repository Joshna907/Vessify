"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, CheckCircle2 } from "lucide-react"

export default function TransactionExtractor({ session }: { session: any }) {
    const [text, setText] = useState("")
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState("")
    const router = useRouter()

    const handleExtract = async () => {
        if (!text.trim()) return

        // Protected action: Redirect to login if not authenticated
        if (!session) {
            router.push("/login")
            return
        }

        setLoading(true)
        setError("")
        setResult(null)

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
            const res = await fetch(`${apiUrl}/api/transactions/extract`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.accessToken || ""}`,
                },
                body: JSON.stringify({ text }),
            })

            if (res.ok) {
                const data = await res.json()
                setResult(data)
                setText("")
                router.refresh()
            } else {
                setError("Extraction failed. Please try again.")
            }
        } catch {
            setError("Network error. Check your connection.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-4">
            <Textarea
                placeholder="Paste your transaction text (SMS, Email, or bank statement)..."
                className="min-h-[160px] glass-input resize-none text-sm"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />

            {error && (
                <div className="text-sm text-red-400 bg-red-950/30 border border-red-900/30 rounded-lg p-3">
                    {error}
                </div>
            )}

            {result && (
                <div className="text-sm bg-primary/5 border border-primary/10 rounded-lg p-4 space-y-1.5">
                    <div className="flex items-center gap-2 text-primary font-medium">
                        <CheckCircle2 className="h-4 w-4" />
                        Transaction Extracted
                    </div>
                    <p className="text-foreground/80 text-sm">
                        {result.data.description} • <span className="font-mono">{result.data.currency} {result.data.amount}</span>
                    </p>
                </div>
            )}

            <Button
                onClick={handleExtract}
                disabled={loading || !text.trim()}
                className="w-full h-11"
            >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Extracting..." : "Extract & Save Transaction"}
            </Button>
        </div>
    )
}