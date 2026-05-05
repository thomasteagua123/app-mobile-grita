# Manual Básico de Uso — Grita Mobile

## Clonar el Repositorio

Abrir una terminal y ejecutar:

```bash
git clone https://github.com/thomasteagua123/app-mobile-grita.git
```

Entrar a la carpeta del proyecto:

```bash
cd app-mobile-grita
```

---

# Abrir el Proyecto en VSCode

```bash
code .
```

---

# Entrar a la Carpeta app/

```bash
cd app/
```

Ver archivos:

```bash
ls
```

Aparecerá algo parecido a esto:

```bash
_layout.tsx
modal.tsx
(tabs)
```

---

# Entrar a la Carpeta (tabs)

La carpeta `(tabs)` tiene paréntesis, por eso no funciona escribir:

```bash
cd (tabs)/
```

Eso genera este error:

```bash
bash: error de sintaxis cerca del elemento inesperado `tabs'
```

---

# Forma Correcta

Hay que escapar los paréntesis:

```bash
cd \(tabs\)
```

Ejemplo:

```bash
etec@213-02:~/Documentos/app-mobile-grita/app-mobile-grita/app$ cd \(tabs\)
etec@213-02:~/Documentos/app-mobile-grita/app-mobile-grita/app/(tabs)$
```

---

# Ver los Archivos

```bash
ls
```

Resultado:

```bash
explore.tsx
index.tsx
_layout.tsx
```

El archivo principal es:

```bash
index.tsx
```

---

# Volver Atrás

```bash
cd ..
```

---

# Ejecutar el Proyecto

Desde la raíz del proyecto:

```bash
bun install
```

Luego:

```bash
bunx expo start
```

---

# Repositorio

```text
https://github.com/thomasteagua123/app-mobile-grita
```

---

# Autor

Proyecto desarrollado por Thomas Avila.
