# 📊 OpenPoll — Frontend

<a name="readme-top"></a>

> Build and share polls that show live results as people vote. Supports single-choice, multi-choice, ranked-choice, and open text questions. Results update in real time via WebSockets — no refresh needed.

## 📗 Table of Contents

- [About](#about)
  - [Built With](#built-with)
  - [Key Features](#key-features)
  - [Live Demo](#live-demo)
- [Backend](#backend)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
  - [Environment Variables](#environment-variables)
  - [Run Locally](#run-locally)
- [Authors](#authors)
- [Future Features](#future-features)
- [Contributing](#contributing)
- [License](#license)

---

## 📖 About <a name="about"></a>

OpenPoll is a full-stack poll and survey platform. This repository contains the Next.js frontend. Create a poll, share the link or embed it anywhere with a one-line iframe snippet, and watch votes come in live.

### 🛠 Built With <a name="built-with"></a>

<details>
  <summary>Frontend</summary>
  <ul>
    <li><a href="https://nextjs.org/">Next.js 14</a></li>
    <li><a href="https://www.typescriptlang.org/">TypeScript</a></li>
    <li><a href="https://tailwindcss.com/">Tailwind CSS</a></li>
    <li><a href="https://recharts.org/">Recharts</a></li>
    <li><a href="https://www.framer.com/motion/">Framer Motion</a></li>
    <li><a href="https://tanstack.com/query">TanStack Query</a></li>
    <li><a href="https://zustand-demo.pmnd.rs/">Zustand</a></li>
    <li><a href="https://react-hook-form.com/">React Hook Form</a></li>
    <li><a href="https://zod.dev/">Zod</a></li>
  </ul>
</details>

<details>
  <summary>Deployment</summary>
  <ul>
    <li><a href="https://vercel.com/">Vercel</a></li>
  </ul>
</details>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### ✨ Key Features <a name="key-features"></a>

- **Real-time vote results** broadcast via WebSockets — no refresh needed
- **Four question types** — single choice, multi-choice, ranked choice, open text
- **Drag-to-rank UI** for ranked-choice questions
- **Embeddable anywhere** via a one-line iframe snippet
- **Poll controls** — expiry dates, voter caps, password protection
- **Results export** — download as CSV or PNG chart
- **JWT authentication** with auto token refresh
- **Live animated charts** powered by Recharts and Framer Motion

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### 🚀 Live Demo <a name="live-demo"></a>

- [Live App](https://openpoll-frontend.vercel.app)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## 🔗 Backend <a name="backend"></a>

> This is the frontend repository only. The backend is built with Django, Django Channels, and Django REST Framework — handling the REST API, WebSocket broadcasting, vote processing, and exports.

👉 [OpenPoll Backend Repository](https://github.com/kessie2862/openpoll-backend)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## 💻 Getting Started <a name="getting-started"></a>

### Prerequisites

- [Node.js](https://nodejs.org/) v20+
- A running instance of the [OpenPoll backend](https://github.com/kessie2862/openpoll-backend)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Setup

Clone the repository:

```sh
git clone https://github.com/kessie2862/openpoll-frontend.git
cd openpoll-frontend
```

Install dependencies:

```sh
npm install
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Environment Variables <a name="environment-variables"></a>

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_WS_URL=ws://localhost:8000
NEXT_PUBLIC_EMBED_BASE_URL=http://localhost:8000/embed
```

For production, point these at your deployed backend:

```env
NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app/api
NEXT_PUBLIC_WS_URL=wss://your-backend.up.railway.app
NEXT_PUBLIC_EMBED_BASE_URL=https://your-backend.up.railway.app/embed
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Run Locally <a name="run-locally"></a>

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

> Make sure the backend is running on port 8000 before starting the frontend.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## 👥 Authors <a name="authors"></a>

👤 **Prosper Kessie**

- GitHub: [@kessie2862](https://github.com/kessie2862)
- LinkedIn: [Prosper Kessie](https://www.linkedin.com/in/prosperkessie/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## 🔭 Future Features <a name="future-features"></a>

- [ ] Poll analytics — votes over time, peak voting hours
- [ ] Email notifications when polls hit milestones
- [ ] Poll duplication — clone an existing poll as a draft
- [ ] Voter receipt — email confirmation after voting

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## 🤝 Contributing <a name="contributing"></a>

Contributions, issues, and feature requests are welcome.

Feel free to check the [issues page](https://github.com/kessie2862/openpoll-frontend/issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## ⭐️ Show your support <a name="support"></a>

If you found this project useful, give it a ⭐️ — it helps a lot.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## 📝 License <a name="license"></a>

This project is [MIT](./LICENSE) licensed.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
