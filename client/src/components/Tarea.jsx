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
    <li>
      <input
        type="checkbox"
        checked={tarea.completada}
        onChange={() => onToggle(tarea.id, !tarea.completada)}
      />

      {editando ? (
        <input
          type="text"
          value={nuevoTitulo}
          onChange={(e) => setNuevoTitulo(e.target.value)}
          onBlur={handleGuardar}
          onKeyDown={(e) => e.key === 'Enter' && handleGuardar()}
          autoFocus
        />
      ) : (
        <span
          onDoubleClick={() => setEditando(true)}
          style={{ textDecoration: tarea.completada ? 'line-through' : 'none' }}
          title="Doble clic para editar"
        >
          {tarea.titulo}
        </span>
      )}

      <button onClick={() => onEliminar(tarea.id)}>🗑️</button>
    </li>
  );
}