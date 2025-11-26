import { useState } from "react";
import { Atendimento } from "@/types/atendimento";
import { AtendimentoForm } from "@/components/AtendimentoForm";
import { AtendimentosList } from "@/components/AtendimentosList";
import { RelatorioPreview } from "@/components/RelatorioPreview";
import { FileText } from "lucide-react";

const Index = () => {
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);

  const handleAddAtendimento = (novoAtendimento: Atendimento) => {
    setAtendimentos([...atendimentos, novoAtendimento]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="h-12 w-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Sistema de Atendimentos
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Registre atendimentos e gere relatórios profissionais em PNG
          </p>
        </header>

        {/* Grid Layout */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Coluna Esquerda */}
          <div className="space-y-8">
            <AtendimentoForm onAddAtendimento={handleAddAtendimento} />
          </div>

          {/* Coluna Direita */}
          <div className="space-y-8">
            <AtendimentosList atendimentos={atendimentos} />
          </div>
        </div>

        {/* Relatório - Full Width */}
        <div className="mt-8">
          <RelatorioPreview atendimentos={atendimentos} />
        </div>
      </div>
    </div>
  );
};

export default Index;
