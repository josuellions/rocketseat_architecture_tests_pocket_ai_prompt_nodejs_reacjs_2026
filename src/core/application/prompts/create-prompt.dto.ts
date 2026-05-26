import z from 'zod';

export const createPromptSchema = z.object({
  title: z
    .string()
    .min(3, 'Title é obrigatório e deve ter mais de 3 caracteres.'),
  content: z
    .string()
    .min(3, 'Contexto é obrigatório e deve ter mais de 3 caracteres.'),
});

export type CreatePromptDTO = z.infer<typeof createPromptSchema>;
