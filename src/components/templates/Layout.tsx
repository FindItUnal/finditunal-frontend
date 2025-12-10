import { Outlet } from 'react-router-dom';
import Header from '../organisms/Header';
import { useConversations } from '../../hooks/useConversations';

export default function Layout() {
	// Obtener el contador real de mensajes no leídos desde el backend
	const { data: conversations = [] } = useConversations();
	const unreadMessageCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

	return (
		<div>
			<Header unreadMessageCount={unreadMessageCount} />
			<main>
				<Outlet />
			</main>
		</div>
	);
}
