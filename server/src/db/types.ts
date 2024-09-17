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
      AdminSession: {
        Row: {
          adminUserId: number
          expires: string
          id: number
          userAgent: string
        }
        Insert: {
          adminUserId: number
          expires: string
          id?: number
          userAgent: string
        }
        Update: {
          adminUserId?: number
          expires?: string
          id?: number
          userAgent?: string
        }
        Relationships: [
          {
            foreignKeyName: "AdminSession_adminUserId_fkey"
            columns: ["adminUserId"]
            isOneToOne: false
            referencedRelation: "AdminUser"
            referencedColumns: ["id"]
          },
        ]
      }
      AdminUser: {
        Row: {
          createdAt: string
          email: string
          emailVerified: string | null
          firstName: string
          id: number
          image: string | null
          lastName: string
          password: string
          phoneNumber: string | null
          role: string
          updatedAt: string
          verificationCode: string | null
        }
        Insert: {
          createdAt?: string
          email: string
          emailVerified?: string | null
          firstName: string
          id?: number
          image?: string | null
          lastName: string
          password: string
          phoneNumber?: string | null
          role: string
          updatedAt?: string
          verificationCode?: string | null
        }
        Update: {
          createdAt?: string
          email?: string
          emailVerified?: string | null
          firstName?: string
          id?: number
          image?: string | null
          lastName?: string
          password?: string
          phoneNumber?: string | null
          role?: string
          updatedAt?: string
          verificationCode?: string | null
        }
        Relationships: []
      }
      Course: {
        Row: {
          applicationDeadline: string
          cost: number
          createdAt: string
          description: string
          duration: string
          endDate: string
          id: number
          location: string
          name: string
          startDate: string
          updatedAt: string
        }
        Insert: {
          applicationDeadline: string
          cost: number
          createdAt?: string
          description: string
          duration: string
          endDate: string
          id?: number
          location: string
          name: string
          startDate: string
          updatedAt?: string
        }
        Update: {
          applicationDeadline?: string
          cost?: number
          createdAt?: string
          description?: string
          duration?: string
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
          condition: string
          createdAt: string
          id: number
          name: string
          notes: string | null
          peripherals: string[] | null
          serialNumber: string
          status: string
          updatedAt: string | null
        }
        Insert: {
          condition: string
          createdAt?: string
          id?: number
          name: string
          notes?: string | null
          peripherals?: string[] | null
          serialNumber: string
          status: string
          updatedAt?: string | null
        }
        Update: {
          condition?: string
          createdAt?: string
          id?: number
          name?: string
          notes?: string | null
          peripherals?: string[] | null
          serialNumber?: string
          status?: string
          updatedAt?: string | null
        }
        Relationships: []
      }
      GearCheckout: {
        Row: {
          approved: boolean
          approverId: number | null
          borrowerId: number
          createdAt: string
          id: number
          items: number[] | null
          pickupDate: string
          returnDate: string
          returned: boolean
          returnedOn: string | null
          returnNotes: string | null
          updatedAt: string | null
        }
        Insert: {
          approved?: boolean
          approverId?: number | null
          borrowerId: number
          createdAt?: string
          id?: number
          items?: number[] | null
          pickupDate: string
          returnDate: string
          returned?: boolean
          returnedOn?: string | null
          returnNotes?: string | null
          updatedAt?: string | null
        }
        Update: {
          approved?: boolean
          approverId?: number | null
          borrowerId?: number
          createdAt?: string
          id?: number
          items?: number[] | null
          pickupDate?: string
          returnDate?: string
          returned?: boolean
          returnedOn?: string | null
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
