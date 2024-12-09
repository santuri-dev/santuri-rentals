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
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
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
          firstName: string | null
          id: number
          image: string | null
          lastName: string | null
          password: string
          phoneNumber: string | null
          role: string
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
          lastName?: string | null
          password: string
          phoneNumber?: string | null
          role?: string
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
          lastName?: string | null
          password?: string
          phoneNumber?: string | null
          role?: string
          updatedAt?: string
          username?: string
          verificationCode?: string | null
        }
        Relationships: []
      }
      Category: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      Course: {
        Row: {
          applicationDeadline: string
          cost: number
          createdAt: string
          description: string
          endDate: string
          id: number
          imagePlaceholder: string | null
          imageUrl: string | null
          location: string
          name: string
          slug: string
          startDate: string
          updatedAt: string
        }
        Insert: {
          applicationDeadline: string
          cost: number
          createdAt?: string
          description: string
          endDate: string
          id?: number
          imagePlaceholder?: string | null
          imageUrl?: string | null
          location: string
          name: string
          slug: string
          startDate: string
          updatedAt?: string
        }
        Update: {
          applicationDeadline?: string
          cost?: number
          createdAt?: string
          description?: string
          endDate?: string
          id?: number
          imagePlaceholder?: string | null
          imageUrl?: string | null
          location?: string
          name?: string
          slug?: string
          startDate?: string
          updatedAt?: string
        }
        Relationships: []
      }
      Gear: {
        Row: {
          condition: string
          createdAt: string
          gearCheckoutId: number | null
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
          gearCheckoutId?: number | null
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
          gearCheckoutId?: number | null
          id?: number
          name?: string
          notes?: string | null
          peripherals?: string[] | null
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
          borrowerId: number
          closed: boolean
          closedById: number | null
          createdAt: string
          id: number
          items: number[] | null
          pickupDate: string
          returnDate: string
          updatedAt: string | null
        }
        Insert: {
          borrowerId: number
          closed?: boolean
          closedById?: number | null
          createdAt?: string
          id?: number
          items?: number[] | null
          pickupDate: string
          returnDate: string
          updatedAt?: string | null
        }
        Update: {
          borrowerId?: number
          closed?: boolean
          closedById?: number | null
          createdAt?: string
          id?: number
          items?: number[] | null
          pickupDate?: string
          returnDate?: string
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "GearCheckout_borrowerId_fkey"
            columns: ["borrowerId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "GearCheckout_closedById_fkey"
            columns: ["closedById"]
            isOneToOne: false
            referencedRelation: "AdminUser"
            referencedColumns: ["id"]
          },
        ]
      }
      Order: {
        Row: {
          createdAt: string
          currency: string
          email: string
          firstName: string | null
          id: number
          lastName: string | null
          phone: string | null
          ref: string
          status: string
          totalCost: number
          trackingId: string | null
        }
        Insert: {
          createdAt?: string
          currency: string
          email: string
          firstName?: string | null
          id?: number
          lastName?: string | null
          phone?: string | null
          ref: string
          status: string
          totalCost: number
          trackingId?: string | null
        }
        Update: {
          createdAt?: string
          currency?: string
          email?: string
          firstName?: string | null
          id?: number
          lastName?: string | null
          phone?: string | null
          ref?: string
          status?: string
          totalCost?: number
          trackingId?: string | null
        }
        Relationships: []
      }
      OrderItem: {
        Row: {
          currency: string
          id: number
          orderId: number | null
          price: number
          productId: number
          quantity: number
        }
        Insert: {
          currency: string
          id?: number
          orderId?: number | null
          price: number
          productId: number
          quantity: number
        }
        Update: {
          currency?: string
          id?: number
          orderId?: number | null
          price?: number
          productId?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "OrderItem_orderId_fkey"
            columns: ["orderId"]
            isOneToOne: false
            referencedRelation: "Order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "OrderItem_productId_fkey"
            columns: ["productId"]
            isOneToOne: false
            referencedRelation: "Product"
            referencedColumns: ["id"]
          },
        ]
      }
      Product: {
        Row: {
          categoryId: number | null
          createdAt: string
          currency: string
          description: string
          id: number
          imagePlaceholder: string | null
          imageUrl: string | null
          name: string
          price: number
          slug: string
          status: string
          stock: number
        }
        Insert: {
          categoryId?: number | null
          createdAt?: string
          currency: string
          description: string
          id?: number
          imagePlaceholder?: string | null
          imageUrl?: string | null
          name: string
          price: number
          slug: string
          status?: string
          stock: number
        }
        Update: {
          categoryId?: number | null
          createdAt?: string
          currency?: string
          description?: string
          id?: number
          imagePlaceholder?: string | null
          imageUrl?: string | null
          name?: string
          price?: number
          slug?: string
          status?: string
          stock?: number
        }
        Relationships: [
          {
            foreignKeyName: "Product_categoryId_fkey"
            columns: ["categoryId"]
            isOneToOne: false
            referencedRelation: "Category"
            referencedColumns: ["id"]
          },
        ]
      }
      Role: {
        Row: {
          gearDiscount: number
          id: number
          name: string
          studioDiscount: number
        }
        Insert: {
          gearDiscount?: number
          id?: number
          name: string
          studioDiscount?: number
        }
        Update: {
          gearDiscount?: number
          id?: number
          name?: string
          studioDiscount?: number
        }
        Relationships: []
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
      StudioRequest: {
        Row: {
          cost: number
          createdAt: string
          endTime: string
          gearItems: number[] | null
          id: number
          startTime: string
          status: string
          typeId: number
          updatedAt: string
          userId: number
        }
        Insert: {
          cost: number
          createdAt?: string
          endTime: string
          gearItems?: number[] | null
          id?: number
          startTime: string
          status?: string
          typeId: number
          updatedAt?: string
          userId: number
        }
        Update: {
          cost?: number
          createdAt?: string
          endTime?: string
          gearItems?: number[] | null
          id?: number
          startTime?: string
          status?: string
          typeId?: number
          updatedAt?: string
          userId?: number
        }
        Relationships: [
          {
            foreignKeyName: "StudioRequest_typeId_fkey"
            columns: ["typeId"]
            isOneToOne: false
            referencedRelation: "StudioType"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "StudioRequest_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      StudioType: {
        Row: {
          description: string
          id: number
          name: string
          pricing: number
        }
        Insert: {
          description: string
          id?: number
          name: string
          pricing: number
        }
        Update: {
          description?: string
          id?: number
          name?: string
          pricing?: number
        }
        Relationships: []
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
          roleId: number | null
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
          roleId?: number | null
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
          roleId?: number | null
          updatedAt?: string
          username?: string
          verificationCode?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "User_roleId_fkey"
            columns: ["roleId"]
            isOneToOne: false
            referencedRelation: "Role"
            referencedColumns: ["id"]
          },
        ]
      }
      UserInvite: {
        Row: {
          createdAt: string
          email: string
          id: number
          roleId: number
          token: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          email: string
          id?: number
          roleId: number
          token: string
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          email?: string
          id?: number
          roleId?: number
          token?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "UserInvite_roleId_fkey"
            columns: ["roleId"]
            isOneToOne: false
            referencedRelation: "Role"
            referencedColumns: ["id"]
          },
        ]
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
