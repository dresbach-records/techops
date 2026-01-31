// This file is the new API client for communicating with the Go backend.
import type { DashboardData, Plan } from "@/types";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/v1';

async function handleResponse(response: Response) {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
}

export async function register(name: string, email: string, password: string): Promise<{ token: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
    });
    return handleResponse(response);
}

export async function login(email: string, password: string): Promise<{ token: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
}

export async function getRecommendedPlan(projectData: { estagio?: string; dores?: string[]; repositorio?: string; }): Promise<Plan> {
    const response = await fetch(`${API_BASE_URL}/diagnostico/recommend-plan`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            estagio: projectData.estagio || "",
            dores: projectData.dores || [],
            repositorio: projectData.repositorio || "",
        }),
    });
    return handleResponse(response);
}

export async function getDashboardData(): Promise<DashboardData> {
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

// TODO: Add other endpoints as the backend grows (e.g., submitDiagnostic, getDashboardData, etc.)
