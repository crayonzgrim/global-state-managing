import { create } from 'zustand';

export interface Book {
  key: string;
  title: string;
  author_name: string;
  first_published_year: string;
  number_of_pages_median: string;
  status: 'done' | 'inProgress' | 'backlog';
}

interface BookState {
  books: Book[];
}

interface BookStore extends BookState {
  addBook: (newBook: Book) => void;
  removeBook: (bookToRemove: Book) => void;
  moveBook: (bookToMove: Book, newStatus: Book['status']) => void;
  loadBooksFromLocalStorage: () => void;
  reorderBooks: (
    listType: Book['status'],
    startIndex: number,
    endIndex: number
  ) => void;
}

export const useBookStore = create<BookStore>((set) => ({
  books: [],
  addBook: (newBook) =>
    set((state: BookState) => {
      const updatedBooks: Book[] = [
        ...state.books,
        { ...newBook, status: 'backlog' }
      ];

      localStorage.setItem('readingList', JSON.stringify(updatedBooks));

      return { books: updatedBooks };
    }),
  removeBook: (bookToRemove) =>
    set((state: BookState) => {
      if (window.confirm('Are you sure?')) {
        const updatedBooks = state.books.filter((book) => {
          return book.key !== bookToRemove.key;
        });

        localStorage.setItem('readingList', JSON.stringify(updatedBooks));

        return { books: updatedBooks };
      }

      return state;
    }),
  moveBook: (bookToMove, newStatus) =>
    set((state: BookState) => {
      const updatedBooks: Book[] = state.books.map((book) =>
        book.key === bookToMove.key ? { ...book, status: newStatus } : book
      );

      localStorage.setItem('readingList', JSON.stringify(updatedBooks));

      return { books: updatedBooks };
    }),
  loadBooksFromLocalStorage: () => {
    const storedBooks = localStorage.getItem('readingList');

    if (storedBooks) {
      set({ books: JSON.parse(storedBooks) });
    } else {
      set({ books: [] });
    }
  },

  reorderBooks: (
    listType: Book['status'],
    startIndex: number,
    endIndex: number
  ) => {
    set((state: BookState) => {
      const filteredBooks = state.books.filter(
        (book) => book.status === listType
      );

      const [reorderBook] = filteredBooks.splice(startIndex, 1);

      filteredBooks.splice(endIndex, 0, reorderBook);

      const updatedBooks = state.books.map((book) =>
        book.status === listType ? filteredBooks.shift() || book : book
      );

      localStorage.setItem('readingList', JSON.stringify(updatedBooks));

      return { books: updatedBooks };
    });
  }
}));
