import { SearchPromptUseCase } from '@/core/application/prompts/search-prompts.use-case';
import { PromptRepository } from '@/core/domain/prompts/prompts.repository';

describe('SearchPromptsUseCase', () => {
  const input = [
    {
      id: '1',
      title: 'Title first',
      content: 'Content first',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: 'Title second',
      content: 'Content second',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const repository: PromptRepository = {
    create: jest.fn(),
    findByTitle: jest.fn(),
    findMany: async () => input,
    searchMany: async (term) =>
      input.filter(
        (prompt) =>
          prompt.title.toLowerCase().includes(term?.toLowerCase()) ||
          prompt.title.toLowerCase().includes(term?.toLowerCase())
      ),
  };
  it('should return all prompts when the term is empty', async () => {
    const useCase = new SearchPromptUseCase(repository);

    const results = await useCase.execute('');

    expect(results).toHaveLength(2);
  });
  it('should return the prompts filtered by the searched term', async () => {
    const query = 'Title first';
    const useCase = new SearchPromptUseCase(repository);

    const results = await useCase.execute(query);

    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('1');
  });
  it('should remove whitespace from empty search results and return the entire list of prompts', async () => {
    const findMany = jest.fn().mockResolvedValue(input);
    const searchMany = jest.fn().mockResolvedValue([]);
    const repositoryWithSpies: PromptRepository = {
      ...repository,
      findMany,
      searchMany,
    };

    const query = '  ';
    const useCase = new SearchPromptUseCase(repositoryWithSpies);

    const results = await useCase.execute(query);

    expect(results).toHaveLength(2);
    expect(findMany).toHaveBeenCalledTimes(1);
    expect(searchMany).not.toHaveBeenCalled();
  });
  it('should handle and remove whitespace in the search to return the list of prompts', async () => {
    const firstElement = input.slice(0, 1);
    const findMany = jest.fn().mockResolvedValue(input);
    const searchMany = jest.fn().mockResolvedValue(firstElement);
    const repositoryWithSpies: PromptRepository = {
      ...repository,
      findMany,
      searchMany,
    };

    const query = ' Title second  ';
    const useCase = new SearchPromptUseCase(repositoryWithSpies);

    const results = await useCase.execute(query);

    expect(results).toMatchObject(firstElement);
    expect(searchMany).toHaveBeenCalledWith(query.trim());
    expect(findMany).not.toHaveBeenCalled();
  });
  it('should handle searches with term undefined or null and return the list of prompts', async () => {
    const findMany = jest.fn().mockResolvedValue(input);
    const searchMany = jest.fn().mockResolvedValue([]);
    const repositoryWithSpies: PromptRepository = {
      ...repository,
      findMany,
      searchMany,
    };

    const query = undefined as unknown as string;
    const useCase = new SearchPromptUseCase(repositoryWithSpies);

    const results = await useCase.execute(query);

    expect(results).toMatchObject(input);
    expect(findMany).toHaveBeenCalledTimes(1);
    expect(searchMany).not.toHaveBeenCalled();
  });
});
