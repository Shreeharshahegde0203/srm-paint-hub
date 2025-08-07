export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      bill_attachments: {
        Row: {
          file_url: string
          id: string
          receipt_id: string
          uploaded_at: string | null
        }
        Insert: {
          file_url: string
          id?: string
          receipt_id: string
          uploaded_at?: string | null
        }
        Update: {
          file_url?: string
          id?: string
          receipt_id?: string
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bill_attachments_receipt_id_fkey"
            columns: ["receipt_id"]
            isOneToOne: false
            referencedRelation: "inventory_receipts"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          created_at: string | null
          customer_number: string | null
          email: string | null
          gstin: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          customer_number?: string | null
          email?: string | null
          gstin?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          customer_number?: string | null
          email?: string | null
          gstin?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      inventory: {
        Row: {
          created_at: string | null
          id: string
          last_restocked_date: string | null
          min_stock_alert_threshold: number | null
          product_code: string
          quantity: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_restocked_date?: string | null
          min_stock_alert_threshold?: number | null
          product_code: string
          quantity?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          last_restocked_date?: string | null
          min_stock_alert_threshold?: number | null
          product_code?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "inventory_product_code_fkey"
            columns: ["product_code"]
            isOneToOne: true
            referencedRelation: "paint_products"
            referencedColumns: ["code"]
          },
        ]
      }
      inventory_movements: {
        Row: {
          created_at: string | null
          id: string
          movement_type: string
          product_id: string
          quantity: number
          reason: string | null
          related_receipt_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          movement_type: string
          product_id: string
          quantity: number
          reason?: string | null
          related_receipt_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          movement_type?: string
          product_id?: string
          quantity?: number
          reason?: string | null
          related_receipt_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_related_receipt_id_fkey"
            columns: ["related_receipt_id"]
            isOneToOne: false
            referencedRelation: "inventory_receipts"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_receipts: {
        Row: {
          bill_due_date: string | null
          bill_paid: boolean | null
          cost_price: number
          created_at: string | null
          id: string
          product_id: string
          quantity: number
          receiving_date: string
          supplier_id: string | null
        }
        Insert: {
          bill_due_date?: string | null
          bill_paid?: boolean | null
          cost_price: number
          created_at?: string | null
          id?: string
          product_id: string
          quantity: number
          receiving_date: string
          supplier_id?: string | null
        }
        Update: {
          bill_due_date?: string | null
          bill_paid?: boolean | null
          cost_price?: number
          created_at?: string | null
          id?: string
          product_id?: string
          quantity?: number
          receiving_date?: string
          supplier_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_receipts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_receipts_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          base: string | null
          color_code: string | null
          gst_percentage: number | null
          id: string
          invoice_id: string | null
          price: number
          price_excluding_gst: number | null
          product_id: string | null
          quantity: number
          unit_quantity: number | null
          unit_type: string | null
        }
        Insert: {
          base?: string | null
          color_code?: string | null
          gst_percentage?: number | null
          id?: string
          invoice_id?: string | null
          price: number
          price_excluding_gst?: number | null
          product_id?: string | null
          quantity: number
          unit_quantity?: number | null
          unit_type?: string | null
        }
        Update: {
          base?: string | null
          color_code?: string | null
          gst_percentage?: number | null
          id?: string
          invoice_id?: string | null
          price?: number
          price_excluding_gst?: number | null
          product_id?: string | null
          quantity?: number
          unit_quantity?: number | null
          unit_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_returned_items: {
        Row: {
          created_at: string | null
          id: string
          invoice_id: string | null
          product_id: string | null
          quantity: number
          return_reason: string | null
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          invoice_id?: string | null
          product_id?: string | null
          quantity?: number
          return_reason?: string | null
          unit_price?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          invoice_id?: string | null
          product_id?: string | null
          quantity?: number
          return_reason?: string | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_returned_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_returned_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          bill_type: string | null
          billing_mode: string | null
          created_at: string | null
          created_by: string | null
          customer_id: string | null
          deleted_at: string | null
          discount: number | null
          id: string
          partial_amount_paid: number | null
          project_reference: string | null
          status: string
          total: number
        }
        Insert: {
          bill_type?: string | null
          billing_mode?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          deleted_at?: string | null
          discount?: number | null
          id?: string
          partial_amount_paid?: number | null
          project_reference?: string | null
          status?: string
          total: number
        }
        Update: {
          bill_type?: string | null
          billing_mode?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          deleted_at?: string | null
          discount?: number | null
          id?: string
          partial_amount_paid?: number | null
          project_reference?: string | null
          status?: string
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      paint_products: {
        Row: {
          brand: string
          code: string
          color: string | null
          created_at: string | null
          default_price: number
          description: string | null
          id: string
          name: string
          type: string
        }
        Insert: {
          brand: string
          code: string
          color?: string | null
          created_at?: string | null
          default_price: number
          description?: string | null
          id?: string
          name: string
          type: string
        }
        Update: {
          brand?: string
          code?: string
          color?: string | null
          created_at?: string | null
          default_price?: number
          description?: string | null
          id?: string
          name?: string
          type?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          base: string | null
          batch_number: string | null
          brand: string
          category: string | null
          cost_price: number | null
          created_at: string | null
          description: string | null
          expiry_date: string | null
          gst_rate: number
          hsn_code: string | null
          id: string
          image: string | null
          last_received_date: string | null
          name: string
          price: number
          reorder_level: number | null
          selling_price: number | null
          stock: number
          supplier_id: string | null
          type: string
          unit: string
          unit_quantity: number | null
          updated_at: string | null
        }
        Insert: {
          base?: string | null
          batch_number?: string | null
          brand: string
          category?: string | null
          cost_price?: number | null
          created_at?: string | null
          description?: string | null
          expiry_date?: string | null
          gst_rate?: number
          hsn_code?: string | null
          id?: string
          image?: string | null
          last_received_date?: string | null
          name: string
          price: number
          reorder_level?: number | null
          selling_price?: number | null
          stock: number
          supplier_id?: string | null
          type: string
          unit?: string
          unit_quantity?: number | null
          updated_at?: string | null
        }
        Update: {
          base?: string | null
          batch_number?: string | null
          brand?: string
          category?: string | null
          cost_price?: number | null
          created_at?: string | null
          description?: string | null
          expiry_date?: string | null
          gst_rate?: number
          hsn_code?: string | null
          id?: string
          image?: string | null
          last_received_date?: string | null
          name?: string
          price?: number
          reorder_level?: number | null
          selling_price?: number | null
          stock?: number
          supplier_id?: string | null
          type?: string
          unit?: string
          unit_quantity?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      project_product_usage: {
        Row: {
          created_at: string | null
          id: string
          invoice_id: string | null
          product_id: string
          project_id: string
          quantity_used: number
          used_date: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          invoice_id?: string | null
          product_id: string
          project_id: string
          quantity_used?: number
          used_date?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          invoice_id?: string | null
          product_id?: string
          project_id?: string
          quantity_used?: number
          used_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_product_usage_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_product_usage_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_product_usage_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "regular_customer_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_order_items: {
        Row: {
          cost_price: number | null
          id: string
          ordered_quantity: number
          product_id: string
          purchase_order_id: string
        }
        Insert: {
          cost_price?: number | null
          id?: string
          ordered_quantity: number
          product_id: string
          purchase_order_id: string
        }
        Update: {
          cost_price?: number | null
          id?: string
          ordered_quantity?: number
          product_id?: string
          purchase_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_items_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          created_at: string | null
          expected_delivery_date: string | null
          id: string
          order_date: string
          order_number: string
          supplier_id: string | null
        }
        Insert: {
          created_at?: string | null
          expected_delivery_date?: string | null
          id?: string
          order_date: string
          order_number: string
          supplier_id?: string | null
        }
        Update: {
          created_at?: string | null
          expected_delivery_date?: string | null
          id?: string
          order_date?: string
          order_number?: string
          supplier_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      regular_customer_invoices: {
        Row: {
          created_at: string | null
          gst_amount: number | null
          id: string
          invoice_id: string
          project_id: string | null
          regular_customer_id: string
          without_gst: boolean | null
        }
        Insert: {
          created_at?: string | null
          gst_amount?: number | null
          id?: string
          invoice_id: string
          project_id?: string | null
          regular_customer_id: string
          without_gst?: boolean | null
        }
        Update: {
          created_at?: string | null
          gst_amount?: number | null
          id?: string
          invoice_id?: string
          project_id?: string | null
          regular_customer_id?: string
          without_gst?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "regular_customer_invoices_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "regular_customer_invoices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "regular_customer_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "regular_customer_invoices_regular_customer_id_fkey"
            columns: ["regular_customer_id"]
            isOneToOne: false
            referencedRelation: "regular_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      regular_customer_payments: {
        Row: {
          created_at: string | null
          id: string
          invoice_id: string | null
          notes: string | null
          paid_amount: number
          payment_date: string
          payment_method: string | null
          regular_customer_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          paid_amount: number
          payment_date: string
          payment_method?: string | null
          regular_customer_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          paid_amount?: number
          payment_date?: string
          payment_method?: string | null
          regular_customer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "regular_customer_payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "regular_customer_payments_regular_customer_id_fkey"
            columns: ["regular_customer_id"]
            isOneToOne: false
            referencedRelation: "regular_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      regular_customer_products: {
        Row: {
          added_at: string | null
          id: string
          product_id: string
          rate: number
          regular_customer_id: string
        }
        Insert: {
          added_at?: string | null
          id?: string
          product_id: string
          rate: number
          regular_customer_id: string
        }
        Update: {
          added_at?: string | null
          id?: string
          product_id?: string
          rate?: number
          regular_customer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "regular_customer_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "regular_customer_products_regular_customer_id_fkey"
            columns: ["regular_customer_id"]
            isOneToOne: false
            referencedRelation: "regular_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      regular_customer_projects: {
        Row: {
          completion_date: string | null
          created_at: string | null
          estimated_quantity: number | null
          id: string
          notes: string | null
          project_name: string
          regular_customer_id: string
          site_address: string | null
          start_date: string | null
          status: string
        }
        Insert: {
          completion_date?: string | null
          created_at?: string | null
          estimated_quantity?: number | null
          id?: string
          notes?: string | null
          project_name: string
          regular_customer_id: string
          site_address?: string | null
          start_date?: string | null
          status?: string
        }
        Update: {
          completion_date?: string | null
          created_at?: string | null
          estimated_quantity?: number | null
          id?: string
          notes?: string | null
          project_name?: string
          regular_customer_id?: string
          site_address?: string | null
          start_date?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "regular_customer_projects_regular_customer_id_fkey"
            columns: ["regular_customer_id"]
            isOneToOne: false
            referencedRelation: "regular_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      regular_customers: {
        Row: {
          address: string | null
          created_at: string | null
          customer_type: string
          email: string | null
          gstin: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          customer_type?: string
          email?: string | null
          gstin?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          customer_type?: string
          email?: string | null
          gstin?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          gst_number: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          gst_number?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          gst_number?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
