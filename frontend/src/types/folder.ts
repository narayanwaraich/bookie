// Define Color type centrally
export const FolderColors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'gray'] as const;
export type FolderColor = typeof FolderColors[number];