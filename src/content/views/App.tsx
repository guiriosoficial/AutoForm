import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { Index } from "@/components/Index";

const App = () => (
  <TooltipProvider>
    <Toaster position="top-center" />
    <Index />
  </TooltipProvider>
);

export default App;
