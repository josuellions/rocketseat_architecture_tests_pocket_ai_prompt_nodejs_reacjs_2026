import { PrismaClient } from '@/generated/prisma/client';
import test, { expect } from '@playwright/test';
import { PrismaPg } from '@prisma/adapter-pg';

test('should edit the prompt via the UI (success)', async ({ page }) => {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  const now = Date.now();
  const originalTitle = `E2E Title original ${now}`;
  const originalContent = 'E2E Content original';

  const updatedTitle = `E2E Title updated ${now}`;
  const updatedContent = 'E2E Content updated';

  const create = await prisma.prompt.create({
    data: {
      title: originalTitle,
      content: originalContent,
    },
  });

  await prisma.$disconnect();

  await page.goto(`/${create.id}`);

  await expect(page.getByPlaceholder('Título do prompt')).toBeVisible();

  await page.fill('input[name="title"]', updatedTitle);
  await page.fill('textarea[name="content"]', updatedContent);

  await page.getByRole('button', { name: 'Salvar' }).click();
  await page.waitForSelector('text=Prompt atualizado com sucesso.', {
    state: 'visible',
    timeout: 15000,
  });

  await expect(page.getByRole('heading', { name: updatedTitle })).toBeVisible();
  await expect(page.locator('input[name="title"]')).toHaveValue(updatedTitle);
});
