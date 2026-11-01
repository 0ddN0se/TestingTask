import { Page, Locator } from '@playwright/test';

export class HomePage {
	readonly page: Page;
	readonly searchInput: Locator;

	constructor(page: Page) {
		this.page = page;
		this.searchInput = page.locator('#SearchText');
	}

	async open() {
		await this.page.goto('https://aliexpress.ru/', { waitUntil: 'domcontentloaded' });
	}

	async search(query: string) {
		// явно ожидаем поле поиска
		await this.searchInput.waitFor({ state: 'visible', timeout: 60_000 });
		// очищаем поле и заполняем текстом
		await this.searchInput.fill(query);
		await this.searchInput.press('Enter');
	}
}