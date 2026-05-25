import { PromptRepository } from '@/core/domain/prompts/prompts.repository';

export class SearchPromptUseCase {
  constructor(private promptRepository: PromptRepository) {}

  async execute(term: string) {
    const query = term?.trim() ?? '';

    if (!query) {
      return this.promptRepository.findMany();
    }

    return this.promptRepository.searchMany(query);
  }
}
