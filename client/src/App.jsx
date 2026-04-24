import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import Home from './pages/Home.jsx';
import Standings from './pages/Standings.jsx';
import Results from './pages/Results.jsx';
import Calendar from './pages/Calendar.jsx';
import Teams from './pages/Teams.jsx';
import TeamDetail from './pages/TeamDetail.jsx';
import PlayerDetail from './pages/PlayerDetail.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Admin from './pages/Admin/index.jsx';
import ManageMatches from './pages/Admin/ManageMatches.jsx';
import ManageTeams from './pages/Admin/ManageTeams.jsx';
import ManagePlayers from './pages/Admin/ManagePlayers.jsx';
import ManageLeagues from './pages/Admin/ManageLeagues.jsx';
import ManageMatchEvents from './pages/Admin/ManageMatchEvents.jsx';
import TopScorers from './pages/TopScorers.jsx';
import Scout from './pages/Scout.jsx';
import Premium from './pages/Premium.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import MatchDetail from './pages/MatchDetail.jsx';
import LiveStandings from './pages/LiveStandings.jsx';
import NotFound from './pages/NotFound.jsx';

function UserRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/classifica" element={<Standings />} />
          <Route path="/classifica/:leagueSlug" element={<Standings />} />
          <Route path="/risultati" element={<Results />} />
          <Route path="/calendario" element={<Calendar />} />
          <Route path="/squadre" element={<Teams />} />
          <Route path="/squadre/:id" element={<TeamDetail />} />
          <Route path="/partite/:id" element={<MatchDetail />} />
          <Route path="/marcatori" element={<TopScorers />} />
          <Route path="/marcatori/:leagueSlug" element={<TopScorers />} />
          <Route path="/giocatori/:id" element={<PlayerDetail />} />
          <Route path="/classifiche-live" element={<LiveStandings />} />
          <Route path="/scout" element={<Scout />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<UserRoute><Dashboard /></UserRoute>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/partite" element={<ManageMatches />} />
            <Route path="/admin/squadre" element={<ManageTeams />} />
            <Route path="/admin/giocatori" element={<ManagePlayers />} />
            <Route path="/admin/leghe" element={<ManageLeagues />} />
            <Route path="/admin/partite/:id/eventi" element={<ManageMatchEvents />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
