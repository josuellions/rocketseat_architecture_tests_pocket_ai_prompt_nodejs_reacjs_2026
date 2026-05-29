import { PromptRepository } from '@/core/domain/prompts/prompts.repository';
import { CreatePromptUseCase } from '@/core/application/prompts/create-prompt.use-case';

const makeRepository = (overrides: Partial<PromptRepository>) => {
  const base = {
    create: jest.fn(async () => undefined),
  };
  return { ...base, ...overrides } as PromptRepository;
};

describe('CreatePromptUseCase', () => {
  it('should create a prompt when there are no duplicates', async () => {
    const repository = makeRepository({
      findByTitle: jest.fn().mockResolvedValue(null),
    });

    const useCase = new CreatePromptUseCase(repository);

    const input = {
      title: 'New prompt',
      content: 'new content prompt',
    };

    await expect(useCase.execute(input)).resolves.toBeUndefined();

    expect(repository.create).toHaveBeenCalledWith(input);
  });
  it('should fail to create a prompt when duplicates exist', async () => {
    const repository = makeRepository({
      findByTitle: jest.fn().mockResolvedValue({
        id: '1',
        title: 'New prompt duplicate',
        content: 'new content prompt duplicate',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    });

    const useCase = new CreatePromptUseCase(repository);

    const input = {
      title: 'New prompt duplicate',
      content: 'new content prompt duplicate',
    };

    await expect(useCase.execute(input)).rejects.toThrow(
      'PROMPT_ALREADY_EXISTS'
    );

    // expect(repository.create).toHaveBeenCalledWith(input);
  });
});
