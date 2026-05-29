import { Logo } from '@/components/logo';
import { render, screen } from '@/lib/test-utils';

describe('Logo', () => {
  it('should render a link to the home page with text', () => {
    render(<Logo />);

    const link = screen.getByRole('link', { name: 'PROMPTS' });

    expect(link).toBeVisible();
    expect(link).toHaveAttribute('href', '/');
  });
});
