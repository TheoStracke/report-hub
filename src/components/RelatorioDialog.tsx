import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DadosRelatorio } from "@/types/atendimento";
import { toast } from "sonner";

interface RelatorioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (dados: DadosRelatorio) => void;
}

export const RelatorioDialog = ({ open, onOpenChange, onConfirm }: RelatorioDialogProps) => {
  const [dificuldades, setDificuldades] = useState<boolean | null>(null);
  const [justificativaDificuldades, setJustificativaDificuldades] = useState("");
  const [emissaoDiaSeguinte, setEmissaoDiaSeguinte] = useState<boolean | null>(null);
  const [quantidadeProximoDia, setQuantidadeProximoDia] = useState("");

  const handleConfirm = () => {
    if (dificuldades === null || emissaoDiaSeguinte === null) {
      toast.error("Preencha todas as perguntas");
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

    const dados: DadosRelatorio = {
      dificuldades,
      justificativaDificuldades: dificuldades ? justificativaDificuldades : undefined,
      emissaoDiaSeguinte,
      quantidadeProximoDia: emissaoDiaSeguinte ? parseInt(quantidadeProximoDia) : undefined,
    };

    onConfirm(dados);
    
    // Reset
    setDificuldades(null);
    setJustificativaDificuldades("");
    setEmissaoDiaSeguinte(null);
    setQuantidadeProximoDia("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Informações do Relatório Diário</DialogTitle>
          <DialogDescription>
            Responda as perguntas abaixo antes de gerar o relatório
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-4">
          {/* Dificuldades */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                1
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Houve dificuldades hoje?
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

          {/* Emissão dia seguinte */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                2
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Há emissões para o dia seguinte?
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
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm}
            className="flex-1"
          >
            Gerar Relatório
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
