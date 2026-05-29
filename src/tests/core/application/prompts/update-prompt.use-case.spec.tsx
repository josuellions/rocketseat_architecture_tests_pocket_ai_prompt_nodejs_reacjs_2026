import { PromptRepository } from '@/core/domain/prompts/prompts.repository';
import { UpdatePromptDTO } from '@/core/application/prompts/update-prompt.dto';
import { UpdatePromptUseCase } from '@/core/application/prompts/update-prompt.use-case';

const makeRepository = (overrides: Partial<PromptRepository>) => {
  const base = {
    update: jest.fn(async (id, data) => ({
      id,
      title: data.title ?? '',
      content: data.content ?? '',
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    findById: jest.fn(async () => null),
  };

  return { ...base, ...overrides } as PromptRepository;
};

describe('UpdatePromptUseCase', () => {
  it('should update when the prompt appears', async () => {
    const now = new Date();
    const repository = makeRepository({
      findById: jest.fn().mockResolvedValue({
        id: '1',
        title: 'title old',
        content: 'content old',
        createdAt: now,
        updatedAt: now,
      }),
      update: jest.fn().mockResolvedValue({
        id: '1',
        title: 'title update',
        content: 'content update',
        createdAt: now,
        updatedAt: now,
      }),
    });

    const useCase = new UpdatePromptUseCase(repository);
    const input: UpdatePromptDTO = {
      id: '1',
      title: 'title update',
      content: 'content update',
    };

    const result = await useCase.execute(input);

    expect(result.title).toBe(input.title);
    expect(repository.update).toHaveBeenCalledWith(input.id, {
      title: input.title,
      content: input.content,
    });
  });
  it('should fail to update when the prompt does not exist', async () => {
    const repository = makeRepository({
      findById: jest.fn().mockResolvedValue(null),
    });

    const useCase = new UpdatePromptUseCase(repository);
    const input: UpdatePromptDTO = {
      id: '1',
      title: 'title update fail',
      content: 'content update fail',
    };

    await expect(useCase.execute(input)).rejects.toThrow('PROMPT_NOT_FOUND');
  });
});
