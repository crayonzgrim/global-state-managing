import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useBookStore } from '@/store';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Book } from './BookSearch';

export const BookList = () => {
  const { books, removeBook, moveBook, reorderBooks } = useBookStore(
    (state) => state
  );

  const renderBookItem = (book: Book, listType: Book['status']) => {
    const { key, title, author_name } = book;
    return (
      <Card key={key}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{author_name}</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-between">
          <Button variant="destructive" onClick={() => removeBook(book)}>
            Remove
          </Button>
          <div className="inline-flex gap-2">
            <Button
              variant="outline"
              onClick={() => moveBook(book, 'inProgress')}
              disabled={listType === 'inProgress'}
            >
              In Progress...
            </Button>
            <Button
              variant="outline"
              onClick={() => moveBook(book, 'backlog')}
              disabled={listType === 'backlog'}
            >
              Backlog...
            </Button>
            <Button
              variant="outline"
              onClick={() => moveBook(book, 'done')}
              disabled={listType === 'done'}
            >
              Done...
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    const listType = result.source.droppableId as Book['status'];

    reorderBooks(listType, sourceIndex, destinationIndex);
  };

  return (
    <div className="space-y-8 p-4">
      <h2 className="mb-4 text-2xl font-bold">My Reading List</h2>

      <DragDropContext onDragEnd={onDragEnd}>
        {books.filter((book) => book.status === 'inProgress').length > 0 && (
          <>
            <h3 className="mb-4 text-xl font-bold">In Progress</h3>
            <div>
              {books
                .filter((book) => book.status === 'inProgress')
                .map((book) => renderBookItem(book, 'inProgress'))}
            </div>
          </>
        )}
      </DragDropContext>

      <DragDropContext onDragEnd={onDragEnd}>
        {books.filter((book) => book.status === 'backlog').length > 0 && (
          <>
            <h3 className="mb-4 text-xl font-bold">Backlog</h3>
            <div>
              {books
                .filter((book) => book.status === 'backlog')
                .map((book) => renderBookItem(book, 'backlog'))}
            </div>
          </>
        )}
      </DragDropContext>

      <DragDropContext onDragEnd={onDragEnd}>
        {books.filter((book) => book.status === 'done').length > 0 && (
          <>
            <h3 className="mb-4 text-xl font-bold">Done</h3>
            <div>
              {books
                .filter((book) => book.status === 'done')
                .map((book) => renderBookItem(book, 'done'))}
            </div>
          </>
        )}
      </DragDropContext>
    </div>
  );
};
