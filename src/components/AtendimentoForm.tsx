import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Atendimento } from "@/types/atendimento";
import { toast } from "sonner";

interface AtendimentoFormProps {
  onAddAtendimento: (atendimento: Atendimento) => void;
}

export const AtendimentoForm = ({ onAddAtendimento }: AtendimentoFormProps) => {
  const [certificadoEmitido, setCertificadoEmitido] = useState<boolean | null>(null);
  const [paraQuem, setParaQuem] = useState<'parceiro' | 'dimas' | 'outros' | null>(null);
  const [quemOutros, setQuemOutros] = useState("");
  const [tipoOutros, setTipoOutros] = useState<'agr_indisponivel' | 'emissao_interna' | 'cliente_final' | null>(null);
  const [motivoNaoEmitido, setMotivoNaoEmitido] = useState<'desistencia' | 'match_biometrico' | null>(null);

  // Registrar automaticamente quando tiver informação completa
  useEffect(() => {
    if (certificadoEmitido === null) return;

    // Se emitido, precisa ter "para quem"
    if (certificadoEmitido) {
      if (!paraQuem) return;
      
      // Se for "outros", precisa ter nome e tipo
      if (paraQuem === 'outros' && (!quemOutros.trim() || !tipoOutros)) return;

      // Tudo preenchido, registrar
      const novoAtendimento: Atendimento = {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        certificadoEmitido: true,
        paraQuem,
        quemOutros: paraQuem === 'outros' ? quemOutros : undefined,
        tipoOutros: paraQuem === 'outros' ? tipoOutros! : undefined,
      };

      onAddAtendimento(novoAtendimento);
      toast.success("Atendimento registrado automaticamente!");
      resetForm();
    } else {
      // Se não emitido, precisa ter motivo
      if (!motivoNaoEmitido) return;

      const novoAtendimento: Atendimento = {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        certificadoEmitido: false,
        motivoNaoEmitido,
      };

      onAddAtendimento(novoAtendimento);
      toast.success("Atendimento registrado automaticamente!");
      resetForm();
    }
  }, [certificadoEmitido, paraQuem, quemOutros, tipoOutros, motivoNaoEmitido]);

  const resetForm = () => {
    setCertificadoEmitido(null);
    setParaQuem(null);
    setQuemOutros("");
    setTipoOutros(null);
    setMotivoNaoEmitido(null);
  };

  return (
    <Card className="w-full shadow-lg border-0">
      <CardHeader className="space-y-2 pb-8">
        <CardTitle className="text-3xl font-bold text-foreground">
          Registrar Atendimento
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Selecione as opções - o registro acontece automaticamente
        </p>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <div className="space-y-10">
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
        </div>
      </CardContent>
    </Card>
  );
};
