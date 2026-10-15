const express = require("express");
const cors = require("cors");

const app = express();

// Permitir peticiones desde tu frontend en Vercel o desde cualquier origen
const CLIENTE_URL = process.env.CLIENTE_URL || "*";
app.use(cors({ origin: CLIENTE_URL }));

app.use(express.json());

// Datos en memoria
let tareas = [
  { id: 1, titulo: "Aprender React", completada: false },
  { id: 2, titulo: "Conectar con Node.js", completada: false },
];
let siguienteId = 3;

// GET - Obtener todas las tareas
app.get("/api/tareas", (req, res) => {
  res.json(tareas);
});

// POST - Crear una tarea
app.post("/api/tareas", (req, res) => {
  const { titulo } = req.body;
  if (!titulo || !titulo.trim()) {
    return res.status(400).json({ error: "El titulo es obligatorio" });
  }
  const nueva = { id: siguienteId++, titulo: titulo.trim(), completada: false };
  tareas.push(nueva);
  res.status(201).json(nueva);
});

// PUT - Actualizar título o estado de una tarea (Soporta Reto 🥇)
app.put("/api/tareas/:id", (req, res) => {
  const tarea = tareas.find((t) => t.id === Number(req.params.id));
  if (!tarea) return res.status(404).json({ error: "Tarea no encontrada" });

  const { titulo, completada } = req.body;

  if (titulo !== undefined && titulo.trim() !== "") {
    tarea.titulo = titulo.trim();
  }
  if (completada !== undefined) {
    tarea.completada = completada;
  }

  res.json(tarea);
});

// DELETE - Eliminar una tarea
app.delete("/api/tareas/:id", (req, res) => {
  const existe = tareas.some((t) => t.id === Number(req.params.id));
  if (!existe) return res.status(404).json({ error: "Tarea no encontrada" });
  tareas = tareas.filter((t) => t.id !== Number(req.params.id));
  res.status(204).send();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.logs(`API corriendo en el puerto ${PORT}`);
});