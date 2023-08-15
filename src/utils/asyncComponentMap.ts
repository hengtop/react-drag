type LibraryType<T = any> = Record<string, () => Promise<{ default: T }>>;

export const LIBRARY_MAP: LibraryType = {
  "antd/es/button": () => import("antd/es/button"),
};
