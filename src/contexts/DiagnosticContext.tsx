"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { z } from "zod";

const diagnosticSchema = z.object({
    pessoa: z.object({
      cpf: z.string().optional(),
      nome: z.string().optional(),
      data_nascimento: z.string().optional(),
      cnpj: z.string().optional().nullable(),
    }),
    contato: z.object({
      email: z.string().email("E-mail inválido.").optional().or(z.literal('')),
      whatsapp: z.string().optional(),
    }),
    seguranca: z.object({
      senha: z.string().optional(),
    }),
    projeto: z.object({
      estagio: z.string().optional(),
      dores: z.array(z.string()).optional(),
      repositorio: z.string().optional(),
      descricao_problema: z.string().optional(),
      expectativa: z.string().optional(),
    }),
    pagamento: z.object({
      metodo: z.string().optional(),
      status: z.enum(["pendente", "pago"]).default("pendente"),
    }),
});

export type DiagnosticData = z.infer<typeof diagnosticSchema>;

interface DiagnosticContextType {
    data: DiagnosticData;
    updateData: (newData: Partial<DiagnosticData>) => void;
    resetData: () => void;
}

const DiagnosticContext = createContext<DiagnosticContextType | undefined>(undefined);

const initialData: DiagnosticData = {
    pessoa: {},
    contato: {},
    seguranca: {},
    projeto: {
        dores: [],
    },
    pagamento: { status: "pendente" },
};

export function DiagnosticProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<DiagnosticData>(initialData);

    useEffect(() => {
        try {
            const savedData = localStorage.getItem("diagnosticData");
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                const result = diagnosticSchema.safeParse(parsedData);
                if (result.success) {
                    setData(result.data);
                } else {
                    localStorage.removeItem("diagnosticData");
                }
            }
        } catch (error) {
            console.error("Failed to load diagnostic data from localStorage", error);
        }
    }, []);

    const updateData = (newData: any) => {
        setData(prevData => {
            // A deep merge would be better here, but for this flow a shallow merge is enough
            const updatedData = { 
                ...prevData,
                ...newData,
                pessoa: {...prevData.pessoa, ...newData.pessoa},
                contato: {...prevData.contato, ...newData.contato},
                seguranca: {...prevData.seguranca, ...newData.seguranca},
                projeto: {...prevData.projeto, ...newData.projeto},
                pagamento: {...prevData.pagamento, ...newData.pagamento},
            };
             try {
                localStorage.setItem("diagnosticData", JSON.stringify(updatedData));
            } catch (error) {
                console.error("Failed to save diagnostic data to localStorage", error);
            }
            return updatedData;
        });
    };

    const resetData = () => {
        localStorage.removeItem("diagnosticData");
        setData(initialData);
    }

    return (
        <DiagnosticContext.Provider value={{ data, updateData, resetData }}>
            {children}
        </DiagnosticContext.Provider>
    );
}

export function useDiagnostic() {
    const context = useContext(DiagnosticContext);
    if (!context) {
        throw new Error("useDiagnostic must be used within a DiagnosticProvider");
    }
    return context;
}
