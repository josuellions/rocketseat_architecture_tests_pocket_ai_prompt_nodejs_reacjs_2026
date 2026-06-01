import test, { expect } from '@playwright/test';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';

test.describe('Delete prompt UI', () => {
  test('should delete a prompt when it exists (success)', async ({ page }) => {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });
    const prisma = new PrismaClient({ adapter });

    const uniqueTitle = `E2E Deletable Prompt ${Date.now()}`;
    const content = 'E2E Deletable Prompt content';

    await prisma.prompt.create({
      data: {
        title: uniqueTitle,
        content: content,
      },
    });

    await prisma.$disconnect();

    await page.goto('/');

    const list = page.getByRole('list');

    await expect(list).toBeVisible();

    const heading = page.getByRole('heading', { name: uniqueTitle });

    await expect(heading).toBeVisible({ timeout: 15000 });

    const promptItem = page
      .getByRole('listitem')
      .filter({ hasText: uniqueTitle });

    await expect(promptItem).toBeVisible();

    await promptItem.getByRole('button', { name: /remover prompt/i }).click();

    await page.getByRole('button', { name: /confirmar/i }).click();

    await expect(page.getByText('Prompt removido com sucesso!')).toBeVisible();
    await expect(page.getByRole('heading', { name: uniqueTitle })).toHaveCount(
      0
    );
  });
});
