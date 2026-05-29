import {
  createPromptAction,
  searchPromptAction,
} from '@/app/actions/prompt.actions';
import { beforeEach } from 'node:test';

jest.mock('@/lib/prisma', () => ({ prisma: {} }));

const mockedSearchExecute = jest.fn();
const mockedCreateExecute = jest.fn();

jest.mock('@/core/application/prompts/search-prompts.use-case', () => ({
  SearchPromptUseCase: jest
    .fn()
    .mockImplementation(() => ({ execute: mockedSearchExecute })),
}));

jest.mock('@/core/application/prompts/create-prompt.use-case', () => ({
  CreatePromptUseCase: jest
    .fn()
    .mockImplementation(() => ({ execute: mockedCreateExecute })),
}));

jest.spyOn(console, 'log').mockImplementation(() => {});

beforeEach(() => {
  mockedSearchExecute.mockReset();
  mockedCreateExecute.mockReset();
});

describe('Server actions: Prompts', () => {
  describe('createPromptAction', () => {
    it('should return a validadtion error when the fields are empty', async () => {
      const data = {
        title: '',
        content: '',
      };

      const result = await createPromptAction(data);

      expect(result?.success).toBe(false);
      expect(result?.message).toBe('Error de validação');
      expect(result?.errors).toBeDefined();
    });
    it('should return error validadtion when the same title exists', async () => {
      mockedCreateExecute.mockRejectedValue(new Error('PROMPT_ALREADY_EXISTS'));
      const data = {
        title: 'title duplicado',
        content: 'content duplicado',
      };

      const result = await createPromptAction(data);

      expect(result?.success).toBe(false);
      expect(result?.message).toBe('Este prompt já existe.');
    });
    it('should return a generic error when the prompt creation fails', async () => {
      mockedCreateExecute.mockRejectedValue(new Error('UNKNOWN'));
      const data = {
        title: 'title error generic',
        content: 'content error generic',
      };

      const result = await createPromptAction(data);

      expect(result?.success).toBe(false);
      expect(result?.message).toBe('Falha ao criar o prompt.');
    });
    it('should create a prompt successfully', async () => {
      mockedCreateExecute.mockResolvedValue(undefined);
      const data = {
        title: 'title new',
        content: 'content new',
      };

      const result = await createPromptAction(data);

      expect(result?.success).toBe(true);
      expect(result?.message).toBe('Prompt criado com sucesso.');
    });
  });

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
