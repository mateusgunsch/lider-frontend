// app/page.tsx
"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardCard } from "@/components/dashboard-card"
import { FilterSelector } from "@/components/filter-selector"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { Users, TrendingUp, Building, GraduationCap, Heart, AlertCircle, MapPin } from "lucide-react"
import { useState, useMemo } from "react"
import { useDataLoader, DataProcessor } from "@/lib/dataProcessor"
import { DataAnalyzer, formatNumber, formatCurrency, getIDHMClassification } from "@/lib/dataAnalysis"
import type { FilterOptions } from "@/lib/dataAnalysis"

// Sistema de cores aprimorado
const CHART_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green  
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#F97316', // Orange
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#EC4899', // Pink
  '#6B7280', // Gray
  '#14B8A6', // Teal
  '#F472B6', // Pink Light
  '#A78BFA', // Purple Light
  '#34D399', // Green Light
  '#FBBF24', // Yellow
];

const SECTOR_COLORS = {
  'Agronegócio': '#10B981',
  'Comércio': '#3B82F6',
  'Construção': '#F59E0B',
  'Educação': '#8B5CF6',
  'Indústria': '#EF4444',
  'Saúde': '#EC4899',
  'Turismo': '#06B6D4'
};

const IDHM_COLORS = {
  'muito-alto': '#059669',
  'alto': '#0284C7',
  'medio': '#D97706',
  'baixo': '#DC2626',
  'muito-baixo': '#7F1D1D'
};

export default function HomePage() {
  const { data, loading, error } = useDataLoader();
  const [selectedUF, setSelectedUF] = useState("todos");
  const [selectedMunicipio, setSelectedMunicipio] = useState("todos");
  const [selectedAno, setSelectedAno] = useState("todos");
  const [selectedIDHMFaixa, setSelectedIDHMFaixa] = useState("todos");

  // Opções de filtros geradas dinamicamente
  const filterOptions = useMemo(() => {
    if (!data.length) return { ufs: [], municipios: [], anos: [] };

    const processor = DataProcessor.getInstance();

    const ufsUnicas = processor.getUniqueValues('siglaUfNome').filter(Boolean);
    const municipiosUnicos = processor.getUniqueValues('municipio').filter(Boolean);
    const anosUnicos = processor.getUniqueValues('ano').filter(Boolean);

    return {
      ufs: [
        { value: "todos", label: "Todos os Estados" },
        ...ufsUnicas.map(uf => ({ value: uf as string, label: uf as string }))
      ],
      municipios: [
        { value: "todos", label: "Todos os Municípios" },
        ...municipiosUnicos.slice(0, 100).map(m => ({ value: m as string, label: m as string }))
      ],
      anos: [
        { value: "todos", label: "Todos os Anos" },
        ...anosUnicos.map(ano => ({ value: ano.toString(), label: ano.toString() }))
      ]
    };
  }, [data]);

  // Dados filtrados
  const filteredData = useMemo(() => {
    if (!data.length) return [];

    const processor = DataProcessor.getInstance();
    const filters: FilterOptions = {};

    if (selectedAno !== "todos") filters.ano = selectedAno;
    if (selectedUF !== "todos") filters.siglaUf = selectedUF;
    if (selectedMunicipio !== "todos") filters.municipio = selectedMunicipio;
    if (selectedIDHMFaixa !== "todos") filters.idhmRange = getIDHMRange(selectedIDHMFaixa);

    return processor.getFilteredData(filters);
  }, [data, selectedAno, selectedUF, selectedMunicipio, selectedIDHMFaixa]);

  // Cálculos principais
  const analytics = useMemo(() => {
    if (!filteredData.length) return null;

    const totals = DataAnalyzer.calculateTotals(filteredData);
    const averages = DataAnalyzer.calculateAverages(filteredData);
    const empresasPorSetor = DataAnalyzer.getEmpresasPorSetor(filteredData);
    const rankingIDHM = DataAnalyzer.getTopMunicipiosByIDHM(filteredData, 15);
    const distribuicaoIDHM = DataAnalyzer.getDistribuicaoPorFaixaIDHM(filteredData);
    const comparativoEstados = DataAnalyzer.getComparativoEstados(filteredData);

    // Dados para gráfico IDHM (limitado para performance)
    const chartDataIDHM = filteredData
      .filter(m => m.idhm !== null && m.idhmRenda !== null && m.idhmEducacao !== null && m.idhmLongevidade !== null)
      .sort((a, b) => (b.idhm || 0) - (a.idhm || 0))
      .slice(0, 15)
      .map(m => ({
        municipio: m.municipio?.substring(0, 12) + (m.municipio && m.municipio.length > 12 ? '...' : ''),
        idhm: m.idhm,
        idhmRenda: m.idhmRenda,
        idhmEducacao: m.idhmEducacao,
        idhmLongevidade: m.idhmLongevidade,
        populacao: m.pop,
        siglaUf: m.siglaUf
      }));

    return {
      totals,
      averages,
      empresasPorSetor,
      rankingIDHM,
      distribuicaoIDHM,
      comparativoEstados,
      chartDataIDHM
    };
  }, [filteredData]);

  function getIDHMRange(faixa: string): [number, number] {
    switch (faixa) {
      case 'muito-alto': return [0.8, 1.0];
      case 'alto': return [0.7, 0.8];
      case 'medio': return [0.6, 0.7];
      case 'baixo': return [0.5, 0.6];
      case 'muito-baixo': return [0.0, 0.5];
      default: return [0.0, 1.0];
    }
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Erro ao Carregar Dados</h2>
            <p className="text-muted-foreground mb-2">{error}</p>
            <p className="text-sm text-muted-foreground">
              Certifique-se de que o arquivo dados_municipais.txt está na pasta public/
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </DashboardLayout>
    );
  }

  const classification = analytics && !isNaN(analytics.averages.idhmMedio)
    ? getIDHMClassification(analytics.averages.idhmMedio)
    : { label: "N/A", color: "text-muted-foreground", bgColor: "bg-muted" };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Resumo Estratégico</h1>
          <p className="text-muted-foreground text-pretty">
            Visão geral dos indicadores socioeconômicos municipais
          </p>
          {filteredData.length > 0 && analytics && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="secondary">
                {formatNumber(filteredData.length)} município{filteredData.length !== 1 ? 's' : ''}
              </Badge>
              <Badge variant="secondary">
                {formatNumber(analytics.totals.populacao)} habitantes
              </Badge>
              <Badge variant="secondary">
                IDHM: {analytics.averages.idhmMedio.toFixed(3)}
              </Badge>
            </div>
          )}
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-4">
          <FilterSelector
            value={selectedAno}
            onValueChange={setSelectedAno}
            options={filterOptions.anos}
            placeholder="Selecione o Ano"
          />
          <FilterSelector
            value={selectedUF}
            onValueChange={setSelectedUF}
            options={filterOptions.ufs}
            placeholder="Selecione o Estado"
          />
          <FilterSelector
            value={selectedMunicipio}
            onValueChange={setSelectedMunicipio}
            options={filterOptions.municipios}
            placeholder="Selecione o Município"
          />
          <FilterSelector
            value={selectedIDHMFaixa}
            onValueChange={setSelectedIDHMFaixa}
            options={[
              { value: "todos", label: "Todas as Faixas de IDHM" },
              { value: "muito-alto", label: "Muito Alto (0.8-1.0)" },
              { value: "alto", label: "Alto (0.7-0.8)" },
              { value: "medio", label: "Médio (0.6-0.7)" },
              { value: "baixo", label: "Baixo (0.5-0.6)" },
              { value: "muito-baixo", label: "Muito Baixo (0.0-0.5)" },
            ]}
            placeholder="Faixa de IDHM"
          />
        </div>

        {/* Mensagem quando não há dados */}
        {filteredData.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum dado encontrado</h3>
              <p className="text-muted-foreground">
                Tente ajustar os filtros para visualizar os dados disponíveis.
              </p>
            </CardContent>
          </Card>
        )}

        {analytics && (
          <>
            {/* KPIs Principais */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <DashboardCard
                title="População Total"
                value={formatNumber(analytics.totals.populacao)}
                change={`${filteredData.length} município${filteredData.length !== 1 ? 's' : ''}`}
                changeType="neutral"
                icon={<Users className="h-4 w-4" />}
              />
              <DashboardCard
                title="IDHM Médio"
                value={isNaN(analytics.averages.idhmMedio) ? "0.000" : analytics.averages.idhmMedio.toFixed(3)}
                change={classification.label}
                changeType="positive"
                icon={<TrendingUp className="h-4 w-4" />}
              />
              <DashboardCard
                title="Total de Empresas"
                value={formatNumber(analytics.totals.empresasTotal)}
                change={`${analytics.averages.empresasPorMunicipio.toFixed(1)} por município`}
                changeType="neutral"
                icon={<Building className="h-4 w-4" />}
              />
              <DashboardCard
                title="Razão Professor/Aluno"
                value={analytics.averages.razaoProfessorAluno > 0 ? `1:${Math.round(analytics.averages.razaoProfessorAluno)}` : "N/D"}
                change={`${formatNumber(analytics.totals.docentes)} docentes`}
                changeType="neutral"
                icon={<GraduationCap className="h-4 w-4" />}
              />
            </div>

            {/* Primeira linha de gráficos */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* IDHM por Dimensão */}
              {analytics.chartDataIDHM.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Composição do IDHM por Dimensão</CardTitle>
                    <CardDescription>
                      Top {analytics.chartDataIDHM.length} municípios - Renda, Educação e Longevidade
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={analytics.chartDataIDHM} margin={{ bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="municipio"
                          angle={-45}
                          textAnchor="end"
                          height={80}
                          fontSize={10}
                        />
                        <YAxis domain={[0, 1]} />
                        <Tooltip
                          formatter={(value, name) => [Number(value).toFixed(3), name]}
                          labelFormatter={(label) => `Município: ${label}`}
                        />
                        <Bar dataKey="idhmRenda" fill={CHART_COLORS[0]} name="IDHM Renda" />
                        <Bar dataKey="idhmEducacao" fill={CHART_COLORS[1]} name="IDHM Educação" />
                        <Bar dataKey="idhmLongevidade" fill={CHART_COLORS[2]} name="IDHM Longevidade" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              {/* Distribuição de Empresas por Setor */}
              {analytics.empresasPorSetor.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Empresas por Setor Econômico</CardTitle>
                    <CardDescription>Distribuição do tecido empresarial</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Pie
                          data={analytics.empresasPorSetor}
                          cx="50%"
                          cy="50%"
                          outerRadius={120}
                          dataKey="empresas"
                          label={({ setor, empresas, percent }) =>
                            `${setor}: ${formatNumber(empresas)} (${(percent * 100).toFixed(1)}%)`
                          }
                        >
                          {analytics.empresasPorSetor.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={SECTOR_COLORS[entry.setor as keyof typeof SECTOR_COLORS] || CHART_COLORS[index % CHART_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [formatNumber(Number(value)), "Empresas"]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Segunda linha de gráficos */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Ranking IDHM */}
              {analytics.rankingIDHM.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Ranking Municipal por IDHM</CardTitle>
                    <CardDescription>Top 10 municípios por desenvolvimento humano</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {analytics.rankingIDHM.slice(0, 10).map((municipio) => {
                        const classification = getIDHMClassification(municipio.idhm);
                        return (
                          <div key={`${municipio.municipio}-${municipio.siglaUf}`}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                            <div className="flex items-center gap-3">
                              <div
                                className="flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-medium"
                                style={{ backgroundColor: CHART_COLORS[municipio.posicao - 1] || CHART_COLORS[0] }}
                              >
                                {municipio.posicao}
                              </div>
                              <div>
                                <p className="font-medium text-sm">{municipio.municipio}</p>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {municipio.siglaUf}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {formatNumber(municipio.populacao)} hab.
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-sm">{municipio.idhm.toFixed(3)}</p>
                              <Badge
                                variant="secondary"
                                className={`text-xs ${classification.color} border-0`}
                                style={{ backgroundColor: classification.bgColor }}
                              >
                                {classification.label}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Distribuição por Faixa de IDHM */}
              {analytics.distribuicaoIDHM.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Distribuição por Faixa de IDHM</CardTitle>
                    <CardDescription>Classificação do desenvolvimento humano</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analytics.distribuicaoIDHM} margin={{ bottom: 80 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="faixa"
                          angle={-45}
                          textAnchor="end"
                          height={100}
                          fontSize={10}
                        />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value} municípios`, "Quantidade"]} />
                        <Bar dataKey="count">
                          {analytics.distribuicaoIDHM.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                entry.faixa.includes('Muito Alto') ? IDHM_COLORS['muito-alto'] :
                                  entry.faixa.includes('Alto') ? IDHM_COLORS['alto'] :
                                    entry.faixa.includes('Médio') ? IDHM_COLORS['medio'] :
                                      entry.faixa.includes('Baixo') && !entry.faixa.includes('Muito') ? IDHM_COLORS['baixo'] :
                                        IDHM_COLORS['muito-baixo']
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Comparativo por Estados */}
            {analytics.comparativoEstados.length > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Comparativo entre Estados</CardTitle>
                  <CardDescription>Indicadores médios por unidade federativa</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {analytics.comparativoEstados.map((estado, index) => (
                      <div
                        key={estado.siglaUf}
                        className="p-4 rounded-lg border-l-4 bg-card hover:bg-muted/50 transition-colors"
                        style={{ borderLeftColor: CHART_COLORS[index % CHART_COLORS.length] }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-sm">{estado.siglaUfNome}</h4>
                          <Badge
                            variant="outline"
                            style={{
                              borderColor: CHART_COLORS[index % CHART_COLORS.length],
                              color: CHART_COLORS[index % CHART_COLORS.length]
                            }}
                          >
                            {estado.siglaUf}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Municípios:</span>
                            <span className="font-medium">{estado.count}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">População:</span>
                            <span className="font-medium">{formatNumber(estado.totals.populacao)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">IDHM Médio:</span>
                            <span className="font-medium">
                              {isNaN(estado.averages.idhmMedio) ? "N/D" : estado.averages.idhmMedio.toFixed(3)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Empresas:</span>
                            <span className="font-medium">{formatNumber(estado.totals.empresas)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Indicadores Resumo */}
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
              <DashboardCard
                title="Profissionais de Saúde"
                value={formatNumber(analytics.totals.medicos + analytics.totals.enfermeiros)}
                change={`${analytics.averages.medicosPor1000.toFixed(1)}/1000 médicos`}
                changeType="positive"
                icon={<Heart className="h-4 w-4" />}
              />
              <DashboardCard
                title="Investimento Saúde"
                value={formatCurrency(analytics.totals.valorSaude)}
                change={`${formatCurrency(analytics.averages.investimentoPorHabitante)} por hab.`}
                changeType="neutral"
                icon={<Heart className="h-4 w-4" />}
              />
              <DashboardCard
                title="Sistema Educacional"
                value={`${formatNumber(analytics.totals.alunos)} alunos`}
                change={`${formatNumber(analytics.totals.docentes)} docentes`}
                changeType="positive"
                icon={<GraduationCap className="h-4 w-4" />}
              />
              <DashboardCard
                title="Cobertura Territorial"
                value={`${analytics.comparativoEstados.length}`}
                change={`estado${analytics.comparativoEstados.length !== 1 ? 's' : ''} analisado${analytics.comparativoEstados.length !== 1 ? 's' : ''}`}
                changeType="neutral"
                icon={<MapPin className="h-4 w-4" />}
              />
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}