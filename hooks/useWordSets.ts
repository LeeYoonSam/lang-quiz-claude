import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface Word {
  id: string;
  text: string;
  meaning: string;
  wordSetId: string;
  createdAt: string;
}

export interface WordSet {
  id: string;
  name: string;
  description: string | null;
  folderId: string | null;
  createdAt: string;
  updatedAt: string;
  words?: Word[];
  wordCount?: number;
  folder?: {
    id: string;
    name: string;
  } | null;
}

export interface CreateWordSetInput {
  name: string;
  description?: string;
  folderId?: string;
}

export interface UpdateWordSetInput {
  name?: string;
  description?: string | null;
  folderId?: string | null;
}

export interface CreateWordInput {
  text: string;
  meaning: string;
}

export interface UpdateWordInput {
  text?: string;
  meaning?: string;
}

const WORDSETS_QUERY_KEY = ["wordsets"];

async function fetchWordSets(): Promise<WordSet[]> {
  const response = await fetch("/api/wordsets");
  if (!response.ok) {
    throw new Error("Failed to fetch wordsets");
  }
  return response.json();
}

async function fetchWordSet(id: string): Promise<WordSet> {
  const response = await fetch(`/api/wordsets/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch wordset");
  }
  return response.json();
}

async function createWordSet(input: CreateWordSetInput): Promise<WordSet> {
  const response = await fetch("/api/wordsets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    throw new Error("Failed to create wordset");
  }
  return response.json();
}

async function updateWordSet(
  id: string,
  input: UpdateWordSetInput
): Promise<WordSet> {
  const response = await fetch(`/api/wordsets/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    throw new Error("Failed to update wordset");
  }
  return response.json();
}

async function deleteWordSet(id: string): Promise<void> {
  const response = await fetch(`/api/wordsets/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete wordset");
  }
}

async function createWord(
  wordSetId: string,
  input: CreateWordInput
): Promise<Word> {
  const response = await fetch(`/api/wordsets/${wordSetId}/words`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    throw new Error("Failed to create word");
  }
  return response.json();
}

async function updateWord(id: string, input: UpdateWordInput): Promise<Word> {
  const response = await fetch(`/api/words/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    throw new Error("Failed to update word");
  }
  return response.json();
}

async function deleteWord(id: string): Promise<void> {
  const response = await fetch(`/api/words/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete word");
  }
}

export function useWordSets() {
  return useQuery({
    queryKey: WORDSETS_QUERY_KEY,
    queryFn: fetchWordSets,
  });
}

export function useWordSet(id: string) {
  return useQuery({
    queryKey: [...WORDSETS_QUERY_KEY, id],
    queryFn: () => fetchWordSet(id),
    enabled: !!id,
  });
}

export function useCreateWordSet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWordSet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORDSETS_QUERY_KEY });
    },
  });
}

export function useUpdateWordSet(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateWordSetInput) => updateWordSet(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORDSETS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...WORDSETS_QUERY_KEY, id] });
    },
  });
}

export function useDeleteWordSet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWordSet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORDSETS_QUERY_KEY });
    },
  });
}

export function useCreateWord(wordSetId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateWordInput) => createWord(wordSetId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...WORDSETS_QUERY_KEY, wordSetId],
      });
    },
  });
}

export function useUpdateWord(wordSetId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { wordId: string } & UpdateWordInput) => {
      const { wordId, ...input } = params;
      return updateWord(wordId, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...WORDSETS_QUERY_KEY, wordSetId],
      });
      queryClient.invalidateQueries({ queryKey: WORDSETS_QUERY_KEY });
    },
  });
}

export function useDeleteWord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORDSETS_QUERY_KEY });
    },
  });
}
