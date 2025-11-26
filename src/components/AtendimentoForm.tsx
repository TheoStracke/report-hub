import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Atendimento } from "@/types/atendimento";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

interface AtendimentoFormProps {
  onAddAtendimento: (atendimento: Atendimento) => void;
}

export const AtendimentoForm = ({ onAddAtendimento }: AtendimentoFormProps) => {
  const [certificadoEmitido, setCertificadoEmitido] = useState<boolean | null>(null);
  const [paraQuem, setParaQuem] = useState<'parceiro' | 'dimas' | 'outros' | null>(null);
  const [quemOutros, setQuemOutros] = useState("");
  const [tipoOutros, setTipoOutros] = useState<'agr_indisponivel' | 'emissao_interna' | 'cliente_final' | null>(null);
  const [motivoNaoEmitido, setMotivoNaoEmitido] = useState<'desistencia' | 'match_biometrico' | null>(null);
  const [dificuldades, setDificuldades] = useState<boolean | null>(null);
  const [justificativaDificuldades, setJustificativaDificuldades] = useState("");
  const [emissaoDiaSeguinte, setEmissaoDiaSeguinte] = useState<boolean | null>(null);
  const [quantidadeProximoDia, setQuantidadeProximoDia] = useState("");

  const resetForm = () => {
    setCertificadoEmitido(null);
    setParaQuem(null);
    setQuemOutros("");
    setTipoOutros(null);
    setMotivoNaoEmitido(null);
    setDificuldades(null);
    setJustificativaDificuldades("");
    setEmissaoDiaSeguinte(null);
    setQuantidadeProximoDia("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (certificadoEmitido === null || dificuldades === null || emissaoDiaSeguinte === null) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (certificadoEmitido && !paraQuem) {
      toast.error("Selecione para quem foi emitido");
      return;
    }

    if (paraQuem === 'outros' && (!quemOutros || !tipoOutros)) {
      toast.error("Preencha os campos de 'Outros'");
      return;
    }

    if (!certificadoEmitido && !motivoNaoEmitido) {
      toast.error("Selecione o motivo da não emissão");
      return;
    }

    if (dificuldades && !justificativaDificuldades.trim()) {
      toast.error("Justifique as dificuldades");
      return;
    }

    if (emissaoDiaSeguinte && (!quantidadeProximoDia || parseInt(quantidadeProximoDia) <= 0)) {
      toast.error("Informe a quantidade para o dia seguinte");
      return;
    }

    const novoAtendimento: Atendimento = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      certificadoEmitido,
      paraQuem: certificadoEmitido ? paraQuem! : undefined,
      quemOutros: paraQuem === 'outros' ? quemOutros : undefined,
      tipoOutros: paraQuem === 'outros' ? tipoOutros! : undefined,
      motivoNaoEmitido: !certificadoEmitido ? motivoNaoEmitido! : undefined,
      dificuldades,
      justificativaDificuldades: dificuldades ? justificativaDificuldades : undefined,
      emissaoDiaSeguinte,
      quantidadeProximoDia: emissaoDiaSeguinte ? parseInt(quantidadeProximoDia) : undefined,
    };

    onAddAtendimento(novoAtendimento);
    resetForm();
    toast.success("Atendimento registrado com sucesso!");
  };

  return (
    <Card className="w-full shadow-lg border-0">
      <CardHeader className="space-y-2 pb-8">
        <CardTitle className="text-3xl font-bold text-foreground">
          Registrar Atendimento
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Preencha as informações do atendimento realizado
        </p>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Seção 1: Certificado Emitido */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                1
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Certificado emitido?
              </h3>
            </div>

            <RadioGroup 
              value={certificadoEmitido?.toString()} 
              onValueChange={(v) => {
                setCertificadoEmitido(v === "true");
                setParaQuem(null);
                setMotivoNaoEmitido(null);
                setQuemOutros("");
                setTipoOutros(null);
              }}
              className="space-y-3 pl-11"
            >
              <label 
                htmlFor="cert-sim" 
                className="flex items-center space-x-3 p-4 rounded-xl border-2 border-border hover:border-primary/50 hover:bg-accent/30 cursor-pointer transition-all duration-200 group"
              >
                <RadioGroupItem value="true" id="cert-sim" className="mt-0" />
                <span className="text-base font-medium group-hover:text-primary transition-colors">
                  Sim
                </span>
              </label>
              <label 
                htmlFor="cert-nao" 
                className="flex items-center space-x-3 p-4 rounded-xl border-2 border-border hover:border-primary/50 hover:bg-accent/30 cursor-pointer transition-all duration-200 group"
              >
                <RadioGroupItem value="false" id="cert-nao" className="mt-0" />
                <span className="text-base font-medium group-hover:text-primary transition-colors">
                  Não
                </span>
              </label>
            </RadioGroup>

            {/* Subseção: Para quem? */}
            {certificadoEmitido === true && (
              <div className="pl-11 animate-fade-in">
                <div className="bg-accent/20 rounded-2xl p-6 space-y-5 border border-border/50">
                  <h4 className="text-lg font-semibold text-foreground mb-4">
                    Para quem?
                  </h4>
                  
                  <RadioGroup 
                    value={paraQuem || ""} 
                    onValueChange={(v: any) => {
                      setParaQuem(v);
                      if (v !== 'outros') {
                        setQuemOutros("");
                        setTipoOutros(null);
                      }
                    }}
                    className="space-y-3"
                  >
                    <label 
                      htmlFor="parceiro" 
                      className="flex items-center space-x-3 p-4 rounded-xl border-2 border-border bg-background hover:border-primary/50 hover:bg-accent/30 cursor-pointer transition-all duration-200 group"
                    >
                      <RadioGroupItem value="parceiro" id="parceiro" className="mt-0" />
                      <span className="text-base font-medium group-hover:text-primary transition-colors">
                        Parceiro
                      </span>
                    </label>
                    <label 
                      htmlFor="dimas" 
                      className="flex items-center space-x-3 p-4 rounded-xl border-2 border-border bg-background hover:border-primary/50 hover:bg-accent/30 cursor-pointer transition-all duration-200 group"
                    >
                      <RadioGroupItem value="dimas" id="dimas" className="mt-0" />
                      <span className="text-base font-medium group-hover:text-primary transition-colors">
                        Dimas
                      </span>
                    </label>
                    <label 
                      htmlFor="outros" 
                      className="flex items-center space-x-3 p-4 rounded-xl border-2 border-border bg-background hover:border-primary/50 hover:bg-accent/30 cursor-pointer transition-all duration-200 group"
                    >
                      <RadioGroupItem value="outros" id="outros" className="mt-0" />
                      <span className="text-base font-medium group-hover:text-primary transition-colors">
                        Outros
                      </span>
                    </label>
                  </RadioGroup>

                  {/* Subseção: Outros */}
                  {paraQuem === 'outros' && (
                    <div className="mt-5 animate-fade-in">
                      <div className="bg-background rounded-xl p-6 space-y-5 border-2 border-border">
                        <div className="space-y-3">
                          <Label htmlFor="quem-outros" className="text-base font-semibold text-foreground">
                            Quem?
                          </Label>
                          <Input 
                            id="quem-outros"
                            value={quemOutros}
                            onChange={(e) => setQuemOutros(e.target.value)}
                            placeholder="Digite o nome da pessoa..."
                            className="h-12 text-base border-2 focus:border-primary transition-colors"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label className="text-base font-semibold text-foreground">
                            Tipo de emissão
                          </Label>
                          <RadioGroup 
                            value={tipoOutros || ""} 
                            onValueChange={(v: any) => setTipoOutros(v)}
                            className="space-y-3"
                          >
                            <label 
                              htmlFor="agr" 
                              className="flex items-center space-x-3 p-3 rounded-lg border-2 border-border hover:border-primary/50 hover:bg-accent/30 cursor-pointer transition-all duration-200 group"
                            >
                              <RadioGroupItem value="agr_indisponivel" id="agr" className="mt-0" />
                              <span className="text-sm font-medium group-hover:text-primary transition-colors">
                                AGR indisponível
                              </span>
                            </label>
                            <label 
                              htmlFor="interna" 
                              className="flex items-center space-x-3 p-3 rounded-lg border-2 border-border hover:border-primary/50 hover:bg-accent/30 cursor-pointer transition-all duration-200 group"
                            >
                              <RadioGroupItem value="emissao_interna" id="interna" className="mt-0" />
                              <span className="text-sm font-medium group-hover:text-primary transition-colors">
                                Emissão interna
                              </span>
                            </label>
                            <label 
                              htmlFor="cliente" 
                              className="flex items-center space-x-3 p-3 rounded-lg border-2 border-border hover:border-primary/50 hover:bg-accent/30 cursor-pointer transition-all duration-200 group"
                            >
                              <RadioGroupItem value="cliente_final" id="cliente" className="mt-0" />
                              <span className="text-sm font-medium group-hover:text-primary transition-colors">
                                Cliente final
                              </span>
                            </label>
                          </RadioGroup>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Subseção: Motivo não emissão */}
            {certificadoEmitido === false && (
              <div className="pl-11 animate-fade-in">
                <div className="bg-destructive/5 rounded-2xl p-6 space-y-5 border border-destructive/20">
                  <h4 className="text-lg font-semibold text-foreground mb-4">
                    Qual o motivo?
                  </h4>
                  
                  <RadioGroup 
                    value={motivoNaoEmitido || ""} 
                    onValueChange={(v: any) => setMotivoNaoEmitido(v)}
                    className="space-y-3"
                  >
                    <label 
                      htmlFor="desistencia" 
                      className="flex items-center space-x-3 p-4 rounded-xl border-2 border-border bg-background hover:border-destructive/50 hover:bg-destructive/5 cursor-pointer transition-all duration-200 group"
                    >
                      <RadioGroupItem value="desistencia" id="desistencia" className="mt-0" />
                      <span className="text-base font-medium group-hover:text-destructive transition-colors">
                        Desistência
                      </span>
                    </label>
                    <label 
                      htmlFor="match" 
                      className="flex items-center space-x-3 p-4 rounded-xl border-2 border-border bg-background hover:border-destructive/50 hover:bg-destructive/5 cursor-pointer transition-all duration-200 group"
                    >
                      <RadioGroupItem value="match_biometrico" id="match" className="mt-0" />
                      <span className="text-base font-medium group-hover:text-destructive transition-colors">
                        Match biométrico
                      </span>
                    </label>
                  </RadioGroup>
                </div>
              </div>
            )}
          </div>

          {/* Seção 2: Dificuldades */}
          <div className="space-y-6 pt-6 border-t border-border/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                2
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Dificuldades?
              </h3>
            </div>

            <RadioGroup 
              value={dificuldades?.toString()} 
              onValueChange={(v) => {
                setDificuldades(v === "true");
                if (v === "false") setJustificativaDificuldades("");
              }}
              className="space-y-3 pl-11"
            >
              <label 
                htmlFor="dif-sim" 
                className="flex items-center space-x-3 p-4 rounded-xl border-2 border-border hover:border-primary/50 hover:bg-accent/30 cursor-pointer transition-all duration-200 group"
              >
                <RadioGroupItem value="true" id="dif-sim" className="mt-0" />
                <span className="text-base font-medium group-hover:text-primary transition-colors">
                  Sim
                </span>
              </label>
              <label 
                htmlFor="dif-nao" 
                className="flex items-center space-x-3 p-4 rounded-xl border-2 border-border hover:border-primary/50 hover:bg-accent/30 cursor-pointer transition-all duration-200 group"
              >
                <RadioGroupItem value="false" id="dif-nao" className="mt-0" />
                <span className="text-base font-medium group-hover:text-primary transition-colors">
                  Não
                </span>
              </label>
            </RadioGroup>

            {dificuldades === true && (
              <div className="pl-11 animate-fade-in">
                <div className="bg-accent/20 rounded-2xl p-6 space-y-3 border border-border/50">
                  <Label htmlFor="justificativa" className="text-base font-semibold text-foreground">
                    Justifique as dificuldades
                  </Label>
                  <Textarea 
                    id="justificativa"
                    value={justificativaDificuldades}
                    onChange={(e) => setJustificativaDificuldades(e.target.value)}
                    placeholder="Descreva detalhadamente as dificuldades encontradas..."
                    className="min-h-[120px] text-base border-2 focus:border-primary transition-colors resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Seção 3: Emissão dia seguinte */}
          <div className="space-y-6 pt-6 border-t border-border/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                3
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Emissão para o dia seguinte?
              </h3>
            </div>

            <RadioGroup 
              value={emissaoDiaSeguinte?.toString()} 
              onValueChange={(v) => {
                setEmissaoDiaSeguinte(v === "true");
                if (v === "false") setQuantidadeProximoDia("");
              }}
              className="space-y-3 pl-11"
            >
              <label 
                htmlFor="prox-sim" 
                className="flex items-center space-x-3 p-4 rounded-xl border-2 border-border hover:border-primary/50 hover:bg-accent/30 cursor-pointer transition-all duration-200 group"
              >
                <RadioGroupItem value="true" id="prox-sim" className="mt-0" />
                <span className="text-base font-medium group-hover:text-primary transition-colors">
                  Sim
                </span>
              </label>
              <label 
                htmlFor="prox-nao" 
                className="flex items-center space-x-3 p-4 rounded-xl border-2 border-border hover:border-primary/50 hover:bg-accent/30 cursor-pointer transition-all duration-200 group"
              >
                <RadioGroupItem value="false" id="prox-nao" className="mt-0" />
                <span className="text-base font-medium group-hover:text-primary transition-colors">
                  Não
                </span>
              </label>
            </RadioGroup>

            {emissaoDiaSeguinte === true && (
              <div className="pl-11 animate-fade-in">
                <div className="bg-accent/20 rounded-2xl p-6 space-y-3 border border-border/50">
                  <Label htmlFor="quantidade" className="text-base font-semibold text-foreground">
                    Quantas?
                  </Label>
                  <Input 
                    id="quantidade"
                    type="number"
                    min="1"
                    value={quantidadeProximoDia}
                    onChange={(e) => setQuantidadeProximoDia(e.target.value)}
                    placeholder="Digite a quantidade..."
                    className="h-12 text-base border-2 focus:border-primary transition-colors"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Botão de submit */}
          <div className="pt-6">
            <Button 
              type="submit" 
              size="lg" 
              className="w-full h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Registrar Atendimento
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
