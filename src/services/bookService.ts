import { staticBooks, staticAuthors } from "../mockData/staticData"
import type { Book } from "../types/Book"
import type { Author } from "../types/Authors"

export const getAllBooks = (): Promise<Book[]> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(staticBooks as Book[])
		}, 500)
	})
}

export const getAllAuthors = (): Promise<Author[]> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(staticAuthors as Author[])
		}, 500)
	})
}