"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardCard } from "@/components/dashboard-card"
import { FilterSelector } from "@/components/filter-selector"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"
import { Shield, Users, MapPin, TrendingUp, Vote } from "lucide-react"

const partidosOptions = [
  { value: "partido-a", label: "Partido A" },
  { value: "partido-b", label: "Partido B" },
  { value: "partido-c", label: "Partido C" },
  { value: "partido-d", label: "Partido D" },
]

const top10Municipios = {
  "partido-a": [
    { municipio: "São Paulo", percentualVotos: 45.2, populacao: "12.3M" },
    { municipio: "Campinas", percentualVotos: 42.8, populacao: "1.2M" },
    { municipio: "Santos", percentualVotos: 41.5, populacao: "433K" },
    { municipio: "Ribeirão Preto", percentualVotos: 40.1, populacao: "703K" },
    { municipio: "Sorocaba", percentualVotos: 39.8, populacao: "687K" },
    { municipio: "Osasco", percentualVotos: 38.9, populacao: "697K" },
    { municipio: "Bauru", percentualVotos: 38.2, populacao: "379K" },
    { municipio: "Piracicaba", percentualVotos: 37.8, populacao: "407K" },
    { municipio: "Jundiaí", percentualVotos: 37.5, populacao: "423K" },
    { municipio: "Franca", percentualVotos: 37.1, populacao: "358K" },
  ],
  "partido-b": [
    { municipio: "Rio de Janeiro", percentualVotos: 48.5, populacao: "6.7M" },
    { municipio: "Niterói", percentualVotos: 44.2, populacao: "515K" },
    { municipio: "Petrópolis", percentualVotos: 42.1, populacao: "306K" },
    { municipio: "Volta Redonda", percentualVotos: 41.8, populacao: "273K" },
    { municipio: "Nova Iguaçu", percentualVotos: 40.5, populacao: "821K" },
    { municipio: "Campos", percentualVotos: 39.9, populacao: "507K" },
    { municipio: "Duque de Caxias", percentualVotos: 39.2, populacao: "924K" },
    { municipio: "Angra dos Reis", percentualVotos: 38.8, populacao: "203K" },
    { municipio: "Cabo Frio", percentualVotos: 38.1, populacao: "230K" },
    { municipio: "Macaé", percentualVotos: 37.6, populacao: "261K" },
  ],
}

const radarData = {
  "partido-a": [
    { indicador: "Educação (IDEB)", valor: 6.8, maximo: 10 },
    { indicador: "Saúde (Leitos/hab)", valor: 3.2, maximo: 5 },
    { indicador: "Economia (Renda)", valor: 7.5, maximo: 10 },
    { indicador: "Emprego (Saldo)", valor: 8.1, maximo: 10 },
    { indicador: "Infraestrutura", valor: 6.9, maximo: 10 },
  ],
  "partido-b": [
    { indicador: "Educação (IDEB)", valor: 5.8, maximo: 10 },
    { indicador: "Saúde (Leitos/hab)", valor: 4.1, maximo: 5 },
    { indicador: "Economia (Renda)", valor: 6.2, maximo: 10 },
    { indicador: "Emprego (Saldo)", valor: 5.9, maximo: 10 },
    { indicador: "Infraestrutura", valor: 7.8, maximo: 10 },
  ],
}

const heatmapData = [
  { municipio: "São Paulo", abstencao: 18.5, renda: 8.2, escolaridade: 7.8, industria: 6.5 },
  { municipio: "Campinas", abstencao: 22.1, renda: 7.5, escolaridade: 8.1, industria: 8.9 },
  { municipio: "Santos", abstencao: 19.8, renda: 7.8, escolaridade: 7.9, industria: 4.2 },
  { municipio: "Ribeirão Preto", abstencao: 25.2, renda: 6.9, escolaridade: 7.2, industria: 7.8 },
  { municipio: "Sorocaba", abstencao: 21.5, renda: 7.1, escolaridade: 6.8, industria: 8.5 },
]

export default function BastioesPage() {
  const [partidoSelecionado, setPartidoSelecionado] = useState("partido-a")

  const municipiosAtual = top10Municipios[partidoSelecionado as keyof typeof top10Municipios] || []
  const radarAtual = radarData[partidoSelecionado as keyof typeof radarData] || []

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Bastiões Eleitorais</h1>
            <p className="text-muted-foreground text-pretty">
              Análise dos municípios com maior concentração de votos por partido
            </p>
          </div>
          <FilterSelector
            value={partidoSelecionado}
            onValueChange={setPartidoSelecionado}
            options={partidosOptions}
            placeholder="Selecionar Partido"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <DashboardCard
            title="Maior Bastião"
            value={municipiosAtual[0]?.municipio || "N/A"}
            change={`${municipiosAtual[0]?.percentualVotos || 0}% dos votos`}
            changeType="positive"
            icon={<Shield className="h-4 w-4" />}
          />
          <DashboardCard
            title="Média de Votos"
            value={`${municipiosAtual.reduce((acc, m) => acc + m.percentualVotos, 0) / municipiosAtual.length || 0}%`}
            change="Nos top 10 municípios"
            changeType="neutral"
            icon={<Vote className="h-4 w-4" />}
          />
          <DashboardCard
            title="População Total"
            value="25.8M"
            change="Soma dos top 10 bastiões"
            changeType="neutral"
            icon={<Users className="h-4 w-4" />}
          />
          <DashboardCard
            title="Cobertura Territorial"
            value="15.2%"
            change="% do eleitorado nacional"
            changeType="neutral"
            icon={<MapPin className="h-4 w-4" />}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>
                Top 10 Municípios - {partidosOptions.find((p) => p.value === partidoSelecionado)?.label}
              </CardTitle>
              <CardDescription>Municípios com maior percentual de votos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {municipiosAtual.map((municipio, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <div className="font-medium">{municipio.municipio}</div>
                      <div className="text-sm text-muted-foreground">Pop: {municipio.populacao}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{municipio.percentualVotos}%</div>
                      <div className="text-sm text-muted-foreground">#{index + 1}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>DNA dos Bastiões - Gráfico de Radar</CardTitle>
              <CardDescription>
                Perfil médio dos municípios do {partidosOptions.find((p) => p.value === partidoSelecionado)?.label}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarAtual}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="indicador" />
                  <PolarRadiusAxis angle={90} domain={[0, 10]} />
                  <Radar
                    name="Indicadores"
                    dataKey="valor"
                    stroke="hsl(var(--chart-1))"
                    fill="hsl(var(--chart-1))"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Mapa de Calor - Indicadores dos Bastiões</CardTitle>
            <CardDescription>Comparação dos indicadores socioeconômicos (valores normalizados 0-10)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Município</th>
                    <th className="text-center p-3">Abstenção</th>
                    <th className="text-center p-3">Renda Média</th>
                    <th className="text-center p-3">Escolaridade</th>
                    <th className="text-center p-3">% Indústria</th>
                  </tr>
                </thead>
                <tbody>
                  {heatmapData.map((row, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-3 font-medium">{row.municipio}</td>
                      <td className="text-center p-3">
                        <div
                          className={`inline-block px-3 py-1 rounded text-white text-sm ${
                            row.abstencao > 23 ? "bg-red-500" : row.abstencao > 20 ? "bg-yellow-500" : "bg-green-500"
                          }`}
                        >
                          {row.abstencao}%
                        </div>
                      </td>
                      <td className="text-center p-3">
                        <div
                          className={`inline-block px-3 py-1 rounded text-white text-sm ${
                            row.renda > 7.5 ? "bg-green-500" : row.renda > 6.5 ? "bg-yellow-500" : "bg-red-500"
                          }`}
                        >
                          {row.renda}
                        </div>
                      </td>
                      <td className="text-center p-3">
                        <div
                          className={`inline-block px-3 py-1 rounded text-white text-sm ${
                            row.escolaridade > 7.5
                              ? "bg-green-500"
                              : row.escolaridade > 6.5
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                        >
                          {row.escolaridade}
                        </div>
                      </td>
                      <td className="text-center p-3">
                        <div
                          className={`inline-block px-3 py-1 rounded text-white text-sm ${
                            row.industria > 7.5 ? "bg-green-500" : row.industria > 5.5 ? "bg-yellow-500" : "bg-red-500"
                          }`}
                        >
                          {row.industria}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 rounded bg-green-500"></span>
                <span>Acima da média</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 rounded bg-yellow-500"></span>
                <span>Próximo à média</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 rounded bg-red-500"></span>
                <span>Abaixo da média</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <DashboardCard
            title="Concentração Eleitoral"
            value="68.5%"
            change="% votos nos top 10 municípios"
            changeType="neutral"
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <DashboardCard
            title="Diversidade Regional"
            value="7 estados"
            change="Presença geográfica dos bastiões"
            changeType="positive"
            icon={<MapPin className="h-4 w-4" />}
          />
          <DashboardCard
            title="Força Eleitoral"
            value="8.2M votos"
            change="Total de votos nos bastiões"
            changeType="positive"
            icon={<Vote className="h-4 w-4" />}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
