"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardCard } from "@/components/dashboard-card"
import { FilterSelector } from "@/components/filter-selector"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Users, Vote, Heart, GraduationCap, DollarSign, Briefcase, Wifi } from "lucide-react"

const partidos = [
  { value: "todos", label: "Todos os Partidos" },
  { value: "partido-a", label: "Partido A" },
  { value: "partido-b", label: "Partido B" },
  { value: "partido-c", label: "Partido C" },
]

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

export default function HomePage() {
  const [partidoSelecionado, setPartidoSelecionado] = useState("todos")

  console.log("[v0] Correlation data:", correlationData)
  console.log("[v0] Electoral results:", resultadoEleitoral)
  console.log("[v0] Employment data:", saldoEmpregos)
  console.log("[v0] Companies data:", empresasPorSetor)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Página Inicial</h1>
            <p className="text-muted-foreground text-pretty">
              Cartões de KPI Comparativos por Bairro dentro do Município
            </p>
          </div>
          <FilterSelector
            value={partidoSelecionado}
            onValueChange={setPartidoSelecionado}
            options={partidos}
            placeholder="Selecionar Partido"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="IDEB Médio"
            value="6.2"
            change="+0.3 em relação ao ano anterior"
            changeType="positive"
            icon={<GraduationCap className="h-4 w-4" />}
          />
          <DashboardCard
            title="Leitos / 1.000 hab."
            value="2.8"
            change="+0.2 em relação ao trimestre anterior"
            changeType="positive"
            icon={<Heart className="h-4 w-4" />}
          />
          <DashboardCard
            title="Renda Média per capita"
            value="R$ 2.450"
            change="+5.2% em relação ao ano anterior"
            changeType="positive"
            icon={<DollarSign className="h-4 w-4" />}
          />
          <DashboardCard
            title="% Escolas com Internet"
            value="87.5%"
            change="+12.3% das escolas conectadas"
            changeType="positive"
            icon={<Wifi className="h-4 w-4" />}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Correlação: Votos vs Indicador Socioeconômico</CardTitle>
            <CardDescription>
              Eixo X: % de Votos no Partido Selecionado | Eixo Y: IDEB (Indicador Educacional)
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
                  <YAxis dataKey="indicador" name="IDEB" type="number" domain={["dataMin - 0.5", "dataMax + 0.5"]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(value, name) => [value, name === "indicador" ? "IDEB" : name]}
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

            {/* Cartões de Abstenção e Comparecimento */}
            <div className="space-y-4">
              <DashboardCard
                title="Abstenção"
                value="21.5%"
                change="-2.1% em relação à eleição anterior"
                changeType="positive"
                icon={<Vote className="h-4 w-4" />}
              />
              <DashboardCard
                title="Comparecimento"
                value="78.5%"
                change="+2.1% em relação à eleição anterior"
                changeType="positive"
                icon={<Users className="h-4 w-4" />}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Seção Socioeconômica</h2>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Coluna 1 - Economia */}
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

            {/* Coluna 2 - Educação */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Educação</h3>

              <DashboardCard
                title="IDEB da Cidade"
                value="6.2"
                change="+0.3 em relação à avaliação anterior"
                changeType="positive"
                icon={<GraduationCap className="h-4 w-4" />}
              />
              <DashboardCard
                title="Taxa de Evasão"
                value="2.8%"
                change="-0.7% em relação ao ano anterior"
                changeType="positive"
              />
              <DashboardCard
                title="Razão Professor/Aluno"
                value="1:22"
                change="Dentro da meta nacional"
                changeType="neutral"
              />
            </div>

            {/* Coluna 3 - Saúde */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Saúde</h3>

              <DashboardCard
                title="Leitos/1.000 hab."
                value="2.8"
                change="+0.2 em relação ao trimestre anterior"
                changeType="positive"
                icon={<Heart className="h-4 w-4" />}
              />
              <DashboardCard
                title="Custo Médio Internação"
                value="R$ 1.250"
                change="-5.2% em relação ao trimestre anterior"
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

        <DashboardCard
          title="Saldo de Emprego Formal (Acumulado)"
          value="+8.450"
          change="+15.2% em relação ao mesmo período do ano anterior"
          changeType="positive"
          icon={<Briefcase className="h-4 w-4" />}
        />
      </div>
    </DashboardLayout>
  )
}
