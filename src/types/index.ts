export type Theme = 'light' | 'dark';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  user_id?: string; // optional backend id
  phone_number?: string;
  role: 'user' | 'admin';
  status: 'active' | 'suspended';
  is_active?: number; // 1 = active, 2 = banned
  createdAt: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  location: string;
  date: string;
  status: 'lost' | 'found' | 'claimed';
  userId: string;
  userName: string;
  userAvatar?: string;
  createdAt: string;
  contact_method?: string;
}

// ============ CHAT TYPES (Backend Integration) ============

/**
 * Mensaje individual en una conversación
 * Compatible con MessageRecord del backend
 */
export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
}

/**
 * Conversación con resumen de información
 * Compatible con ConversationSummary del backend
 */
export interface Chat {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  reportId?: number;
  reportTitle?: string;
}

export interface Report {
  id: string;
  itemId: string;
  itemTitle: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  description: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface Metrics {
  totalUsers: number;
  totalItems: number;
  activeReports: number;
  itemsFound: number;
}

/**
 * Estadísticas del dashboard de administración
 * Respuesta del endpoint GET /user/admin/dashboard-stats
 */
export interface AdminDashboardStats {
  total_users: number;
  new_users_last_7_days: number;
  total_reports: number;
  reports_today: number;
  active_complaints: number;
  recovered_reports_current_month: number;
  recovery_rate_current_month: number;
  active_users_percentage: number;
  resolved_complaints_percentage_current_month: number;
}

/**
 * Registro de actividad del sistema
 * Respuesta del endpoint GET /user/admin/activity-log
 */
export interface ActivityLogRecord {
  activity_id: number;
  event_type: string;
  actor_user_id: string | null;
  target_type: string;
  target_id: string | null;
  title: string;
  description: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

/**
 * Respuesta paginada de actividad
 */
export interface ActivityLogResponse {
  items: ActivityLogRecord[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Usuario resumido para el panel de admin
 * GET /user/admin/users
 */
export interface AdminUserSummary {
  user_id: string;
  email: string;
  name: string;
  phone_number: string | null;
  role: 'user' | 'admin';
  is_active: number;
  created_at: string;
  updated_at: string;
}

/**
 * Respuesta de lista de usuarios para admin
 */
export interface AdminUsersResponse {
  total_users: number;
  active_users: number;
  users: AdminUserSummary[];
}

/**
 * Detalle de usuario con estadísticas
 * GET /user/admin/users/:user_id
 */
export interface UserDetailWithStats {
  user_id: string;
  email: string;
  name: string;
  phone_number: string | null;
  role: 'user' | 'admin';
  is_active: number;
  created_at: string;
  updated_at: string;
  total_reports: number;
  delivered_reports: number;
}

/**
 * Tipos para el sistema de denuncias (complaints)
 */
export type ComplaintReason = 'spam' | 'inappropriate' | 'fraud' | 'other';
export type ComplaintStatus = 'pending' | 'in_review' | 'resolved' | 'rejected';

/**
 * Registro de denuncia del backend
 * GET /user/admin/complaints
 */
export interface ComplaintRecord {
  complaint_id: number;
  report_id: number;
  reporter_user_id: string;
  reason: ComplaintReason;
  description: string | null;
  status: ComplaintStatus;
  admin_notes: string | null;
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Parámetros para actualizar estado de denuncia
 */
export interface UpdateComplaintInput {
  status?: ComplaintStatus;
  admin_notes?: string;
}

/**
 * Respuesta de acción sobre denuncia
 */
export interface ComplaintActionResponse {
  message: string;
}

// ============ NOTIFICATION TYPES (Backend Integration) ============

/**
 * Tipos de notificaciones disponibles en el sistema
 */
export type NotificationType = 'system' | 'report' | 'complaint' | 'message';

/**
 * Registro de notificación del backend
 * Compatible con NotificationRecord del backend
 */
export interface Notification {
  notification_id: number;
  user_id: string;
  type: NotificationType;
  title: string;
  message?: string | null;
  related_id?: number | null;
  is_read: boolean;
  created_at: string;
}

/**
 * Respuesta paginada de notificaciones
 * GET /user/{user_id}/notifications
 */
export interface NotificationPage {
  items: Notification[];
  total: number;
  unread_count: number;
  limit: number;
  offset: number;
}
