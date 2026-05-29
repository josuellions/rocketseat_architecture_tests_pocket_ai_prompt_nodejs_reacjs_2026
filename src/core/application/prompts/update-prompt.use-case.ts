import { PromptRepository } from '@/core/domain/prompts/prompts.repository';
import { UpdatePromptDTO } from './update-prompt.dto';

export class UpdatePromptUseCase {
  constructor(private promptRepository: PromptRepository) {}

  async execute(data: UpdatePromptDTO) {
    const promptExists = await this.promptRepository.findById(data.id);

    if (!promptExists) {
      throw new Error('PROMPT_NOT_FOUND');
    }

    return await this.promptRepository.update(data.id, {
      title: data.title,
      content: data.content,
    });
  }
}
