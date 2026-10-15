import { useState } from 'react';

export function Tarea({ tarea, onToggle, onEliminar, onEditar }) {
  const [editando, setEditando] = useState(false);
  const [nuevoTitulo, setNuevoTitulo] = useState(tarea.titulo);

  const handleGuardar = () => {
    if (nuevoTitulo.trim() !== '' && nuevoTitulo !== tarea.titulo) {
      onEditar(tarea.id, nuevoTitulo.trim());
    }
    setEditando(false);
  };

  return (
    <li className={`tarea ${tarea.completada ? 'completada' : ''}`}>
      <input
        type="checkbox"
        checked={tarea.completada}
        onChange={() => onToggle(tarea.id, !tarea.completada)}
        style={{ marginRight: '10px', cursor: 'pointer' }}
      />

      {editando ? (
        <input
          type="text"
          value={nuevoTitulo}
          onChange={(e) => setNuevoTitulo(e.target.value)}
          onBlur={handleGuardar}
          onKeyDown={(e) => e.key === 'Enter' && handleGuardar()}
          className="input-editar"
          autoFocus
        />
      ) : (
        <span
          onDoubleClick={() => setEditando(true)}
          title="Doble clic para editar"
        >
          {tarea.titulo}
        </span>
      )}

      <button onClick={() => onEliminar(tarea.id)} className="btn-eliminar" title="Eliminar tarea">
        🗑️
      </button>
    </li>
  );
}