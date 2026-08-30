import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";

const Catalog = lazy(() => import("@/pages/Catalog"));
const Detail = lazy(() => import("@/pages/Detail"));
const Admin = lazy(() => import("@/pages/Admin"));

function Loader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center text-sm font-semibold text-slate-500">
      Carregando...
    </div>
  );
}

function AppRouter() {
  return (
    <Suspense fallback={<Loader />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/imoveis" component={Catalog} />
        <Route path="/imoveis/:id">
          {(params) => <Detail id={params.id} />}
        </Route>
        <Route path="/admin" component={Admin} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <Toaster />
        <AppRouter />
      </ThemeProvider>
    </ErrorBoundary>
  );
}