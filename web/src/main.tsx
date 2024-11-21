import React from "react";
import ReactDOM from "react-dom/client";
import { VisibilityProvider } from "./providers/VisibilityProvider";
import App from './components/App';
import { isEnvBrowser } from './utils/misc';
import { PageProvider } from './providers/PageProvider';
const root = document.getElementById('root');
// if (isEnvBrowser()) {
//   // https://i.imgur.com/iPTAdYV.png - Night time img
//   root!.style.backgroundImage = 'url("https://i.imgur.com/3pzRj9n.png")';
//   root!.style.backgroundSize = 'cover';
//   root!.style.backgroundRepeat = 'no-repeat';
//   root!.style.backgroundPosition = 'center';
// }


ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<VisibilityProvider>
			<PageProvider>
				<App />
			</PageProvider>
		</VisibilityProvider>
	</React.StrictMode>
);
