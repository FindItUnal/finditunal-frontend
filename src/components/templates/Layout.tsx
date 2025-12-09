import { Outlet } from 'react-router-dom';
import Header from '../organisms/Header';
import { mockChats } from '../../data/chats';

export default function Layout() {
	// TODO: Replace mockChats with real unread count from backend
	const unreadMessageCount = mockChats?.reduce((acc, c) => acc + (c.unreadCount || 0), 0) || 0;

	return (
		<div>
			<Header unreadMessageCount={unreadMessageCount} />
			<main>
				<Outlet />
			</main>
		</div>
	);
}
