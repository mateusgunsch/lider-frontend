"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardCard } from "@/components/dashboard-card"
import { FilterSelector } from "@/components/filter-selector"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Scatter,
  ScatterChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts"
import { Users, Vote, Heart, GraduationCap, DollarSign, Wifi, MapPin } from "lucide-react"

const municipios = [
  { value: "todos", label: "Visão Comparativa" },
  { value: "sao-paulo", label: "São Paulo" },
  { value: "rio-janeiro", label: "Rio de Janeiro" },
  { value: "belo-horizonte", label: "Belo Horizonte" },
  { value: "salvador", label: "Salvador" },
  { value: "brasilia", label: "Brasília" },
]

const anos = [
  { value: "2024", label: "2024" },
  { value: "2023", label: "2023" },
  { value: "2022", label: "2022" },
  { value: "2021", label: "2021" },
]

const partidos = [
  { value: "todos", label: "Todos os Partidos" },
  { value: "partido-a", label: "Partido A" },
  { value: "partido-b", label: "Partido B" },
  { value: "partido-c", label: "Partido C" },
]

const mapaData = [
  { municipio: "São Paulo", partido: "Partido A", cor: "#3b82f6", prefeito: "João Silva" },
  { municipio: "Rio de Janeiro", partido: "Partido B", cor: "#ef4444", prefeito: "Maria Santos" },
  { municipio: "Belo Horizonte", partido: "Partido A", cor: "#3b82f6", prefeito: "Pedro Costa" },
  { municipio: "Salvador", partido: "Partido C", cor: "#10b981", prefeito: "Ana Lima" },
  { municipio: "Brasília", partido: "Partido B", cor: "#ef4444", prefeito: "Carlos Oliveira" },
]

const dadosMunicipio = {
  "sao-paulo": {
    nome: "São Paulo",
    populacao: "12.396.372",
    idh: "0.805",
    prefeito: "João Silva",
    partido: "Partido A",
  },
  "rio-janeiro": {
    nome: "Rio de Janeiro",
    populacao: "6.775.561",
    idh: "0.799",
    prefeito: "Maria Santos",
    partido: "Partido B",
  },
}

const correlationData = [
  { votosPartido: 25, indicador: 6.2, municipio: "São Paulo" },
  { votosPartido: 45, indicador: 5.8, municipio: "Rio de Janeiro" },
  { votosPartido: 35, indicador: 6.5, municipio: "Belo Horizonte" },
  { votosPartido: 55, indicador: 5.4, municipio: "Salvador" },
  { votosPartido: 30, indicador: 6.8, municipio: "Brasília" },
  { votosPartido: 40, indicador: 5.9, municipio: "Fortaleza" },
  { votosPartido: 20, indicador: 7.1, municipio: "Curitiba" },
  { votosPartido: 50, indicador: 5.6, municipio: "Recife" },
]

const resultadoEleitoral = [
  { name: "Partido A", value: 35, color: "hsl(var(--chart-1))" },
  { name: "Partido B", value: 28, color: "hsl(var(--chart-2))" },
  { name: "Partido C", value: 22, color: "hsl(var(--chart-3))" },
  { name: "Partido D", value: 15, color: "hsl(var(--chart-4))" },
]

const saldoEmpregos = [
  { mes: "Jan", saldo: 1200 },
  { mes: "Fev", saldo: 800 },
  { mes: "Mar", saldo: 1500 },
  { mes: "Abr", saldo: 900 },
  { mes: "Mai", saldo: 1800 },
  { mes: "Jun", saldo: 1100 },
]

const empresasPorSetor = [
  { setor: "Serviços", empresas: 45 },
  { setor: "Comércio", empresas: 28 },
  { setor: "Indústria", empresas: 18 },
  { setor: "Agropecuária", empresas: 9 },
]

const indicadores = [
  { value: "ideb", label: "IDEB" },
  { value: "evasao", label: "Taxa de Evasão" },
  { value: "massa-salarial", label: "Massa Salarial" },
  { value: "custo-paciente", label: "Custo por Paciente" },
]

export default function HomePage() {
  const [partidoSelecionado, setPartidoSelecionado] = useState("todos")
  const [municipioSelecionado, setMunicipioSelecionado] = useState("todos")
  const [anoSelecionado, setAnoSelecionado] = useState("2024")
  const [indicadorSelecionado, setIndicadorSelecionado] = useState("ideb")

  const modoComparativo = municipioSelecionado === "todos"
  const dadosAtualMunicipio = dadosMunicipio[municipioSelecionado as keyof typeof dadosMunicipio]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-balance">
                {modoComparativo ? "Análise Comparativa" : `Município: ${dadosAtualMunicipio?.nome}`}
              </h1>
              <p className="text-muted-foreground text-pretty">
                {modoComparativo
                  ? "Comparação entre municípios por partido político"
                  : "Análise detalhada do município selecionado"}
              </p>
            </div>
          </div>

          <div className="flex gap-4 flex-wrap">
            <FilterSelector
              value={municipioSelecionado}
              onValueChange={setMunicipioSelecionado}
              options={municipios}
              placeholder="Selecionar Município"
            />
            <FilterSelector
              value={anoSelecionado}
              onValueChange={setAnoSelecionado}
              options={anos}
              placeholder="Selecionar Ano"
            />
            <FilterSelector
              value={partidoSelecionado}
              onValueChange={setPartidoSelecionado}
              options={partidos}
              placeholder="Selecionar Partido"
            />
          </div>

          {!modoComparativo && dadosAtualMunicipio && (
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">População</p>
                    <p className="text-lg font-semibold">{dadosAtualMunicipio.populacao}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">IDH</p>
                    <p className="text-lg font-semibold">{dadosAtualMunicipio.idh}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Prefeito</p>
                    <p className="text-lg font-semibold">{dadosAtualMunicipio.prefeito}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Partido</p>
                    <p className="text-lg font-semibold">{dadosAtualMunicipio.partido}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {modoComparativo ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Mapa Interativo do Estado
                </CardTitle>
                <CardDescription>
                  Clique em um município para ver análise detalhada. Cores representam o partido do prefeito eleito.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-muted/20 rounded-lg">
                  {mapaData.map((item) => (
                    <Button
                      key={item.municipio}
                      variant="outline"
                      className="h-20 flex-col gap-1 hover:scale-105 transition-transform bg-transparent"
                      style={{ borderColor: item.cor, borderWidth: "2px" }}
                      onClick={() => setMunicipioSelecionado(item.municipio.toLowerCase().replace(" ", "-"))}
                    >
                      <div className="font-semibold text-sm">{item.municipio}</div>
                      <div className="text-xs text-muted-foreground">{item.partido}</div>
                      <div className="text-xs">{item.prefeito}</div>
                    </Button>
                  ))}
                </div>
                <div className="flex gap-4 mt-4 text-sm">
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
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <DashboardCard
                title="IDEB Médio"
                value="6.2"
                change={`Média dos municípios do ${partidoSelecionado === "todos" ? "estado" : partidos.find((p) => p.value === partidoSelecionado)?.label}`}
                changeType="neutral"
                icon={<GraduationCap className="h-4 w-4" />}
              />
              <DashboardCard
                title="Leitos / 1.000 hab."
                value="2.8"
                change="Média comparativa por partido"
                changeType="neutral"
                icon={<Heart className="h-4 w-4" />}
              />
              <DashboardCard
                title="Renda Média per capita"
                value="R$ 2.450"
                change="Média dos municípios selecionados"
                changeType="neutral"
                icon={<DollarSign className="h-4 w-4" />}
              />
              <DashboardCard
                title="% Escolas com Internet"
                value="87.5%"
                change="Conectividade média"
                changeType="neutral"
                icon={<Wifi className="h-4 w-4" />}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Análise de Correlação</CardTitle>
                <CardDescription className="flex items-center gap-4">
                  <span>Eixo X: % de Votos no Partido Selecionado | Eixo Y: Indicador Socioeconômico</span>
                  <FilterSelector
                    value={indicadorSelecionado}
                    onValueChange={setIndicadorSelecionado}
                    options={indicadores}
                    placeholder="Selecionar Indicador"
                  />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ width: "100%", height: "400px" }}>
                  <ResponsiveContainer>
                    <ScatterChart data={correlationData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="votosPartido"
                        name="% Votos"
                        unit="%"
                        type="number"
                        domain={["dataMin - 5", "dataMax + 5"]}
                      />
                      <YAxis
                        dataKey="indicador"
                        name={indicadores.find((i) => i.value === indicadorSelecionado)?.label}
                        type="number"
                        domain={["dataMin - 0.5", "dataMax + 0.5"]}
                      />
                      <Tooltip
                        cursor={{ strokeDasharray: "3 3" }}
                        formatter={(value, name) => [
                          value,
                          indicadores.find((i) => i.value === indicadorSelecionado)?.label,
                        ]}
                        labelFormatter={(label) =>
                          `Município: ${correlationData.find((d) => d.votosPartido === label)?.municipio || "N/A"}`
                        }
                      />
                      <Scatter dataKey="indicador" fill="#3b82f6" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Seção Eleitoral</h2>
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Resultado Última Eleição</CardTitle>
                    <CardDescription>Distribuição de votos para prefeito</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div style={{ width: "100%", height: "250px" }}>
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie
                            data={resultadoEleitoral}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {resultadoEleitoral.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={["#3b82f6", "#ef4444", "#10b981", "#f59e0b"][index]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value}%`, "Votos"]} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <DashboardCard
                    title="Abstenção"
                    value="21.5%"
                    change="-2.1% vs eleição anterior"
                    changeType="positive"
                    icon={<Vote className="h-4 w-4" />}
                  />
                  <DashboardCard
                    title="Comparecimento"
                    value="78.5%"
                    change="+2.1% vs eleição anterior"
                    changeType="positive"
                    icon={<Users className="h-4 w-4" />}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Seção Socioeconômica</h2>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Economia</h3>
                  <Card>
                    <CardHeader>
                      <CardTitle>Saldo de Empregos</CardTitle>
                      <CardDescription>Últimos 12 meses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div style={{ width: "100%", height: "200px" }}>
                        <ResponsiveContainer>
                          <LineChart data={saldoEmpregos} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="mes" />
                            <YAxis />
                            <Tooltip formatter={(value) => [value, "Saldo de Empregos"]} />
                            <Line type="monotone" dataKey="saldo" stroke="#10b981" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Empresas por Setor</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div style={{ width: "100%", height: "200px" }}>
                        <ResponsiveContainer>
                          <BarChart data={empresasPorSetor} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="setor" />
                            <YAxis />
                            <Tooltip formatter={(value) => [value, "Empresas"]} />
                            <Bar dataKey="empresas" fill="#3b82f6" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Educação</h3>
                  <DashboardCard
                    title="IDEB da Cidade"
                    value="6.2"
                    change="+0.3 vs avaliação anterior"
                    changeType="positive"
                    icon={<GraduationCap className="h-4 w-4" />}
                  />
                  <DashboardCard
                    title="Taxa de Evasão"
                    value="2.8%"
                    change="-0.7% vs ano anterior"
                    changeType="positive"
                  />
                  <DashboardCard
                    title="Razão Professor/Aluno"
                    value="1:22"
                    change="Dentro da meta nacional"
                    changeType="neutral"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Saúde</h3>
                  <DashboardCard
                    title="Leitos/1.000 hab."
                    value="2.8"
                    change="+0.2 vs trimestre anterior"
                    changeType="positive"
                    icon={<Heart className="h-4 w-4" />}
                  />
                  <DashboardCard
                    title="Custo Médio Internação"
                    value="R$ 1.250"
                    change="-5.2% vs trimestre anterior"
                    changeType="positive"
                  />
                  <DashboardCard
                    title="Principal CID"
                    value="J44 - DPOC"
                    change="28% das internações"
                    changeType="neutral"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
