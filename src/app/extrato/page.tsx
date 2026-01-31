
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Separator } from "@/components/ui/separator";
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  
  const invoiceItems = [
    {
      service: "Diagnóstico Técnico e Plataforma",
      details: "Acesso completo e análise inicial",
      price: 999.0,
    },
    {
      service: "Desconto de Lançamento",
      details: "Cupom: STARTUP2026",
      price: -100.0,
    },
  ];
  
  const total = invoiceItems.reduce((acc, item) => acc + item.price, 0);
  
  export default function ExtratoPage() {
    return (
      <div className="min-h-screen bg-muted/40 py-12 flex items-center justify-center px-4">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader className="p-6">
            <CardTitle className="text-2xl font-headline">
              Extrato de Serviço
            </CardTitle>
            <CardDescription>
              Detalhes da sua contratação com a Tech Lab.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-4">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <p className="font-semibold text-muted-foreground">FATURADO PARA</p>
                  <p>João Pereira (Exemplo)</p>
                  <p>joao.exemplo@email.com</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-semibold text-muted-foreground">Nº DO EXTRATO</p>
                  <p>TL-2026-001</p>
                  <p className="font-semibold text-muted-foreground mt-2">DATA</p>
                  <p>{new Date().toLocaleDateString("pt-BR")}</p>
                </div>
              </div>
              <Separator />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Serviço</TableHead>
                    <TableHead className="text-right">Valor (BRL)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoiceItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <p className="font-medium">{item.service}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.details}
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        {item.price.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/50 p-6">
            <div className="w-full flex justify-end">
              <div className="grid gap-2 text-right w-full max-w-sm">
                <div className="flex justify-between items-center gap-4">
                  <p className="font-semibold">Subtotal</p>
                  <p>R$ 999,00</p>
                </div>
                 <div className="flex justify-between items-center gap-4">
                  <p className="font-semibold text-destructive">Descontos</p>
                  <p className="text-destructive">- R$ 100,00</p>
                </div>
                <Separator className="my-2"/>
                <div className="flex justify-between items-center gap-4">
                  <p className="text-lg font-bold">Total a Pagar</p>
                  <p className="text-lg font-bold">
                    {total.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }
