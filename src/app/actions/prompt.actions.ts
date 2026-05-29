'use server';

import z from 'zod';
import { prisma } from '@/lib/prisma';
import { PromptSummary } from '@/core/domain/prompts/prompt.entity';
import { PrismaPromptRepository } from '@/infra/repository/prisma-prompts.repository';
import { SearchPromptUseCase } from '@/core/application/prompts/search-prompts.use-case';
import {
  CreatePromptDTO,
  createPromptSchema,
} from '@/core/application/prompts/create-prompt.dto';
import { CreatePromptUseCase } from '@/core/application/prompts/create-prompt.use-case';

type SearchFormState = {
  success: boolean;
  message?: string;
  prompts?: PromptSummary[];
};

export async function createPromptAction(data: CreatePromptDTO) {
  const validated = createPromptSchema.safeParse(data);

  if (!validated.success) {
    const { fieldErrors } = z.flattenError(validated.error);

    return {
      success: false,
      message: 'Error de validação',
      errors: fieldErrors,
    };
  }

  try {
    const repository = new PrismaPromptRepository(prisma);
    const useCase = new CreatePromptUseCase(repository);

    await useCase.execute(validated.data);
  } catch (error) {
    const _error = error as Error;
    console.log(error);

    if (_error.message === 'PROMPT_ALREADY_EXISTS') {
      return {
        success: false,
        message: 'Este prompt já existe.',
      };
    }

    return {
      success: false,
      message: 'Falha ao criar o prompt.',
    };
  }

  return {
    success: true,
    message: 'Prompt criado com sucesso.',
  };
}

export async function searchPromptAction(
  _prev: SearchFormState,
  formData: FormData
): Promise<SearchFormState> {
  // const term = String(formData.get('search-prompts') ?? '').trim();
  const term = String(formData.get('query') ?? '').trim();

  const repository = new PrismaPromptRepository(prisma);

  const useCase = new SearchPromptUseCase(repository);

  try {
    const results = await useCase.execute(term);

    const prompts = results.map(({ id, title, content }) => ({
      id,
      title,
      content,
    }));

    return {
      success: true,
      prompts,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: 'Falha ao buscar prompts.',
    };
  }
}
