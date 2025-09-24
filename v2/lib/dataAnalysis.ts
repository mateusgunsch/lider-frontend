import { MunicipioRow } from './types';

export interface FilterOptions {
    ano?: number | string;
    siglaUf?: string;
    municipio?: string;
    idhmRange?: [number, number];
    populacaoRange?: [number, number];
}

export interface AggregatedMetrics {
    populacao: number;
    docentes: number;
    alunos: number;
    enfermeiros: number;
    medicos: number;
    valorSaude: number;
    empresasTotal: number;
    empresasPorSetor: {
        agronegocio: number;
        comercio: number;
        construcao: number;
        educacao: number;
        industria: number;
        saude: number;
        turismo: number;
    };
    vinculosPorSetor: {
        agronegocio: number;
        comercio: number;
        construcao: number;
        educacao: number;
        industria: number;
        saude: number;
        turismo: number;
    };
}

export interface CalculatedAverages {
    idhmMedio: number;
    idhmRenda: number;
    idhmEducacao: number;
    idhmLongevidade: number;
    razaoProfessorAluno: number;
    medicosPor1000: number;
    enfermeirosPor1000: number;
    empresasPorMunicipio: number;
    investimentoPorHabitante: number;
}

export class DataAnalyzer {
    // Calcula totais de forma otimizada
    static calculateTotals(data: MunicipioRow[]): AggregatedMetrics {
        return data.reduce((acc, municipio) => ({
            populacao: acc.populacao + (municipio.pop || 0),
            docentes: acc.docentes + (municipio.totalDocentes || 0),
            alunos: acc.alunos + (municipio.totalAlunos || 0),
            enfermeiros: acc.enfermeiros + (municipio.quantidadeProfissionaisEnfermeiro || 0),
            medicos: acc.medicos + (municipio.quantidadeProfissionaisMedico || 0),
            valorSaude: acc.valorSaude + (municipio.valorTotalAtoProfissional || 0),
            empresasTotal: acc.empresasTotal +
                (municipio.numeroDeEmpresasAgronegocio || 0) +
                (municipio.numeroDeEmpresasComercio || 0) +
                (municipio.numeroDeEmpresasConstrucao || 0) +
                (municipio.numeroDeEmpresasEducacao || 0) +
                (municipio.numeroDeEmpresasIndustria || 0) +
                (municipio.numeroDeEmpresasSaude || 0) +
                (municipio.numeroDeEmpresasTurismo || 0),
            empresasPorSetor: {
                agronegocio: acc.empresasPorSetor.agronegocio + (municipio.numeroDeEmpresasAgronegocio || 0),
                comercio: acc.empresasPorSetor.comercio + (municipio.numeroDeEmpresasComercio || 0),
                construcao: acc.empresasPorSetor.construcao + (municipio.numeroDeEmpresasConstrucao || 0),
                educacao: acc.empresasPorSetor.educacao + (municipio.numeroDeEmpresasEducacao || 0),
                industria: acc.empresasPorSetor.industria + (municipio.numeroDeEmpresasIndustria || 0),
                saude: acc.empresasPorSetor.saude + (municipio.numeroDeEmpresasSaude || 0),
                turismo: acc.empresasPorSetor.turismo + (municipio.numeroDeEmpresasTurismo || 0),
            },
            vinculosPorSetor: {
                agronegocio: acc.vinculosPorSetor.agronegocio + (municipio.quantidadeVinculosAtivosAgronegocio || 0),
                comercio: acc.vinculosPorSetor.comercio + (municipio.quantidadeVinculosAtivosComercio || 0),
                construcao: acc.vinculosPorSetor.construcao + (municipio.quantidadeVinculosAtivosConstrucao || 0),
                educacao: acc.vinculosPorSetor.educacao + (municipio.quantidadeVinculosAtivosEducacao || 0),
                industria: acc.vinculosPorSetor.industria + (municipio.quantidadeVinculosAtivosIndustria || 0),
                saude: acc.vinculosPorSetor.saude + (municipio.quantidadeVinculosAtivosSaude || 0),
                turismo: acc.vinculosPorSetor.turismo + (municipio.quantidadeVinculosAtivosTurismo || 0),
            }
        }), {
            populacao: 0,
            docentes: 0,
            alunos: 0,
            enfermeiros: 0,
            medicos: 0,
            valorSaude: 0,
            empresasTotal: 0,
            empresasPorSetor: {
                agronegocio: 0,
                comercio: 0,
                construcao: 0,
                educacao: 0,
                industria: 0,
                saude: 0,
                turismo: 0,
            },
            vinculosPorSetor: {
                agronegocio: 0,
                comercio: 0,
                construcao: 0,
                educacao: 0,
                industria: 0,
                saude: 0,
                turismo: 0,
            }
        });
    }

    // Calcula médias ponderadas
    static calculateAverages(data: MunicipioRow[]): CalculatedAverages {
        if (data.length === 0) {
            return {
                idhmMedio: 0,
                idhmRenda: 0,
                idhmEducacao: 0,
                idhmLongevidade: 0,
                razaoProfessorAluno: 0,
                medicosPor1000: 0,
                enfermeirosPor1000: 0,
                empresasPorMunicipio: 0,
                investimentoPorHabitante: 0,
            };
        }

        const totals = this.calculateTotals(data);

        // Filtra apenas valores válidos para cada métrica
        const validIDHM = data.filter(m => m.idhm !== null && m.idhm !== undefined && !isNaN(m.idhm));
        const validRenda = data.filter(m => m.idhmRenda !== null && m.idhmRenda !== undefined && !isNaN(m.idhmRenda));
        const validEducacao = data.filter(m => m.idhmEducacao !== null && m.idhmEducacao !== undefined && !isNaN(m.idhmEducacao));
        const validLongevidade = data.filter(m => m.idhmLongevidade !== null && m.idhmLongevidade !== undefined && !isNaN(m.idhmLongevidade));

        return {
            idhmMedio: validIDHM.length > 0
                ? validIDHM.reduce((sum, m) => sum + (m.idhm || 0), 0) / validIDHM.length
                : 0,
            idhmRenda: validRenda.length > 0
                ? validRenda.reduce((sum, m) => sum + (m.idhmRenda || 0), 0) / validRenda.length
                : 0,
            idhmEducacao: validEducacao.length > 0
                ? validEducacao.reduce((sum, m) => sum + (m.idhmEducacao || 0), 0) / validEducacao.length
                : 0,
            idhmLongevidade: validLongevidade.length > 0
                ? validLongevidade.reduce((sum, m) => sum + (m.idhmLongevidade || 0), 0) / validLongevidade.length
                : 0,
            razaoProfessorAluno: totals.docentes > 0 ? totals.alunos / totals.docentes : 0,
            medicosPor1000: totals.populacao > 0 ? (totals.medicos / totals.populacao) * 1000 : 0,
            enfermeirosPor1000: totals.populacao > 0 ? (totals.enfermeiros / totals.populacao) * 1000 : 0,
            empresasPorMunicipio: data.length > 0 ? totals.empresasTotal / data.length : 0,
            investimentoPorHabitante: totals.populacao > 0 ? totals.valorSaude / totals.populacao : 0,
        };
    }

    // Gera dados para gráfico de setores otimizado
    static getEmpresasPorSetor(data: MunicipioRow[]) {
        const totals = this.calculateTotals(data);

        return [
            { setor: "Comércio", empresas: totals.empresasPorSetor.comercio, vinculos: totals.vinculosPorSetor.comercio, color: "hsl(var(--chart-1))" },
            { setor: "Indústria", empresas: totals.empresasPorSetor.industria, vinculos: totals.vinculosPorSetor.industria, color: "hsl(var(--chart-2))" },
            { setor: "Agronegócio", empresas: totals.empresasPorSetor.agronegocio, vinculos: totals.vinculosPorSetor.agronegocio, color: "hsl(var(--chart-3))" },
            { setor: "Turismo", empresas: totals.empresasPorSetor.turismo, vinculos: totals.vinculosPorSetor.turismo, color: "hsl(var(--chart-4))" },
            { setor: "Educação", empresas: totals.empresasPorSetor.educacao, vinculos: totals.vinculosPorSetor.educacao, color: "hsl(var(--chart-5))" },
            { setor: "Saúde", empresas: totals.empresasPorSetor.saude, vinculos: totals.vinculosPorSetor.saude, color: "hsl(var(--chart-1))" },
            { setor: "Construção", empresas: totals.empresasPorSetor.construcao, vinculos: totals.vinculosPorSetor.construcao, color: "hsl(var(--chart-3))" }
        ].filter(item => item.empresas > 0).sort((a, b) => b.empresas - a.empresas);
    }

    // Rankings otimizados para grandes datasets
    static getTopMunicipiosByIDHM(data: MunicipioRow[], limit: number = 10) {
        return data
            .filter(m => m.idhm !== null && m.idhm !== undefined)
            .sort((a, b) => (b.idhm || 0) - (a.idhm || 0))
            .slice(0, limit)
            .map((m, index) => ({
                posicao: index + 1,
                municipio: m.municipio || 'N/A',
                siglaUf: m.siglaUf || 'N/A',
                idhm: m.idhm || 0,
                populacao: m.pop || 0
            }));
    }

    static getTopMunicipiosByIDEB(data: MunicipioRow[], limit: number = 10) {
        return data
            .filter(m => m.ideb !== null && m.ideb !== undefined)
            .sort((a, b) => (b.ideb || 0) - (a.ideb || 0))
            .slice(0, limit)
            .map((m, index) => ({
                posicao: index + 1,
                municipio: m.municipio || 'N/A',
                siglaUf: m.siglaUf || 'N/A',
                ideb: m.ideb || 0,
                populacao: m.pop || 0
            }));
    }

    static getTopMunicipiosBySaudeCobertura(data: MunicipioRow[], limit: number = 10) {
        return data
            .filter(m => m.pop && m.pop > 0)
            .map(m => ({
                municipio: m.municipio || 'N/A',
                siglaUf: m.siglaUf || 'N/A',
                populacao: m.pop || 0,
                medicosPor1000: m.pop ? ((m.quantidadeProfissionaisMedico || 0) / m.pop) * 1000 : 0,
                enfermeirosPor1000: m.pop ? ((m.quantidadeProfissionaisEnfermeiro || 0) / m.pop) * 1000 : 0,
                coberturaTotal: m.pop ? (((m.quantidadeProfissionaisMedico || 0) + (m.quantidadeProfissionaisEnfermeiro || 0)) / m.pop) * 1000 : 0
            }))
            .sort((a, b) => b.coberturaTotal - a.coberturaTotal)
            .slice(0, limit)
            .map((m, index) => ({ ...m, posicao: index + 1 }));
    }

    // Análise por faixas de IDHM
    static getDistribuicaoPorFaixaIDHM(data: MunicipioRow[]) {
        const faixas = {
            'Muito Baixo (0.0-0.5)': 0,
            'Baixo (0.5-0.6)': 0,
            'Médio (0.6-0.7)': 0,
            'Alto (0.7-0.8)': 0,
            'Muito Alto (0.8-1.0)': 0
        };

        data.forEach(m => {
            if (m.idhm !== null && m.idhm !== undefined) {
                if (m.idhm >= 0.8) faixas['Muito Alto (0.8-1.0)']++;
                else if (m.idhm >= 0.7) faixas['Alto (0.7-0.8)']++;
                else if (m.idhm >= 0.6) faixas['Médio (0.6-0.7)']++;
                else if (m.idhm >= 0.5) faixas['Baixo (0.5-0.6)']++;
                else faixas['Muito Baixo (0.0-0.5)']++;
            }
        });

        return Object.entries(faixas).map(([faixa, count]) => ({ faixa, count }));
    }

    // Análise comparativa por estado
    static getComparativoEstados(data: MunicipioRow[]) {
        const estadosMap = new Map();

        data.forEach(m => {
            const uf = m.siglaUf;
            if (!uf) return;

            if (!estadosMap.has(uf)) {
                estadosMap.set(uf, {
                    siglaUf: uf,
                    siglaUfNome: m.siglaUfNome,
                    municipios: [],
                    totals: {
                        populacao: 0,
                        medicos: 0,
                        enfermeiros: 0,
                        empresas: 0,
                        valorSaude: 0
                    }
                });
            }

            const estado = estadosMap.get(uf);
            estado.municipios.push(m);
            estado.totals.populacao += (m.pop || 0);
            estado.totals.medicos += (m.quantidadeProfissionaisMedico || 0);
            estado.totals.enfermeiros += (m.quantidadeProfissionaisEnfermeiro || 0);
            estado.totals.valorSaude += (m.valorTotalAtoProfissional || 0);
            estado.totals.empresas +=
                (m.numeroDeEmpresasAgronegocio || 0) +
                (m.numeroDeEmpresasComercio || 0) +
                (m.numeroDeEmpresasConstrucao || 0) +
                (m.numeroDeEmpresasEducacao || 0) +
                (m.numeroDeEmpresasIndustria || 0) +
                (m.numeroDeEmpresasSaude || 0) +
                (m.numeroDeEmpresasTurismo || 0);
        });

        return Array.from(estadosMap.values()).map(estado => ({
            ...estado,
            count: estado.municipios.length,
            averages: {
                idhmMedio: estado.municipios
                    .filter(m => m.idhm)
                    .reduce((sum, m) => sum + (m.idhm || 0), 0) /
                    estado.municipios.filter(m => m.idhm).length || 0,
                medicosPor1000: estado.totals.populacao > 0
                    ? (estado.totals.medicos / estado.totals.populacao) * 1000 : 0,
                enfermeirosPor1000: estado.totals.populacao > 0
                    ? (estado.totals.enfermeiros / estado.totals.populacao) * 1000 : 0,
                investimentoPorHab: estado.totals.populacao > 0
                    ? estado.totals.valorSaude / estado.totals.populacao : 0
            }
        })).sort((a, b) => b.totals.populacao - a.totals.populacao);
    }

    // Dados preparados para gráficos (com amostragem para datasets grandes)
    static prepareChartData(data: MunicipioRow[], type: 'idhm' | 'saude' | 'empresas', maxPoints: number = 50) {
        let processedData = [...data];

        // Se tem muitos dados, faz amostragem estratificada
        if (data.length > maxPoints) {
            const step = Math.ceil(data.length / maxPoints);
            processedData = data.filter((_, index) => index % step === 0);
        }

        switch (type) {
            case 'idhm':
                return processedData
                    .filter(m => m.idhm && m.municipio)
                    .map(m => ({
                        municipio: m.municipio,
                        idhm: m.idhm,
                        idhmRenda: m.idhmRenda,
                        idhmEducacao: m.idhmEducacao,
                        idhmLongevidade: m.idhmLongevidade,
                        populacao: m.pop,
                        siglaUf: m.siglaUf
                    }));

            case 'saude':
                return processedData
                    .filter(m => m.pop && m.pop > 0)
                    .map(m => ({
                        municipio: m.municipio,
                        populacao: m.pop,
                        medicosPor1000: ((m.quantidadeProfissionaisMedico || 0) / (m.pop || 1)) * 1000,
                        enfermeirosPor1000: ((m.quantidadeProfissionaisEnfermeiro || 0) / (m.pop || 1)) * 1000,
                        investimentoPorHab: (m.valorTotalAtoProfissional || 0) / (m.pop || 1),
                        empresasSaude: m.numeroDeEmpresasSaude || 0,
                        siglaUf: m.siglaUf
                    }));

            case 'empresas':
                return processedData
                    .filter(m => m.municipio)
                    .map(m => ({
                        municipio: m.municipio,
                        agronegocio: m.numeroDeEmpresasAgronegocio || 0,
                        comercio: m.numeroDeEmpresasComercio || 0,
                        construcao: m.numeroDeEmpresasConstrucao || 0,
                        educacao: m.numeroDeEmpresasEducacao || 0,
                        industria: m.numeroDeEmpresasIndustria || 0,
                        saude: m.numeroDeEmpresasSaude || 0,
                        turismo: m.numeroDeEmpresasTurismo || 0,
                        total: (m.numeroDeEmpresasAgronegocio || 0) +
                            (m.numeroDeEmpresasComercio || 0) +
                            (m.numeroDeEmpresasConstrucao || 0) +
                            (m.numeroDeEmpresasEducacao || 0) +
                            (m.numeroDeEmpresasIndustria || 0) +
                            (m.numeroDeEmpresasSaude || 0) +
                            (m.numeroDeEmpresasTurismo || 0),
                        populacao: m.pop,
                        siglaUf: m.siglaUf
                    }));

            default:
                return [];
        }
    }
}

// Funções de formatação otimizadas
export const formatNumber = (num: number | null | undefined): string => {
    if (num === null || num === undefined || isNaN(num)) {
        return "0";
    }

    const absNum = Math.abs(num);
    if (absNum >= 1000000000) {
        return `${(num / 1000000000).toFixed(1)}B`;
    } else if (absNum >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
    } else if (absNum >= 1000) {
        return `${(num / 1000).toFixed(1)}K`;
    }
    return Math.round(num).toString();
};

export const formatCurrency = (value: number | null | undefined): string => {
    if (value === null || value === undefined || isNaN(value)) {
        return "R$ 0";
    }

    const absValue = Math.abs(value);
    if (absValue >= 1000000000) {
        return `R$ ${(value / 1000000000).toFixed(1)}B`;
    } else if (absValue >= 1000000) {
        return `R$ ${(value / 1000000).toFixed(1)}M`;
    } else if (absValue >= 1000) {
        return `R$ ${(value / 1000).toFixed(1)}K`;
    }
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
};

export const formatPercentage = (value: number | null | undefined): string => {
    if (value === null || value === undefined || isNaN(value)) {
        return "0%";
    }
    return `${(value * 100).toFixed(1)}%`;
};

// Utilitários para classificação
export const getIDHMClassification = (idhm: number) => {
    if (idhm >= 0.8) return { label: "Muito Alto", color: "text-green-600", bgColor: "bg-green-100" };
    if (idhm >= 0.7) return { label: "Alto", color: "text-blue-600", bgColor: "bg-blue-100" };
    if (idhm >= 0.6) return { label: "Médio", color: "text-yellow-600", bgColor: "bg-yellow-100" };
    if (idhm >= 0.5) return { label: "Baixo", color: "text-orange-600", bgColor: "bg-orange-100" };
    return { label: "Muito Baixo", color: "text-red-600", bgColor: "bg-red-100" };
};

export const getSaudeCoberturalassification = (cobertura: number) => {
    if (cobertura >= 5) return { label: "Adequada", color: "text-green-600", bgColor: "bg-green-100" };
    if (cobertura >= 3) return { label: "Intermediária", color: "text-yellow-600", bgColor: "bg-yellow-100" };
    return { label: "Insuficiente", color: "text-red-600", bgColor: "bg-red-100" };
};