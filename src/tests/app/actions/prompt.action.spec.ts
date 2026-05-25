import { searchPromptAction } from '@/app/actions/prompt.action';
import { beforeEach } from 'node:test';

jest.mock('@/lib/prisma', () => ({ prisma: {} }));

const mockedSearchExecute = jest.fn();

jest.mock('@/core/application/prompts/search-prompts.use-case', () => ({
  SearchPromptUseCase: jest
    .fn()
    .mockImplementation(() => ({ execute: mockedSearchExecute })),
}));

jest.spyOn(console, 'log').mockImplementation(() => {});

beforeEach(() => {
  mockedSearchExecute.mockReset();
});

describe('Server actions: Prompts', () => {
  describe('searchPromptAction', () => {
    it('should return success with the non-empty search term', async () => {
      const input = [
        {
          id: '1',
          title: 'AI Title',
          content: 'Content ai teste',
        },
      ];

      mockedSearchExecute.mockResolvedValue(input);

      const formData = new FormData();
      formData.append('query', 'AI');

      const result = await searchPromptAction({ success: true }, formData);

      expect(result.success).toBe(true);
      expect(result.prompts).toEqual(input);
    });
    it('should return success and list all prompts with an empty search term', async () => {
      const input = [
        {
          id: '1',
          title: 'Title first',
          content: 'Content first',
        },
        {
          id: '2',
          title: 'Title second',
          content: 'Content second',
        },
      ];

      mockedSearchExecute.mockResolvedValue(input);

      const formData = new FormData();
      formData.append('query', 'empyt');

      const result = await searchPromptAction({ success: true }, formData);

      expect(result.success).toBeDefined();
      expect(result.prompts).toEqual(input);
    });
    it('should return an error when the search fails', async () => {
      const error = new Error('UNKNOWN');

      mockedSearchExecute.mockRejectedValue(error);

      const formData = new FormData();
      formData.append('query', 'error');

      const result = await searchPromptAction({ success: true }, formData);

      expect(result.success).toBeDefined();
      expect(result.prompts).toBe(undefined);
      expect(result.message).toBe('Falha ao buscar prompts.');
    });
    it('should must remove the spaces before searching', async () => {
      const input = [
        {
          id: '1',
          title: 'Title first',
          content: 'Content first',
        },
        {
          id: '2',
          title: 'Title second',
          content: 'Content second',
        },
      ];

      mockedSearchExecute.mockResolvedValue(input);

      const formData = new FormData();
      formData.append('query', ' Title first ');

      const result = await searchPromptAction({ success: true }, formData);

      expect(mockedSearchExecute).toHaveBeenCalledWith('Title first');
      expect(result.success).toBe(true);
      expect(result.prompts).toEqual(input);
    });
    it('should be handled when sending a query with an empty term', async () => {
      const input = [
        {
          id: '1',
          title: 'Title first',
          content: 'Content first',
        },
        {
          id: '2',
          title: 'Title second',
          content: 'Content second',
        },
      ];

      mockedSearchExecute.mockResolvedValue(input);

      const formData = new FormData();

      const result = await searchPromptAction({ success: true }, formData);

      expect(mockedSearchExecute).toHaveBeenCalledWith('');
      expect(result.success).toBe(true);
      expect(result.prompts).toEqual(input);
    });
  });
});
