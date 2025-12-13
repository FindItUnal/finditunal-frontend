import { Outlet } from 'react-router-dom';
import Header from '../organisms/Header';
import { useConversations } from '../../hooks/useConversations';
import { useUnreadNotificationsCount } from '../../hooks';

export default function Layout() {
	// Obtener el contador real de mensajes no leídos desde el backend
	const { data: conversations = [] } = useConversations();
	const unreadMessageCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

	// Obtener el contador de notificaciones no leídas
	const { data: notificationsData } = useUnreadNotificationsCount();
	const unreadNotificationsCount = notificationsData?.unread_count || 0;

	return (
		<div>
			<Header 
				unreadMessageCount={unreadMessageCount} 
				unreadNotificationsCount={unreadNotificationsCount}
			/>
			<main>
				<Outlet />
			</main>
		</div>
	);
}
