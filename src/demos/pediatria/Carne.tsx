/* Carné digital: cada dosis del esquema, cuál ya se puso y registrar las que se aplican hoy. */
import { useState, type FormEvent } from "react";
import { Check, Search, Syringe } from "lucide-react";
import {
  DOSIS, ETAPAS, PEDIATRAS, aCriterio, edadTexto, fechaCorta, hoyIso, nombreDosis, pediatraPor, resumenCarne,
  type Aplicada, type Clinica, type Paciente,
} from "./datos";

const sinTildes = (t: string) => t.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase("es");

export function Carne({ clinica, pacienteId, alElegir }: { clinica: Clinica; pacienteId: string; alElegir: (id: string) => void }) {
  const [buscar, setBuscar] = useState("");
  const [abierta, setAbierta] = useState("");
  const [aviso, setAviso] = useState("");
  const paciente = clinica.pacientes.find((p) => p.id === pacienteId) ?? clinica.pacientes[0];
  const info = resumenCarne(paciente);
  const lista = clinica.pacientes.filter((p) => sinTildes(`${p.nombre} ${p.tutor}`).includes(sinTildes(buscar.trim())));

  function elegir(id: string) {
    alElegir(id);
    setAbierta("");
    setAviso("");
  }

  return (
    <>
      <div className="pa-panel-titulo">
        <div>
          <h1>Registro de vacunas</h1>
          <p className="pa-suave">Lo que registre aquí aparece de inmediato en el carné del Portal Padres.</p>
        </div>
      </div>
      <div className="pa-pacientes">
        <div className="pa-caja">
          <label className="pa-buscar">
            <Search size={17} aria-hidden />
            <span className="pa-oculto">Buscar paciente o encargado</span>
            <input type="search" value={buscar} placeholder="Buscar paciente o encargado" onChange={(e) => setBuscar(e.target.value)} />
          </label>
          <ul className="pa-lista">
            {lista.map((p) => {
              const r = resumenCarne(p);
              return (
                <li key={p.id}>
                  <button type="button" aria-pressed={p.id === paciente.id} onClick={() => elegir(p.id)}>
                    <strong>{p.nombre}</strong>
                    {p.familia && <span className="pa-en-portal">Carné visible en Portal Padres</span>}
                    <small data-pendiente={r.pendientes > 0}>
                      {edadTexto(r.meses)} · {r.pendientes ? `${r.pendientes} ${r.pendientes === 1 ? "dosis pendiente" : "dosis pendientes"}` : "al día"}
                    </small>
                  </button>
                </li>
              );
            })}
            {lista.length === 0 && <li className="pa-vacio">Sin resultados.</li>}
          </ul>
        </div>

        <div className="pa-caja">
          <h2>{paciente.nombre}</h2>
          <p className="pa-suave">
            {edadTexto(info.meses)} · nació el {fechaCorta(paciente.nacimiento)} · {paciente.tutor} · {paciente.telefono}
          </p>
          <div className="pa-avance" role="img" aria-label={`${info.puestas} de ${info.total} dosis de su edad`}>
            <span style={{ width: `${info.total ? (info.puestas / info.total) * 100 : 100}%` }} />
          </div>
          <p className="pa-suave">
            {info.puestas} de {info.total} dosis que corresponden a su edad
          </p>

          <Rapido
            key={paciente.id}
            paciente={paciente}
            alGuardar={(d, nombre) => {
              clinica.aplicar(paciente.id, d);
              setAbierta("");
              setAviso(`${nombre} quedó registrada en el carné de ${paciente.nombre}.`);
            }}
          />
          <p className="pa-confirmacion" role="status">
            {aviso}
          </p>

          {ETAPAS.map((etapa) => (
            <div key={etapa.id} className="pa-grupo">
              <h3>{etapa.nombre}</h3>
              <ul>
                {DOSIS.filter((d) => d.vacuna.etapa === etapa.id)
                  .sort((a, b) => a.mes - b.mes)
                  .map((d) => {
                    const puesta = paciente.aplicadas.find((a) => a.clave === d.clave);
                    const tipo = puesta ? "puesta" : d.mes <= info.meses && !aCriterio(d) ? "pendiente" : "despues";
                    return (
                      <li key={d.clave}>
                        <span>
                          <strong>{nombreDosis(d)}</strong>
                          <small>
                            {puesta
                              ? `Aplicada el ${fechaCorta(puesta.fecha)} · lote ${puesta.lote} · ${pediatraPor(puesta.pediatraId).nombre}`
                              : aCriterio(d)
                                ? "Según indicación del pediatra"
                                : d.mes === 0
                                  ? "Corresponde al nacer"
                                  : `Corresponde a los ${edadTexto(d.mes)}`}
                          </small>
                        </span>
                        <div className="pa-acciones-dosis">
                          <span className="pa-chip" data-tipo={tipo}>
                            {puesta && <Check size={13} aria-hidden />}
                            {tipo === "puesta" ? "Aplicada" : tipo === "pendiente" ? "Pendiente" : "Más adelante"}
                          </span>
                          {puesta ? (
                            <button type="button" className="pa-enlace" onClick={() => { clinica.anular(paciente.id, d.clave); setAviso(`Se quitó el registro de ${nombreDosis(d)}.`); }}>
                              Anular<span className="pa-oculto"> {nombreDosis(d)}</span>
                            </button>
                          ) : (
                            <button type="button" className="pa-btn pa-chico pa-contorno" aria-expanded={abierta === d.clave} onClick={() => { setAbierta(abierta === d.clave ? "" : d.clave); setAviso(""); }}>
                              <Syringe size={15} aria-hidden /> Registrar<span className="pa-oculto"> {nombreDosis(d)}</span>
                            </button>
                          )}
                        </div>
                        {abierta === d.clave && !puesta && (
                          <Registro
                            nacimiento={paciente.nacimiento}
                            alCancelar={() => setAbierta("")}
                            alGuardar={(r) => {
                              clinica.aplicar(paciente.id, { clave: d.clave, ...r });
                              setAbierta("");
                              setAviso(`${nombreDosis(d)} quedó registrada en el carné de ${paciente.nombre}.`);
                            }}
                          />
                        )}
                      </li>
                    );
                  })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* registro rápido: dosis, lote y listo, con fecha de hoy */
function Rapido({ paciente, alGuardar }: { paciente: Paciente; alGuardar: (d: Aplicada, nombre: string) => void }) {
  const { meses, faltan } = resumenCarne(paciente);
  const sinPoner = DOSIS.filter((d) => !paciente.aplicadas.some((a) => a.clave === d.clave));
  /* primero las pendientes; después las que se pueden adelantar según indicación */
  const opciones = [...faltan, ...sinPoner.filter((d) => !faltan.includes(d) && d.mes <= meses + 6)];
  const [elegida, setElegida] = useState("");
  const [lote, setLote] = useState("");
  const [pediatraId, setPediatra] = useState(PEDIATRAS[0].id);
  const [falta, setFalta] = useState("");
  const dosis = opciones.find((d) => d.clave === elegida) ?? opciones[0];

  if (!dosis) return <p className="pa-confirmacion">No hay dosis por registrar para su edad.</p>;

  function guardar(e: FormEvent) {
    e.preventDefault();
    if (!lote.trim()) return setFalta("Escriba el número de lote del frasco.");
    alGuardar({ clave: dosis.clave, fecha: hoyIso(), lote: lote.trim().toUpperCase(), pediatraId }, nombreDosis(dosis));
    setLote("");
    setElegida("");
  }

  return (
    <form className="pa-rapido" onSubmit={guardar} noValidate>
      <h3>Registro rápido de hoy</h3>
      <label className="pa-campo pa-rapido-dosis">
        <span>Vacuna aplicada</span>
        <select value={dosis.clave} onChange={(e) => setElegida(e.target.value)}>
          {opciones.map((d) => (
            <option key={d.clave} value={d.clave}>
              {nombreDosis(d)}
              {faltan.includes(d) ? " (pendiente)" : ""}
            </option>
          ))}
        </select>
      </label>
      <label className="pa-campo">
        <span>Lote</span>
        <input value={lote} autoComplete="off" onChange={(e) => { setLote(e.target.value); setFalta(""); }} />
      </label>
      <label className="pa-campo">
        <span>Aplicó</span>
        <select value={pediatraId} onChange={(e) => setPediatra(e.target.value)}>
          {PEDIATRAS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" className="pa-btn pa-bosque">
        <Syringe size={17} aria-hidden /> Registrar
      </button>
      {falta && (
        <p className="pa-falta" role="alert">
          {falta}
        </p>
      )}
    </form>
  );
}

type Datos = { fecha: string; lote: string; pediatraId: string };

function Registro({ nacimiento, alGuardar, alCancelar }: { nacimiento: string; alGuardar: (d: Datos) => void; alCancelar: () => void }) {
  const [fecha, setFecha] = useState(hoyIso());
  const [lote, setLote] = useState("");
  const [pediatraId, setPediatra] = useState(PEDIATRAS[0].id);
  const [falta, setFalta] = useState("");

  function guardar(e: FormEvent) {
    e.preventDefault();
    if (!fecha || fecha > hoyIso() || fecha < nacimiento) return setFalta("La fecha debe estar entre el nacimiento y hoy.");
    if (!lote.trim()) return setFalta("Escriba el número de lote del frasco.");
    alGuardar({ fecha, lote: lote.trim().toUpperCase(), pediatraId });
  }

  return (
    <form className="pa-formulario" onSubmit={guardar} noValidate>
      <label className="pa-campo">
        <span>Fecha de aplicación</span>
        <input type="date" value={fecha} min={nacimiento} max={hoyIso()} onChange={(e) => { setFecha(e.target.value); setFalta(""); }} />
      </label>
      <label className="pa-campo">
        <span>Lote</span>
        <input value={lote} autoFocus autoComplete="off" onChange={(e) => { setLote(e.target.value); setFalta(""); }} />
      </label>
      <label className="pa-campo">
        <span>Aplicó</span>
        <select value={pediatraId} onChange={(e) => setPediatra(e.target.value)}>
          {PEDIATRAS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>
      </label>
      <div>
        <button type="submit" className="pa-btn pa-chico pa-bosque">
          Guardar en el carné
        </button>
        <button type="button" className="pa-btn pa-chico pa-contorno" onClick={alCancelar}>
          Cancelar
        </button>
        {falta && (
          <p className="pa-falta" role="alert">
            {falta}
          </p>
        )}
      </div>
    </form>
  );
}
