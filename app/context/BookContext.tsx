"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../lib/firebase";

/* =========================
   TYPES
========================= */

export interface Book {
  stock: number;
  id: string;
  title: string;
  author: string;
  price: number;
  category: string;
  description: string;
  image: string;
}

interface BookContextType {
  books: Book[];
  addBook: (book: Omit<Book, "id">) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
}

const BookContext = createContext<BookContextType | undefined>(
  undefined
);

/* =========================
   PROVIDER
========================= */

export function BookProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [books, setBooks] = useState<Book[]>([]);

  /* =========================
     FETCH BOOKS REAL-TIME
  ========================= */

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "books"),
      (snapshot) => {
        const bookList: Book[] = snapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Book, "id">),
          })
        );

        setBooks(bookList);
      }
    );

    return () => unsubscribe();
  }, []);

  /* =========================
     ADD BOOK
  ========================= */

  const addBook = async (
    book: Omit<Book, "id">
  ) => {
    await addDoc(collection(db, "books"), book);
  };

  /* =========================
     DELETE BOOK
  ========================= */

  const deleteBook = async (id: string) => {
    await deleteDoc(doc(db, "books", id));
  };

  return (
    <BookContext.Provider
      value={{ books, addBook, deleteBook }}
    >
      {children}
    </BookContext.Provider>
  );
}

/* =========================
   HOOK
========================= */

export function useBooks() {
  const context = useContext(BookContext);

  if (!context) {
    throw new Error(
      "useBooks must be used inside BookProvider"
    );
  }

  return context;
}