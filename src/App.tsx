import { Opening } from "./components/Opening";
import { SelectedWork } from "./components/SelectedWork";
import { Tenure } from "./components/Tenure";
import { Craft } from "./components/Craft";
import { AskPortfolio } from "./components/AskPortfolio";
import { AskFab } from "./components/AskFab";
import { Close } from "./components/Close";

export default function App() {
  return (
    <div className="site">
      <div className="site__grain" aria-hidden="true" />
      <Opening />
      <main>
        <SelectedWork />
        <Tenure />
        <Craft />
        <AskPortfolio />
      </main>
      <Close />
      <AskFab />
    </div>
  );
}
