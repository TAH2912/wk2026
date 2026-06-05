import { Download, RotateCcw, Upload } from "lucide-react";
import { useRef, useState } from "react";
import type { AppDataContext } from "../useAppData";
import { Button } from "../components/Button";
import { PageHeader } from "../components/PageHeader";
import { exportAppData, importAppData } from "../utils/storage";

export const SettingsPage = ({ data }: { data: AppDataContext }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  const download = () => {
    const blob = new Blob([JSON.stringify(exportAppData(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `wk2026-export-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    data.setToast("Export gedownload");
  };

  const upload = async (file?: File) => {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      importAppData(parsed);
      data.replaceImportedData(parsed);
      setError("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Importeren is mislukt.");
    }
  };

  const reset = () => {
    if (window.confirm("Alle lokale uitslagen, vrienden en pools wissen?")) data.resetLocalData();
  };

  return (
    <div>
      <PageHeader label="Instellingen" title="Data beheren" body="Alles draait lokaal in je browser. Reset laadt opnieuw de originele JSON-basisdata." />
      <section className="grid gap-5 lg:grid-cols-3">
        <article className="glass p-5">
          <Download className="text-oranje-300" />
          <h2 className="mt-4 text-xl font-black text-white">Exporteren</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">Download alle lokale uitslagen, vrienden en pools als JSON.</p>
          <Button className="mt-5" icon={<Download size={16} />} onClick={download}>Export JSON</Button>
        </article>
        <article className="glass p-5">
          <Upload className="text-sky-300" />
          <h2 className="mt-4 text-xl font-black text-white">Importeren</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">Zet een eerder exportbestand terug in deze browser.</p>
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(event) => upload(event.target.files?.[0])} />
          <Button className="mt-5" variant="secondary" icon={<Upload size={16} />} onClick={() => fileRef.current?.click()}>Import JSON</Button>
          {error ? <p className="mt-3 text-sm font-bold text-rose-200">{error}</p> : null}
        </article>
        <article className="glass p-5">
          <RotateCcw className="text-rose-300" />
          <h2 className="mt-4 text-xl font-black text-white">Resetten</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">Wis localStorage en bouw de app opnieuw op vanuit de originele bestanden in `src/data`.</p>
          <Button className="mt-5" variant="danger" icon={<RotateCcw size={16} />} onClick={reset}>Alles wissen</Button>
        </article>
      </section>
      <section className="glass mt-6 p-5">
        <h2 className="text-xl font-black text-white">Brondata</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Plaats `worldcup_nl.json`, `worldcup_teams.json` en `worldcup_groups.json` in `src/data/`. De mapper in `src/data/mappers.ts`
          vertaalt afwijkende veldnamen naar het interne TypeScript datamodel.
        </p>
      </section>
    </div>
  );
};
