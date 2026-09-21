import { Route, Switch, Redirect } from 'wouter'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import ScrollToTop from './components/layout/ScrollToTop'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import Detail from './pages/Detail'
import Admin from './pages/Admin'
import AdminForm from './pages/AdminForm'
import NotFound from './pages/NotFound'
import PendingApproval from './components/auth/PendingApproval'
import { useAuth } from './hooks/useAuth'

function ProtectedAdmin({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuth()
  if (!isAuthenticated) return <Redirect to="/admin" />
  if (user && !user.isApproved) return <PendingApproval onLogout={logout} />
  return <>{children}</>
}

function App() {
  return (
    <div className="flex min-h-svh flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/imoveis" component={Catalog} />
          <Route path="/imoveis/:id">{(params) => <Detail id={params.id} />}</Route>
          <Route path="/admin" component={Admin} />
          <Route path="/admin/novo">
            {() => (
              <ProtectedAdmin>
                <AdminForm />
              </ProtectedAdmin>
            )}
          </Route>
          <Route path="/admin/editar/:id">
            {(params) => (
              <ProtectedAdmin>
                <AdminForm id={params.id} />
              </ProtectedAdmin>
            )}
          </Route>
          <Route path="/admin/dashboard">{() => <Admin />}</Route>
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  )
}

export default App