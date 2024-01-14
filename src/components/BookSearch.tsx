import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { useBookStore } from '@/store';
import axios from 'axios';
import { useState } from 'react';

export type Book = {
  key: string;
  title: string;
  author_name: string;
  first_published_year: string;
  number_of_pages_median: string;
  status: 'done' | 'inProgress' | 'backlog';
};

type SearchResult = {
  docs: Book[];
  numFound: number;
};

export const BookSearch = () => {
  const { books, addBook } = useBookStore((state) => state);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalResults, setTotalResult] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const resultsPerPage = 100;

  const searchBooks = async (page: number = 1) => {
    if (!query) return;

    setIsLoading(true);

    try {
      const res = await axios.get<SearchResult>(
        `https://openlibrary.org/search.json?q=${query}&page=${page}&limit=${resultsPerPage}`
      );

      setResults(res.data.docs);
      setTotalResult(res.data.numFound);
      setCurrentPage(page);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeypress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      searchBooks();
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(totalResults / resultsPerPage)) {
      searchBooks(currentPage + 1);
    }
  };

  const startIdx = (currentPage - 1) * resultsPerPage + 1;
  const endIdx = Math.min(startIdx + resultsPerPage - 1, totalResults);

  return (
    <div className="p-4">
      <div className="sm:max-w-xs">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyUp={handleKeypress}
          placeholder="Search for your next book!"
        />
      </div>
      <Button onClick={() => searchBooks()} disabled={isLoading}>
        {isLoading ? 'Searching...' : 'Search'}
      </Button>

      <div className="mt-2">
        {totalResults > 0 && (
          <p className="text-sm">
            showing {startIdx} - {endIdx} out of {totalResults} results
          </p>
        )}
      </div>

      <div className="mt-4 max-h-64 overflow-auto">
        {query.length > 0 && results.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="p-2">Title</TableHead>
                <TableHead className="p-2">Author</TableHead>
                <TableHead className="p-2">Year</TableHead>
                <TableHead className="p-2">Page Count</TableHead>
                <TableHead className="p-2"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((book) => {
                const {
                  key,
                  title,
                  author_name,
                  first_published_year,
                  number_of_pages_median
                } = book;
                return (
                  <TableRow key={key}>
                    <TableCell>{title}</TableCell>
                    <TableCell>{author_name}</TableCell>
                    <TableCell>{first_published_year}</TableCell>
                    <TableCell>{number_of_pages_median || '-'}</TableCell>
                    <TableCell>
                      <Button
                        variant={'outline'}
                        onClick={() =>
                          addBook({
                            key,
                            title,
                            author_name,
                            first_published_year,
                            number_of_pages_median,
                            status: 'backlog'
                          })
                        }
                        disabled={books.some((a) => a.key === book.key)}
                      >
                        Add
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="flex max-h-60 items-center justify-center p-16"></div>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <Button
          variant={'outline'}
          onClick={handlePrevPage}
          disabled={currentPage <= 1 || isLoading}
        >
          PREV
        </Button>
        <span>PAGE : {currentPage}</span>
        <Button
          variant={'outline'}
          onClick={handleNextPage}
          disabled={
            currentPage >= Math.ceil(totalResults / resultsPerPage) || isLoading
          }
        >
          NEXT
        </Button>
      </div>
    </div>
  );
};
