import { useState, useRef, useMemo, useEffect } from "react";
// UI Components
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// Icons
import { 
  FileDown, LayoutDashboard, TrendingUp, UserCheck, Ban, Clock,
  AlertTriangle, CalendarClock, CheckCircle2, ThumbsDown, ThumbsUp, 
  ClipboardList, X, FileText
} from "lucide-react";
// Utils & Libs
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Tooltip } from "recharts";
import * as htmlToImage from 'html-to-image';
import { toast } from "sonner";
import { cn } from "@/lib/utils";
// Types
import { Atendimento, ResumoAtendimentos, DadosRelatorio } from "@/types/atendimento";

// --- CONSTANTES & CONFIGURAÇÕES ---

const REPORT_WIDTH = 800; // Largura fixa para garantir consistência na imagem
const THEME = {
  parceiros: "#3b82f6", // Blue-500
  dimas: "#10b981",     // Emerald-500
  outros: "#8b5cf6",    // Violet-500
  desistencias: "#ef4444", // Red-500
  match: "#f59e0b",     // Amber-500
  text: "#1e293b",      // Slate-800
  bg: "#ffffff",
};

const PIE_COLORS = [THEME.parceiros, THEME.dimas, THEME.outros, THEME.desistencias, THEME.match];

// --- SUB-COMPONENTES ---

/**
 * Dialog para preenchimento de dados complementares
 */
const RelatorioDialog = ({ 
  open, 
  onOpenChange, 
  onConfirm 
}: { 
  open: boolean; 
  onOpenChange: (o: boolean) => void; 
  onConfirm: (d: DadosRelatorio) => void; 
}) => {
  const [dificuldades, setDificuldades] = useState<boolean | null>(null);
  const [justificativa, setJustificativa] = useState("");
  const [temAgendamento, setTemAgendamento] = useState<boolean | null>(null);
  const [qtdProximoDia, setQtdProximoDia] = useState("");

  // Reseta o estado ao abrir
  useEffect(() => {
    if (open) {
      setDificuldades(null);
      setJustificativa("");
      setTemAgendamento(null);
      setQtdProximoDia("");
    }
  }, [open]);

  const handleSubmit = () => {
    if (dificuldades === null || temAgendamento === null) {
      toast.error("Por favor, responda todas as perguntas.");
      return;
    }
    if (dificuldades && !justificativa.trim()) {
      toast.error("Descreva a dificuldade encontrada.");
      return;
    }
    if (temAgendamento && (!qtdProximoDia || parseInt(qtdProximoDia) <= 0)) {
      toast.error("Informe a quantidade para amanhã.");
      return;
    }

    onConfirm({
      dificuldades,
      justificativaDificuldades: dificuldades ? justificativa : undefined,
      emissaoDiaSeguinte: temAgendamento,
      quantidadeProximoDia: temAgendamento ? parseInt(qtdProximoDia) : undefined,
    });
  };

  const SelectionOption = ({ selected, onClick, icon: Icon, label, color }: any) => (
    <div
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center gap-2 transition-all hover:bg-slate-50",
        selected ? `border-${color}-500 bg-${color}-50 ring-1 ring-${color}-500` : "border-slate-200 text-slate-500"
      )}
    >
      <Icon className={cn("h-6 w-6", selected ? `text-${color}-600` : "text-slate-400")} />
      <span className={cn("font-medium text-sm", selected ? `text-${color}-700` : "text-slate-600")}>{label}</span>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Complemento do Relatório
          </DialogTitle>
          <DialogDescription>Dados finais para o fechamento do dia.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Pergunta 1 */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Houve dificuldades operacionais?
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <SelectionOption selected={dificuldades === false} onClick={() => setDificuldades(false)} icon={ThumbsUp} label="Não, tudo certo" color="emerald" />
              <SelectionOption selected={dificuldades === true} onClick={() => setDificuldades(true)} icon={ThumbsDown} label="Sim, tive problemas" color="amber" />
            </div>
            {dificuldades && (
              <Textarea 
                placeholder="Descreva o problema (ex: sistema lento, falta de luz...)" 
                value={justificativa} 
                onChange={e => setJustificativa(e.target.value)} 
                className="mt-2 border-amber-200 focus-visible:ring-amber-500"
              />
            )}
          </div>

          <div className="h-px bg-slate-100" />

          {/* Pergunta 2 */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-base">
              <CalendarClock className="h-4 w-4 text-blue-500" />
              Previsão para amanhã?
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <SelectionOption selected={temAgendamento === false} onClick={() => setTemAgendamento(false)} icon={X} label="Sem agendamentos" color="slate" />
              <SelectionOption selected={temAgendamento === true} onClick={() => setTemAgendamento(true)} icon={CheckCircle2} label="Há agendamentos" color="blue" />
            </div>
            {temAgendamento && (
              <div className="flex items-center gap-2 mt-2">
                <Label>Quantidade:</Label>
                <Input 
                  type="number" 
                  className="w-24 border-blue-200" 
                  value={qtdProximoDia} 
                  onChange={e => setQtdProximoDia(e.target.value)} 
                  autoFocus 
                />
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}>Gerar Relatório</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/**
 * Card Simples de KPI
 */
const KpiCard = ({ icon: Icon, title, value, colorClass, bgClass }: any) => (
  <div className={`p-4 rounded-lg border border-slate-200 ${bgClass} flex flex-col justify-between h-24`}>
    <div className={`flex items-center gap-2 ${colorClass}`}>
      <Icon className="h-4 w-4" />
      <span className="text-[10px] font-bold uppercase tracking-wider">{title}</span>
    </div>
    <p className="text-3xl font-extrabold text-slate-800 mt-1">{value}</p>
  </div>
);

// --- COMPONENTE PRINCIPAL ---

export const RelatorioPreview = ({ atendimentos }: { atendimentos: Atendimento[] }) => {
  const relatorioRef = useRef<HTMLDivElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dadosComplementares, setDadosComplementares] = useState<DadosRelatorio | null>(null);

  // Lógica de cálculo (Memoizada)
  const resumo = useMemo((): ResumoAtendimentos => {
    let parceiros = 0, dimas = 0, outros = 0, desistencias = 0, match = 0;

    atendimentos.forEach(a => {
      if (a.certificadoEmitido) {
        if (a.paraQuem === 'parceiro') parceiros++;
        else if (a.paraQuem === 'dimas') dimas++;
        else if (a.paraQuem === 'outros') outros++;
      } else {
        if (a.motivoNaoEmitido === 'desistencia') desistencias++;
        else if (a.motivoNaoEmitido === 'match_biometrico') match++;
      }
    });

    return {
      emissoesParceiros: parceiros,
      emissoesDimas: dimas,
      emissoesOutros: outros,
      desistencias,
      matchBiometrico: match,
      totalEmissoes: parceiros + dimas + outros,
      dificuldades: dadosComplementares?.justificativaDificuldades ? [dadosComplementares.justificativaDificuldades] : [],
      emissoesProximoDia: dadosComplementares?.quantidadeProximoDia || 0,
    };
  }, [atendimentos, dadosComplementares]);

  // Dados para Gráficos
  const dataPie = [
    { name: 'Parceiros', value: resumo.emissoesParceiros },
    { name: 'Dimas', value: resumo.emissoesDimas },
    { name: 'Outros', value: resumo.emissoesOutros },
    { name: 'Desistências', value: resumo.desistencias },
    { name: 'Match Bio.', value: resumo.matchBiometrico },
  ].filter(i => i.value > 0);

  const dataBar = [
    { name: 'Emitidos', value: resumo.totalEmissoes, fill: THEME.dimas },
    { name: 'Não Emitidos', value: resumo.desistencias + resumo.matchBiometrico, fill: THEME.desistencias },
    { name: 'Próx. Dia', value: resumo.emissoesProximoDia, fill: THEME.parceiros },
  ];

  // Handlers
  const handleStartProcess = () => {
    if (atendimentos.length === 0) return toast.error("Sem dados para gerar relatório.");
    setDialogOpen(true);
  };

  const handleDownload = async () => {
    if (!relatorioRef.current || !htmlToImage) return;

    try {
      toast.loading("Gerando imagem de alta resolução...");
      const node = relatorioRef.current;
      
      // FIX CRUCIAL: Captura a altura total do scroll, não apenas a visível
      const scrollHeight = node.scrollHeight;
      const scrollWidth = node.scrollWidth;

      const dataUrl = await htmlToImage.toPng(node, {
        backgroundColor: '#ffffff',
        width: scrollWidth,
        height: scrollHeight + 40, // +40px margem de segurança
        quality: 1.0,
        pixelRatio: 3, // Alta resolução (Retina)
        style: {
          transform: 'none',
          margin: '0',
          height: `${scrollHeight}px`, // Força altura explicita
          maxHeight: 'none',
          overflow: 'visible'
        }
      });

      const link = document.createElement('a');
      link.download = `relatorio-${format(new Date(), "yyyy-MM-dd")}.png`;
      link.href = dataUrl;
      link.click();
      toast.dismiss();
      toast.success("Imagem gerada com sucesso!");
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error("Erro ao processar imagem.");
    }
  };

  return (
    <>
      <Card className="border-muted/60 shadow-sm bg-slate-50/50">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100 bg-white rounded-t-lg">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
              <FileText className="h-5 w-5 text-primary" />
              Pré-visualização do Relatório
            </CardTitle>
            <CardDescription>Revise os dados antes de exportar.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleStartProcess}>
              {dadosComplementares ? "Editar Dados" : "Preencher Dados"}
            </Button>
            <Button size="sm" onClick={handleDownload} disabled={!dadosComplementares} className="bg-primary text-white">
              <FileDown className="mr-2 h-4 w-4" />
              Baixar PNG
            </Button>
          </div>
        </CardHeader>

        {/* WRAPPER VISUAL
          - items-center: Centraliza o "papel"
          - h-auto / min-h-0: Permite crescimento infinito (evita scroll interno)
          - py-8: Dá respiro superior/inferior na tela cinza
        */}
        <CardContent className="flex flex-col items-center py-8 px-4 h-auto min-h-0 overflow-visible">
          
          {dadosComplementares ? (
            <div 
              ref={relatorioRef}
              className="bg-white shadow-2xl border border-slate-200 text-slate-800 relative"
              style={{ 
                width: `${REPORT_WIDTH}px`,
                minHeight: '1000px', // Simula altura mínima de A4
                fontFamily: 'Arial, Helvetica, sans-serif'
              }}
            >
              {/* === CABEÇALHO DO DOCUMENTO === */}
              <div className="p-8 pb-4 border-b-4 border-slate-800 flex justify-between items-end bg-slate-50">
                <div>
                  <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Relatório<br/>Diário</h1>
                  <span className="inline-block mt-2 px-2 py-0.5 bg-slate-800 text-white text-xs font-bold uppercase rounded">
                    Produção e Emissões
                  </span>
                </div>
                <div className="text-right">
                   <p className="text-[10px] uppercase text-slate-400 font-bold tracking-widest mb-1">Data de Referência</p>
                   <p className="text-2xl font-bold text-slate-800 tabular-nums">
                     {format(new Date(), "dd/MM/yyyy")}
                   </p>
                </div>
              </div>

              {/* === CORPO DO DOCUMENTO === */}
              <div className="p-8 space-y-8">
                
                {/* 1. KPIs */}
                <section>
                   <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Indicadores Principais</h2>
                   <div className="grid grid-cols-4 gap-4">
                      <KpiCard icon={TrendingUp} title="Total Emitidos" value={resumo.totalEmissoes} colorClass="text-blue-600" bgClass="bg-blue-50/50" />
                      <KpiCard icon={UserCheck} title="Dimas" value={resumo.emissoesDimas} colorClass="text-emerald-600" bgClass="bg-emerald-50/50" />
                      <KpiCard icon={Ban} title="Não Emitidos" value={resumo.desistencias + resumo.matchBiometrico} colorClass="text-red-600" bgClass="bg-red-50/50" />
                      <KpiCard icon={Clock} title="Prev. Amanhã" value={resumo.emissoesProximoDia} colorClass="text-slate-600" bgClass="bg-slate-50/50" />
                   </div>
                </section>

                {/* 2. GRÁFICOS */}
                <section className="grid grid-cols-2 gap-8 h-72">
                  <div className="border border-slate-100 rounded-xl p-4 shadow-sm bg-white flex flex-col">
                    <h3 className="text-xs font-bold text-center text-slate-500 uppercase mb-4 pb-2 border-b border-slate-50">Distribuição</h3>
                    <div className="flex-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={dataPie}
                            cx="50%" cy="50%"
                            innerRadius={50} outerRadius={70}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {dataPie.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} strokeWidth={0} />
                            ))}
                          </Pie>
                          <Legend verticalAlign="bottom" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="border border-slate-100 rounded-xl p-4 shadow-sm bg-white flex flex-col">
                     <h3 className="text-xs font-bold text-center text-slate-500 uppercase mb-4 pb-2 border-b border-slate-50">Comparativo</h3>
                     <div className="flex-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dataBar} layout="vertical" margin={{ left: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                            {dataBar.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                     </div>
                  </div>
                </section>

                {/* 3. DETALHAMENTO TEXTUAL */}
                <section className="grid grid-cols-2 gap-8 pt-4">
                  {/* Tabela de Dificuldades */}
                  <div>
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                       Ocorrências / Dificuldades
                    </h2>
                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 min-h-[100px]">
                      {resumo.dificuldades.length > 0 ? (
                        <ul className="list-disc list-inside text-sm text-slate-700 space-y-2">
                          {resumo.dificuldades.map((dif, idx) => (
                            <li key={idx} className="leading-snug">{dif}</li>
                          ))}
                        </ul>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-1 opacity-70">
                           <CheckCircle2 className="h-6 w-6" />
                           <span className="text-xs italic">Sem ocorrências</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Resumo Numérico */}
                  <div>
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                       Detalhamento
                    </h2>
                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 min-h-[100px] text-sm flex flex-col gap-2">
                      <div className="flex justify-between border-b border-slate-200 pb-1">
                        <span className="text-slate-500">Total Parceiros</span>
                        <span className="font-bold text-slate-800">{resumo.emissoesParceiros}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-1">
                        <span className="text-slate-500">Total Outros</span>
                        <span className="font-bold text-slate-800">{resumo.emissoesOutros}</span>
                      </div>
                      <div className="flex justify-between pt-1">
                        <span className="text-slate-500">Taxa de Sucesso</span>
                        <span className="font-bold text-emerald-600">
                          {resumo.totalEmissoes > 0 
                            ? Math.round((resumo.totalEmissoes / (resumo.totalEmissoes + resumo.desistencias + resumo.matchBiometrico)) * 100) 
                            : 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* === RODAPÉ DO DOCUMENTO === */}
              <div className="absolute bottom-0 w-full p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-widest">
                <span>Relatório Gerado Automaticamente</span>
                <span>{format(new Date(), "HH:mm '•' dd MMMM yyyy", { locale: ptBR })}</span>
              </div>
            </div>
          ) : (
            // EMPTY STATE (Tela inicial antes de preencher)
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-50">
              <div className="bg-slate-100 p-4 rounded-full">
                <LayoutDashboard className="h-10 w-10 text-slate-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-900">Nenhum relatório gerado</h3>
                <p className="text-sm text-slate-500">Clique em "Preencher Dados" para começar.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <RelatorioDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        onConfirm={(dados) => { setDadosComplementares(dados); setDialogOpen(false); }} 
      />
    </>
  );
};