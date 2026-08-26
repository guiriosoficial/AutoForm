import { Header } from "@/components/layouts/Header";
import { HomeView } from "@/views/HomeView";
import { PreferencesView } from "@/views/PreferencesView";
import { useNavigation } from "@/providers/NavigationProvider";
import { Page } from "@/configs";

export function App ()  {
  const { activePage } = useNavigation()

  return (
    <div className="flex flex-col gap-4 p-4 w-xl bg-background">
      <Header />

      {activePage === Page.HOME && <HomeView />}
      {activePage === Page.PREFERENCES && <PreferencesView />}
    </div>
  )
}
