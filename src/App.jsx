import DashboardPage from './Pages/DashboardPage';
import PortfolioPage from './Pages/PortfolioPage';
import ProjectDetailPage from './Pages/ProjectDetailPage';

const App = () => {
  if (window.location.pathname.startsWith('/dashboard')) {
    return <DashboardPage />;
  }

  if (window.location.pathname.startsWith('/projects/')) {
    return <ProjectDetailPage />;
  }

  return <PortfolioPage />;
};

export default App;
