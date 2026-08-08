import { backendAssetUrl, type BookSummary } from "@/lib/serverApi";
import type { BookCardData } from "./BookCard";

export function toBookCardData(book: BookSummary): BookCardData {
  return {
    id: book.id,
    slug: book.slug,
    title: book.title,
    author: book.author,
    coverImageUrl: backendAssetUrl(book.cover_image),
    price: book.price !== null ? Number(book.price) : null,
    currency: book.currency,
    rating: book.rating !== null ? Number(book.rating) : null,
    reviewsCount: book.reviews_count,
    categoryName: book.category_name,
  };
}
