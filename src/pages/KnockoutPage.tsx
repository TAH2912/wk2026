import type { AppDataContext } from "../useAppData";
import { KnockoutBracket } from "../components/KnockoutBracket";
import { PageHeader } from "../components/PageHeader";

export const KnockoutPage = ({ data }: { data: AppDataContext }) => (
  <div>
    <PageHeader label="Knock-out" title="Route naar de finale" body="Placeholderteams zoals W89 en L101 blijven zichtbaar totdat je het schema later vervangt of aanvult." />
    <KnockoutBracket matches={data.matches.filter((match) => match.stage !== "group")} />
  </div>
);
