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
      <Card>
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
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">
          Atendimentos do Dia ({atendimentos.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {atendimentos.map((atendimento, index) => (
            <div 
              key={atendimento.id}
              className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono">
                    #{atendimentos.length - index}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {format(atendimento.timestamp, "HH:mm", { locale: ptBR })}
                  </span>
                </div>
                <Badge variant={atendimento.certificadoEmitido ? "default" : "destructive"}>
                  {atendimento.certificadoEmitido ? "Emitido" : "Não Emitido"}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Para quem:</span>
                  <p className="font-medium">{getParaQuemLabel(atendimento)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Motivo (se não emitido):</span>
                  <p className="font-medium">{getMotivoLabel(atendimento)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Dificuldades:</span>
                  <p className="font-medium">{atendimento.dificuldades ? "Sim" : "Não"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Próximo dia:</span>
                  <p className="font-medium">
                    {atendimento.emissaoDiaSeguinte ? `Sim (${atendimento.quantidadeProximoDia})` : "Não"}
                  </p>
                </div>
              </div>

              {atendimento.justificativaDificuldades && (
                <div className="mt-3 p-2 bg-muted rounded text-sm">
                  <span className="text-muted-foreground">Justificativa: </span>
                  {atendimento.justificativaDificuldades}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
