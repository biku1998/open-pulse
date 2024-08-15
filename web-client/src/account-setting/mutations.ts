import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../api/supabase";
import { convertToCamelCase } from "../lib/utils";
import { Token } from "../types";
import { tokenKeys } from "./query-keys";

const createToken = async (
  payload: Pick<Token, "name" | "value" | "createdBy">,
): Promise<Token> => {
  const { data, error } = await supabase
    .from("tokens")
    .insert({
      name: payload.name,
      value: payload.value,
      created_by: payload.createdBy,
    })
    .select("*")
    .single();

  if (error) throw new Error("Failed to create token");

  return convertToCamelCase<Token>(data);
};

export const useCreateToken = ({
  onSuccess,
}: {
  onSuccess?: (token: Token) => void;
} = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createToken,
    onSuccess: (token) => {
      queryClient.invalidateQueries({
        queryKey: tokenKeys.list(),
      });
      if (onSuccess) onSuccess(token);
    },
  });
};

const toggleToken = async ({
  id,
  isActive,
  updatedBy,
}: {
  id: string;
  isActive: boolean;
  updatedBy: string;
}) => {
  const { error } = await supabase
    .from("tokens")
    .update({ is_active: isActive, updated_by: updatedBy })
    .eq("id", id);

  if (error) throw new Error("Failed to toggle token");
};

export const useToggleToken = ({
  onError,
  onSuccess,
}: {
  onSuccess?: (data: {
    id: string;
    isActive: boolean;
    updatedBy: string;
  }) => void;
  onError?: (error: Error) => void;
} = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleToken,
    onMutate: ({ id, isActive }) => {
      queryClient.cancelQueries({ queryKey: tokenKeys.list() });

      const previousTokens = queryClient.getQueryData(tokenKeys.list());

      queryClient.setQueryData(tokenKeys.list(), (oldTokens: Token[]) => {
        return oldTokens.map((token) => {
          if (token.id === id) {
            return {
              ...token,
              isActive,
            };
          }
          return token;
        });
      });
      return { previousTokens };
    },
    onError: (error, _, context) => {
      if (context) {
        queryClient.setQueryData(tokenKeys.list(), context.previousTokens);
      }
      if (onError) onError(error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: tokenKeys.list(),
      });
    },
    onSuccess: (_, variables) => {
      if (onSuccess) onSuccess(variables);
    },
  });
};
