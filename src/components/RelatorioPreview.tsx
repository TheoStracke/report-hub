import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Atendimento, ResumoAtendimentos } from "@/types/atendimento";
import { Download, FileImage } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import html2canvas from "html2canvas";
import { useRef } from "react";
import { toast } from "sonner";

interface RelatorioPreviewProps {
  atendimentos: Atendimento[];
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--destructive))', 'hsl(var(--muted))'];

export const RelatorioPreview = ({ atendimentos }: RelatorioPreviewProps) => {
  const relatorioRef = useRef<HTMLDivElement>(null);

  const calcularResumo = (): ResumoAtendimentos => {
    let emissoesParceiros = 0;
    let emissoesDimas = 0;
    let emissoesOutros = 0;
    let desistencias = 0;
    let matchBiometrico = 0;
    let emissoesProximoDia = 0;
    const dificuldades: string[] = [];

    atendimentos.forEach(atendimento => {
      if (atendimento.certificadoEmitido) {
        if (atendimento.paraQuem === 'parceiro') emissoesParceiros++;
        else if (atendimento.paraQuem === 'dimas') emissoesDimas++;
        else if (atendimento.paraQuem === 'outros') emissoesOutros++;
      } else {
        if (atendimento.motivoNaoEmitido === 'desistencia') desistencias++;
        else if (atendimento.motivoNaoEmitido === 'match_biometrico') matchBiometrico++;
      }

      if (atendimento.dificuldades && atendimento.justificativaDificuldades) {
        dificuldades.push(atendimento.justificativaDificuldades);
      }

      if (atendimento.emissaoDiaSeguinte && atendimento.quantidadeProximoDia) {
        emissoesProximoDia += atendimento.quantidadeProximoDia;
      }
    });

    return {
      emissoesParceiros,
      emissoesDimas,
      emissoesOutros,
      desistencias,
      matchBiometrico,
      totalEmissoes: emissoesParceiros + emissoesDimas + emissoesOutros,
      dificuldades,
      emissoesProximoDia,
    };
  };

  const resumo = calcularResumo();

  const dadosGraficoPizza = [
    { name: 'Parceiros', value: resumo.emissoesParceiros },
    { name: 'Dimas', value: resumo.emissoesDimas },
    { name: 'Outros', value: resumo.emissoesOutros },
    { name: 'Desistências', value: resumo.desistencias },
    { name: 'Match Biométrico', value: resumo.matchBiometrico },
  ].filter(item => item.value > 0);

  const dadosGraficoBarras = [
    { name: 'Emissões', value: resumo.totalEmissoes },
    { name: 'Não Emissões', value: resumo.desistencias + resumo.matchBiometrico },
    { name: 'Próximo Dia', value: resumo.emissoesProximoDia },
  ];

  const handleDownload = async () => {
    if (!relatorioRef.current) return;

    try {
      toast.info("Gerando imagem...");
      const canvas = await html2canvas(relatorioRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
      });

      const link = document.createElement('a');
      const dataAtual = format(new Date(), "dd-MM-yyyy", { locale: ptBR });
      link.download = `relatorio-emissoes-${dataAtual}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast.success("Relatório baixado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar imagem:", error);
      toast.error("Erro ao gerar o relatório");
    }
  };

  if (atendimentos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <FileImage className="h-6 w-6" />
            Gerar Relatório
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Registre pelo menos um atendimento para gerar o relatório.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl flex items-center gap-2">
            <FileImage className="h-6 w-6" />
            Gerar Relatório
          </CardTitle>
          <Button onClick={handleDownload} size="lg">
            <Download className="mr-2 h-4 w-4" />
            Baixar PNG
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={relatorioRef} className="bg-background p-8 space-y-6">
          {/* Cabeçalho */}
          <div className="text-center border-b pb-4">
            <h2 className="text-3xl font-bold mb-2">RELATÓRIO DE EMISSÕES</h2>
            <p className="text-xl text-muted-foreground">
              {format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          </div>

          {/* Quantitativos */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold mb-4">📊 Quantitativos</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Emissões - Parceiros Indicadores</p>
                <p className="text-3xl font-bold">{resumo.emissoesParceiros}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Emissões - Dimas</p>
                <p className="text-3xl font-bold">{resumo.emissoesDimas}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Emissões - Outros</p>
                <p className="text-3xl font-bold">{resumo.emissoesOutros}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Desistências</p>
                <p className="text-3xl font-bold">{resumo.desistencias}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Match Biométrico</p>
                <p className="text-3xl font-bold">{resumo.matchBiometrico}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Emissões Próximo Dia</p>
                <p className="text-3xl font-bold">{resumo.emissoesProximoDia}</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-primary text-primary-foreground rounded-lg text-center">
              <p className="text-lg font-semibold">TOTAL DE EMISSÕES</p>
              <p className="text-5xl font-bold">{resumo.totalEmissoes}</p>
            </div>
          </div>

          {/* Dificuldades */}
          {resumo.dificuldades.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">⚠️ Dificuldades</h3>
              <ul className="list-disc list-inside space-y-1">
                {resumo.dificuldades.map((dif, idx) => (
                  <li key={idx} className="text-sm">{dif}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Gráficos */}
          <div className="grid grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="text-center font-semibold mb-2">Distribuição</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={dadosGraficoPizza}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dadosGraficoPizza.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h3 className="text-center font-semibold mb-2">Comparativo</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dadosGraficoBarras}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
