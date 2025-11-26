import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Atendimento } from "@/types/atendimento";
import { toast } from "sonner";

interface AtendimentoFormProps {
  onAddAtendimento: (atendimento: Atendimento) => void;
}

export const AtendimentoForm = ({ onAddAtendimento }: AtendimentoFormProps) => {
  // Estados para controle visual da seleção
  const [certificadoEmitido, setCertificadoEmitido] = useState<boolean | null>(null);
  const [paraQuem, setParaQuem] = useState<'parceiro' | 'dimas' | 'outros' | null>(null);
  const [tipoOutros, setTipoOutros] = useState<'agr_indisponivel' | 'emissao_interna' | 'cliente_final' | null>(null);
  const [motivoNaoEmitido, setMotivoNaoEmitido] = useState<'desistencia' | 'match_biometrico' | null>(null);

  // Função auxiliar para registrar e limpar imediatamente
  const realizarRegistro = (dados: Partial<Atendimento>) => {
    const novoAtendimento: Atendimento = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      certificadoEmitido: dados.certificadoEmitido ?? false,
      ...dados
    } as Atendimento;

    onAddAtendimento(novoAtendimento);
    toast.success("Atendimento registrado!");

    // Reset imediato dos campos visuais
    setCertificadoEmitido(null);
    setParaQuem(null);
    setTipoOutros(null);
    setMotivoNaoEmitido(null);
  };

  // --- HANDLERS DE CLIQUE (Lógica acontece na hora) ---

  const handleParaQuemChange = (valor: string) => {
    const novoValor = valor as 'parceiro' | 'dimas' | 'outros';
    setParaQuem(novoValor);

    // Se for Parceiro ou Dimas, registra imediatamente
    if (novoValor !== 'outros') {
      realizarRegistro({
        certificadoEmitido: true,
        paraQuem: novoValor
      });
    }
    // Se for "outros", não faz nada ainda, espera o usuário clicar no TIPO abaixo
  };

  const handleTipoOutrosChange = (valor: string) => {
    const novoTipo = valor as 'agr_indisponivel' | 'emissao_interna' | 'cliente_final';
    setTipoOutros(novoTipo);

    // Registra imediatamente ao selecionar o tipo
    realizarRegistro({
      certificadoEmitido: true,
      paraQuem: 'outros',
      tipoOutros: novoTipo
    });
  };

  const handleMotivoChange = (valor: string) => {
    const novoMotivo = valor as 'desistencia' | 'match_biometrico';
    setMotivoNaoEmitido(novoMotivo);

    // Registra imediatamente
    realizarRegistro({
      certificadoEmitido: false,
      motivoNaoEmitido: novoMotivo
    });
  };

  return (
    <Card className="w-full shadow-lg border-0">
      <CardHeader className="space-y-2 pb-6">
        <CardTitle className="text-3xl font-bold text-foreground">
          Registrar Atendimento
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Clique na opção para registrar automaticamente
        </p>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <div className="space-y-8">
          
          {/* PERGUNTA 1: EMITIU? */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">1</div>
              Certificado emitido?
            </h3>

            <RadioGroup 
              value={certificadoEmitido === null ? "" : certificadoEmitido.toString()} 
              onValueChange={(v) => {
                setCertificadoEmitido(v === "true");
                // Limpa filhos se mudar a opção pai
                setParaQuem(null);
                setMotivoNaoEmitido(null);
                setTipoOutros(null);
              }}
              className="grid grid-cols-2 gap-4"
            >
              <label className="flex items-center space-x-3 p-4 rounded-xl border-2 border-border hover:border-primary/50 hover:bg-accent/30 cursor-pointer transition-all duration-200 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-accent/30">
                <RadioGroupItem value="true" id="cert-sim" className="mt-0" />
                <span className="text-base font-medium">Sim</span>
              </label>
              <label className="flex items-center space-x-3 p-4 rounded-xl border-2 border-border hover:border-primary/50 hover:bg-accent/30 cursor-pointer transition-all duration-200 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-accent/30">
                <RadioGroupItem value="false" id="cert-nao" className="mt-0" />
                <span className="text-base font-medium">Não</span>
              </label>
            </RadioGroup>
          </div>

          {/* PERGUNTA 2A: PARA QUEM? (Aparece se Sim) */}
          {certificadoEmitido === true && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">2</div>
                Para quem?
              </h3>
              
              <RadioGroup 
                value={paraQuem || ""} 
                onValueChange={handleParaQuemChange}
                className="grid grid-cols-1 gap-3"
              >
                <label className="flex items-center space-x-3 p-4 rounded-xl border-2 border-border bg-background hover:border-primary/50 hover:bg-accent/30 cursor-pointer transition-all duration-200 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-accent/30">
                  <RadioGroupItem value="parceiro" id="parceiro" />
                  <span className="text-base font-medium">Parceiro</span>
                </label>
                
                <label className="flex items-center space-x-3 p-4 rounded-xl border-2 border-border bg-background hover:border-primary/50 hover:bg-accent/30 cursor-pointer transition-all duration-200 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-accent/30">
                  <RadioGroupItem value="dimas" id="dimas" />
                  <span className="text-base font-medium">Dimas</span>
                </label>
                
                <label className="flex items-center space-x-3 p-4 rounded-xl border-2 border-border bg-background hover:border-primary/50 hover:bg-accent/30 cursor-pointer transition-all duration-200 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-accent/30">
                  <RadioGroupItem value="outros" id="outros" />
                  <span className="text-base font-medium">Outros</span>
                </label>
              </RadioGroup>

              {/* PERGUNTA 2B: TIPO OUTROS (Aparece se Outros) */}
              {paraQuem === 'outros' && (
                <div className="pl-4 mt-2 border-l-2 border-border animate-in fade-in slide-in-from-left-2 duration-300">
                  <Label className="text-sm font-semibold text-muted-foreground mb-3 block">
                    Selecione o tipo para finalizar:
                  </Label>
                  <RadioGroup 
                    value={tipoOutros || ""} 
                    onValueChange={handleTipoOutrosChange}
                    className="grid grid-cols-1 gap-2"
                  >
                    <label className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-all [&:has([data-state=checked])]:bg-accent/50 [&:has([data-state=checked])]:border-primary">
                      <RadioGroupItem value="agr_indisponivel" id="agr" />
                      <span className="text-sm font-medium">AGR indisponível</span>
                    </label>
                    <label className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-all [&:has([data-state=checked])]:bg-accent/50 [&:has([data-state=checked])]:border-primary">
                      <RadioGroupItem value="emissao_interna" id="interna" />
                      <span className="text-sm font-medium">Emissão interna</span>
                    </label>
                    <label className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-all [&:has([data-state=checked])]:bg-accent/50 [&:has([data-state=checked])]:border-primary">
                      <RadioGroupItem value="cliente_final" id="cliente" />
                      <span className="text-sm font-medium">Cliente final</span>
                    </label>
                  </RadioGroup>
                </div>
              )}
            </div>
          )}

          {/* PERGUNTA 3: MOTIVO (Aparece se Não) */}
          {certificadoEmitido === false && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
               <h3 className="text-lg font-semibold flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-destructive/10 text-destructive text-xs font-bold">2</div>
                Qual o motivo?
              </h3>
              
              <RadioGroup 
                value={motivoNaoEmitido || ""} 
                onValueChange={handleMotivoChange}
                className="grid grid-cols-1 gap-3"
              >
                <label className="flex items-center space-x-3 p-4 rounded-xl border-2 border-border bg-background hover:border-destructive/50 hover:bg-destructive/5 cursor-pointer transition-all duration-200 [&:has([data-state=checked])]:border-destructive [&:has([data-state=checked])]:bg-destructive/10">
                  <RadioGroupItem value="desistencia" id="desistencia" />
                  <span className="text-base font-medium">Desistência</span>
                </label>
                <label className="flex items-center space-x-3 p-4 rounded-xl border-2 border-border bg-background hover:border-destructive/50 hover:bg-destructive/5 cursor-pointer transition-all duration-200 [&:has([data-state=checked])]:border-destructive [&:has([data-state=checked])]:bg-destructive/10">
                  <RadioGroupItem value="match_biometrico" id="match" />
                  <span className="text-base font-medium">Match biométrico</span>
                </label>
              </RadioGroup>
            </div>
          )}

        </div>
      </CardContent>
    </Card>
  );
};