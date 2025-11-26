import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Registrar Atendimento</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Certificado Emitido */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">1. Certificado emitido?</Label>
            <RadioGroup value={certificadoEmitido?.toString()} onValueChange={(v) => {
              setCertificadoEmitido(v === "true");
              setParaQuem(null);
              setMotivoNaoEmitido(null);
              setQuemOutros("");
              setTipoOutros(null);
            }}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="cert-sim" />
                <Label htmlFor="cert-sim" className="cursor-pointer">Sim</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="cert-nao" />
                <Label htmlFor="cert-nao" className="cursor-pointer">Não</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Se SIM - Para quem? */}
          {certificadoEmitido === true && (
            <div className="space-y-3 pl-4 border-l-2 border-primary/20">
              <Label className="text-base font-semibold">Para quem?</Label>
              <RadioGroup value={paraQuem || ""} onValueChange={(v: any) => {
                setParaQuem(v);
                if (v !== 'outros') {
                  setQuemOutros("");
                  setTipoOutros(null);
                }
              }}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="parceiro" id="parceiro" />
                  <Label htmlFor="parceiro" className="cursor-pointer">Parceiro</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dimas" id="dimas" />
                  <Label htmlFor="dimas" className="cursor-pointer">Dimas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="outros" id="outros" />
                  <Label htmlFor="outros" className="cursor-pointer">Outros</Label>
                </div>
              </RadioGroup>

              {/* Se OUTROS */}
              {paraQuem === 'outros' && (
                <div className="space-y-3 pl-4 border-l-2 border-primary/20 mt-3">
                  <div>
                    <Label htmlFor="quem-outros">Quem?</Label>
                    <Input 
                      id="quem-outros"
                      value={quemOutros}
                      onChange={(e) => setQuemOutros(e.target.value)}
                      placeholder="Digite o nome..."
                      className="mt-2"
                    />
                  </div>
                  <RadioGroup value={tipoOutros || ""} onValueChange={(v: any) => setTipoOutros(v)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="agr_indisponivel" id="agr" />
                      <Label htmlFor="agr" className="cursor-pointer">AGR indisponível</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="emissao_interna" id="interna" />
                      <Label htmlFor="interna" className="cursor-pointer">Emissão interna</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cliente_final" id="cliente" />
                      <Label htmlFor="cliente" className="cursor-pointer">Cliente final</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
            </div>
          )}

          {/* Se NÃO - Motivo */}
          {certificadoEmitido === false && (
            <div className="space-y-3 pl-4 border-l-2 border-destructive/20">
              <Label className="text-base font-semibold">Qual o motivo?</Label>
              <RadioGroup value={motivoNaoEmitido || ""} onValueChange={(v: any) => setMotivoNaoEmitido(v)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="desistencia" id="desistencia" />
                  <Label htmlFor="desistencia" className="cursor-pointer">Desistência</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="match_biometrico" id="match" />
                  <Label htmlFor="match" className="cursor-pointer">Match biométrico</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Dificuldades */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">2. Dificuldades?</Label>
            <RadioGroup value={dificuldades?.toString()} onValueChange={(v) => {
              setDificuldades(v === "true");
              if (v === "false") setJustificativaDificuldades("");
            }}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="dif-sim" />
                <Label htmlFor="dif-sim" className="cursor-pointer">Sim</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="dif-nao" />
                <Label htmlFor="dif-nao" className="cursor-pointer">Não</Label>
              </div>
            </RadioGroup>
            {dificuldades === true && (
              <Textarea 
                value={justificativaDificuldades}
                onChange={(e) => setJustificativaDificuldades(e.target.value)}
                placeholder="Descreva as dificuldades..."
                className="mt-2"
              />
            )}
          </div>

          {/* Emissão dia seguinte */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">3. Emissão para o dia seguinte?</Label>
            <RadioGroup value={emissaoDiaSeguinte?.toString()} onValueChange={(v) => {
              setEmissaoDiaSeguinte(v === "true");
              if (v === "false") setQuantidadeProximoDia("");
            }}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="prox-sim" />
                <Label htmlFor="prox-sim" className="cursor-pointer">Sim</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="prox-nao" />
                <Label htmlFor="prox-nao" className="cursor-pointer">Não</Label>
              </div>
            </RadioGroup>
            {emissaoDiaSeguinte === true && (
              <div>
                <Label htmlFor="quantidade">Quantas?</Label>
                <Input 
                  id="quantidade"
                  type="number"
                  min="1"
                  value={quantidadeProximoDia}
                  onChange={(e) => setQuantidadeProximoDia(e.target.value)}
                  placeholder="Digite a quantidade..."
                  className="mt-2"
                />
              </div>
            )}
          </div>

          <Button type="submit" size="lg" className="w-full">
            Registrar Atendimento
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
