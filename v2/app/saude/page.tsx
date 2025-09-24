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
  Scatter,
  ScatterChart,
  Area,
  AreaChart,
  Cell,
} from "recharts"
import { Heart, Users, Hospital, Activity, DollarSign, TrendingUp, AlertCircle, MapPin } from "lucide-react"
import { useState, useMemo } from "react"
import { useDataLoader, DataProcessor } from "@/lib/dataProcessor"
import { DataAnalyzer, formatNumber, formatCurrency, getSaudeCoberturalassification } from "@/lib/dataAnalysis"
import type { FilterOptions } from "@/lib/dataAnalysis"

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))"
];

export default function SaudePage() {
  const { data, loading, error } = useDataLoader();
  const [selectedUF, setSelectedUF] = useState("todos");
  const [selectedMunicipio, setSelectedMunicipio] = useState("todos");
  const [selectedAno, setSelectedAno] = useState("todos");

  // Opções de filtros geradas dinamicamente
  const filterOptions = useMemo(() => {
    if (!data.length) return { ufs: [], municipios: [], anos: [] };

    const processor = DataProcessor.getInstance();
    return {
      ufs: [
        { value: "todos", label: "Todos os Estados" },
        ...processor.getUniqueValues('siglaUfNome')
          .filter(Boolean)
          .map(uf => ({ value: uf as string, label: uf as string }))
      ],
      municipios: [
        { value: "todos", label: "Todos os Municípios" },
        ...processor.getUniqueValues('municipio')
          .filter(Boolean)
          .slice(0, 100)
          .map(m => ({ value: m as string, label: m as string }))
      ],
      anos: [
        { value: "todos", label: "Todos os Anos" },
        ...processor.getUniqueValues('ano')
          .filter(Boolean)
          .map(ano => ({ value: ano.toString(), label: ano.toString() }))
      ]
    };
  }, [data]);

  // Dados filtrados
  const filteredData = useMemo(() => {
    if (!data.length) return [];

    const processor = DataProcessor.getInstance();
    const filters: FilterOptions = {
      ...(selectedAno !== "todos" && { ano: selectedAno }),
      ...(selectedUF !== "todos" && { siglaUf: selectedUF }),
      ...(selectedMunicipio !== "todos" && { municipio: selectedMunicipio }),
    };

    return processor.getFilteredData(filters);
  }, [data, selectedAno, selectedUF, selectedMunicipio]);

  // Análises de saúde
  const saudeAnalytics = useMemo(() => {
    if (!filteredData.length) return null;

    const totals = DataAnalyzer.calculateTotals(filteredData);
    const averages = DataAnalyzer.calculateAverages(filteredData);
    const chartData = DataAnalyzer.prepareChartData(filteredData, 'saude', 30);
    const rankingCobertura = DataAnalyzer.getTopMunicipiosBySaudeCobertura(filteredData, 15);
    const comparativoEstados = DataAnalyzer.getComparativoEstados(filteredData);

    // Distribuição por faixas de cobertura
    const distribuicaoCobertura = filteredData
      .filter(m => m.pop && m.pop > 0)
      .map(m => {
        const cobertura = ((m.quantidadeProfissionaisMedico || 0) + (m.quantidadeProfissionaisEnfermeiro || 0)) / (m.pop || 1) * 1000;
        if (cobertura >= 10) return 'Excelente (≥10/1000)';
        if (cobertura >= 5) return 'Adequada (5-10/1000)';
        if (cobertura >= 3) return 'Intermediária (3-5/1000)';
        if (cobertura >= 1) return 'Baixa (1-3/1000)';
        return 'Muito Baixa (<1/1000)';
      })
      .reduce((acc, faixa) => {
        acc[faixa] = (acc[faixa] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const distribuicaoArray = Object.entries(distribuicaoCobertura)
      .map(([faixa, count]) => ({ faixa, count }));

    // Correlação população vs investimento
    const correlacaoInvestimento = filteredData
      .filter(m => m.pop && m.pop > 0)
      .map(m => ({
        municipio: m.municipio,
        populacao: m.pop,
        investimentoPorHab: (m.valorTotalAtoProfissional || 0) / (m.pop || 1),
        totalProfissionais: (m.quantidadeProfissionaisMedico || 0) + (m.quantidadeProfissionaisEnfermeiro || 0),
        siglaUf: m.siglaUf
      }))
      .sort((a, b) => (b.populacao || 0) - (a.populacao || 0))
      .slice(0, 50); // Limita para performance

    // Análise de empresas de saúde
    const empresasSaude = filteredData
      .filter(m => (m.numeroDeEmpresasSaude || 0) > 0 || (m.quantidadeVinculosAtivosSaude || 0) > 0)
      .map(m => ({
        municipio: m.municipio,
        empresas: m.numeroDeEmpresasSaude || 0,
        vinculos: m.quantidadeVinculosAtivosSaude || 0,
        populacao: m.pop || 0,
        empresasPor10k: m.pop ? ((m.numeroDeEmpresasSaude || 0) / m.pop) * 10000 : 0
      }))
      .filter(m => m.empresas > 0)
      .sort((a, b) => b.empresasPor10k - a.empresasPor10k)
      .slice(0, 20);

    return {
      totals,
      averages,
      chartData,
      rankingCobertura,
      comparativoEstados,
      distribuicaoArray,
      correlacaoInvestimento,
      empresasSaude
    };
  }, [filteredData]);

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Erro ao Carregar Dados de Saúde</h2>
            <p className="text-muted-foreground">{error}</p>
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Sistema de Saúde</h1>
          <p className="text-muted-foreground text-pretty">
            Infraestrutura de saúde, cobertura profissional e investimentos municipais
          </p>
          {filteredData.length > 0 && saudeAnalytics && (
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="secondary">
                {formatNumber(filteredData.length)} município{filteredData.length !== 1 ? 's' : ''}
              </Badge>
              <Badge variant="secondary">
                {formatNumber(saudeAnalytics.totals.populacao)} habitantes
              </Badge>
              <Badge variant="secondary">
                {formatNumber(saudeAnalytics.totals.medicos + saudeAnalytics.totals.enfermeiros)} profissionais
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
        </div>

        {saudeAnalytics && (
          <>
            {/* KPIs Principais de Saúde */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <DashboardCard
                title="Médicos por 1.000 hab"
                value={saudeAnalytics.averages.medicosPor1000.toFixed(1)}
                change={`Total: ${formatNumber(saudeAnalytics.totals.medicos)} médicos`}
                changeType={saudeAnalytics.averages.medicosPor1000 >= 2.3 ? "positive" : "neutral"}
                icon={<Users className="h-4 w-4" />}
              />
              <DashboardCard
                title="Enfermeiros por 1.000 hab"
                value={saudeAnalytics.averages.enfermeirosPor1000.toFixed(1)}
                change={`Total: ${formatNumber(saudeAnalytics.totals.enfermeiros)} enfermeiros`}
                changeType={saudeAnalytics.averages.enfermeirosPor1000 >= 3.0 ? "positive" : "neutral"}
                icon={<Heart className="h-4 w-4" />}
              />
              <DashboardCard
                title="Investimento Total"
                value={formatCurrency(saudeAnalytics.totals.valorSaude)}
                change={`${formatCurrency(saudeAnalytics.averages.investimentoPorHabitante)} por habitante`}
                changeType="neutral"
                icon={<DollarSign className="h-4 w-4" />}
              />
              <DashboardCard
                title="Cobertura Geral"
                value={`${(saudeAnalytics.averages.medicosPor1000 + saudeAnalytics.averages.enfermeirosPor1000).toFixed(1)}/1000`}
                change={`${filteredData.reduce((sum, m) => sum + (m.numeroDeEmpresasSaude || 0), 0)} empresas de saúde`}
                changeType="positive"
                icon={<Hospital className="h-4 w-4" />}
              />
            </div>

            {/* Distribuição de Cobertura por Faixas */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Municípios por Faixa de Cobertura</CardTitle>
                <CardDescription>
                  Classificação baseada em profissionais de saúde por 1.000 habitantes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={saudeAnalytics.distribuicaoArray}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="faixa" angle={-45} textAnchor="end" height={100} fontSize={11} />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} municípios`, "Quantidade"]} />
                    <Bar dataKey="count" fill={CHART_COLORS[0]}>
                      {saudeAnalytics.distribuicaoArray.map((entry, index) => (
                        <Cell key={`cell-${index}`}
                          fill={
                            entry.faixa.includes('Excelente') ? '#22c55e' :
                              entry.faixa.includes('Adequada') ? '#3b82f6' :
                                entry.faixa.includes('Intermediária') ? '#eab308' :
                                  entry.faixa.includes('Baixa') && !entry.faixa.includes('Muito') ? '#f97316' :
                                    '#ef4444'
                          } />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Ranking de Cobertura */}
              <Card>
                <CardHeader>
                  <CardTitle>Top 10 Municípios em Cobertura de Saúde</CardTitle>
                  <CardDescription>Melhores índices de profissionais por habitante</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {saudeAnalytics.rankingCobertura.slice(0, 10).map((municipio) => {
                      const status = getSaudeCoberturalassification(municipio.coberturaTotal);
                      return (
                        <div key={`${municipio.municipio}-${municipio.siglaUf}`}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                              {municipio.posicao}
                            </div>
                            <div>
                              <p className="font-medium">{municipio.municipio}</p>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {municipio.siglaUf}
                                </Badge>
                                <p className="text-sm text-muted-foreground">
                                  {formatNumber(municipio.populacao)} hab.
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{municipio.coberturaTotal.toFixed(1)}/1000</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <span>{municipio.medicosPor1000.toFixed(1)} méd.</span>
                              <span>+</span>
                              <span>{municipio.enfermeirosPor1000.toFixed(1)} enf.</span>
                            </div>
                            <Badge className={`text-xs mt-1 ${status.bgColor} ${status.color} border-0`}>
                              {status.label}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Correlação População vs Investimento */}
              <Card>
                <CardHeader>
                  <CardTitle>População vs Investimento per Capita</CardTitle>
                  <CardDescription>Relação entre porte municipal e investimento em saúde</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart data={saudeAnalytics.correlacaoInvestimento.slice(0, 30)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="populacao"
                        name="População"
                        scale="log"
                        domain={['dataMin', 'dataMax']}
                        tickFormatter={(value) => formatNumber(value)}
                      />
                      <YAxis
                        dataKey="investimentoPorHab"
                        name="Investimento per capita"
                        tickFormatter={(value) => `R$ ${value.toFixed(0)}`}
                      />
                      <Tooltip
                        formatter={(value, name) => [
                          name === "populacao" ? formatNumber(Number(value)) + " hab." :
                            formatCurrency(Number(value)),
                          name === "populacao" ? "População" : "Investimento per capita"
                        ]}
                        labelFormatter={(label, payload) => payload?.[0]?.payload?.municipio || ""}
                      />
                      <Scatter dataKey="investimentoPorHab" fill={CHART_COLORS[2]} />
                    </ScatterChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Análise de Empresas de Saúde */}
            {saudeAnalytics.empresasSaude.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Empresas de Saúde por Município</CardTitle>
                  <CardDescription>
                    Municípios com maior densidade de empresas de saúde (por 10.000 habitantes)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={saudeAnalytics.empresasSaude.slice(0, 15)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="municipio" angle={-45} textAnchor="end" height={80} fontSize={10} />
                      <YAxis />
                      <Tooltip
                        formatter={(value, name) => [
                          name === 'empresas' ? `${value} empresas` :
                            name === 'vinculos' ? `${value} vínculos` :
                              Number(value).toFixed(2) + '/10k hab.',
                          name === 'empresas' ? 'Empresas' :
                            name === 'vinculos' ? 'Vínculos Ativos' :
                              'Empresas por 10k hab.'
                        ]}
                      />
                      <Bar dataKey="empresasPor10k" fill={CHART_COLORS[3]} name="Densidade" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Comparativo por Estados */}
            {saudeAnalytics.comparativoEstados.length > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Indicadores de Saúde por Estado</CardTitle>
                  <CardDescription>Comparativo de cobertura e investimento por UF</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {saudeAnalytics.comparativoEstados.map((estado) => (
                      <div key={estado.siglaUf} className="p-4 rounded-lg border bg-card">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">{estado.siglaUfNome}</h4>
                          <Badge variant="outline">{estado.siglaUf}</Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Municípios:</span>
                            <span>{estado.count}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">População:</span>
                            <span>{formatNumber(estado.totals.populacao)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Médicos/1000:</span>
                            <span>{estado.averages.medicosPor1000.toFixed(1)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Enfermeiros/1000:</span>
                            <span>{estado.averages.enfermeirosPor1000.toFixed(1)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Investimento/hab:</span>
                            <span>{formatCurrency(estado.averages.investimentoPorHab)}</span>
                          </div>
                          <div className="pt-2 border-t">
                            <div className="flex justify-between font-medium">
                              <span>Cobertura Total:</span>
                              <span className={getSaudeCoberturalassification(
                                estado.averages.medicosPor1000 + estado.averages.enfermeirosPor1000
                              ).color}>
                                {(estado.averages.medicosPor1000 + estado.averages.enfermeirosPor1000).toFixed(1)}/1000
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Métricas Resumo */}
            <div className="grid gap-4 md:grid-cols-4">
              <DashboardCard
                title="Profissionais Totais"
                value={formatNumber(saudeAnalytics.totals.medicos + saudeAnalytics.totals.enfermeiros)}
                change={`${((saudeAnalytics.totals.medicos + saudeAnalytics.totals.enfermeiros) / saudeAnalytics.totals.populacao * 1000).toFixed(1)}/1000 habitantes`}
                changeType="positive"
                icon={<Activity className="h-4 w-4" />}
              />
              <DashboardCard
                title="Investimento Médio"
                value={formatCurrency(saudeAnalytics.totals.valorSaude / filteredData.length)}
                change="Por município"
                changeType="neutral"
                icon={<TrendingUp className="h-4 w-4" />}
              />
              <DashboardCard
                title="Municípios Analisados"
                value={formatNumber(filteredData.length)}
                change={`${saudeAnalytics.comparativoEstados.length} estados`}
                changeType="neutral"
                icon={<MapPin className="h-4 w-4" />}
              />
              <DashboardCard
                title="Taxa de Cobertura"
                value={`${Math.round((filteredData.filter(m =>
                  m.pop && ((m.quantidadeProfissionaisMedico || 0) + (m.quantidadeProfissionaisEnfermeiro || 0)) / m.pop * 1000 >= 3
                ).length / filteredData.filter(m => m.pop).length) * 100)}%`}
                change="Municípios com cobertura adequada"
                changeType="positive"
                icon={<Hospital className="h-4 w-4" />}
              />
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}