import { BookList } from '@/components/BookList';
import { useBookStore } from '@/store';
import { useEffect } from 'react';
import { BookSearch } from './components/BookSearch';

function App() {
  const { loadBooksFromLocalStorage } = useBookStore((state) => state);

  useEffect(() => {
    loadBooksFromLocalStorage();
  }, [loadBooksFromLocalStorage]);

  return (
    <div className="container mx-auto border border-red-500">
      <BookSearch />
      <BookList />
    </div>
  );
}

export default App;
