import { Collapsible } from "../Collapsible";
import { Header } from "../Header";

import { PrSearch } from "./components/PrSearch";

export function Home() {
  return (
    <>
      <Header />
      <div className="AppWrapper">
        <h1 className="title">What would you like to do now?</h1>
        <Collapsible title="Search for a PR">
          <PrSearch />
        </Collapsible>
      </div>
    </>
  );
}
