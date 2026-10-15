import { useEffect, useState } from 'react';
import { Tarea } from './components/Tarea';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/tareas';

export default function App() {
  const [tareas, setTareas] = useState([]);
  const [nuevoTexto, setNuevoTexto] = useState('');

  const cargarTareas = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTareas(data);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
    }
  };

  useEffect(() => {
    cargarTareas();
  }, []);

  const agregarTarea = async (e) => {
    e.preventDefault();
    if (!nuevoTexto.trim()) return;

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: nuevoTexto })
    });
    const nueva = await res.json();
    setTareas([...tareas, nueva]);
    setNuevoTexto('');
  };

  const toggleTarea = async (id, completada) => {
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completada })
    });
    setTareas(tareas.map((t) => (t.id === id ? { ...t, completada } : t)));
  };

  const eliminarTarea = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    setTareas(tareas.filter((t) => t.id !== id));
  };

  // 🥇 Reto: Editar el título de una tarea
  const editarTarea = async (id, nuevoTitulo) => {
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: nuevoTitulo })
    });
    setTareas(tareas.map((t) => (t.id === id ? { ...t, titulo: nuevoTitulo } : t)));
  };

  // 🥈 Reto: Eliminar todas las tareas completadas
  const eliminarCompletadas = async () => {
    const completadas = tareas.filter((t) => t.completada);
    for (const t of completadas) {
      await fetch(`${API_URL}/${t.id}`, { method: 'DELETE' });
    }
    setTareas(tareas.filter((t) => !t.completada));
  };

  // 🥉 Reto: Contador de tareas completadas
  const completadasCount = tareas.filter((t) => t.completada).length;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '500px', margin: '0 auto' }}>
      <h1>Lista de Tareas</h1>

      {/* 🥉 Reto: Contador */}
      <p style={{ fontWeight: 'bold', color: '#555' }}>
        {completadasCount} de {tareas.length} tareas completadas
      </p>

      <form onSubmit={agregarTarea} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          value={nuevoTexto}
          onChange={(e) => setNuevoTexto(e.target.value)}
          placeholder="Nueva tarea..."
          style={{ flex: 1, padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Agregar
        </button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tareas.map((t) => (
          <Tarea
            key={t.id}
            tarea={t}
            onToggle={toggleTarea}
            onEliminar={eliminarTarea}
            onEditar={editarTarea}
          />
        ))}
      </ul>

      {/* 🥈 Reto: Botón para eliminar completadas */}
      {completadasCount > 0 && (
        <button
          onClick={eliminarCompletadas}
          style={{
            marginTop: '15px',
            backgroundColor: '#ff4d4d',
            color: 'white',
            border: 'none',
            padding: '8px 14px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Eliminar completadas
        </button>
      )}
    </div>
  );
}