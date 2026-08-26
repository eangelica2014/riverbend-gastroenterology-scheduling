/**
 * Clinical Field Notebook design: every route sits inside one evidence-oriented folio shell
 * so the Phase 1 agent and Phase 2 platform read as a coherent product system.
 */

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import { AppShell } from "./components/AppShell";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Agent from "./pages/Agent";
import Architecture from "./pages/Architecture";
import Experiments from "./pages/Experiments";
import Home from "./pages/Home";
import Platform from "./pages/Platform";
import Tests from "./pages/Tests";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/agent"} component={Agent} />
      <Route path={"/architecture"} component={Architecture} />
      <Route path={"/tests"} component={Tests} />
      <Route path={"/platform"} component={Platform} />
      <Route path={"/experiments"} component={Experiments} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <AppShell>
            <Router />
          </AppShell>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
