
// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';

import {
    render,
    screen,
    within,
    cleanup
} from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import {
    describe,
    it,
    expect,
    vi,
    afterEach
} from 'vitest';

import Main from './Main';

vi.mock('../pwaUpdates', () => ({
    subscribeToUpdates: vi.fn(() => () => {}),
    applyAvailableUpdate: vi.fn()
}));

afterEach(cleanup);

describe('NPCinator main screen', () => {
    it('renders the application heading', () => {
        render(<Main />);

        expect(
            screen.getByRole('heading', {
                name: 'NPCinator'
            })
        ).toBeInTheDocument();
    });

    it('renders the application logo', () => {
        render(<Main />);

        expect(
            screen.getByRole('img', {
                name: 'Logo'
            })
        ).toBeInTheDocument();
    });

    it('starts without generated cards', () => {
        render(<Main />);

        expect(
            screen.getByText(
                'Make a character by pressing the button'
            )
        ).toBeInTheDocument();
    });

    it('defaults to Character', () => {
        render(<Main />);

        expect(
            screen.getByRole('combobox')
        ).toHaveValue('Character');
    });

    it('offers all supported character types', () => {
        render(<Main />);

        const selector = screen.getByRole('combobox');

        expect(
            within(selector)
                .getAllByRole('option')
                .map(option => option.textContent)
        ).toEqual([
            'Character',
            'Villain',
            'Lackey',
            'Hero',
            'Sidekick'
        ]);
    });

    it.each([
        'Character',
        'Villain',
        'Lackey',
        'Hero',
        'Sidekick'
    ])('generates a complete %s card', async type => {
        const interaction = userEvent.setup();

        const { container } = render(<Main />);

        await interaction.selectOptions(
            screen.getByRole('combobox'),
            type
        );

        await interaction.click(
            screen.getByRole('button', {
                name: 'Go'
            })
        );

        const cards = container.querySelectorAll('.card');

        expect(cards).toHaveLength(1);

        const card = cards[0] as HTMLElement;

        expect(
            card.querySelector('.cardType')
        ).toHaveTextContent(type);

        expect(
            card.querySelector('.cardName')
                ?.textContent?.trim()
        ).toBeTruthy();

        expect(
            within(card).getByText(/References:/)
        ).toBeInTheDocument();

        expect(
            within(card).getByText(/They were/)
        ).toBeInTheDocument();

        expect(
            within(card).getByText(/They follow/)
        ).toBeInTheDocument();
    });

    it('preserves existing cards when generating another', async () => {
        const interaction = userEvent.setup();

        const { container } = render(<Main />);

        const generate = screen.getByRole('button', {
            name: 'Go'
        });

        await interaction.click(generate);

        const original = container
            .querySelector('.card')?.textContent;

        await interaction.selectOptions(
            screen.getByRole('combobox'),
            'Villain'
        );

        await interaction.click(generate);

        const cards = container.querySelectorAll('.card');

        expect(cards).toHaveLength(2);
        expect(cards[1].textContent).toBe(original);

        expect(
            cards[0].querySelector('.cardType')
        ).toHaveTextContent('Villain');
    });
});
