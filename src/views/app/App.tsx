import { Toaster } from "@/components/ui/toast";
import { Index } from "@/components/Index";
import { ThemeProvider } from "@/providers/theme-provider";

const App = () => (
  <>
    <ThemeProvider>
      <Toaster />
      <Index />
    </ThemeProvider>
  </>
);

export default App;
