# Dramabox Unofficial API

A Node.js/Next.js based API to fetch data from DramaboxDB, secured with API Key authentication.

## 🚀 Base URL
**Production:** `https://api-drmbox.mkstore.id`

## 🛠 Features

- **Search Dramas:** Search for dramas by keyword.
- **Home Data:** Fetch homepage recommendations.
- **Movie Details:** Get full drama info including episode lists.
- **Genre List:** Browse dramas by category/genre.
- **Admin Panel:** Built-in dashboard to manage API Keys.

## 📚 API Documentation

### Authentication
Include `x-api-key` header in all requests.

### Endpoints

#### 1. Search
```http
GET /api/search?q={keyword}&lang={locale}
```

#### 2. Home
```http
GET /api/home?lang={locale}
```

#### 3. Movie Detail
```http
GET /api/movie?id={id}&slug={slug}
```

#### 4. Genre
```http
GET /api/genre?id={id}
```

## 📦 Installation

1. Clone the repo
```bash
git clone https://github.com/nokosite-api/drmbx-api.git
```
2. Install dependencies
```bash
npm install
```
3. Setup `.env`
```env
SUPABASE_URL=...
SUPABASE_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_PASSWORD=...
```
4. Run locally
```bash
npm run dev
```
