import { Outlet } from 'react-router-dom';
import Header from '../HeaderResponsive';

export default function Layout() {
	return (
		<div>
			<Header />
			<main>
				<Outlet />
			</main>
		</div>
	);
}
