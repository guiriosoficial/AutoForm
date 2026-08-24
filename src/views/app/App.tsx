import { Toaster } from "@/components/ui/toast.tsx";
import { Index } from "@/components";
import { ThemeProvider } from "@/providers/theme-provider.tsx";

const App = () => (
  <>
    <ThemeProvider>
      <Toaster />
      <Index />
    </ThemeProvider>
  </>
);

export default App;
