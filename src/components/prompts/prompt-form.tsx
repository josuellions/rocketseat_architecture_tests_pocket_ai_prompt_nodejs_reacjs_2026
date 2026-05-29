'use client';

import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CopyButton } from '@/components/button-actions';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

import {
  CreatePromptDTO,
  createPromptSchema,
} from '@/core/application/prompts/create-prompt.dto';

import {
  createPromptAction,
  updatePromptAction,
} from '@/app/actions/prompt.actions';
import { Prompt } from '@/core/domain/prompts/prompt.entity';

type PromptFromProps = {
  prompt?: Prompt | null;
};

export const PromptForm = ({ prompt }: PromptFromProps) => {
  const router = useRouter();
  const isEdit = !!prompt?.id;

  const form = useForm<CreatePromptDTO>({
    resolver: zodResolver(createPromptSchema),
    defaultValues: {
      title: prompt?.title || '',
      content: prompt?.content || '',
    },
  });

  const content = useWatch({
    control: form.control,
    name: 'content',
  });

  const submit = async (data: CreatePromptDTO) => {
    const result = isEdit
      ? await updatePromptAction({ id: prompt?.id, ...data })
      : await createPromptAction(data);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    router.refresh();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
        <header className="flex flex-wrap gap-2 items-center mb-6 justify-end">
          <CopyButton content={content} />
          <Button
            size="sm"
            type="submit"
            title="Save prompt"
            className="rounded-md"
          >
            Salvar
          </Button>
        </header>
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input autoFocus placeholder="Título do prompt" {...field} />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          name="content"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Digite o conteúdo do prompt..."
                  variant="transparent"
                  size="lg"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
