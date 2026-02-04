"use client";
// This file is the new API client for communicating with the Go backend.
import type { UserMeResponse } from "@/types/user";
import type { DiagnosticoResultadoResponse } from "@/types/plano";
import type { CriarPagamentoRequest, CriarPagamentoResponse, AnonymizedDonation } from "@/types/pagamento";
import type { PainelResponse } from "@/types/painel";
import { auth } from "./firebase";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/v1';

async function getAuthToken(): Promise<string> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
        throw new Error('User not authenticated.');
    }
    return currentUser.getIdToken();
}

async function handleResponse(response: Response) {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
     // Handle empty response body for 200 OK
    const text = await response.text();
    return text ? JSON.parse(text) : {};
}

export async function registerUserProfile(name: string): Promise<UserMeResponse> {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ nome: name }),
    });
    return handleResponse(response);
}

export async function getMe(): Promise<UserMeResponse> {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    return handleResponse(response);
}

export async function getDiagnosticResult(): Promise<DiagnosticoResultadoResponse> {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/diagnostico/resultado`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    return handleResponse(response);
}

export async function getDashboardData(): Promise<PainelResponse> {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/cliente/painel`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    return handleResponse(response);
}

export async function getDonations(): Promise<AnonymizedDonation[]> {
    const response = await fetch(`${API_BASE_URL}/donations`);
    return handleResponse(response);
}

export async function createPayment(data: CriarPagamentoRequest): Promise<CriarPagamentoResponse> {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/pagamentos/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    });
    return handleResponse(response);
}
