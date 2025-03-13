import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";

export type QueryConfig<TData, TError> = Omit<
  UseQueryOptions<TData, TError, TData>,
  "queryKey" | "queryFn"
>;

export type MutationConfig<TData, TError, TVariables> = Omit<
  UseMutationOptions<TData, TError, TVariables>,
  "mutationFn"
>;

export { useQuery, useMutation, useQueryClient };
