import { render, screen } from '@testing-library/react';

describe('Example', () => {
  it('test render', () => {
    render(<div>Teste</div>);

    expect(screen.getByText('Teste')).toBeInTheDocument();
  });
});
