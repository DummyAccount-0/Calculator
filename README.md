# 🧮 Scientific Calculator App

A modern **React**-based all-in-one calculator suite that combines advanced calculations, matrix operations, interactive graphing, a rich formula library, and a built-in unit converter — all in a clean, responsive interface.

---

## ✨ Features

### **General**
- 🌗 **Light & Dark Theme** — Easily toggle themes across all panels.
- 💻 **Responsive Layout** — Works seamlessly on desktop and tablet.
- 📜 **History System** — Access all previous results and click to restore them.
- ⌨️ **Keyboard Shortcuts** — Many actions are mapped for quick keyboard usage.

---

### **Advanced Calculator**
- Standard and scientific mathematical operations.
- Expression-based calculations.
- Keeps a **clickable history** of calculations for reuse.

---

### **Matrix Calculator**
- Edit **multiple matrices** (A, B, C, …) with dynamic creation/removal.
- Add/remove rows and columns **per matrix**.
- Supported operations:
  - ➕ Addition
  - ➖ Subtraction
  - ✖️ Multiplication (A × B)
  - 🔄 Transpose
  - 🔄 Inverse
  - 📐 Determinant
- **Store Result as Matrix** — Instantly reuse output as a new matrix.
- Numpad and direct input supported in grid cells.

---

### **Formula Library**
- Organized **database of formulas** for Math, Physics, Engineering, and Computer Science.
- 🔍 **Search** by name, description, or tags.
- 📂 **Filter** by category and subcategory.
- ⭐ **Favorite formulas** (persisted for the session).
- Mobile-friendly card view with:
  - Formula text
  - Variable explanations
  - Color-coded tags

---

### **Graphing Panel**
- Plot **functions, parametric equations, and 3D surfaces**.
- Toggle between **2D** and **3D** plot modes.
- Dual function support — plot two functions together.
- Auto-adjusts colors to match theme.

---

### **Unit Conversion Sidebar**
- Built-in **conversion panel** (length, weight, time, energy, etc.).
- Quick-access sidebar for fast unit changes.

---

## 🛠 Installation & Setup

### **1. Install Dependencies**
```bash
npm install
```

### **2. Start the App**
```bash
npm start
```

### **3. Open in Browser**
Visit:
```
http://localhost:3000
```

---

## 📂 Project Structure
```
src/
  ├── components/         # Reusable UI components
  ├── pages/              # Calculator, Matrix, Graphing, Formula Library
  ├── contexts/           # Theme and state management
  ├── styles/             # SCSS styles
  ├── images/             # Icons and assets
```
