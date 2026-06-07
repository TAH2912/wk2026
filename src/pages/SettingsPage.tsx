import { Download, RefreshCw, RotateCcw, Upload, Zap } from "lucide-react";
import { useRef, useState } from "react";
import type { AppDataContext } from "../useAppData";
import { Button } from "../components/Button";
import { PageHeader } from "../components/PageHeader";
import { formatDutchDateTime } from "../utils/date";
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

      <section className="glass mb-6 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-oranje-500/15 text-oranje-300">
              <Zap size={20} />
            </span>
            <div>
              <h2 className="text-xl font-black text-white">Automatische uitslagen</h2>
              <p className="mt-1 max-w-xl text-sm leading-6 text-slate-300">
                De app haalt eindstanden automatisch op uit de openbare OpenFootball-bron en verwerkt ze in poulestanden
                en wedstrijdpools. Handmatige invoer heeft altijd voorrang.
              </p>
              <p className="mt-2 text-xs font-bold text-slate-400">
                {data.autoResults && Object.keys(data.autoResults).length > 0
                  ? `${Object.keys(data.autoResults).length} wedstrijd${
                      Object.keys(data.autoResults).length === 1 ? "" : "en"
                    } automatisch ingevuld`
                  : "Nog geen automatische uitslagen (het WK is nog niet begonnen)"}
                {data.lastSynced ? ` · laatst bijgewerkt ${formatDutchDateTime(data.lastSynced)}` : ""}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              role="switch"
              aria-checked={data.autoSync}
              onClick={() => data.toggleAutoSync(!data.autoSync)}
              className={`focus-ring relative inline-flex h-7 w-12 items-center rounded-full transition ${
                data.autoSync ? "bg-oranje-500" : "bg-white/15"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                  data.autoSync ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <Button
              variant="secondary"
              icon={<RefreshCw size={16} className={data.syncing ? "animate-spin" : ""} />}
              disabled={data.syncing}
              onClick={() => data.syncResults(false)}
            >
              {data.syncing ? "Bezig…" : "Ververs nu"}
            </Button>
          </div>
        </div>
      </section>

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
