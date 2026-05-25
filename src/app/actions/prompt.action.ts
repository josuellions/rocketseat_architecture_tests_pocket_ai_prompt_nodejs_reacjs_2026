'use server';

import { PromptSummary } from '@/core/domain/prompts/prompt.entity';
import { PrismaPromptRepository } from '@/infra/repository/prisma-prompts.repository';
import { SearchPromptUseCase } from '@/core/application/prompts/search-prompts.use-case';
import { prisma } from '@/lib/prisma';

type SearchFormState = {
  success: boolean;
  message?: String;
  prompts?: PromptSummary[];
};

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
