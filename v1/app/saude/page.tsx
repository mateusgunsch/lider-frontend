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
  { cid: "J44 - DPOC", casos: 1250 },
  { cid: "I25 - Cardiopatia", casos: 980 },
  { cid: "E11 - Diabetes", casos: 850 },
  { cid: "N18 - Insuf. Renal", casos: 720 },
  { cid: "F32 - Depressão", casos: 650 },
]

const correlacaoSaude = [
  { custoVoto: 8.5, leitosMil: 3.2, municipio: "São Paulo" },
  { custoVoto: 12.3, leitosMil: 2.8, municipio: "Rio de Janeiro" },
  { custoVoto: 15.7, leitosMil: 2.1, municipio: "Salvador" },
  { custoVoto: 6.2, leitosMil: 4.1, municipio: "Curitiba" },
  { custoVoto: 18.9, leitosMil: 1.8, municipio: "Fortaleza" },
  { custoVoto: 9.8, leitosMil: 3.5, municipio: "Brasília" },
]

export default function SaudePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Sistema de Saúde</h1>
          <p className="text-muted-foreground text-pretty">
            Monitoramento da infraestrutura de saúde e indicadores médicos
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Leitos por 1.000 hab"
            value="2.8"
            change="+0.2 vs trimestre anterior"
            changeType="positive"
            icon={<Hospital className="h-4 w-4" />}
          />
          <DashboardCard
            title="Custo Médio/Paciente/Dia"
            value="R$ 285"
            change="-5.2% vs trimestre anterior"
            changeType="positive"
            icon={<DollarSign className="h-4 w-4" />}
          />
          <DashboardCard
            title="Tempo Médio Internação"
            value="4.2 dias"
            change="-0.8 dias vs trimestre anterior"
            changeType="positive"
            icon={<Clock className="h-4 w-4" />}
          />
          <DashboardCard
            title="Profissionais/1.000 hab"
            value="3.5"
            change="+0.3 vs ano anterior"
            changeType="positive"
            icon={<Users className="h-4 w-4" />}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <DashboardCard
            title="Cobertura SUS"
            value="92.1%"
            change="🟢 Acima da meta nacional (85%)"
            changeType="positive"
            icon={<Heart className="h-4 w-4" />}
          />
          <DashboardCard
            title="Taxa Ocupação Leitos"
            value="78.5%"
            change="🟡 Próximo ao limite (80%)"
            changeType="neutral"
            icon={<Activity className="h-4 w-4" />}
          />
          <DashboardCard
            title="Mortalidade Infantil"
            value="12.4‰"
            change="🟢 Abaixo da média nacional (14‰)"
            changeType="positive"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Principais Causas de Internação (CID)</CardTitle>
              <CardDescription>Doenças mais frequentes registradas</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={principaisCausas} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="cid" type="category" width={120} />
                  <Tooltip />
                  <Bar dataKey="casos" fill="hsl(var(--chart-2))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Correlação: Custo por Voto vs Leitos</CardTitle>
              <CardDescription>Relação entre investimento em campanha e infraestrutura de saúde</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart data={correlacaoSaude}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="custoVoto" name="Custo por Voto" unit="R$" />
                  <YAxis dataKey="leitosMil" name="Leitos/1000 hab" />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter dataKey="leitosMil" fill="hsl(var(--chart-2))" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <DashboardCard
            title="Unidades Básicas"
            value="1.245"
            change="+28 novas unidades este ano"
            changeType="positive"
          />
          <DashboardCard
            title="Hospitais Públicos"
            value="89"
            change="Cobertura de 100% dos distritos"
            changeType="neutral"
          />
          <DashboardCard title="Médicos Ativos" value="2.850" change="+5.2% vs ano anterior" changeType="positive" />
          <DashboardCard
            title="Enfermeiros Ativos"
            value="4.120"
            change="+3.8% vs ano anterior"
            changeType="positive"
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
