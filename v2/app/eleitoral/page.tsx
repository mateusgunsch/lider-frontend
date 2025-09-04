"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardCard } from "@/components/dashboard-card"
import { FilterSelector } from "@/components/filter-selector"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts"
import { Vote, Users, MapPin, TrendingUp, DollarSign, Calendar, UserCheck } from "lucide-react"

const municipios = [
  { value: "sao-paulo", label: "São Paulo" },
  { value: "rio-janeiro", label: "Rio de Janeiro" },
  { value: "belo-horizonte", label: "Belo Horizonte" },
]

const bairros = [
  { value: "todos", label: "Todos os Bairros" },
  { value: "centro", label: "Centro" },
  { value: "zona-norte", label: "Zona Norte" },
  { value: "zona-sul", label: "Zona Sul" },
  { value: "zona-leste", label: "Zona Leste" },
  { value: "zona-oeste", label: "Zona Oeste" },
]

const anos = [
  { value: "2024", label: "2024" },
  { value: "2022", label: "2022" },
  { value: "2020", label: "2020" },
]

const resultadoEleicao = [
  { name: "Partido A", votos: 45000, percentual: 35, color: "#3b82f6" },
  { name: "Partido B", votos: 32000, percentual: 25, color: "#ef4444" },
  { name: "Partido C", votos: 28000, percentual: 22, color: "#10b981" },
  { name: "Partido D", votos: 23000, percentual: 18, color: "#f59e0b" },
]

const mapaCoropletico = [
  { bairro: "Centro", partidoVencedor: "Partido A", percentualVencedor: 42, abstencao: 18, cor: "#3b82f6" },
  { bairro: "Zona Norte", partidoVencedor: "Partido B", percentualVencedor: 38, abstencao: 25, cor: "#ef4444" },
  { bairro: "Zona Sul", partidoVencedor: "Partido A", percentualVencedor: 45, abstencao: 15, cor: "#3b82f6" },
  { bairro: "Zona Leste", partidoVencedor: "Partido C", percentualVencedor: 35, abstencao: 28, cor: "#10b981" },
  { bairro: "Zona Oeste", partidoVencedor: "Partido B", percentualVencedor: 40, abstencao: 22, cor: "#ef4444" },
]

const distribuicaoVotos = [
  { categoria: "18-25 anos", partidoA: 30, partidoB: 25, partidoC: 25, partidoD: 20 },
  { categoria: "26-35 anos", partidoA: 35, partidoB: 30, partidoC: 20, partidoD: 15 },
  { categoria: "36-50 anos", partidoA: 40, partidoB: 25, partidoC: 25, partidoD: 10 },
  { categoria: "51+ anos", partidoA: 45, partidoB: 20, partidoC: 25, partidoD: 10 },
]

const perfilEscolaridade = [
  { escolaridade: "Fundamental", partidoA: 35, partidoB: 25, partidoC: 25, partidoD: 15 },
  { escolaridade: "Médio", partidoA: 30, partidoB: 30, partidoC: 25, partidoD: 15 },
  { escolaridade: "Superior", partidoA: 40, partidoB: 20, partidoC: 30, partidoD: 10 },
  { escolaridade: "Pós-Graduação", partidoA: 45, partidoB: 15, partidoC: 30, partidoD: 10 },
]

const perfilGenero = [
  { genero: "Masculino", partidoA: 38, partidoB: 28, partidoC: 22, partidoD: 12 },
  { genero: "Feminino", partidoA: 32, partidoB: 22, partidoC: 28, partidoD: 18 },
]

export default function EleitoralPage() {
  const [municipioSelecionado, setMunicipioSelecionado] = useState("sao-paulo")
  const [bairroSelecionado, setBairroSelecionado] = useState("todos")
  const [anoSelecionado, setAnoSelecionado] = useState("2024")
  const [visualizacaoMapa, setVisualizacaoMapa] = useState("partido") // "partido" ou "abstencao"

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-balance">Análise Eleitoral e Demografia</h1>
            <p className="text-muted-foreground text-pretty">
              Cruzamento do perfil do eleitor com escolhas políticas e nível de engajamento
            </p>
          </div>

          <div className="flex gap-4 flex-wrap">
            <FilterSelector
              value={municipioSelecionado}
              onValueChange={setMunicipioSelecionado}
              options={municipios}
              placeholder="Selecionar Município"
            />
            <FilterSelector
              value={bairroSelecionado}
              onValueChange={setBairroSelecionado}
              options={bairros}
              placeholder="Selecionar Bairro"
            />
            <FilterSelector
              value={anoSelecionado}
              onValueChange={setAnoSelecionado}
              options={anos}
              placeholder="Selecionar Ano"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <DashboardCard
            title="Abstenção (%)"
            value="21.5%"
            change="-2.1% vs eleição anterior"
            changeType="positive"
            icon={<Users className="h-4 w-4" />}
          />
          <DashboardCard
            title="Comparecimento (%)"
            value="78.5%"
            change="+2.1% vs eleição anterior"
            changeType="positive"
            icon={<Vote className="h-4 w-4" />}
          />
          <DashboardCard
            title="Total de Votos"
            value="128.4K"
            change="Por partido/candidato"
            changeType="neutral"
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <DashboardCard
            title="Custo por Voto"
            value="R$ 12.50"
            change="Despesa campanha / nº votos"
            changeType="neutral"
            icon={<DollarSign className="h-4 w-4" />}
          />
          <DashboardCard
            title="Perfil Predominante"
            value="25-35 anos"
            change="Superior completo"
            changeType="neutral"
            icon={<UserCheck className="h-4 w-4" />}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Mapa Coroplético por Bairro/Zona Eleitoral
            </CardTitle>
            <CardDescription className="flex items-center gap-4">
              <span>Visualização geográfica da distribuição política</span>
              <div className="flex gap-2">
                <Button
                  variant={visualizacaoMapa === "partido" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setVisualizacaoMapa("partido")}
                >
                  Partido Vencedor
                </Button>
                <Button
                  variant={visualizacaoMapa === "abstencao" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setVisualizacaoMapa("abstencao")}
                >
                  Nível de Abstenção
                </Button>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-muted/20 rounded-lg">
              {mapaCoropletico.map((item) => (
                <div
                  key={item.bairro}
                  className="p-4 rounded-lg border-2 hover:scale-105 transition-transform cursor-pointer"
                  style={{
                    borderColor:
                      visualizacaoMapa === "partido"
                        ? item.cor
                        : item.abstencao > 25
                          ? "#ef4444"
                          : item.abstencao > 20
                            ? "#f59e0b"
                            : "#10b981",
                    backgroundColor:
                      visualizacaoMapa === "partido"
                        ? `${item.cor}20`
                        : item.abstencao > 25
                          ? "#ef444420"
                          : item.abstencao > 20
                            ? "#f59e0b20"
                            : "#10b98120",
                  }}
                >
                  <div className="font-semibold text-sm">{item.bairro}</div>
                  {visualizacaoMapa === "partido" ? (
                    <>
                      <div className="text-xs text-muted-foreground">{item.partidoVencedor}</div>
                      <div className="text-xs font-medium">{item.percentualVencedor}% dos votos</div>
                    </>
                  ) : (
                    <>
                      <div className="text-xs text-muted-foreground">Abstenção</div>
                      <div className="text-xs font-medium">{item.abstencao}%</div>
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-4 text-sm">
              {visualizacaoMapa === "partido" ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span>Partido A</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span>Partido B</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Partido C</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Baixa (&lt;20%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span>Média (20-25%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span>Alta (&gt;25%)</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Votos por Faixa Etária</CardTitle>
              <CardDescription>Gráfico de barras empilhadas (100%) - Perfil etário dos eleitores</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={distribuicaoVotos}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="categoria" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                  <Bar dataKey="partidoA" stackId="a" fill="#3b82f6" name="Partido A" />
                  <Bar dataKey="partidoB" stackId="a" fill="#ef4444" name="Partido B" />
                  <Bar dataKey="partidoC" stackId="a" fill="#10b981" name="Partido C" />
                  <Bar dataKey="partidoD" stackId="a" fill="#f59e0b" name="Partido D" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Perfil de Escolaridade por Partido</CardTitle>
              <CardDescription>Distribuição educacional dos eleitores de cada partido</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={perfilEscolaridade}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="escolaridade" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                  <Bar dataKey="partidoA" stackId="a" fill="#3b82f6" name="Partido A" />
                  <Bar dataKey="partidoB" stackId="a" fill="#ef4444" name="Partido B" />
                  <Bar dataKey="partidoC" stackId="a" fill="#10b981" name="Partido C" />
                  <Bar dataKey="partidoD" stackId="a" fill="#f59e0b" name="Partido D" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Resultado da Última Eleição</CardTitle>
              <CardDescription>Distribuição percentual de votos para prefeito</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={resultadoEleicao}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="percentual"
                    label={({ name, percentual }) => `${name}: ${percentual}%`}
                  >
                    {resultadoEleicao.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Votos"]} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Gênero</CardTitle>
              <CardDescription>Preferência eleitoral por gênero</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={perfilGenero}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="genero" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                  <Bar dataKey="partidoA" fill="#3b82f6" name="Partido A" />
                  <Bar dataKey="partidoB" fill="#ef4444" name="Partido B" />
                  <Bar dataKey="partidoC" fill="#10b981" name="Partido C" />
                  <Bar dataKey="partidoD" fill="#f59e0b" name="Partido D" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <DashboardCard
            title="Eleitores Aptos"
            value="164.2K"
            change="+3.2% vs última eleição"
            changeType="positive"
            icon={<Calendar className="h-4 w-4" />}
          />
          <DashboardCard title="Votos Brancos" value="3.2%" change="-0.5% vs eleição anterior" changeType="positive" />
          <DashboardCard title="Votos Nulos" value="2.6%" change="-1.0% vs eleição anterior" changeType="positive" />
          <DashboardCard title="Urnas Eletrônicas" value="245" change="100% funcionamento" changeType="neutral" />
        </div>
      </div>
    </DashboardLayout>
  )
}
