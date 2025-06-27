// /constants/swrKeys.ts
export const swrKeys = {
  users: "/users",
  user: (id: number) => `/users/${id}`,
  posts: "/posts",
};
export const swrKeysWithPrefix = {
  users: (prefix: string) => `${prefix}/users`,
  user: (prefix: string, id: number) => `${prefix}/users/${id}`,
  posts: (prefix: string) => `${prefix}/posts`,
};
export const swrKeysWithPrefixAndSuffix = {
  users: (prefix: string, suffix: string) => `${prefix}/users/${suffix}`,
  user: (prefix: string, id: number, suffix: string) =>
    `${prefix}/users/${id}/${suffix}`,
  posts: (prefix: string, suffix: string) => `${prefix}/posts/${suffix}`,
};
export const swrKeysWithPrefixAndSuffixAndQuery = {
  users: (prefix: string, suffix: string, query: string) =>
    `${prefix}/users/${suffix}?${query}`,
  user: (prefix: string, id: number, suffix: string, query: string) =>
    `${prefix}/users/${id}/${suffix}?${query}`,
  posts: (prefix: string, suffix: string, query: string) =>
    `${prefix}/posts/${suffix}?${query}`,
};
export const swrKeysWithPrefixAndQuery = {
  users: (prefix: string, query: string) => `${prefix}/users?${query}`,
  user: (prefix: string, id: number, query: string) =>
    `${prefix}/users/${id}?${query}`,
  posts: (prefix: string, query: string) => `${prefix}/posts?${query}`,
};
export const swrKeysWithSuffix = {
  users: (suffix: string) => `/users/${suffix}`,
  user: (id: number, suffix: string) => `/users/${id}/${suffix}`,
  posts: (suffix: string) => `/posts/${suffix}`,
};
export const swrKeysWithSuffixAndQuery = {
  users: (suffix: string, query: string) => `/users/${suffix}?${query}`,
  user: (id: number, suffix: string, query: string) =>
    `/users/${id}/${suffix}?${query}`,
  posts: (suffix: string, query: string) => `/posts/${suffix}?${query}`,
};
export const swrKeysWithQuery = {
  users: (query: string) => `/users?${query}`,
  user: (id: number, query: string) => `/users/${id}?${query}`,
  posts: (query: string) => `/posts?${query}`,
};
export const swrKeysWithPrefixAndSuffixAndQueryAndId = {
  users: (prefix: string, suffix: string, query: string, id: number) =>
    `${prefix}/users/${suffix}?${query}&id=${id}`,
  user: (prefix: string, id: number, suffix: string, query: string) =>
    `${prefix}/users/${id}/${suffix}?${query}`,
  posts: (prefix: string, suffix: string, query: string) =>
    `${prefix}/posts/${suffix}?${query}`,
  userWithId: (prefix: string, id: number, query: string) =>
    `${prefix}/users/${id}?${query}`,
  postsWithId: (prefix: string, id: number, query: string) =>
    `${prefix}/posts/${id}?${query}`,
  usersWithId: (prefix: string, id: number, query: string) =>
    `${prefix}/users/${id}?${query}`,
  postsWithPrefix: (prefix: string, query: string) =>
    `${prefix}/posts?${query}`,
  usersWithPrefix: (prefix: string, query: string) =>
    `${prefix}/users?${query}`,
  userWithPrefix: (prefix: string, id: number, query: string) =>
    `${prefix}/users/${id}?${query}`,
  postsWithPrefixAndId: (prefix: string, id: number, query: string) =>
    `${prefix}/posts/${id}?${query}`,
  usersWithPrefixAndId: (prefix: string, id: number, query: string) =>
    `${prefix}/users/${id}?${query}`,
  userWithPrefixAndId: (prefix: string, id: number, query: string) =>
    `${prefix}/users/${id}?${query}`,
  postsWithPrefixAndSuffix: (prefix: string, suffix: string, query: string) =>
    `${prefix}/posts/${suffix}?${query}`,
  usersWithPrefixAndSuffix: (prefix: string, suffix: string, query: string) =>
    `${prefix}/users/${suffix}?${query}`,
  userWithPrefixAndSuffix: (
    prefix: string,
    id: number,
    suffix: string,
    query: string
  ) => `${prefix}/users/${id}/${suffix}?${query}`,
  postsWithPrefixAndSuffixAndId: (
    prefix: string,
    suffix: string,
    id: number,
    query: string
  ) => `${prefix}/posts/${suffix}/${id}?${query}`,
  usersWithPrefixAndSuffixAndId: (
    prefix: string,
    suffix: string,
    id: number,
    query: string
  ) => `${prefix}/users/${suffix}/${id}?${query}`,
  userWithPrefixAndSuffixAndId: (
    prefix: string,
    id: number,
    suffix: string,
    query: string
  ) => `${prefix}/users/${id}/${suffix}?${query}`,
  postsWithPrefixAndQuery: (prefix: string, query: string) =>
    `${prefix}/posts?${query}`,
  usersWithPrefixAndQuery: (prefix: string, query: string) =>
    `${prefix}/users?${query}`,
  userWithPrefixAndQuery: (prefix: string, id: number, query: string) =>
    `${prefix}/users/${id}?${query}`,
  postsWithPrefixAndSuffixAndQuery: (
    prefix: string,
    suffix: string,
    query: string
  ) => `${prefix}/posts/${suffix}?${query}`,
  usersWithPrefixAndSuffixAndQuery: (
    prefix: string,
    suffix: string,
    query: string
  ) => `${prefix}/users/${suffix}?${query}`,
  userWithPrefixAndSuffixAndQuery: (
    prefix: string,
    id: number,
    suffix: string,
    query: string
  ) => `${prefix}/users/${id}/${suffix}?${query}`,
  postsWithPrefixAndSuffixAndQueryAndId: (
    prefix: string,
    suffix: string,
    id: number,
    query: string
  ) => `${prefix}/posts/${suffix}/${id}?${query}`,
  usersWithPrefixAndSuffixAndQueryAndId: (
    prefix: string,
    suffix: string,
    id: number,
    query: string
  ) => `${prefix}/users/${suffix}/${id}?${query}`,
  userWithPrefixAndSuffixAndQueryAndId: (
    prefix: string,
    id: number,
    suffix: string,
    query: string
  ) => `${prefix}/users/${id}/${suffix}?${query}`,
};
