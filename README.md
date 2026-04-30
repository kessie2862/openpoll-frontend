# 📊 OpenPoll

<a name="readme-top"></a>

> Build and share polls that show live results as people vote. Supports single-choice, multi-choice, ranked-choice, and open text questions. Results update in real time via WebSockets — no refresh needed.

## 📗 Table of Contents

- [About](#about)
  - [Built With](#built-with)
  - [Key Features](#key-features)
  - [Live Demo](#live-demo)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
  - [Environment Variables](#environment-variables)
  - [Run Locally](#run-locally)
- [Backend](#backend)
- [Authors](#authors)
- [Future Features](#future-features)
- [Contributing](#contributing)
- [License](#license)

---

## 📖 About <a name="about"></a>

OpenPoll is a full-stack poll and survey platform built with Django and Next.js. Create a poll, share the link or embed it anywhere with a one-line iframe snippet, and watch votes come in live.

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
  </ul>
</details>

<details>
  <summary>Backend</summary>
  <ul>
    <li><a href="https://www.djangoproject.com/">Django</a></li>
    <li><a href="https://www.django-rest-framework.org/">Django REST Framework</a></li>
    <li><a href="https://channels.readthedocs.io/">Django Channels</a></li>
    <li><a href="https://github.com/django/daphne">Daphne</a></li>
    <li><a href="https://redis.io/">Redis</a></li>
    <li><a href="https://www.postgresql.org/">PostgreSQL</a></li>
  </ul>
</details>

<details>
  <summary>Deployment</summary>
  <ul>
    <li><a href="https://vercel.com/">Vercel</a> — Frontend</li>
    <li><a href="https://railway.app/">Railway</a> — Backend, PostgreSQL, Redis</li>
  </ul>
</details>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### ✨ Key Features <a name="key-features"></a>

- **Real-time vote results** broadcast via Django Channels WebSockets
- **Four question types** — single choice, multi-choice, ranked choice (IRV tallying), open text
- **Drag-to-rank UI** for ranked-choice questions
- **Embeddable anywhere** via a one-line iframe snippet
- **Vote fraud prevention** — IP + browser fingerprint deduplication per account
- **Poll controls** — expiry dates, voter caps, password protection
- **Results export** — download as CSV or PNG chart
- **JWT authentication** with auto token refresh

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### 🚀 Live Demo <a name="live-demo"></a>

- [Frontend](https://openpoll-frontend.vercel.app)
- [Backend API](https://web-production-65e27.up.railway.app/api/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## 💻 Getting Started <a name="getting-started"></a>

### Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [Python](https://www.python.org/) 3.12+
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)

### Setup

Clone the repository:

```sh
git clone https://github.com/kessie2862/openpoll.git
cd openpoll
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Environment Variables <a name="environment-variables"></a>

**Backend** — create `openpoll/.env`:

```env
SECRET_KEY=your-secret-key
DB_NAME=openpoll_db
DB_USER=openpoll_user
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432
REDIS_URL=redis://127.0.0.1:6379/0
```

**Frontend** — create `openpoll-web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_WS_URL=ws://localhost:8000
NEXT_PUBLIC_EMBED_BASE_URL=http://localhost:8000/embed
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Run Locally <a name="run-locally"></a>

**Backend:**

```sh
cd openpoll
python -m venv venv

# Windows
.\venv\Scripts\Activate.ps1
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
daphne -p 8000 config.asgi:application
```

**Frontend:**

```sh
cd openpoll-web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## 🔗 Backend <a name="backend"></a>

The backend is a separate Django application in the `openpoll/` directory of this repo. It handles the REST API, WebSocket broadcasting, vote processing, and exports.

See the [backend README](./openpoll/README.md) for full setup and deployment instructions.

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

Feel free to check the [issues page](https://github.com/kessie2862/openpoll/issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## ⭐️ Show your support <a name="support"></a>

If you found this project useful, give it a ⭐️ — it helps a lot.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## 📝 License <a name="license"></a>

This project is [MIT](./LICENSE) licensed.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
