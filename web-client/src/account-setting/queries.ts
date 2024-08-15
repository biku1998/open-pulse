import { useQuery } from "@tanstack/react-query";
import { supabase } from "../api/supabase";
import { convertToCamelCase } from "../lib/utils";
import { Token } from "../types";
import { tokenKeys } from "./query-keys";

const getTokens = async (): Promise<
  Omit<Token, "createdBy" | "createdAt">[]
> => {
  const { data, error } = await supabase
    .from("tokens")
    .select("id, name, value, is_active")
    .order("created_at", { ascending: false });
  if (error) throw new Error("Failed to get tokens");

  return convertToCamelCase<Omit<Token, "createdBy" | "createdAt">[]>(data);
};

export const useFetchTokens = () =>
  useQuery({
    queryKey: tokenKeys.list(),
    queryFn: getTokens,
  });
