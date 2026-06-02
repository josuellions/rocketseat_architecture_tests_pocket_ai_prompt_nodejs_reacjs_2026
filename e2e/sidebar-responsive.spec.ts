import test, { expect } from '@playwright/test';

test.describe('Sidebar responsive UI', () => {
  test('should open and close the sidebar (mobile)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });

    await page.goto('/');

    const openButton = page.getByLabel(/abrir menu/i);

    await expect(openButton).toBeVisible();
    await expect(openButton).toHaveAttribute('aria-expanded', 'false');

    await openButton.click();
    await expect(openButton).toBeVisible();
    await expect(openButton).toHaveAttribute('aria-expanded', 'true');

    const aside = page.getByRole('complementary');
    await expect(aside).toBeInViewport();

    const closeButton = page.getByLabel(/fechar menu/i);
    const searchInput = page.getByPlaceholder(/buscar prompts.../i);

    await expect(closeButton).toBeInViewport();
    await expect(searchInput).toBeInViewport();

    await closeButton.click();
    await expect(openButton).toHaveAttribute('aria-expanded', 'false');
    await expect(closeButton).not.toBeInViewport();
    await expect(searchInput).not.toBeInViewport();
    await expect(aside).not.toBeInViewport();
  });
  test('should open and close the sidebar (desktop)', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 800 });

    await page.goto('/');

    const openButton = page.getByLabel(/abrir menu/i);
    const closeButton = page.getByLabel(/fechar menu/i);
    const searchInput = page.getByPlaceholder(/buscar prompts.../i);
    const textHome = page.getByRole('heading', {
      name: /Selecione um prompt/i,
    });
    const collapseButton = page.getByRole('button', {
      name: /minimizar sidebar/i,
    });

    await expect(textHome).toBeVisible();
    await expect(openButton).toBeHidden();
    await expect(searchInput).toBeVisible();
    await expect(closeButton).toBeHidden();
    await expect(collapseButton).toBeInViewport();
  });
});
