
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export function useCustomerProjects() {
  const queryClient = useQueryClient();

  // Fetch projects for a specific customer
  const getCustomerProjects = (customerId: string) => {
    return useQuery({
      queryKey: ["customer_projects", customerId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("regular_customer_projects")
          .select("*")
          .eq("regular_customer_id", customerId)
          .order("created_at", { ascending: false });
        if (error) throw error;
        return data as Tables<"regular_customer_projects">[];
      },
      enabled: !!customerId,
    });
  };

  // Add new project
  const addProject = useMutation({
    mutationFn: async (project: TablesInsert<"regular_customer_projects">) => {
      const { data, error } = await supabase
        .from("regular_customer_projects")
        .insert(project)
        .select("*")
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["customer_projects", data.regular_customer_id] });
    },
  });

  // Update project
  const updateProject = useMutation({
    mutationFn: async ({ id, project }: { id: string; project: TablesUpdate<"regular_customer_projects"> }) => {
      const { data, error } = await supabase
        .from("regular_customer_projects")
        .update(project)
        .eq("id", id)
        .select("*")
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["customer_projects", data.regular_customer_id] });
    },
  });

  return {
    getCustomerProjects,
    addProject: addProject.mutateAsync,
    updateProject: updateProject.mutateAsync,
  };
}
