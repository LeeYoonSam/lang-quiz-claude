"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";

export interface WordSet {
  id: string;
  name: string;
  description?: string;
  folderId?: string;
  wordCount?: number;
  createdAt: string;
  updatedAt: string;
  words?: Word[];
}

export interface Word {
  id: string;
  text: string;
  meaning: string;
  wordSetId: string;
  createdAt: string;
  updatedAt: string;
}

export function useWordSets(): UseQueryResult<WordSet[], Error> {
  return useQuery({
    queryKey: ["wordsets"],
    queryFn: async () => {
      const res = await fetch("/api/wordsets");
      if (!res.ok) throw new Error("Failed to fetch wordsets");
      return res.json();
    },
  });
}

export function useWordSet(
  id: string | undefined
): UseQueryResult<WordSet, Error> {
  return useQuery({
    queryKey: ["wordsets", id],
    queryFn: async () => {
      if (!id) throw new Error("ID is required");
      const res = await fetch(`/api/wordsets/${id}`);
      if (!res.ok) throw new Error("Failed to fetch wordset");
      return res.json();
    },
    enabled: !!id,
  });
}

export function useCreateWordSet(): UseMutationResult<
  WordSet,
  Error,
  { name: string; description?: string },
  unknown
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/wordsets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create wordset");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wordsets"] });
    },
  });
}

export function useUpdateWordSet(
  id: string
): UseMutationResult<
  WordSet,
  Error,
  { name?: string; description?: string },
  unknown
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await fetch(`/api/wordsets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update wordset");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wordsets"] });
      queryClient.invalidateQueries({ queryKey: ["wordsets", id] });
    },
  });
}

export function useDeleteWordSet(): UseMutationResult<
  void,
  Error,
  string,
  unknown
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/wordsets/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete wordset");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wordsets"] });
    },
  });
}

export function useCreateWord(
  wordsetId: string
): UseMutationResult<
  Word,
  Error,
  { text: string; meaning: string },
  unknown
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await fetch(`/api/wordsets/${wordsetId}/words`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create word");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wordsets", wordsetId] });
    },
  });
}

export function useUpdateWord(
  id: string
): UseMutationResult<Word, Error, { text?: string; meaning?: string }, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await fetch(`/api/words/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update word");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["wordsets"] });
      queryClient.invalidateQueries({
        queryKey: ["wordsets", data.wordSetId],
      });
    },
  });
}

export function useDeleteWord(): UseMutationResult<void, Error, string, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/words/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete word");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wordsets"] });
    },
  });
}
