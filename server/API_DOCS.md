# Travel Planner API Documentation

## Base URL

```text
http://localhost:3000
```

---

# Authentication

Endpoint yang membutuhkan authentication harus mengirim access token melalui header:

```http
Authorization: Bearer <access_token>
```

---

# 1. Authentication

## POST /register

Register user baru.

### Authentication

Not required.

### Request Body

```json
{
  "username": "john",
  "email": "john@mail.com",
  "password": "password123",
  "fullName": "John Doe",
  "address": "Jakarta",
  "phone": "08123456789",
  "birthDate": "1999-01-01",
  "gender": "Male"
}
```

### Success Response

**201 Created**

```json
{
  "message": "Success create new user",
  "user": {
    "id": 1,
    "username": "john",
    "email": "john@mail.com"
  }
}
```

### Error Response

**400 Bad Request**

Terjadi jika username, email, atau password tidak diisi.

```json
{
  "message": "Bad Request"
}
```

---

## POST /login

Login menggunakan email dan password.

### Authentication

Not required.

### Request Body

```json
{
  "email": "john@mail.com",
  "password": "password123"
}
```

### Success Response

**200 OK**

```json
{
  "access_token": "your-access-token"
}
```

### Error Response

**400 Bad Request**

Jika email atau password tidak diisi.

**401 Unauthorized**

Jika email atau password tidak sesuai.

---

## POST /google-login

Login menggunakan Google OAuth.

### Authentication

Not required.

### Header

```http
token: <google-credential>
```

### Success Response

**200 OK**

```json
{
  "access_token": "your-access-token"
}
```

### Error Response

**500 Internal Server Error**

Jika proses verifikasi Google gagal.

---

# 2. Profile

## GET /profile

Mengambil profile user yang sedang login.

### Authentication

Required.

```http
Authorization: Bearer <access_token>
```

### Success Response

**200 OK**

```json
{
  "message": "Success read profile",
  "profile": {
    "id": 1,
    "UserId": 1,
    "fullName": "John Doe",
    "address": "Jakarta",
    "phone": "08123456789",
    "birthDate": "1999-01-01",
    "gender": "Male"
  }
}
```

### Error Response

**404 Not Found**

Jika profile tidak ditemukan.

---

## PUT /profile

Mengupdate profile user yang sedang login.

### Authentication

Required.

```http
Authorization: Bearer <access_token>
```

### Request Body

```json
{
  "fullName": "John Doe",
  "address": "Bekasi",
  "phone": "08123456789",
  "birthDate": "1999-01-01",
  "gender": "Male"
}
```

### Success Response

**200 OK**

```json
{
  "message": "Profile updated successfully",
  "profile": {}
}
```

### Error Response

**404 Not Found**

Jika profile tidak ditemukan.

---

# 3. Travel Plan

## GET /travel-plan

Mengambil semua travel plan milik user yang sedang login.

### Authentication

Required.

```http
Authorization: Bearer <access_token>
```

### Success Response

**200 OK**

```json
{
  "message": "Success read travel plans",
  "travelPlan": [
    {
      "id": 1,
      "UserId": 1,
      "title": "Bali Adventure",
      "destination": "Bali",
      "duration": 5,
      "budget": 5000000,
      "travelStyle": "Adventure"
    }
  ]
}
```

---

## POST /travel-plan

Membuat travel plan baru.

### Authentication

Required.

```http
Authorization: Bearer <access_token>
```

### Request Body

```json
{
  "title": "Bali Adventure",
  "destination": "Bali",
  "duration": 5,
  "budget": 5000000,
  "travelStyle": "Adventure",
  "budgetBreakdown": {
    "accommodation": 2000000,
    "transportation": 1000000,
    "food": 1000000,
    "activities": 1000000
  },
  "travelTips": [
    "Bring sunscreen",
    "Bring comfortable shoes"
  ]
}
```

### Success Response

**201 Created**

```json
{
  "message": "Success create new Travel Plan",
  "travelPlan": {}
}
```

---

## POST /travel-plan/generate

Generate travel plan menggunakan Google Gemini AI.

### Authentication

Required.

```http
Authorization: Bearer <access_token>
```

### Request Body

```json
{
  "destination": "Bali",
  "duration": 5,
  "budget": 5000000,
  "travelStyle": "Adventure",
  "language": "en"
}
```

`language` dapat menggunakan:

```text
en
```

untuk English atau:

```text
id
```

untuk Indonesian.

### Success Response

**200 OK**

```json
{
  "message": "Success generate travel plan",
  "travelPlan": {
    "trip_title": "Bali Adventure",
    "destination": "Bali",
    "duration": "5 days",
    "travel_style": "Adventure",
    "language": "en",
    "itinerary": [],
    "budget_breakdown": {
      "currency": "IDR",
      "total_budget": 5000000,
      "categories": []
    },
    "travel_tips": []
  }
}
```

---

## POST /travel-plan/save

Menyimpan travel plan yang telah dibuat oleh AI beserta itinerary.

### Authentication

Required.

```http
Authorization: Bearer <access_token>
```

### Request Body

```json
{
  "trip_title": "Bali Adventure",
  "destination": "Bali",
  "duration": "5",
  "travel_style": "Adventure",
  "language": "en",
  "itinerary": [
    {
      "day": 1,
      "title": "Beach Day",
      "activities": [
        {
          "time": "10:00",
          "activity": "Visit Kuta Beach",
          "location": "Kuta",
          "description": "Enjoy the beach",
          "estimated_cost_idr": 50000
        }
      ]
    }
  ],
  "budget_breakdown": {
    "currency": "IDR",
    "total_budget": 5000000,
    "categories": []
  },
  "travel_tips": [
    "Bring sunscreen"
  ]
}
```

### Success Response

**201 Created**

```json
{
  "message": "Success save generated travel plan",
  "travelPlan": {}
}
```

---

## GET /travel-plan/:id

Mengambil detail travel plan berdasarkan ID beserta itinerary.

### Authentication

Required.

```http
Authorization: Bearer <access_token>
```

### URL Parameter

```text
id
```

Contoh:

```text
GET /travel-plan/1
```

### Success Response

**200 OK**

```json
{
  "travelPlan": {
    "id": 1,
    "title": "Bali Adventure",
    "destination": "Bali",
    "duration": 5,
    "budget": 5000000,
    "travelStyle": "Adventure",
    "Itineraries": []
  }
}
```

### Error Response

**404 Not Found**

Jika travel plan tidak ditemukan.

---

## PUT /travel-plan/:id

Mengupdate travel plan.

### Authentication

Required.

```http
Authorization: Bearer <access_token>
```

### Request Body

```json
{
  "title": "Bali Adventure Updated",
  "destination": "Bali",
  "duration": 7,
  "budget": 7000000,
  "travelStyle": "Relax",
  "budgetBreakdown": {
    "accommodation": 3000000,
    "food": 1500000
  },
  "travelTips": [
    "Bring sunscreen"
  ]
}
```

### Success Response

**200 OK**

```json
{
  "message": "Success update Travel Plan",
  "travelPlan": {}
}
```

### Error Response

**404 Not Found**

Jika travel plan tidak ditemukan.

---

## DELETE /travel-plan/:id

Menghapus travel plan.

### Authentication

Required.

```http
Authorization: Bearer <access_token>
```

### Success Response

**200 OK**

```json
{
  "message": "Success delete Travel Plan"
}
```

### Error Response

**404 Not Found**

Jika travel plan tidak ditemukan.

---

## GET /travel-plan/:id/export

Export travel plan menjadi PDF.

### Authentication

Required.

### URL Parameter

```text
id
```

Contoh:

```text
GET /travel-plan/1/export
```

### Success Response

**200 OK**

Response berupa file PDF.

Response headers:

```http
Content-Type: application/pdf
Content-Disposition: attachment; filename="Bali Adventure.pdf"
```

### Error Response

**404 Not Found**

Jika travel plan tidak ditemukan.

---

# 4. Itinerary

## GET /itinerary/:travelPlanId

Mengambil semua itinerary dari travel plan tertentu.

### Authentication

Required.

```http
Authorization: Bearer <access_token>
```

### URL Parameter

```text
travelPlanId
```

Contoh:

```text
GET /itinerary/1
```

### Success Response

**200 OK**

```json
{
  "message": "Success read itineraries",
  "itineraries": [
    {
      "id": 1,
      "TravelPlanId": 1,
      "day": 1,
      "title": "Beach Day",
      "activities": []
    }
  ]
}
```

### Error Response

**404 Not Found**

Jika travel plan tidak ditemukan.

**403 Forbidden**

Jika travel plan bukan milik user yang sedang login.

---

## POST /itinerary/:travelPlanId

Membuat itinerary baru untuk travel plan.

### Authentication

Required.

### Request Body

```json
{
  "day": 1,
  "title": "Beach Day",
  "activities": [
    {
      "time": "10:00",
      "activity": "Visit Kuta Beach",
      "location": "Kuta",
      "description": "Enjoy the beach",
      "estimated_cost_idr": 50000
    }
  ]
}
```

### Success Response

**201 Created**

```json
{
  "message": "Success create itinerary",
  "itinerary": {}
}
```

### Error Response

**404 Not Found**

Jika travel plan tidak ditemukan.

**403 Forbidden**

Jika travel plan bukan milik user.

---

## PUT /itinerary/:id

Mengupdate itinerary.

### Authentication

Required.

### Request Body

```json
{
  "day": 1,
  "title": "Updated Beach Day",
  "activities": []
}
```

### Success Response

**200 OK**

```json
{
  "message": "Success update itinerary",
  "itinerary": {}
}
```

### Error Response

**404 Not Found**

Jika itinerary atau travel plan tidak ditemukan.

**403 Forbidden**

Jika itinerary bukan milik travel plan user.

---

## DELETE /itinerary/:id

Menghapus itinerary.

### Authentication

Required.

### Success Response

**200 OK**

```json
{
  "message": "Success delete itinerary"
}
```

### Error Response

**404 Not Found**

Jika itinerary atau travel plan tidak ditemukan.

**403 Forbidden**

Jika itinerary bukan milik travel plan user.

---

# 5. Common Error Responses

## 400 Bad Request

Request tidak valid atau data yang dibutuhkan tidak lengkap.

```json
{
  "message": "Bad Request"
}
```

## 401 Unauthorized

Access token tidak ada atau tidak valid.

```json
{
  "message": "Please login first"
}
```

## 403 Forbidden

User tidak memiliki akses terhadap resource.

```json
{
  "message": "Forbidden"
}
```

## 404 Not Found

Resource tidak ditemukan.

```json
{
  "message": "Data not found"
}
```

## 500 Internal Server Error

Terjadi kesalahan pada server.

```json
{
  "message": "Internal Server Error"
}
```