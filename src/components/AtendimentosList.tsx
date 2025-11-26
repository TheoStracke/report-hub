import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Atendimento } from "@/types/atendimento";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AtendimentosListProps {
  atendimentos: Atendimento[];
}

export const AtendimentosList = ({ atendimentos }: AtendimentosListProps) => {
  const getParaQuemLabel = (atendimento: Atendimento) => {
    if (!atendimento.certificadoEmitido) return "-";
    
    switch (atendimento.paraQuem) {
      case 'parceiro': return 'Parceiro';
      case 'dimas': return 'Dimas';
      case 'outros': {
        const tipo = atendimento.tipoOutros === 'agr_indisponivel' ? 'AGR indisponível' :
                     atendimento.tipoOutros === 'emissao_interna' ? 'Emissão interna' :
                     'Cliente final';
        return `${atendimento.quemOutros} (${tipo})`;
      }
      default: return '-';
    }
  };

  const getMotivoLabel = (atendimento: Atendimento) => {
    if (atendimento.certificadoEmitido) return "-";
    return atendimento.motivoNaoEmitido === 'desistencia' ? 'Desistência' : 'Match biométrico';
  };

  if (atendimentos.length === 0) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-2xl">Atendimentos do Dia</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Nenhum atendimento registrado ainda.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="text-2xl">
          Atendimentos do Dia
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {atendimentos.length} {atendimentos.length === 1 ? 'atendimento registrado' : 'atendimentos registrados'}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {atendimentos.map((atendimento, index) => (
            <div 
              key={atendimento.id}
              className="p-4 rounded-xl border-2 border-border bg-card hover:shadow-md transition-all duration-200 animate-fade-in"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                    {atendimentos.length - index}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {format(atendimento.timestamp, "HH:mm", { locale: ptBR })}
                  </span>
                </div>
                <Badge 
                  variant={atendimento.certificadoEmitido ? "default" : "destructive"}
                  className="font-medium"
                >
                  {atendimento.certificadoEmitido ? "✓ Emitido" : "✗ Não Emitido"}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 gap-2 text-sm">
                {atendimento.certificadoEmitido ? (
                  <div className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
                    <span className="text-muted-foreground font-medium">Para quem:</span>
                    <span className="font-semibold">{getParaQuemLabel(atendimento)}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-destructive/5 rounded-lg">
                    <span className="text-muted-foreground font-medium">Motivo:</span>
                    <span className="font-semibold">{getMotivoLabel(atendimento)}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
