import { getDb } from "./mongodb";

export async function usersCol() {
  return (await getDb()).collection("users");
}
export async function booksCol() {
  return (await getDb()).collection("books");
}
export async function userBooksCol() {
  return (await getDb()).collection("user_books");
}
