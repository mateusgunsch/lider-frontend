// Adiciona a propriedade 'fs' ao tipo Window para evitar erro de compilação
declare global {
    interface Window {
        fs?: {
            readFile: (path: string, options?: { encoding?: string }) => Promise<string>;
        };
    }
}

export class DataProcessor {
    private static instance: DataProcessor;
    private processedData: MunicipioRow[] = [];
    private isLoaded = false;
    private isLoading = false;

    private constructor() { }

    static getInstance(): DataProcessor {
        if (!DataProcessor.instance) {
            DataProcessor.instance = new DataProcessor();
        }
        return DataProcessor.instance;
    }

    async loadData(fileName: string = 'dados_municipais.txt'): Promise<MunicipioRow[]> {
        if (this.isLoaded) {
            return this.processedData;
        }

        if (this.isLoading) {
            // Aguarda o carregamento em andamento
            return new Promise((resolve) => {
                const checkLoaded = () => {
                    if (this.isLoaded) {
                        resolve(this.processedData);
                    } else {
                        setTimeout(checkLoaded, 100);
                    }
                };
                checkLoaded();
            });
        }

        this.isLoading = true;

        try {
            // Tenta carregar do arquivo usando a API do navegador
            let rawData: MunicipioRawData[];

            try {
                if (typeof window !== 'undefined' && window.fs?.readFile) {
                    // Ambiente com window.fs disponível
                    const fileContent = await window.fs.readFile(fileName, { encoding: 'utf8' });
                    rawData = this.parseJsonArray(fileContent);
                } else {
                    // Fallback: tenta carregar de public/
                    const response = await fetch(`/${fileName}`);
                    if (!response.ok) {
                        throw new Error(`Erro ao carregar arquivo: ${response.statusText}`);
                    }
                    const fileContent = await response.text();
                    rawData = this.parseJsonArray(fileContent);
                }
            } catch (error) {
                console.warn('Erro ao carregar arquivo, usando dados de exemplo:', error);
                rawData = this.getExampleData();
            }

            this.processedData = rawData.map(this.transformData);
            this.isLoaded = true;
            this.isLoading = false;

            console.log(`Dados carregados: ${this.processedData.length} registros`);
            return this.processedData;
        } catch (error) {
            this.isLoading = false;
            console.error('Erro no processamento de dados:', error);
            throw error;
        }
    }

    private parseJsonArray(content: string): MunicipioRawData[] {
        try {
            // Remove quebras de linha e tenta parsear como JSON
            const cleanContent = content.trim();

            // Verifica se é um array JSON válido
            if (cleanContent.startsWith('[') && cleanContent.endsWith(']')) {
                return JSON.parse(cleanContent);
            }

            // Tenta parsear linha por linha se não for um array
            const lines = cleanContent.split('\n').filter(line => line.trim());
            const result: MunicipioRawData[] = [];

            for (const line of lines) {
                try {
                    const parsed = JSON.parse(line.trim());
                    if (parsed && typeof parsed === 'object') {
                        result.push(parsed);
                    }
                } catch (lineError) {
                    console.warn('Erro ao parsear linha:', line.substring(0, 100));
                }
            }

            return result;
        } catch (error) {
            console.error('Erro ao parsear JSON:', error);
            throw new Error('Formato de arquivo inválido');
        }
    }

    private transformData(raw: MunicipioRawData): MunicipioRow {
        return {
            ano: raw.ano || null,
            siglaUf: raw.sigla_uf || null,
            siglaUfNome: raw.sigla_uf_nome || null,
            idMunicipio: raw.id_municipio || null,
            municipio: raw.municipio || null,
            cidade: raw.cidade || null,
            pop: raw.pop || null,
            idhm: raw.IDHM || null,
            idhmRenda: raw["IDHM Renda"] || null,
            idhmEducacao: raw["IDHM Educação"] || null,
            idhmLongevidade: raw["IDHM Longevidade"] || null,
            idhmMulheres: null, // Não disponível nos dados atuais
            idhmHomens: null, // Não disponível nos dados atuais
            idhmNegros: null, // Não disponível nos dados atuais
            idhmBrancos: null, // Não disponível nos dados atuais
            totalDocentes: raw.total_docentes || null,
            totalAlunos: raw.total_alunos || null,
            taxaAprovacao: null, // Não disponível nos dados atuais
            indicadorRendimento: null, // Não disponível nos dados atuais
            ideb: null, // Não disponível nos dados atuais
            quantidadeProfissionaisEnfermeiro: raw.quantidade_profissionais_enfermeiro || null,
            quantidadeProfissionaisMedico: raw.quantidade_profissionais_medico || null,
            valorTotalAtoProfissional: raw.valor_total_ato_profissional || null,
            numeroDeEmpresasAgronegocio: raw.numero_de_empresas_agronegocio || null,
            quantidadeVinculosAtivosAgronegocio: raw.quantidade_vinculos_ativos_agronegocio || null,
            numeroDeEmpresasComercio: raw.numero_de_empresas_comercio || null,
            quantidadeVinculosAtivosComercio: raw.quantidade_vinculos_ativos_comercio || null,
            massaSalarialComercio: null, // Não disponível nos dados atuais
            numeroDeEmpresasConstrucao: raw.numero_de_empresas_construcao || null,
            quantidadeVinculosAtivosConstrucao: raw.quantidade_vinculos_ativos_construcao || null,
            massaSalarialConstrucao: null, // Não disponível nos dados atuais
            numeroDeEmpresasEducacao: raw.numero_de_empresas_educacao || null,
            quantidadeVinculosAtivosEducacao: raw.quantidade_vinculos_ativos_educacao || null,
            massaSalarialEducacao: null, // Não disponível nos dados atuais
            numeroDeEmpresasIndustria: raw.numero_de_empresas_industria || null,
            quantidadeVinculosAtivosIndustria: raw.quantidade_vinculos_ativos_industria || null,
            massaSalarialIndustria: null, // Não disponível nos dados atuais
            numeroDeEmpresasSaude: raw.numero_de_empresas_saude || null,
            quantidadeVinculosAtivosSaude: raw.quantidade_vinculos_ativos_saude || null,
            massaSalarialSaude: null, // Não disponível nos dados atuais
            numeroDeEmpresasTurismo: raw.numero_de_empresas_turismo || null,
            quantidadeVinculosAtivosTurismo: raw.quantidade_vinculos_ativos_turismo || null,
            massaSalarialTurismo: null, // Não disponível nos dados atuais
        };
    }

    private getExampleData(): MunicipioRawData[] {
        return [
            {
                "ano": 2010,
                "sigla_uf": "AC",
                "sigla_uf_nome": "Acre",
                "id_municipio": 1200013,
                "municipio": "Acrelândia",
                "cidade": "Acrelândia",
                "pop": 12707,
                "IDHM": 0.604,
                "IDHM Renda": 0.584,
                "IDHM Educação": 0.466,
                "IDHM Longevidade": 0.808,
                "total_docentes": 151,
                "total_alunos": 4170,
                "quantidade_profissionais_enfermeiro": 665,
                "quantidade_profissionais_medico": 85,
                "valor_total_ato_profissional": 96201.42,
                "numero_de_empresas_agronegocio": 34,
                "quantidade_vinculos_ativos_agronegocio": 72,
                "numero_de_empresas_comercio": 98,
                "quantidade_vinculos_ativos_comercio": 154,
                "numero_de_empresas_construcao": 4,
                "quantidade_vinculos_ativos_construcao": 13,
                "numero_de_empresas_educacao": 10,
                "quantidade_vinculos_ativos_educacao": 2,
                "numero_de_empresas_industria": 30,
                "quantidade_vinculos_ativos_industria": 162,
                "numero_de_empresas_saude": 1,
                "quantidade_vinculos_ativos_saude": 0,
                "numero_de_empresas_turismo": 9,
                "quantidade_vinculos_ativos_turismo": 3
            }
            // Dados de exemplo para fallback
        ];
    }

    getData(): MunicipioRow[] {
        return this.processedData;
    }

    getFilteredData(filters: {
        ano?: number | string;
        siglaUf?: string;
        municipio?: string;
        idhmRange?: [number, number];
    }): MunicipioRow[] {
        return this.processedData.filter(row => {
            // Filtro por ano
            if (filters.ano && filters.ano !== 'todos') {
                const rowAno = typeof row.ano === 'string' ? parseInt(row.ano) : row.ano;
                const filterAno = typeof filters.ano === 'string' ? parseInt(filters.ano) : filters.ano;
                if (rowAno !== filterAno) return false;
            }

            // Filtro por UF
            if (filters.siglaUf && filters.siglaUf !== 'todos' && row.siglaUfNome !== filters.siglaUf) {
                return false;
            }

            // Filtro por município
            if (filters.municipio && filters.municipio !== 'todos' && row.municipio !== filters.municipio) {
                return false;
            }

            // Filtro por faixa IDHM
            if (filters.idhmRange && row.idhm !== null && row.idhm !== undefined) {
                const [min, max] = filters.idhmRange;
                if (row.idhm < min || row.idhm > max) return false;
            }

            return true;
        });
    }

    // Métodos para análise de grandes volumes de dados
    getUniqueValues(field: keyof MunicipioRow): Array<string | number> {
        const values = new Set<string | number>();
        this.processedData.forEach(row => {
            const value = row[field];
            if (value !== null && value !== undefined) {
                values.add(value as string | number);
            }
        });
        return Array.from(values).sort();
    }

    getAggregatedData(groupBy: keyof MunicipioRow, aggregateFields: Array<keyof MunicipioRow>) {
        const groups = new Map();

        this.processedData.forEach(row => {
            const groupKey = row[groupBy];
            if (!groupKey) return;

            if (!groups.has(groupKey)) {
                groups.set(groupKey, {
                    count: 0,
                    sums: {},
                    averages: {}
                });
            }

            const group = groups.get(groupKey);
            group.count++;

            aggregateFields.forEach(field => {
                const value = row[field];
                if (typeof value === 'number') {
                    if (!group.sums[field]) group.sums[field] = 0;
                    group.sums[field] += value;
                    group.averages[field] = group.sums[field] / group.count;
                }
            });
        });

        return groups;
    }

    // Método para processar dados em chunks (para datasets muito grandes)
    processInChunks<T>(
        data: MunicipioRow[],
        processor: (chunk: MunicipioRow[]) => T[],
        chunkSize: number = 1000
    ): T[] {
        const results: T[] = [];

        for (let i = 0; i < data.length; i += chunkSize) {
            const chunk = data.slice(i, i + chunkSize);
            const chunkResults = processor(chunk);
            results.push(...chunkResults);
        }

        return results;
    }
}

// Hook personalizado para usar os dados no React
import { useState, useEffect } from 'react';
import { MunicipioRawData, MunicipioRow } from './types';

export function useDataLoader(fileName?: string) {
    const [data, setData] = useState<MunicipioRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const processor = DataProcessor.getInstance();
                const loadedData = await processor.loadData(fileName);
                setData(loadedData);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
                console.error('Erro no carregamento:', err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [fileName]);

    return { data, loading, error };
}