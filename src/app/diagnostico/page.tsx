"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// This page just redirects to the first step of the diagnostic.
export default function DiagnosticRootPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/diagnostico/01-bem-vindo");
    }, [router]);

    return null; // Or a loading spinner
}
