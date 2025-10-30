import { useState, useEffect } from "react"
import { BookOpen } from "lucide-react"
import BookCard from "./components/BookCard"
import AuthorCard from "./components/AuthorCard"
import SearchBar from "./components/SearchBar"
import { getAllBooks, getAllAuthors } from "./services/bookService"
import AddAuthorForm from "./components/tabs/AddAuthorForm"
import type { Author } from "./types/Authors"
import AddBookForm from "./components/tabs/AddBookForm"
import type { Book } from "./types/Book"

import NavigationTabs from "./components/NavogationTabs"

// Utility type to assert that the ID property exists for components that rely on it
type ItemWithId<T> = T & { id: number }

const App = () => {
	const [activeTab, setActiveTab] = useState("books")
	const [searchTerm, setSearchTerm] = useState("")
	const [books, setBooks] = useState<Book[]>([])
	const [authors, setAuthors] = useState<Author[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true)
			try {
				const [fetchedBooks, fetchedAuthors] = await Promise.all([
					getAllBooks(),
					getAllAuthors(),
				])
				setBooks(fetchedBooks as Book[])
				setAuthors(fetchedAuthors as Author[])
			} catch (error) {
				console.error("Failed to fetch initial data:", error)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [])

	const handleAddAuthor = (author: Author) => {
		const newId = Math.max(...authors.map(a => a.id ?? 0), 0) + 1
		const newAuthor = { ...author, id: newId }

		setAuthors((prevAuthors) => [...prevAuthors, newAuthor])

		setActiveTab("authors")

		console.log("New author added:", newAuthor)
	}

	const handleAddBook = (book: Book) => {
		const newId = Math.max(...books.map(b => b.id ?? 0), 0) + 1
		const newBook = { ...book, id: newId }

		setBooks((prevBooks) => [...prevBooks, newBook])
		
		setActiveTab("books")

		console.log("New book added:", newBook)
	}

	const getAuthorById = (authorId: number) => {
		return authors.find((author) => author.id === authorId)
	}

	const getBookCountByAuthor = (authorId: number) => {
		return books.filter((book) => book.authorId === authorId).length
	}

	const filteredBooks = books.filter((book) => {
		const author = getAuthorById(book.authorId)
		return (
			book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			author?.name.toLowerCase().includes(searchTerm.toLowerCase())
		)
	})

	const filteredAuthors = authors.filter((author) =>
		author.name.toLowerCase().includes(searchTerm.toLowerCase())
	)

	return (
		<div className="min-h-screen bg-gray-100">
			<header className="bg-indigo-600 text-white shadow-lg">
				<div className="container mx-auto px-4 py-6">
					<div className="flex items-center gap-3 mb-4">
						<BookOpen className="w-8 h-8" />
						<h1 className="text-3xl font-bold">Books & Authors Library</h1>
					</div>
					<SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
				</div>
			</header>

			<NavigationTabs
				activeTab={activeTab}
				setActiveTab={setActiveTab}
				booksCount={filteredBooks.length}
				authorsCount={filteredAuthors.length}
			/>

			<main className="container mx-auto px-4 py-8">
				{loading && (
					<div className="text-center py-12 text-gray-500 text-xl font-medium">
						Loading data...
					</div>
				)}

				{!loading && activeTab === "books" && (
					<div className="space-y-4 flex flex-col flex-wrap">
						{filteredBooks.length > 0 ? (
							filteredBooks.map((book) => (
								<BookCard
									key={book.id}
									book={book as ItemWithId<Book>}
									author={getAuthorById(book.authorId)! as ItemWithId<Author>}
								/>
							))
						) : (
							<div className="text-center py-12 text-gray-500">
								No books found matching your search.
							</div>
						)}
					</div>
				)}

				{!loading && activeTab === "authors" && (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{filteredAuthors.length > 0 ? (
							filteredAuthors.map((author) => (
								<AuthorCard
									key={author.id}
									author={author as ItemWithId<Author>}
									bookCount={getBookCountByAuthor(author.id!)}
								/>
							))
						) : (
							<div className="col-span-2 text-center py-12 text-gray-500">
								No authors found matching your search.
							</div>
						)}
					</div>
				)}

				{!loading && activeTab === "add-author" && (
					<AddAuthorForm
						onSubmit={handleAddAuthor}
						onCancel={() => setActiveTab("authors")}
					/>
				)}

				{!loading && activeTab === "add-book" && (
					<AddBookForm authors={authors} onSubmit={handleAddBook} />
				)}
			</main>
		</div>
	)
}

export default App