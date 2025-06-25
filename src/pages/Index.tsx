import React, { useState, useMemo } from "react";
import { Book, Headphones, Clock, CheckCircle } from "lucide-react";
import { BookCard, BookItem } from "@/components/BookCard";
import { StatsCard } from "@/components/StatsCard";
import { AddBookDialog } from "@/components/AddBookDialog";
import { SearchBar } from "@/components/SearchBar";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState<BookItem[]>([
    {
      id: "1",
      title: "Alchemist",
      author: "Paul Coelho",
      duration: "5h 35m",
      category: "Self-Help",
      status: "to-listen",
      description:
        "Follow your dreams, and the universe will conspire to help you.",
      audio: "alchemist.mp3",
    },
    {
      id: "2",
      title: "The Psychology of Money",
      author: "Morgan Housel",
      duration: "5h 39m",
      category: "Business",
      status: "listening",
      description:
        "Timeless lessons on wealth, greed, and happiness. How to think about money and make better financial decisions.",
    },
    {
      id: "3",
      title: "Sapiens",
      author: "Yuval Noah Harari",
      duration: "15h 17m",
      category: "History",
      status: "completed",
      description:
        "A Brief History of Humankind. How humans came to dominate the planet and what that means for our future.",
    },
    {
      id: "4",
      title: "The Joe Rogan Experience",
      author: "Joe Rogan",
      duration: "2h 45m",
      category: "Podcast",
      status: "to-listen",
      description:
        "Long-form conversations with fascinating guests from all walks of life. Deep dives into topics that matter.",
    },
    {
      id: "5",
      title: "Design Better",
      author: "Aarron Walter & Eli Woolery",
      duration: "4h 12m",
      category: "Technology",
      status: "to-listen",
      description:
        "A guide to human-centered design and the principles that drive great user experiences.",
    },
  ]);

  const filteredBooks = useMemo(() => {
    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [books, searchTerm]);

  const stats = useMemo(() => {
    const toListen = books.filter((book) => book.status === "to-listen").length;
    const listening = books.filter(
      (book) => book.status === "listening"
    ).length;
    const completed = books.filter(
      (book) => book.status === "completed"
    ).length;
    return { toListen, listening, completed, total: books.length };
  }, [books]);

  const handleAddBook = (newBook: Omit<BookItem, "id">) => {
    const book: BookItem = {
      ...newBook,
      id: Date.now().toString(),
    };
    setBooks((prev) => [book, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  AudioQueue
                </h1>
                <p className="text-sm text-gray-600">Your listening library</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
              <AddBookDialog onAddBook={handleAddBook} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Items"
            value={stats.total}
            icon={Book}
            color="bg-gradient-to-r from-purple-500 to-purple-600"
          />
          <StatsCard
            title="To Listen"
            value={stats.toListen}
            icon={Clock}
            color="bg-gradient-to-r from-gray-500 to-gray-600"
          />
          <StatsCard
            title="Currently Listening"
            value={stats.listening}
            icon={Headphones}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <StatsCard
            title="Completed"
            value={stats.completed}
            icon={CheckCircle}
            color="bg-gradient-to-r from-green-500 to-green-600"
          />
        </div>

        {/* Books Grid */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Your Library ({filteredBooks.length}{" "}
            {filteredBooks.length === 1 ? "item" : "items"})
          </h2>

          {filteredBooks.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-4">
                <Book className="w-16 h-16 text-gray-300 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-500 mb-2">
                {searchTerm ? "No books found" : "No books in your library"}
              </h3>
              <p className="text-gray-400 mb-4">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Add your first audiobook or podcast to get started"}
              </p>
              {!searchTerm && <AddBookDialog onAddBook={handleAddBook} />}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
