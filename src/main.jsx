import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from "./context/AouthContext.jsx";
import { ProjectProvider } from "./context/ProjectContext";
import { RoleProvider } from './context/RoleContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <NotificationProvider>
      <RoleProvider>
        <ProjectProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ProjectProvider>
      </RoleProvider>
    </NotificationProvider>
  </BrowserRouter>
)
