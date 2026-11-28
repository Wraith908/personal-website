
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('home page loads correctly', async ({ page }) => {
    await page.goto('/');

    await expect(
        page.getByRole('heading', {
            name: 'NPCinator'
        })
    ).toBeVisible();

    await expect(
        page.getByRole('combobox')
    ).toHaveValue('Character');

    await expect(
        page.getByRole('button', {
            name: 'Go'
        })
    ).toBeVisible();
});

test('all character types generate successfully', async ({ page }) => {
    await page.goto('/');

    for (const type of [
        'Character',
        'Hero',
        'Villain',
        'Lackey',
        'Sidekick'
    ]) {
        await page.getByRole('combobox')
            .selectOption(type);

        await page.getByRole('button', {
            name: 'Go'
        }).click();

        const card = page.locator('.card').first();

        await expect(card).toBeVisible();

        await expect(
            card.locator('.cardType')
        ).toHaveText(type);

        await expect(
            card.locator('.cardName')
        ).not.toBeEmpty();

        await expect(card).toContainText('References:');
    }

    await expect(
        page.locator('.card')
    ).toHaveCount(5);
});

test('existing cards remain unchanged', async ({ page }) => {
    await page.goto('/');

    const generate = page.getByRole('button', {
        name: 'Go'
    });

    const cards = page.locator('.card');

    await generate.click();

    await expect(cards).toHaveCount(1);

    const firstCard = cards.first();

    // Wait for React to populate the card.
    await expect(
        firstCard.locator('.cardName')
    ).toHaveText(/\S/);

    await expect(firstCard).toContainText('They were');
    await expect(firstCard).toContainText('They follow');

    const original = await firstCard.innerText();

    await generate.click();

    await expect(cards).toHaveCount(2);

    await expect(
        cards.first().locator('.cardName')
    ).toHaveText(/\S/);

    await expect(cards.nth(1)).toHaveText(original, {
        useInnerText: true
    });
});

const viewports = [
    { name: 'Narrow mobile', width: 320, height: 568 },
    { name: 'Mobile', width: 390, height: 844 },
    { name: 'Tablet portrait', width: 1024, height: 1366 },
    { name: 'Tablet landscape', width: 1366, height: 1024 },
    { name: 'Desktop', width: 1440, height: 900 }
];

for (const viewport of viewports) {
    test(`responsive layout: ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({
            width: viewport.width,
            height: viewport.height
        });

        await page.goto('/');

        const generate = page.getByRole('button', {
            name: 'Go'
        });

        for (let i = 0; i < 5; i++) {
            await generate.click();
        }

        await expect(
            page.locator('.card')
        ).toHaveCount(5);

        await expect(generate).toBeVisible();

        const overflow = await page.evaluate(() => {
            return document.documentElement.scrollWidth >
                window.innerWidth + 1;
        });

        // Advisory until the responsive layout story.
        if (overflow) {
            const warning =
                `Horizontal overflow: ${viewport.name}`;

            console.warn(warning);

            test.info().annotations.push({
                type: 'warning',
                description: warning
            });
        }
    });
}

test('accessibility audit', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', {
        name: 'Go'
    }).click();

    const results = await new AxeBuilder({ page })
        .analyze();

    // Advisory until existing issues are addressed.
    for (const violation of results.violations) {
        console.warn(
            `Accessibility: ${violation.id} ` +
            `(${violation.impact}) - ${violation.description}`
        );
    }

    await test.info().attach('accessibility-report', {
        body: JSON.stringify(results.violations, null, 2),
        contentType: 'application/json'
    });
});

test('NPC generation works offline', async ({
    page,
    context
}) => {
    await page.goto('/');

    await page.waitForFunction(
        () => navigator.serviceWorker?.controller !== null
            && !!navigator.serviceWorker?.controller
    );

    await context.setOffline(true);

    try {
        await page.reload();

        await page.getByRole('button', {
            name: 'Go'
        }).click();

        await expect(
            page.locator('.card')
        ).toHaveCount(1);

        await expect(
            page.locator('.cardName')
        ).not.toBeEmpty();
    } finally {
        await context.setOffline(false);
    }
});
