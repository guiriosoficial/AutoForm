import { Toaster } from "@/components/ui/toast";
import { Index } from "@/components/Index";
import { AppSettingsProvider } from "@/providers/AppSettingsProvider";

const App = () => (
  <>
    <AppSettingsProvider>
      <Toaster />
      <Index />
    </AppSettingsProvider>
  </>
);

export default App;
