import { CopyButton, CopyButtonProps } from '@/components/button-actions';
import { act, render, screen, waitFor } from '@/lib/test-utils';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';

const makeSut = ({ content = '' }: CopyButtonProps = {} as CopyButtonProps) => {
  return render(<CopyButton content={content} />);
};

const writeTextMock = jest.fn();

jest.mock('sonner', () => ({
  toast: { error: jest.fn() },
}));

describe('CopyButton', () => {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

  beforeEach(() => {
    writeTextMock.mockReset();
    Object.defineProperty(global.navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      configurable: true,
    });
    jest.useFakeTimers({ legacyFakeTimers: true });
  });
  it('shoul display a `toast` error when copy fails', async () => {
    const errorMessage = `ocorreu um error.`;
    const error = new Error(errorMessage);

    jest
      .spyOn(global.navigator.clipboard, 'writeText')
      .mockRejectedValueOnce(error);

    const content = 'text';
    makeSut({ content });

    const button = screen.getByRole('button', { name: /copiar/i });
    await user.click(button);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        `Error ao copiar o texto: ${errorMessage}`
      );
    });
    expect(screen.getByRole('button', { name: /copiar/i })).toBeVisible();
  });
  it('should disable the button when the content is empty', async () => {
    const content = ' ';
    makeSut({ content });

    const button = screen.getByRole('button', { name: /copiar/i });

    expect(button).toBeDisabled();

    await user.click(button);

    expect(writeTextMock).not.toHaveBeenCalled();
  });
  it('shoul clear the `timer` before activating the `copy` button again', async () => {
    writeTextMock.mockResolvedValueOnce(undefined);

    const clearSpy = jest.spyOn(window, 'clearTimeout');

    const content = 'text';
    makeSut({ content });

    const button = screen.getByRole('button', { name: /copiar/i });
    await user.click(button);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /copiado/i })
      ).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /copiado/i }));

    expect(clearSpy).toHaveBeenCalled();
    clearSpy.mockRestore();
  });
  it('should copy and change the `label` to `copiado` and then change it back to `copiar`', async () => {
    writeTextMock.mockResolvedValueOnce(undefined);

    const content = 'text';
    makeSut({ content });

    const button = screen.getByRole('button', { name: /copiar/i });
    await user.click(button);

    expect(
      await screen.findByRole('button', { name: /copiado/i })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('button', { name: /copiado/i })
    ).toBeVisible();

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(
      await screen.findByRole('button', { name: /copiar/i })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('button', { name: /copiar/i })
    ).toBeVisible();
  });
});
