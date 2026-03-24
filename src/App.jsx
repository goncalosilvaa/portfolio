import DashboardPage from './Pages/DashboardPage';
import PortfolioPage from './Pages/PortfolioPage';

const App = () => {
  if (window.location.pathname.startsWith('/dashboard')) {
    return <DashboardPage />;
  }

  return <PortfolioPage />;
};

export default App;
