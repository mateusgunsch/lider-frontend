"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardCard } from "@/components/dashboard-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Line,
  LineChart,
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
  ReferenceLine,
} from "recharts"
import { DollarSign, TrendingUp, Briefcase, PiggyBank, Users, Building } from "lucide-react"

const saldoEmpregosMensal = [
  { mes: "Jan", admissoes: 2800, demissoes: 1600, saldo: 1200 },
  { mes: "Fev", admissoes: 2400, demissoes: 1600, saldo: 800 },
  { mes: "Mar", admissoes: 3100, demissoes: 1600, saldo: 1500 },
  { mes: "Abr", admissoes: 2500, demissoes: 1600, saldo: 900 },
  { mes: "Mai", admissoes: 3400, demissoes: 1600, saldo: 1800 },
  { mes: "Jun", admissoes: 2700, demissoes: 1600, saldo: 1100 },
]

const empresasPorSetor = [
  { setor: "Serviços", empresas: 45, color: "hsl(var(--chart-1))" },
  { setor: "Comércio", empresas: 28, color: "hsl(var(--chart-2))" },
  { setor: "Indústria", empresas: 18, color: "hsl(var(--chart-3))" },
  { setor: "Agropecuária", empresas: 9, color: "hsl(var(--chart-4))" },
]

const cascataEmpregos = [
  { categoria: "Vínculos Iniciais", valor: 45000, tipo: "inicial" },
  { categoria: "Admissões", valor: 12500, tipo: "positivo" },
  { categoria: "Demissões", valor: -8200, tipo: "negativo" },
  { categoria: "Vínculos Finais", valor: 49300, tipo: "final" },
]

const escolaridadePorSetor = [
  { setor: "Serviços", fundamental: 20, medio: 45, superior: 30, posGrad: 5 },
  { setor: "Comércio", fundamental: 35, medio: 50, superior: 12, posGrad: 3 },
  { setor: "Indústria", fundamental: 25, medio: 55, superior: 18, posGrad: 2 },
  { setor: "Agropecuária", fundamental: 60, medio: 30, superior: 8, posGrad: 2 },
]

export default function EconomiaPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Indicadores Econômicos</h1>
          <p className="text-muted-foreground text-pretty">
            Acompanhamento do mercado de trabalho e atividade econômica
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Saldo de Empregos"
            value="+8.450"
            change="Admissões - Demissões (acumulado)"
            changeType="positive"
            icon={<Briefcase className="h-4 w-4" />}
          />
          <DashboardCard
            title="Massa Salarial Total"
            value="R$ 2.8B"
            change="+5.2% vs ano anterior"
            changeType="positive"
            icon={<DollarSign className="h-4 w-4" />}
          />
          <DashboardCard
            title="Nº de Empresas Ativas"
            value="12.450"
            change="+3.8% vs ano anterior"
            changeType="positive"
            icon={<Building className="h-4 w-4" />}
          />
          <DashboardCard
            title="Taxa de Desemprego"
            value="7.8%"
            change="-1.2% vs trimestre anterior"
            changeType="positive"
            icon={<Users className="h-4 w-4" />}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Evolução Mensal do Saldo de Empregos</CardTitle>
            <CardDescription>Admissões vs Demissões ao longo do tempo</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={saldoEmpregosMensal}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="admissoes"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  name="Admissões"
                />
                <Line
                  type="monotone"
                  dataKey="demissoes"
                  stroke="hsl(var(--destructive))"
                  strokeWidth={2}
                  name="Demissões"
                />
                <ReferenceLine y={0} stroke="#666" strokeDasharray="2 2" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Empresas por Setor</CardTitle>
              <CardDescription>Percentual de empresas por setor econômico</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={empresasPorSetor}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="empresas"
                    label={({ setor, empresas }) => `${setor}: ${empresas}%`}
                  >
                    {empresasPorSetor.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Saldo de Empregos - Gráfico Cascata</CardTitle>
              <CardDescription>Composição do saldo final de vínculos</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cascataEmpregos}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="categoria" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="valor">
                    {cascataEmpregos.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.tipo === "positivo"
                            ? "hsl(var(--chart-1))"
                            : entry.tipo === "negativo"
                              ? "hsl(var(--destructive))"
                              : "hsl(var(--chart-4))"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Composição da Escolaridade por Setor</CardTitle>
            <CardDescription>Distribuição da força de trabalho por nível educacional</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={escolaridadePorSetor}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="setor" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="fundamental" stackId="a" fill="hsl(var(--chart-1))" name="Fundamental" />
                <Bar dataKey="medio" stackId="a" fill="hsl(var(--chart-2))" name="Médio" />
                <Bar dataKey="superior" stackId="a" fill="hsl(var(--chart-3))" name="Superior" />
                <Bar dataKey="posGrad" stackId="a" fill="hsl(var(--chart-4))" name="Pós-Graduação" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-4">
          <DashboardCard
            title="PIB Municipal"
            value="R$ 45.2B"
            change="+2.8% vs ano anterior"
            changeType="positive"
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <DashboardCard
            title="Renda Média"
            value="R$ 2.450"
            change="+4.1% vs ano anterior"
            changeType="positive"
            icon={<DollarSign className="h-4 w-4" />}
          />
          <DashboardCard
            title="Inflação Local"
            value="3.2%"
            change="-1.4% vs ano anterior"
            changeType="positive"
            icon={<PiggyBank className="h-4 w-4" />}
          />
          <DashboardCard
            title="Investimentos"
            value="R$ 890M"
            change="+15.2% vs ano anterior"
            changeType="positive"
            icon={<Building className="h-4 w-4" />}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
