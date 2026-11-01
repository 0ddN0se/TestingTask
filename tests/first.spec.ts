import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';

test('Транспортиры — первые 10 по возрастанию цены', async ({ page }) => {
	const home = new HomePage(page);
	const results = new SearchResultsPage(page);

	// Шаг 1–2
	await home.open();
	await home.search('транспортир');

	// Шаг 3
	await results.expectLoaded();
	await results.sortByPriceAsc();


	// Шаг 4
	console.log("Вывод отсортированого алиэкспрессом массива");
	const products = await results.getFirstProducts(10);
	// Выводим каждый товар: "номер. название — цена"
	products.forEach((p, i) => console.log(`${i + 1}. ${p.name} — ${p.price}`));
	expect(products.length).toBe(10);

});