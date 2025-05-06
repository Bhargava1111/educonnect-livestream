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
      courses: {
        Row: {
          category: string
          created_at: string
          description: string
          duration: string
          id: string
          image_url: string | null
          instructor: string
          is_featured: boolean | null
          is_published: boolean | null
          level: string
          popular: boolean | null
          price: number
          short_description: string
          status: string
          title: string
          topics: string[] | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          duration: string
          id?: string
          image_url?: string | null
          instructor: string
          is_featured?: boolean | null
          is_published?: boolean | null
          level: string
          popular?: boolean | null
          price: number
          short_description: string
          status: string
          title: string
          topics?: string[] | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          duration?: string
          id?: string
          image_url?: string | null
          instructor?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          level?: string
          popular?: boolean | null
          price?: number
          short_description?: string
          status?: string
          title?: string
          topics?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      education: {
        Row: {
          course: string | null
          created_at: string
          education_type: string
          id: string
          percentage: string | null
          school_university: string | null
          user_id: string
          year_of_completion: string | null
        }
        Insert: {
          course?: string | null
          created_at?: string
          education_type: string
          id?: string
          percentage?: string | null
          school_university?: string | null
          user_id: string
          year_of_completion?: string | null
        }
        Update: {
          course?: string | null
          created_at?: string
          education_type?: string
          id?: string
          percentage?: string | null
          school_university?: string | null
          user_id?: string
          year_of_completion?: string | null
        }
        Relationships: []
      }
      enrollment_forms: {
        Row: {
          aadhar_number: string
          certificate_id: string | null
          certificate_url: string | null
          current_address: Json
          date_of_birth: string
          degree: Json | null
          email: string
          father_name: string | null
          first_name: string
          form_type: string
          gender: string
          guardian_email: string | null
          guardian_phone: string | null
          id: string
          is_same_address: boolean
          last_name: string
          mother_name: string | null
          permanent_address: Json
          phone: string
          photograph_url: string | null
          post_graduation: Json | null
          related_id: string
          status: string
          student_id: string
          submitted_at: string
          tenth_grade: Json | null
          twelfth_grade: Json | null
        }
        Insert: {
          aadhar_number: string
          certificate_id?: string | null
          certificate_url?: string | null
          current_address: Json
          date_of_birth: string
          degree?: Json | null
          email: string
          father_name?: string | null
          first_name: string
          form_type: string
          gender: string
          guardian_email?: string | null
          guardian_phone?: string | null
          id?: string
          is_same_address: boolean
          last_name: string
          mother_name?: string | null
          permanent_address: Json
          phone: string
          photograph_url?: string | null
          post_graduation?: Json | null
          related_id: string
          status: string
          student_id: string
          submitted_at?: string
          tenth_grade?: Json | null
          twelfth_grade?: Json | null
        }
        Update: {
          aadhar_number?: string
          certificate_id?: string | null
          certificate_url?: string | null
          current_address?: Json
          date_of_birth?: string
          degree?: Json | null
          email?: string
          father_name?: string | null
          first_name?: string
          form_type?: string
          gender?: string
          guardian_email?: string | null
          guardian_phone?: string | null
          id?: string
          is_same_address?: boolean
          last_name?: string
          mother_name?: string | null
          permanent_address?: Json
          phone?: string
          photograph_url?: string | null
          post_graduation?: Json | null
          related_id?: string
          status?: string
          student_id?: string
          submitted_at?: string
          tenth_grade?: Json | null
          twelfth_grade?: Json | null
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          certificate_issued: boolean | null
          completed: boolean | null
          course_id: string
          created_at: string
          enrollment_date: string
          id: string
          last_accessed_date: string | null
          progress: number
          status: string
          student_id: string
        }
        Insert: {
          certificate_issued?: boolean | null
          completed?: boolean | null
          course_id: string
          created_at?: string
          enrollment_date?: string
          id?: string
          last_accessed_date?: string | null
          progress?: number
          status: string
          student_id: string
        }
        Update: {
          certificate_issued?: boolean | null
          completed?: boolean | null
          course_id?: string
          created_at?: string
          enrollment_date?: string
          id?: string
          last_accessed_date?: string | null
          progress?: number
          status?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          application_link: string | null
          applied_count: number | null
          category: string | null
          company: string
          contact_email: string | null
          deadline_date: string | null
          description: string
          experience: string | null
          external_link: string | null
          featured: boolean | null
          id: string
          location: string
          posted_at: string
          requirements: string[] | null
          salary: string
          status: string
          title: string
          type: string
        }
        Insert: {
          application_link?: string | null
          applied_count?: number | null
          category?: string | null
          company: string
          contact_email?: string | null
          deadline_date?: string | null
          description: string
          experience?: string | null
          external_link?: string | null
          featured?: boolean | null
          id?: string
          location: string
          posted_at?: string
          requirements?: string[] | null
          salary: string
          status: string
          title: string
          type: string
        }
        Update: {
          application_link?: string | null
          applied_count?: number | null
          category?: string | null
          company?: string
          contact_email?: string | null
          deadline_date?: string | null
          description?: string
          experience?: string | null
          external_link?: string | null
          featured?: boolean | null
          id?: string
          location?: string
          posted_at?: string
          requirements?: string[] | null
          salary?: string
          status?: string
          title?: string
          type?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          aadhar_number: string | null
          address: string | null
          country: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          profile_picture: string | null
          skills: string[] | null
          updated_at: string
        }
        Insert: {
          aadhar_number?: string | null
          address?: string | null
          country?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          profile_picture?: string | null
          skills?: string[] | null
          updated_at?: string
        }
        Update: {
          aadhar_number?: string | null
          address?: string | null
          country?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          profile_picture?: string | null
          skills?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      student_activities: {
        Row: {
          activity_type: string
          context: Json | null
          id: string
          student_id: string
          timestamp: string
        }
        Insert: {
          activity_type: string
          context?: Json | null
          id?: string
          student_id: string
          timestamp?: string
        }
        Update: {
          activity_type?: string
          context?: Json | null
          id?: string
          student_id?: string
          timestamp?: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
