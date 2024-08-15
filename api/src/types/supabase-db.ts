export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      channels: {
        Row: {
          created_at: string;
          created_by: string;
          id: string;
          name: string;
          position: number;
          project_id: string;
          updated_at: string | null;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string;
          created_by: string;
          id?: string;
          name: string;
          position: number;
          project_id: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          id?: string;
          name?: string;
          position?: number;
          project_id?: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'channels_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'channels_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'channels_updated_by_fkey';
            columns: ['updated_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      chart_aggregations: {
        Row: {
          aggregation_type: Database['public']['Enums']['chart_aggregation_type'];
          chart_id: number;
          created_at: string;
          created_by: string;
          field: string | null;
          id: number;
          updated_at: string | null;
          updated_by: string | null;
        };
        Insert: {
          aggregation_type: Database['public']['Enums']['chart_aggregation_type'];
          chart_id: number;
          created_at?: string;
          created_by: string;
          field?: string | null;
          id?: number;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Update: {
          aggregation_type?: Database['public']['Enums']['chart_aggregation_type'];
          chart_id?: number;
          created_at?: string;
          created_by?: string;
          field?: string | null;
          id?: number;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'chart_aggregations_chart_id_fkey';
            columns: ['chart_id'];
            isOneToOne: false;
            referencedRelation: 'charts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'chart_aggregations_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'chart_aggregations_updated_by_fkey';
            columns: ['updated_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      chart_conditions: {
        Row: {
          chart_id: number;
          created_at: string;
          created_by: string;
          field: Database['public']['Enums']['chart_condition_field_type'];
          id: number;
          logical_operator:
            | Database['public']['Enums']['chart_condition_logical_operator']
            | null;
          operator: Database['public']['Enums']['chart_condition_operator'];
          parent_id: number | null;
          updated_at: string | null;
          updated_by: string | null;
          value: string;
        };
        Insert: {
          chart_id: number;
          created_at?: string;
          created_by: string;
          field: Database['public']['Enums']['chart_condition_field_type'];
          id?: number;
          logical_operator?:
            | Database['public']['Enums']['chart_condition_logical_operator']
            | null;
          operator: Database['public']['Enums']['chart_condition_operator'];
          parent_id?: number | null;
          updated_at?: string | null;
          updated_by?: string | null;
          value: string;
        };
        Update: {
          chart_id?: number;
          created_at?: string;
          created_by?: string;
          field?: Database['public']['Enums']['chart_condition_field_type'];
          id?: number;
          logical_operator?:
            | Database['public']['Enums']['chart_condition_logical_operator']
            | null;
          operator?: Database['public']['Enums']['chart_condition_operator'];
          parent_id?: number | null;
          updated_at?: string | null;
          updated_by?: string | null;
          value?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'chart_conditions_chart_id_fkey';
            columns: ['chart_id'];
            isOneToOne: false;
            referencedRelation: 'charts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'chart_conditions_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'chart_conditions_parent_id_fkey';
            columns: ['parent_id'];
            isOneToOne: false;
            referencedRelation: 'chart_conditions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'chart_conditions_updated_by_fkey';
            columns: ['updated_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      charts: {
        Row: {
          chart_type: Database['public']['Enums']['chart_type'];
          created_at: string;
          created_by: string;
          description: string | null;
          id: number;
          name: string;
          project_id: string;
          updated_at: string | null;
          updated_by: string | null;
        };
        Insert: {
          chart_type: Database['public']['Enums']['chart_type'];
          created_at?: string;
          created_by: string;
          description?: string | null;
          id?: number;
          name: string;
          project_id: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Update: {
          chart_type?: Database['public']['Enums']['chart_type'];
          created_at?: string;
          created_by?: string;
          description?: string | null;
          id?: number;
          name?: string;
          project_id?: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'charts_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'charts_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'charts_updated_by_fkey';
            columns: ['updated_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      event_tags: {
        Row: {
          channel_id: string | null;
          created_at: string;
          created_by: string;
          event_id: number;
          id: number;
          key: string;
          project_id: string | null;
          value: string;
        };
        Insert: {
          channel_id?: string | null;
          created_at?: string;
          created_by: string;
          event_id: number;
          id?: number;
          key: string;
          project_id?: string | null;
          value: string;
        };
        Update: {
          channel_id?: string | null;
          created_at?: string;
          created_by?: string;
          event_id?: number;
          id?: number;
          key?: string;
          project_id?: string | null;
          value?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'event_tags_channel_id_fkey';
            columns: ['channel_id'];
            isOneToOne: false;
            referencedRelation: 'channels';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'event_tags_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'event_tags_event_id_fkey';
            columns: ['event_id'];
            isOneToOne: false;
            referencedRelation: 'events';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'event_tags_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
        ];
      };
      events: {
        Row: {
          channel_id: string;
          created_at: string;
          created_by: string;
          description: string | null;
          icon: string | null;
          id: number;
          name: string;
          project_id: string;
          user_id: string | null;
        };
        Insert: {
          channel_id: string;
          created_at?: string;
          created_by: string;
          description?: string | null;
          icon?: string | null;
          id?: number;
          name: string;
          project_id: string;
          user_id?: string | null;
        };
        Update: {
          channel_id?: string;
          created_at?: string;
          created_by?: string;
          description?: string | null;
          icon?: string | null;
          id?: number;
          name?: string;
          project_id?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'events_channel_id_fkey';
            columns: ['channel_id'];
            isOneToOne: false;
            referencedRelation: 'channels';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'events_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'events_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
        ];
      };
      insights: {
        Row: {
          created_at: string;
          created_by: string;
          icon: string | null;
          id: number;
          name: string;
          position: number;
          project_id: string;
          updated_at: string | null;
          value: string;
        };
        Insert: {
          created_at?: string;
          created_by: string;
          icon?: string | null;
          id?: number;
          name: string;
          position?: number;
          project_id: string;
          updated_at?: string | null;
          value: string;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          icon?: string | null;
          id?: number;
          name?: string;
          position?: number;
          project_id?: string;
          updated_at?: string | null;
          value?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'insights_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'insights_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
        ];
      };
      project_tokens: {
        Row: {
          created_at: string;
          created_by: string;
          id: number;
          project_id: string;
          token_id: string;
          updated_at: string | null;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string;
          created_by: string;
          id?: number;
          project_id: string;
          token_id: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          id?: number;
          project_id?: string;
          token_id?: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'project_tokens_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'project_tokens_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'project_tokens_token_id_fkey';
            columns: ['token_id'];
            isOneToOne: false;
            referencedRelation: 'tokens';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'project_tokens_updated_by_fkey';
            columns: ['updated_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      projects: {
        Row: {
          created_at: string;
          created_by: string;
          icon_url: string | null;
          id: string;
          name: string;
          updated_at: string | null;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string;
          created_by: string;
          icon_url?: string | null;
          id?: string;
          name: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          icon_url?: string | null;
          id?: string;
          name?: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'projects_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'projects_updated_by_fkey';
            columns: ['updated_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      tokens: {
        Row: {
          created_at: string;
          created_by: string;
          id: string;
          is_active: boolean;
          name: string;
          updated_at: string | null;
          updated_by: string | null;
          value: string;
        };
        Insert: {
          created_at?: string;
          created_by: string;
          id?: string;
          is_active?: boolean;
          name?: string;
          updated_at?: string | null;
          updated_by?: string | null;
          value: string;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          id?: string;
          is_active?: boolean;
          name?: string;
          updated_at?: string | null;
          updated_by?: string | null;
          value?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'tokens_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tokens_updated_by_fkey';
            columns: ['updated_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      users: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          deactivation_reason: string | null;
          email: string;
          id: string;
          is_active: boolean;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          deactivation_reason?: string | null;
          email: string;
          id: string;
          is_active?: boolean;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          deactivation_reason?: string | null;
          email?: string;
          id?: string;
          is_active?: boolean;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'users_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      chart_aggregation_type:
        | 'SUM'
        | 'AVG'
        | 'COUNT'
        | 'MIN'
        | 'MAX'
        | 'COUNT_DISTINCT'
        | 'MEDIAN';
      chart_condition_field_type:
        | 'EVENT_NAME'
        | 'TAG_KEY'
        | 'TAG_VALUE'
        | 'USER_ID';
      chart_condition_logical_operator: 'AND' | 'OR';
      chart_condition_operator: 'EQUALS' | 'NOT_EQUALS';
      chart_type:
        | 'LINE'
        | 'BAR'
        | 'PIE'
        | 'MULTI_LINE'
        | 'STACKED_BAR'
        | 'FUNNEL';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null;
          avif_autodetection: boolean | null;
          created_at: string | null;
          file_size_limit: number | null;
          id: string;
          name: string;
          owner: string | null;
          owner_id: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id: string;
          name: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id?: string;
          name?: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          owner_id: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
          version: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'objects_bucketId_fkey';
            columns: ['bucket_id'];
            isOneToOne: false;
            referencedRelation: 'buckets';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string;
          name: string;
          owner: string;
          metadata: Json;
        };
        Returns: undefined;
      };
      extension: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      filename: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      foldername: {
        Args: {
          name: string;
        };
        Returns: string[];
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: {
          size: number;
          bucket_id: string;
        }[];
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;
