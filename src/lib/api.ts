"use client";
// This file is the new API client for communicating with the Go backend.
import type { LoginResponse } from "@/types/auth";
import type { UserMeResponse } from "@/types/user";
import type { DiagnosticoResultadoResponse } from "@/types/plano";
import type { CriarPagamentoRequest, CriarPagamentoResponse } from "@/types/pagamento";
import type { PainelResponse } from "@/types/painel";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/v1';

async function handleResponse(response: Response) {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
}

export async function register(name: string, email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
    });
    return handleResponse(response);
}

export async function login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
}

export async function getMe(): Promise<UserMeResponse> {
    const token = localStorage.getItem('authToken');
    if (!token) {
        throw new Error('Authentication token not found.');
    }

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
    const token = localStorage.getItem('authToken');
    if (!token) {
        throw new Error('Authentication token not found.');
    }
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
    const token = localStorage.getItem('authToken');
    if (!token) {
        throw new Error('Authentication token not found.');
    }

    const response = await fetch(`${API_BASE_URL}/dashboard`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    return handleResponse(response);
}


export async function createPayment(data: CriarPagamentoRequest): Promise<CriarPagamentoResponse> {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication token not found.');
    
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
