import { PromptForm } from '@/components/prompts';
import { render, screen } from '@/lib/test-utils';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';

const refreshMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: refreshMock }),
}));

const createActionMock = jest.fn();
jest.mock('@/app/actions/prompt.actions', () => ({
  createPromptAction: (...args: unknown[]) => createActionMock(...args),
}));

jest.mock('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const makeSut = () => {
  return render(<PromptForm />);
};

beforeEach(() => {
  (toast.success as jest.Mock).mockReset();
  (toast.error as jest.Mock).mockReset();
  createActionMock.mockReset();
  refreshMock.mockReset();
});

describe('PromptForm', () => {
  const user = userEvent.setup();

  it('should create a new prompt successfully', async () => {
    createActionMock.mockResolvedValueOnce({
      success: true,
      message: 'Prompt criado com sucesso.',
    });
    makeSut();

    const titleInput = screen.getByPlaceholderText('Título do prompt');
    const contetInput = screen.getByPlaceholderText(
      'Digite o conteúdo do prompt...'
    );
    const submitButton = screen.getByRole('button', { name: 'Salvar' });

    await user.type(titleInput, 'title');
    await user.type(contetInput, 'content');
    await user.click(submitButton);

    expect(createActionMock).toHaveBeenCalledWith({
      title: 'title',
      content: 'content',
    });

    expect(toast.success).toHaveBeenCalledWith('Prompt criado com sucesso.');

    expect(refreshMock).toHaveBeenCalledTimes(1);
  });
  it('should display an error when it fails to create the prompt', async () => {
    createActionMock.mockResolvedValueOnce({
      success: false,
      message: 'error',
    });
    makeSut();

    const titleInput = screen.getByPlaceholderText('Título do prompt');
    const contetInput = screen.getByPlaceholderText(
      'Digite o conteúdo do prompt...'
    );
    const submitButton = screen.getByRole('button', { name: 'Salvar' });

    await user.type(titleInput, 'title');
    await user.type(contetInput, 'content');
    await user.click(submitButton);

    expect(toast.error).toHaveBeenCalledWith('error');
    expect(refreshMock).not.toHaveBeenCalledTimes(1);
  });
  it('should display a `required` message when the form is empty', async () => {
    makeSut();

    const submitButton = screen.getByRole('button', { name: 'Salvar' });

    await user.click(submitButton);

    expect(
      screen.getByText('Title é obrigatório e deve ter mais de 3 caracteres.')
    ).toBeVisible();
    expect(
      screen.getByText(
        'Contexto é obrigatório e deve ter mais de 3 caracteres.'
      )
    ).toBeVisible();
    expect(createActionMock).not.toHaveBeenCalled();
  });
});
