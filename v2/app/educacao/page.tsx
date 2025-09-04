"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardCard } from "@/components/dashboard-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts"
import { GraduationCap, Users, BookOpen, School, Wifi, UserCheck } from "lucide-react"

const evasaoPorBairro = [
  { bairro: "Centro", evasao: 1.8 },
  { bairro: "Norte", evasao: 3.2 },
  { bairro: "Sul", evasao: 2.1 },
  { bairro: "Leste", evasao: 4.5 },
  { bairro: "Oeste", evasao: 2.8 },
]

const razaoProfessorAluno = [
  { bairro: "Centro", razao: 18 },
  { bairro: "Norte", razao: 25 },
  { bairro: "Sul", razao: 20 },
  { bairro: "Leste", razao: 28 },
  { bairro: "Oeste", razao: 22 },
]

const escolasInfraestrutura = [
  { escola: "E.M. João Silva", agua: true, luz: true, internet: true },
  { escola: "E.M. Maria Santos", agua: true, luz: true, internet: false },
  { escola: "E.M. Pedro Costa", agua: false, luz: true, internet: false },
  { escola: "E.M. Ana Oliveira", agua: true, luz: true, internet: true },
  { escola: "E.M. Carlos Lima", agua: true, luz: false, internet: false },
]

export default function EducacaoPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Sistema Educacional</h1>
          <p className="text-muted-foreground text-pretty">Indicadores de qualidade e infraestrutura educacional</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Nota Média (IDEB)"
            value="6.2"
            change="+0.3 vs avaliação anterior"
            changeType="positive"
            icon={<GraduationCap className="h-4 w-4" />}
          />
          <DashboardCard
            title="Taxa de Evasão (%)"
            value="2.8%"
            change="-0.7% vs ano anterior"
            changeType="positive"
            icon={<Users className="h-4 w-4" />}
          />
          <DashboardCard
            title="Razão Professor/Aluno"
            value="1:22"
            change="Dentro da meta nacional (1:25)"
            changeType="positive"
            icon={<UserCheck className="h-4 w-4" />}
          />
          <DashboardCard
            title="% Escolas c/ Infraestrutura"
            value="87.5%"
            change="+12.3% vs ano anterior"
            changeType="positive"
            icon={<School className="h-4 w-4" />}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>IDEB - Índice de Desenvolvimento da Educação Básica</CardTitle>
            <CardDescription>Meta nacional: 6.0 | Meta municipal: 6.5</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center space-x-8 py-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">6.2</div>
                <div className="text-sm text-muted-foreground">Atual</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-blue-600">6.0</div>
                <div className="text-sm text-muted-foreground">Meta Nacional</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-purple-600">6.5</div>
                <div className="text-sm text-muted-foreground">Meta Municipal</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div className="bg-green-600 h-4 rounded-full" style={{ width: "93%" }}></div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-2">
              🟢 Acima da meta nacional | 🟡 Próximo à meta municipal
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Taxa de Evasão por Bairro</CardTitle>
              <CardDescription>Comparação entre distritos do município</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={evasaoPorBairro}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bairro" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="evasao" fill="hsl(var(--chart-3))">
                    {evasaoPorBairro.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.evasao > 3 ? "hsl(var(--destructive))" : "hsl(var(--chart-3))"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Razão Professor/Aluno por Bairro</CardTitle>
              <CardDescription>Número de alunos por professor</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={razaoProfessorAluno}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bairro" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="razao" fill="hsl(var(--chart-4))">
                    {razaoProfessorAluno.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.razao > 25 ? "hsl(var(--destructive))" : "hsl(var(--chart-4))"}
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
            <CardTitle>Infraestrutura das Escolas Municipais</CardTitle>
            <CardDescription>Status da infraestrutura básica por unidade escolar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Escola</th>
                    <th className="text-center p-2">Água</th>
                    <th className="text-center p-2">Energia</th>
                    <th className="text-center p-2">Internet</th>
                  </tr>
                </thead>
                <tbody>
                  {escolasInfraestrutura.map((escola, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2 font-medium">{escola.escola}</td>
                      <td className="text-center p-2">
                        <span
                          className={`inline-block w-4 h-4 rounded-full ${escola.agua ? "bg-green-500" : "bg-red-500"}`}
                        ></span>
                      </td>
                      <td className="text-center p-2">
                        <span
                          className={`inline-block w-4 h-4 rounded-full ${escola.luz ? "bg-green-500" : "bg-red-500"}`}
                        ></span>
                      </td>
                      <td className="text-center p-2">
                        <span
                          className={`inline-block w-4 h-4 rounded-full ${escola.internet ? "bg-green-500" : "bg-red-500"}`}
                        ></span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 rounded-full bg-green-500"></span>
                <span>Disponível</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 rounded-full bg-red-500"></span>
                <span>Indisponível</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-4">
          <DashboardCard
            title="Escolas Municipais"
            value="156"
            change="+8 novas escolas este ano"
            changeType="positive"
            icon={<School className="h-4 w-4" />}
          />
          <DashboardCard
            title="Professores Ativos"
            value="2.240"
            change="+3.1% vs ano anterior"
            changeType="positive"
            icon={<Users className="h-4 w-4" />}
          />
          <DashboardCard
            title="Alunos Matriculados"
            value="48.650"
            change="+1.2% vs ano anterior"
            changeType="positive"
            icon={<BookOpen className="h-4 w-4" />}
          />
          <DashboardCard
            title="Conectividade"
            value="87.5%"
            change="Escolas com internet banda larga"
            changeType="positive"
            icon={<Wifi className="h-4 w-4" />}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
