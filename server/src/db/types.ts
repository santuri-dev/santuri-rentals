export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Course: {
        Row: {
          cost: number
          createdAt: string
          description: string
          endDate: string
          id: number
          location: string
          name: string
          startDate: string
          updatedAt: string
        }
        Insert: {
          cost: number
          createdAt?: string
          description: string
          endDate: string
          id?: number
          location: string
          name: string
          startDate: string
          updatedAt?: string
        }
        Update: {
          cost?: number
          createdAt?: string
          description?: string
          endDate?: string
          id?: number
          location?: string
          name?: string
          startDate?: string
          updatedAt?: string
        }
        Relationships: []
      }
      Gear: {
        Row: {
          accessories: string | null
          condition: string
          createdAt: string
          gearCheckoutId: number | null
          id: number
          name: string
          notes: string | null
          serialNumber: string
          status: string
          updatedAt: string | null
        }
        Insert: {
          accessories?: string | null
          condition: string
          createdAt?: string
          gearCheckoutId?: number | null
          id?: number
          name: string
          notes?: string | null
          serialNumber: string
          status: string
          updatedAt?: string | null
        }
        Update: {
          accessories?: string | null
          condition?: string
          createdAt?: string
          gearCheckoutId?: number | null
          id?: number
          name?: string
          notes?: string | null
          serialNumber?: string
          status?: string
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Gear_gearCheckoutId_fkey"
            columns: ["gearCheckoutId"]
            isOneToOne: false
            referencedRelation: "GearCheckout"
            referencedColumns: ["id"]
          },
        ]
      }
      GearCheckout: {
        Row: {
          approved: boolean
          approverId: number
          borrowerId: number
          createdAt: string
          id: number
          pickupDate: string
          returnDate: string
          returned: boolean
          returnedOn: string
          returnNotes: string | null
          updatedAt: string | null
        }
        Insert: {
          approved: boolean
          approverId: number
          borrowerId: number
          createdAt?: string
          id?: number
          pickupDate: string
          returnDate: string
          returned: boolean
          returnedOn: string
          returnNotes?: string | null
          updatedAt?: string | null
        }
        Update: {
          approved?: boolean
          approverId?: number
          borrowerId?: number
          createdAt?: string
          id?: number
          pickupDate?: string
          returnDate?: string
          returned?: boolean
          returnedOn?: string
          returnNotes?: string | null
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "GearCheckout_approverId_fkey"
            columns: ["approverId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "GearCheckout_borrowerId_fkey"
            columns: ["borrowerId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Session: {
        Row: {
          expires: string
          id: number
          userAgent: string
          userId: number
        }
        Insert: {
          expires: string
          id?: number
          userAgent: string
          userId: number
        }
        Update: {
          expires?: string
          id?: number
          userAgent?: string
          userId?: number
        }
        Relationships: [
          {
            foreignKeyName: "Session_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      User: {
        Row: {
          createdAt: string
          email: string
          emailVerified: string | null
          firstName: string | null
          id: number
          image: string | null
          imgPlaceholder: string | null
          lastName: string | null
          password: string
          phoneNumber: string | null
          resetPasswordToken: string | null
          updatedAt: string
          username: string
          verificationCode: string | null
        }
        Insert: {
          createdAt?: string
          email: string
          emailVerified?: string | null
          firstName?: string | null
          id?: number
          image?: string | null
          imgPlaceholder?: string | null
          lastName?: string | null
          password: string
          phoneNumber?: string | null
          resetPasswordToken?: string | null
          updatedAt?: string
          username: string
          verificationCode?: string | null
        }
        Update: {
          createdAt?: string
          email?: string
          emailVerified?: string | null
          firstName?: string | null
          id?: number
          image?: string | null
          imgPlaceholder?: string | null
          lastName?: string | null
          password?: string
          phoneNumber?: string | null
          resetPasswordToken?: string | null
          updatedAt?: string
          username?: string
          verificationCode?: string | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
