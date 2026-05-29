import { PrismaClient } from '@/generated/prisma/client';
import { Prompt } from '@/core/domain/prompts/prompt.entity';
import { CreatePromptDTO } from '@/core/application/prompts/create-prompt.dto';
import { PrismaPromptRepository } from '@/infra/repository/prisma-prompts.repository';

type PromptDelegateMock = {
  create: jest.MockedFunction<
    (args: { data: CreatePromptDTO }) => Promise<void>
  >;
  findFirst: jest.MockedFunction<
    (args: {
      where: { title: string };
    }) => Promise<Pick<Prompt, 'id' | 'title' | 'content'> | null>
  >;
  findMany: jest.MockedFunction<
    (args: {
      orderBy?: { createdAt: 'asc' | 'desc' };
      where?: {
        OR: Array<{
          title?: { contains: string; mode: 'insensitive' };
          content?: { contains: string; mode: 'insensitive' };
        }>;
      };
    }) => Promise<Prompt[]>
  >;
};

type PrismaMock = {
  prompt: PromptDelegateMock;
};

function createMockPrisma() {
  const mock: PrismaMock = {
    prompt: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  return mock as unknown as PrismaClient & PrismaMock;
}

describe('PrismaPromptRepository', () => {
  let prisma: ReturnType<typeof createMockPrisma>;
  let repository: PrismaPromptRepository;

  beforeEach(() => {
    prisma = createMockPrisma();
    repository = new PrismaPromptRepository(prisma);
  });

  describe('create', () => {
    it('should use the create method with the correct data', async () => {
      const input = {
        title: 'Title create 01',
        content: 'Content create 01',
      };

      await repository.create(input);

      expect(prisma.prompt.create).toHaveBeenCalledWith({
        data: input,
      });
    });
  });
  describe('findMany', () => {
    it('should sort by createdAt desc and map the results', async () => {
      const dateNow = new Date();
      const input = [
        {
          id: '1',
          title: 'Title 01',
          content: 'Content 01',
          createdAt: dateNow,
          updatedAt: dateNow,
        },
        {
          id: '2',
          title: 'Title 02',
          content: 'Content 02',
          createdAt: dateNow,
          updatedAt: dateNow,
        },
      ];

      prisma.prompt.findMany.mockResolvedValue(input);

      const results = await repository.findMany();

      expect(prisma.prompt.findMany).toHaveBeenCalledWith({
        orderBy: {
          createdAt: 'desc',
        },
      });
      expect(results).toMatchObject(input);
    });
  });
  describe('searchMany', () => {
    it('should search for an empty term and not send the WHERE clause', async () => {
      const dateNow = new Date();
      const input = [
        {
          id: '1',
          title: 'Title 01',
          content: 'Content 01',
          createdAt: dateNow,
          updatedAt: dateNow,
        },
      ];

      prisma.prompt.findMany.mockResolvedValue(input);

      const results = await repository.searchMany(' ');

      expect(prisma.prompt.findMany).toHaveBeenCalledWith({
        where: undefined,
        orderBy: {
          createdAt: 'desc',
        },
      });
      expect(results).toMatchObject(input);
    });
    it('should search by term and populate OR in WHERE clause', async () => {
      const dateNow = new Date();
      const input = [
        {
          id: '1',
          title: 'Title 01',
          content: 'Content 01',
          createdAt: dateNow,
          updatedAt: dateNow,
        },
      ];

      prisma.prompt.findMany.mockResolvedValue(input);

      const results = await repository.searchMany(' title 01 ');

      expect(prisma.prompt.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            {
              title: {
                contains: 'title 01',
                mode: 'insensitive',
              },
            },
            {
              content: {
                contains: 'title 01',
                mode: 'insensitive',
              },
            },
          ],
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      expect(results).toMatchObject(input);
    });
  });
  describe('findByTitle', () => {
    it('should use the `findByTitle` method if the title already exists', async () => {
      const input = {
        id: '1',
        title: 'Title create exist',
        content: 'Content create title exist',
      };

      prisma.prompt.findFirst.mockResolvedValue(input);

      const result = await repository.findByTitle(input.title);

      expect(prisma.prompt.findFirst).toHaveBeenCalledWith({
        where: { title: input.title },
      });
      expect(result).toEqual(input);
    });
  });
});
