## CareerStack  
### Skill Development & Career Growth Platform aligned with **SDG Goal 8 – Decent Work & Economic Growth**

CareerStack is a full-stack web platform that helps users evaluate how well their current skills match a target job role, identify missing skills, and discover recommended courses to bridge those gaps.

Instead of acting like a traditional job board that simply redirects users away, CareerStack is designed as a **career guidance and upskilling platform**.  
Its core value is helping users understand **what they need to learn next** to become job ready.

---

## Project Vision

CareerStack was built around the idea that many students and early-career professionals know *which job they want*, but not always:

- how ready they are for it,
- which skills they are missing,
- and which learning resources can help them improve.

The platform solves this by turning job roles into structured skill requirements and comparing them against the user’s current skill set.

This directly supports **UN Sustainable Development Goal 8 (SDG 8)** by promoting:

- **Decent Work**
- **Skill Development**
- **Economic Opportunity**
- **Career Growth Accessibility**

---

## Core Features

### 1. Authentication & Role-Based Access
- User registration and login using JWT authentication
- Protected routes for authenticated users
- Admin-only access to management functionality
- Session stored in local Storage for frontend route protection
- Navbar dynamically adapts based on logged-in user role

### 2. Skill Match Engine (Main Product Feature)
Users can:

- enter their current skills (comma-separated),
- select a target job role,
- calculate a **skill match percentage**.

The platform then shows:

- **Match %**
- **Match strength label** (Strong / Moderate / Needs Improvement / Low)
- **Skills the user already has**
- **Skills the user is missing**

This is the **core functionality** of CareerStack.

### 3. Course Recommendation Engine
If the user is missing required skills for a job role, CareerStack recommends courses that help close those skill gaps.

The recommendation logic:

- compares missing job skills with course `skills []` tags
- ranks courses based on how many missing skills they cover
- shows the most relevant results first

This makes the platform a **career improvement tool**, not just a job listing site.

### 4. Backend-Powered Job Feed
Admins can add jobs through the backend.

Users can browse job roles and:

- view role details
- see required skills
- click **Check Skill Match** (primary action)
- optionally use **Apply** as a secondary external link

### 5. Income Tracker
Users can access a simple income tracking page to visualise career and earning progression over time.

### 6. Admin Dashboard
Admin users can manage platform data through a protected admin interface:

- add/edit/delete jobs
- add/edit/delete courses
- maintain skill-tagged course data for better recommendations

---

## Corrected Product Flow (Important)

### Previous job-board style flow (not ideal)
Job → External Apply Link

### Final CareerStack flow (correct product direction)
**Job Feed → Check Skill Match → Skill Gap Analysis → Recommended Courses**

This is the intended and final product design because it better reflects CareerStack’s purpose:

- not just helping users *find jobs*,
- but helping users become **qualified for those jobs**.

---

## How the Skill Matching Works

Each job stores a list of required skills:

```js
{
  title: "AI / ML Engineer",
  skills: ["Python", "TensorFlow", "PyTorch", "ML Algorithms"]
}
````

The user enters their own skills:

```text
Python, SQL, Pandas
```

The system:

1. normalizes both skill lists (lowercase + trim),
2. finds intersections,
3. calculates:

```text
match % = (matched skills / required skills) * 100
```

Then it identifies:

* Matched skills
* Missing skills

---

## How Course Recommendation Works

Each course stores:

* title
* provider
* price
* link
* skills[]
* level

Example:

```js
{
  title: "TensorFlow in Practice",
  provider: "Coursera",
  skills: ["TensorFlow", "Python"],
  price: 0
}
```

If the user is missing:

* TensorFlow
* PyTorch

Then CareerStack filters courses where:

```js
course. Skills overlaps missing Skills
```

Courses are ranked by how many missing skills they cover.

This ensures recommendations are:

* Relevant
* Explainable
* Aligned to the target job role

---

## Tech Stack

### Frontend

* HTML5
* CSS3
* Vanilla JavaScript
* LocalStorage (session caching)
* Fetch API

### Backend

* Node.js
* Express.js
* MongoDB Atlas / MongoDB
* Mongoose
* JWT Authentication
* bcryptjs
* CORS
* dotenv

---

## Project Structure

```bash
careerstack/
│
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── jobfeed.html
│   ├── user-dashboard.html
│   ├── income.html
│   ├── admin-dashboard.html
│   ├── auth.js
│   ├── skillmatch.js
│   ├── theme.js
│   └── style.css
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── error.js
│   │   ├── models/
│   │   │   ├── user.js
│   │   │   ├── job.js
│   │   │   └── course.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── jobs.routes.js
│   │   │   ├── courses.routes.js
│   │   │   ├── income.routes.js
│   │   │   └── admin.routes.js
│   │   ├── utils/
│   │   │   ├── seedAdmin.js
│   │   │   └── seedData.js
│   │   └── server.js
│   │
│   ├── package.json
│   └── .env
```

---

## Data Models

### User

* `name`
* `email`
* `password`
* `role` (`user` or `admin`)

### Job

* `title`
* `company`
* `location`
* `salary`
* `type`
* `description`
* `skills[]`
* `applyUrl`
* `createdBy`

### Course

* `title`
* `provider`
* `category`
* `price`
* `image`
* `link`
* `description`
* `skills[]`
* `level`
* `createdBy`

---

## Backend Setup

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Create `.env`

```env
PORT=5000
NODE_ENV=development

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d

ADMIN_NAME=Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@123
```

### 3. Start backend

```bash
npm run dev
```

### 4. Optional: seed jobs + courses

```bash
npm run seed
```

---

## Frontend Setup

Since the frontend is plain HTML/CSS/JS, you can run it using:

* VS Code Live Server, or
* any static server

Make sure the backend is running on:

```text
http://localhost:5000
```

And in `auth.js`:

```js
const API_BASE = "http://localhost:5000/api";
```

---

## Default Admin Login

If admin seeding is enabled:

```text
Email: admin@example.com
Password: Admin@123
```

(Or whatever is configured in `.env`.)

---

## Example User Journey

1. User registers / logs in
2. Opens **Job Feed**
3. Browses a role like **AI / ML Engineer**
4. Clicks **Check Skill Match**
5. Gets redirected to **User Dashboard**
6. Enters skills like:

```text
Python, SQL, Pandas
```

7. CareerStack calculates:

* match %
* matched skills
* missing skills

8. Platform recommends:

* TensorFlow course
* PyTorch course
* ML fundamentals course

This turns the platform into a guided **upskilling pathway**.

---

## Current Limitations / Future Improvements

### Current limitations

* Skill parsing is rule-based (exact normalized match)
* No fuzzy synonym handling (e.g. `JS` vs `JavaScript`)
* Course recommendations depend on accurate `skills[]` tagging
* No resume upload / automated skill extraction yet
* Income tracker is simple and not analytics-heavy
* Frontend is built in vanilla JS, so scalability is limited compared to React

### Future improvements

* Add NLP-based skill synonym mapping
* Add resume parsing
* Add personalized learning roadmaps
* Add saved target roles
* Add progress tracking for completed courses
* Add charts for income analytics
* Migrate frontend to React for maintainability
* Add real external job APIs (optional enhancement)

---

## Why This Project Is Valuable

CareerStack is stronger than a basic CRUD project because it combines:

* authentication
* role-based access
* admin data management
* backend-driven frontend
* skill matching logic
* recommendation logic
* real product thinking

Its real value is that it **connects job aspiration to learning action**.

Instead of asking only:

> “What jobs are available?”

It asks:

> “How close are you to this role, and what should you learn next?”

That makes it a more meaningful and differentiated project.

---

## Project Level Assessment

Compared to a simple CRUD app, CareerStack is:

* **Above average**
* **Good for internships / entry-level interviews**
* **Strong if explained as a product-focused full-stack project**

Compared to more advanced projects like:

* AI-based Proctoring System
* IncidentIQ-style full-stack ops system
* Real-time Chat Application

CareerStack is **lighter technically**, but still useful because it demonstrates:

* product design thinking
* full-stack integration
* user flow correction
* data modeling
* recommendation logic

So it should be positioned as:

* **supporting project / secondary project**
* not your strongest flagship project

---

## Author

Built as a full-stack academic/product-style project focused on:

* career growth
* skill gap analysis
* guided learning
* SDG Goal 8 alignment

Members-
Shivam
Saurav Bhatt

---

## License

This project is for educational / portfolio use.

```

---
