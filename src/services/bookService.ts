import { staticBooks, staticAuthors } from "../mockData/staticData"
import type { Book } from "../types/Book"
import type { Author } from "../types/Authors"

interface GoogleBookItem {
	id: string
	volumeInfo: {
		title: string
		authors?: string[]
		publishedDate?: string
		description?: string
		industryIdentifiers?: Array<{
			type: string
			identifier: string
		}>
		imageLinks?: {
			thumbnail?: string
		}
	}
}

const transformGoogleBook = (item: GoogleBookItem): Book => {
	const info = item.volumeInfo
	const isbn =
		info.industryIdentifiers?.find((i) => i.type.includes("ISBN"))
			?.identifier ?? ""
	const year = info.publishedDate ? parseInt(info.publishedDate.substring(0, 4)) : 0
	
	return {
		title: info.title,
		authorId: 9999, // Placeholder ID for books not in the local database
		isbn: isbn,
		publishedYear: year,
		description: info.description ?? "No description available.",
		coverUrl: info.imageLinks?.thumbnail ?? "",
	}
}

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes"

export const searchBooksByTitle = async (title: string): Promise<Book[]> => {
	try {
		const params = new URLSearchParams({
			q: `intitle:${title}`,
			country: "US",
			maxResults: "40",
		})

		const response = await fetch(`${GOOGLE_BOOKS_API}?${params}`)

		if (!response.ok) {
			throw new Error(`API request failed with status ${response.status}`)
		}

		const data = await response.json()

		if (!data.items || data.items.length === 0) {
			return []
		}

		return data.items.map(transformGoogleBook)
	} catch (error) {
		console.error("Error fetching books from Google Books API:", error)
		return []
	}
}

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