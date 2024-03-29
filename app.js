class Book {
	constructor(title, author, isbn) {
		this.title = title;
		this.author = author;
		this.isbn = isbn;
	}
}

// UI Class : Handles UI Tasks
class UI {
	static displayBooks() {
		// const StoredBooks = [
		// 	{
		// 		title: 'Livre un',
		// 		author: 'John Doe',
		// 		isbn: '3434434',
		// 	},
		// 	{
		// 		title: 'Livre un',
		// 		author: 'John Doe',
		// 		isbn: '45543',
		// 	},
		// ];

		const books = Store.getBooks();

		books.forEach((book) => UI.addBookToList(book));
	}
	static addBookToList(book) {
		const list = document.querySelector('#book-list');

		const row = document.createElement('tr');

		row.innerHTML = `
			<td>${book.title}</td>
			<td>${book.author}</td>
			<td>${book.isbn}</td>
			<td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
		`;

		list.appendChild(row);
	}

	static deleteBook(el) {
		if (el.classList.contains('delete')) {
			el.parentElement.parentElement.remove();
		}
	}

	static showAlert(message, className) {
		const div = document.createElement('div');
		div.className = `alert alert-${className} text-center`;
		div.appendChild(document.createTextNode(message));
		const container = document.querySelector('.container');
		const form = document.querySelector('#book-form');
		// Insert the div before the form on the DOM
		container.insertBefore(div, form);

		// Vanish in 3 seconds
		setTimeout(() => document.querySelector('.alert').remove(), 1000);
	}
	static clearFields() {
		document.querySelector('#title').value = '';
		document.querySelector('#author').value = '';
		document.querySelector('#isbn').value = '';
	}
}

// Store Class: Handles Storage
class Store {
	static getBooks() {
		let books;
		if (localStorage.getItem('books') === null) {
			books = [];
		} else {
			books = JSON.parse(localStorage.getItem('books'));
		}

		return books;
	}

	static addBook(book) {
		const books = Store.getBooks();
		books.push(book);

		// if (Array.isArray(books)) {
		// 	books.push(book);
		// } else {
		// 	console.log('books variable does not store an array');
		// }

		localStorage.setItem('books', JSON.stringify(books));
	}

	static removeBook(isbn) {
		const books = Store.getBooks();

		books.forEach((book, index) => {
			if (book.isbn === isbn) {
				books.splice(index, 1);
			}
		});

		localStorage.setItem('books', JSON.stringify(books));
	}
}

// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
	// Prevent actual submit
	e.preventDefault();

	// get form values
	const title = document.querySelector('#title').value;
	const author = document.querySelector('#author').value;
	const isbn = document.querySelector('#isbn').value;

	// Validate
	if (title === '' || author === '' || isbn === '') {
		UI.showAlert('Veuillez remplir tous les champs!!!', 'danger');
	} else {
		// instantiate book
		const book = new Book(title, author, isbn);

		// Add Book to the DOM UI
		UI.addBookToList(book);

		// Add Book to store
		Store.addBook(book);

		// Show success message
		UI.showAlert('Livre Ajouté', 'success');

		// Clear fields

		UI.clearFields();
	}
});

// Event : Delete a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
	// Remove Book from store
	Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

	UI.deleteBook(e.target);

	// Show success message
	UI.showAlert('Livre supprimé', 'danger');
});
