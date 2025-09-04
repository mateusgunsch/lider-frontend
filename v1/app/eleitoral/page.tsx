"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardCard } from "@/components/dashboard-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts"
import { Vote, Users, MapPin, TrendingUp, DollarSign } from "lucide-react"

const resultadoEleicao = [
  { name: "Partido A", votos: 45000, percentual: 35, color: "hsl(var(--chart-1))" },
  { name: "Partido B", votos: 32000, percentual: 25, color: "hsl(var(--chart-2))" },
  { name: "Partido C", votos: 28000, percentual: 22, color: "hsl(var(--chart-3))" },
  { name: "Partido D", votos: 23000, percentual: 18, color: "hsl(var(--chart-4))" },
]

const zonaEleitoral = [
  { zona: "Zona 1", partidoA: 40, partidoB: 30, partidoC: 20, partidoD: 10 },
  { zona: "Zona 2", partidoA: 25, partidoB: 35, partidoC: 25, partidoD: 15 },
  { zona: "Zona 3", partidoA: 45, partidoB: 20, partidoC: 25, partidoD: 10 },
  { zona: "Zona 4", partidoA: 30, partidoB: 40, partidoC: 20, partidoD: 10 },
]

const perfilEleitorado = [
  { escolaridade: "Fundamental", partidoA: 35, partidoB: 25, partidoC: 25, partidoD: 15 },
  { escolaridade: "Médio", partidoA: 30, partidoB: 30, partidoC: 25, partidoD: 15 },
  { escolaridade: "Superior", partidoA: 40, partidoB: 20, partidoC: 30, partidoD: 10 },
  { escolaridade: "Pós-Grad", partidoA: 45, partidoB: 15, partidoC: 30, partidoD: 10 },
]

export default function EleitoralPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Dados Eleitorais</h1>
          <p className="text-muted-foreground text-pretty">
            Análise completa dos processos eleitorais e participação cidadã
          </p>
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
            change="Votos válidos computados"
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
            title="Seções Eleitorais"
            value="245"
            change="100% cobertura territorial"
            changeType="neutral"
            icon={<MapPin className="h-4 w-4" />}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Resultado da Última Eleição</CardTitle>
              <CardDescription>Distribuição de votos para prefeito</CardDescription>
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
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Zona Eleitoral</CardTitle>
              <CardDescription>Partido mais votado por zona (simulação de mapa coroplético)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={zonaEleitoral}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="zona" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="partidoA" stackId="a" fill="hsl(var(--chart-1))" name="Partido A" />
                  <Bar dataKey="partidoB" stackId="a" fill="hsl(var(--chart-2))" name="Partido B" />
                  <Bar dataKey="partidoC" stackId="a" fill="hsl(var(--chart-3))" name="Partido C" />
                  <Bar dataKey="partidoD" stackId="a" fill="hsl(var(--chart-4))" name="Partido D" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Perfil do Eleitorado por Escolaridade</CardTitle>
            <CardDescription>Distribuição de votos por nível educacional dos eleitores</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={perfilEleitorado}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="escolaridade" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="partidoA" stackId="a" fill="hsl(var(--chart-1))" name="Partido A" />
                <Bar dataKey="partidoB" stackId="a" fill="hsl(var(--chart-2))" name="Partido B" />
                <Bar dataKey="partidoC" stackId="a" fill="hsl(var(--chart-3))" name="Partido C" />
                <Bar dataKey="partidoD" stackId="a" fill="hsl(var(--chart-4))" name="Partido D" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-4">
          <DashboardCard
            title="Eleitores Aptos"
            value="164.2K"
            change="+3.2% vs última eleição"
            changeType="positive"
          />
          <DashboardCard title="Votos Brancos" value="3.2%" change="-0.5% vs eleição anterior" changeType="positive" />
          <DashboardCard title="Votos Nulos" value="2.6%" change="-1.0% vs eleição anterior" changeType="positive" />
          <DashboardCard title="Urnas Eletrônicas" value="245" change="100% funcionamento" changeType="neutral" />
        </div>
      </div>
    </DashboardLayout>
  )
}
