import { Route, Switch } from 'wouter'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import Detail from './pages/Detail'
import Admin from './pages/Admin'
import AdminForm from './pages/AdminForm'
import NotFound from './pages/NotFound'

function App() {
  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/imoveis" component={Catalog} />
          <Route path="/imoveis/:id">{(params) => <Detail id={params.id} />}</Route>
          <Route path="/admin" component={Admin} />
          <Route path="/admin/novo">{() => <AdminForm />}</Route>
          <Route path="/admin/editar/:id">{(params) => <AdminForm id={params.id} />}</Route>
          <Route path="/admin/dashboard">{() => <Admin />}</Route>
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  )
}

export default App