import { render, screen } from '@/lib/test-utils';

import { SidebarContent } from '@/components/sidebar/sidebar-content';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const makeSut = () => {
  return render(<SidebarContent />);
};

describe('SidebarContent', () => {
  describe('aside and button', () => {
    it('should render a new prompt button', () => {
      makeSut();

      expect(screen.getByRole('complementary')).toBeVisible();
      expect(screen.getByRole('button', { name: 'Novo prompt' })).toBeVisible();
    });
  });

  describe('Colapsar and expadir', () => {
    it('should start expanded and display the minimize button', () => {
      makeSut();

      const aside = screen.getByRole('complementary');

      expect(aside).toBeVisible();

      const collapseButton = screen.getByRole('button', {
        name: /minimizar sidebar/i,
      });

      expect(collapseButton).toBeVisible();

      const expandButton = screen.queryByRole('button', {
        name: /expandir sidebar/i,
      });

      expect(expandButton).not.toBeInTheDocument();
    });
    it.only('must hide and show the expand button', () => {
      makeSut();
    });
  });
});
