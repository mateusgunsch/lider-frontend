"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardCard } from "@/components/dashboard-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
} from "recharts"
import { Heart, Users, Hospital, Activity, DollarSign, Clock } from "lucide-react"

const principaisCausas = [
  { cid: "J44 - DPOC", casos: 1250, percentual: 18.5 },
  { cid: "I25 - Cardiopatia Isquêmica", casos: 980, percentual: 14.5 },
  { cid: "E11 - Diabetes Mellitus", casos: 850, percentual: 12.6 },
  { cid: "N18 - Insuficiência Renal", casos: 720, percentual: 10.7 },
  { cid: "F32 - Episódio Depressivo", casos: 650, percentual: 9.6 },
]

const correlacaoSaude = [
  { custoVoto: 8.5, leitosMil: 3.2, municipio: "São Paulo", despesaCampanha: 2850000 },
  { custoVoto: 12.3, leitosMil: 2.8, municipio: "Rio de Janeiro", despesaCampanha: 4920000 },
  { custoVoto: 15.7, leitosMil: 2.1, municipio: "Salvador", despesaCampanha: 3140000 },
  { custoVoto: 6.2, leitosMil: 4.1, municipio: "Curitiba", despesaCampanha: 1850000 },
  { custoVoto: 18.9, leitosMil: 1.8, municipio: "Fortaleza", despesaCampanha: 5670000 },
  { custoVoto: 9.8, leitosMil: 3.5, municipio: "Brasília", despesaCampanha: 2940000 },
]

export default function SaudePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Sistema de Saúde</h1>
          <p className="text-muted-foreground text-pretty">
            Infraestrutura de saúde, atendimento e epidemiologia municipal
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Leitos por 1.000 hab"
            value="2.8"
            change="🟢 Acima da meta nacional (2.5)"
            changeType="positive"
            icon={<Hospital className="h-4 w-4" />}
          />
          <DashboardCard
            title="Custo Médio por Internação"
            value="R$ 1.285"
            change="🟡 +5.2% vs trimestre anterior"
            changeType="neutral"
            icon={<DollarSign className="h-4 w-4" />}
          />
          <DashboardCard
            title="Tempo Médio de Internação"
            value="4.2 dias"
            change="🟢 -0.8 dias vs trimestre anterior"
            changeType="positive"
            icon={<Clock className="h-4 w-4" />}
          />
          <DashboardCard
            title="Médicos por 1.000 hab"
            value="2.1"
            change="🟡 Abaixo da meta OMS (2.3)"
            changeType="neutral"
            icon={<Users className="h-4 w-4" />}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <DashboardCard
            title="Enfermeiros por 1.000 hab"
            value="3.5"
            change="🟢 Acima da meta nacional (3.0)"
            changeType="positive"
            icon={<Heart className="h-4 w-4" />}
          />
          <DashboardCard
            title="Taxa Ocupação Leitos"
            value="78.5%"
            change="🟡 Próximo ao limite ideal (80%)"
            changeType="neutral"
            icon={<Activity className="h-4 w-4" />}
          />
          <DashboardCard
            title="Cobertura Populacional"
            value="94.2%"
            change="🟢 Meta universal atingida"
            changeType="positive"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Principais Causas de Internação (CID)</CardTitle>
              <CardDescription>Doenças mais frequentes no sistema de saúde municipal</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={principaisCausas} layout="horizontal" margin={{ left: 100 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="cid" type="category" width={140} fontSize={12} />
                  <Tooltip
                    formatter={(value, name) => [
                      name === "casos" ? `${value} casos` : `${value}%`,
                      name === "casos" ? "Total de Casos" : "Percentual",
                    ]}
                  />
                  <Bar dataKey="casos" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Correlação: Despesa de Campanha vs Leitos</CardTitle>
              <CardDescription>Relação entre investimento político e infraestrutura de saúde</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart data={correlacaoSaude} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="despesaCampanha"
                    name="Despesa de Campanha"
                    unit="R$"
                    tickFormatter={(value) => `R$ ${(value / 1000000).toFixed(1)}M`}
                  />
                  <YAxis dataKey="leitosMil" name="Leitos/1000 hab" />
                  <Tooltip
                    formatter={(value, name) => [
                      name === "leitosMil" ? `${value} leitos/1000 hab` : `R$ ${(value / 1000000).toFixed(1)}M`,
                      name === "leitosMil" ? "Leitos por 1000 hab" : "Despesa de Campanha",
                    ]}
                    labelFormatter={(label, payload) => payload?.[0]?.payload?.municipio || ""}
                  />
                  <Scatter dataKey="leitosMil" fill="#ef4444" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <DashboardCard
            title="Total de Leitos Hospitalares"
            value="8.450"
            change="Capacidade total municipal"
            changeType="neutral"
          />
          <DashboardCard
            title="Profissionais Médicos"
            value="6.285"
            change="+185 novos registros este ano"
            changeType="positive"
          />
          <DashboardCard
            title="Profissionais Enfermeiros"
            value="10.520"
            change="+312 novos registros este ano"
            changeType="positive"
          />
          <DashboardCard
            title="Custo Total Mensal"
            value="R$ 12.8M"
            change="Gastos com internações"
            changeType="neutral"
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
