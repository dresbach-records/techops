export function getContractText(name: string): string {
    const today = new Date().toLocaleDateString("pt-BR", {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    return `
CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE CONSULTORIA TÉCNICA E ACESSO À PLATAFORMA

CONTRATADA: TECH LAB, empresa de consultoria fictícia, doravante denominada "TECH LAB".

CONTRATANTE: ${name}, doravante denominado(a) "CLIENTE".

As partes acima qualificadas celebram o presente contrato, que se regerá pelas seguintes cláusulas:

CLÁUSULA 1ª - DO OBJETO
1.1. O objeto deste contrato é a prestação de serviços de consultoria técnica especializada pela TECH LAB ao CLIENTE, incluindo a realização de um diagnóstico técnico e o fornecimento de acesso a uma plataforma online com um painel personalizado e roadmap estratégico.

CLÁUSULA 2ª - DOS SERVIÇOS
2.1. Os serviços incluem:
    a) Análise do questionário de diagnóstico preenchido pelo CLIENTE.
    b) Geração de um diagnóstico técnico detalhado.
    c) Criação de um roadmap estratégico com os próximos passos recomendados.
    d) Concessão de acesso à plataforma digital da TECH LAB.

CLÁUSULA 3ª - DO PAGAMENTO
3.1. Pelos serviços prestados, o CLIENTE pagará à TECH LAB o valor acordado no momento da finalização do diagnóstico, conforme extrato detalhado.
3.2. O acesso completo à plataforma será liberado após a confirmação do pagamento. Em caso de pagamento via boleto, o acesso pode levar até 3 dias úteis para ser liberado, embora o painel básico já esteja disponível.

CLÁUSULA 4ª - DAS OBRIGAÇÕES
4.1. A TECH LAB se compromete a prestar os serviços com zelo e profissionalismo, utilizando as melhores práticas de mercado.
4.2. O CLIENTE se compromete a fornecer todas as informações necessárias para a realização do diagnóstico de forma verídica.

CLÁUSULA 5ª - DA CONFIDENCIALIDADE
5.1. Todas as informações trocadas entre as partes serão consideradas confidenciais e não poderão ser divulgadas a terceiros sem consentimento prévio.

CLÁUSULA 6ª - DO PRAZO
6.1. O presente contrato tem validade a partir da data de sua aceitação eletrônica e vigorará pelo período do plano contratado.

CLÁUSULA 7ª - DA ACEITAÇÃO
7.1. O CLIENTE declara ter lido e concordado com todos os termos deste contrato, bem como com os Termos de Serviço e a Política de Privacidade disponíveis no site. A finalização do cadastro e do pagamento constitui assinatura eletrônica e aceitação plena deste instrumento.

Data de Aceite: ${today}

TECH LAB
    `;
}
