import { useEffect, useState } from 'react';
import { Tarea } from './components/Tarea';
import './App.css';

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

  const editarTarea = async (id, nuevoTitulo) => {
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: nuevoTitulo })
    });
    setTareas(tareas.map((t) => (t.id === id ? { ...t, titulo: nuevoTitulo } : t)));
  };

  const eliminarCompletadas = async () => {
    const completadas = tareas.filter((t) => t.completada);
    for (const t of completadas) {
      await fetch(`${API_URL}/${t.id}`, { method: 'DELETE' });
    }
    setTareas(tareas.filter((t) => !t.completada));
  };

  const completadasCount = tareas.filter((t) => t.completada).length;

  return (
    <div className="contenedor">
      <h1>Lista de Tareas</h1>

      {/* 🥉 Reto: Contador */}
      <p className="estado">
        {completadasCount} de {tareas.length} tareas completadas
      </p>

      <form onSubmit={agregarTarea} className="formulario">
        <input
          type="text"
          value={nuevoTexto}
          onChange={(e) => setNuevoTexto(e.target.value)}
          placeholder="Nueva tarea..."
        />
        <button type="submit">Agregar</button>
      </form>

      <ul className="lista">
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

      {/* 🥈 Reto: Botón Eliminar completadas */}
      {completadasCount > 0 && (
        <button onClick={eliminarCompletadas} className="btn-completadas">
          Eliminar completadas
        </button>
      )}
    </div>
  );
}