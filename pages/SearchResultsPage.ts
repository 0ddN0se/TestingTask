import { Page, Locator, expect } from '@playwright/test';

export class SearchResultsPage {
	readonly page: Page;
	readonly sortButton: Locator;
	readonly cards: Locator;

	constructor(page: Page) {
		this.page = page;
		this.sortButton = page.locator('[class*="haze-select_Select__select"]');
		this.cards = page.locator('a[href*="/item/"]');
	}

	async expectLoaded() {
		await expect(this.page).toHaveURL(/search/i, { timeout: 30_000 });
	}

	async sortByPriceAsc() {
		await this.sortButton.click();
		await this.page.getByText(/Сначала дешёвые/i).first().click();
	}

	async getFirstProducts(limit: number) {
		const overlay = this.page.locator('[class*="LoadOverlay__loadOverlayShow"]');

		// 1. Ждём появления оверлея (максимум 5 секунд — обычно появляется сразу)
		await overlay.waitFor({ state: 'visible', timeout: 5_000 }).catch(() => { });

		// 2. Ждём его исчезновения
		await overlay.waitFor({ state: 'hidden', timeout: 30_000 }).catch(() => { });

		await expect(this.cards.first()).toBeVisible({ timeout: 30_000 });

		const count = Math.min(await this.cards.count(), limit);
		const products: { name: string; price: string }[] = [];

		for (let i = 0; i < count; i++) {
			const card = this.cards.nth(i);

			// название — первый текст с title
			const name = (await card
				.locator('[data-type="PartWrap-Text"][title]')
				.first()
				.getAttribute('title'))?.trim() ?? '';

			// цена — все тексты с ₽, берём последний (основная цена)
			const texts = await card
				.locator('[data-type="PartWrap-Text"]')
				.allInnerTexts();

			const prices = texts
				.map(t => t.trim())
				.filter(t => /^\d[\d\s]*₽$/.test(t));

			const price = prices[prices.length - 1] ?? '';

			products.push({ name, price });
		}

		return products;
	}
}