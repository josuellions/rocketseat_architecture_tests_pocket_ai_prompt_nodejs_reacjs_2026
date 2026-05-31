import z from 'zod';

export const updatePromptSchema = z.object({
  id: z.string().min(1, 'Id é obrigatório.'),
  title: z
    .string()
    .min(3, 'Title é obrigatório e deve ter mais de 3 caracteres.'),
  content: z
    .string()
    .min(3, 'Contexto é obrigatório e deve ter mais de 3 caracteres.'),
});

export type UpdatePromptDTO = z.infer<typeof updatePromptSchema>;
