import BackgroundComponent from "./components/Background/background"
import { ClothesProvider } from "./components/Fetch/clothes-fetch"
import { ItemsProvider } from "./components/Fetch/items-fetch"
import PageTop from "./components/PageTop/pageTop"
import RoutesComponent from "./Routes/Routes"

function App() {

  return (
    <>
    <ItemsProvider>
    <ClothesProvider>
      <BackgroundComponent />
      <PageTop/>
      <RoutesComponent />
    </ClothesProvider>
    </ItemsProvider>
    </>
  )
}

export default App
