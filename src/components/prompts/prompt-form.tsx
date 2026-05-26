import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

export const PromptForm = () => {
  return (
    <form action="" className="space-y-6">
      <header className="flex flex-wrap gap-2 items-center mb-6 justify-end">
        <Button
          type="submit"
          title="Save prompt"
          size="sm"
          className="rounded-md"
        >
          Salvar
        </Button>
      </header>
      <Input autoFocus placeholder="Título do prompt" />

      <Textarea
        placeholder="Digite o conteúdo do prompt..."
        variant="transparent"
        size="lg"
      />
    </form>
  );
};
