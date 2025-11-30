# GramSahayak 🇮🇳
### Digital Power to the Panchayat | पंचायत का डिजिटल साथी

**GramSahayak** is a next-generation Progressive Web Application (PWA) designed specifically for **Gram Panchayat Members (Ward Members & Sarpanchs)** in rural India. 

It acts as a smart digital assistant to manage village governance, draft official correspondence via AI, track grievances, and ensure no villager is left behind.

![Banner](https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=1200&q=80)

---

## ✨ Key Features

### 1. 🗣️ **Bharat-Ready Localization**
*   Full support for **10 Indian Languages**: English, Hindi (हिंदी), Bengali (বাংলা), Telugu (తెలుగు), Marathi (मराठी), Tamil (தமிழ்), Gujarati (ગુજરાતી), Kannada (ಕನ್ನಡ), Malayalam (മലയാളം), and Punjabi (ਪੰਜਾਬੀ).
*   The entire UI and AI-generated content adapt to the selected language.

### 2. 🤖 **AI Karyalaya (Smart Drafter)**
*   Powered by **Google Gemini 2.5 Flash**.
*   Drafts complex official letters (e.g., to BDO, District Magistrate) in seconds.
*   Context-aware: Automatically inserts the member's Name, Ward, and Panchayat details.

### 3. 📋 **Jan Sunwai (Grievance Log)**
*   Digital register for village issues (Water, Roads, Electricity, Pension).
*   **Priority Tracking**: Tag issues as Urgent, High, Medium, or Low.
*   **Action History**: Track every step taken to resolve an issue.
*   **Aging Analysis**: See exactly how many days an issue has been pending.

### 4. 📅 **Smart Schedule & Itinerary**
*   **"My Day" View**: A focused timeline of today's tasks.
*   **Calendar View**: Monthly grid for planning Gram Sabhas and visits.
*   **Integration**: One-click "Schedule Visit" directly from a Grievance card.
*   **Notifications**: Browser alerts 15 minutes before any event.

### 5. 📢 **Gram Sampark (Broadcast)**
*   Draft polit, emoji-rich WhatsApp messages for village groups using AI.
*   Supports "Hinglish" and local dialects to ensure messages are read and understood.

### 6. 🔐 **Security & Privacy**
*   **App Lock**: Secure the app with a 4-digit PIN.
*   **Biometric Support**: Unlock using the phone's native Fingerprint or Face ID (WebAuthn).
*   **Local First**: All data is stored in the device's `localStorage` for privacy.

---

## 📸 Screenshots

| Dashboard & Stats | Grievance Log | AI Letter Drafter |
|:---:|:---:|:---:|
| <img src="https://via.placeholder.com/300x600?text=Dashboard" alt="Dashboard" width="200"/> | <img src="https://via.placeholder.com/300x600?text=Grievance+Log" alt="Grievance Log" width="200"/> | <img src="https://via.placeholder.com/300x600?text=AI+Drafter" alt="AI Drafter" width="200"/> |

| Scheduler | WhatsApp Connect | Lock Screen |
|:---:|:---:|:---:|
| <img src="https://via.placeholder.com/300x600?text=Calendar" alt="Calendar" width="200"/> | <img src="https://via.placeholder.com/300x600?text=Broadcast" alt="Broadcast" width="200"/> | <img src="https://via.placeholder.com/300x600?text=App+Lock" alt="App Lock" width="200"/> |

---

## 🛠️ Tech Stack

*   **Framework**: React 18
*   **Build Tool**: Vite / Webpack
*   **Styling**: Tailwind CSS (Mobile-first design)
*   **AI Engine**: Google GenAI SDK (`gemini-2.5-flash`)
*   **Charts**: Recharts
*   **PWA**: Service Workers & Manifest for offline & install capability.
*   **Auth**: Web Authentication API (WebAuthn) for Biometrics.

---

## 🚀 Getting Started

### Prerequisites
1.  Node.js installed on your machine.
2.  A valid **Google Gemini API Key** (Get it from [AI Studio](https://aistudio.google.com/)).

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/gram-sahayak.git
    cd gram-sahayak
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure API Key**
    *   Create a `.env` file in the root directory.
    *   Add your key:
        ```env
        API_KEY=your_actual_api_key_here
        ```
    *   *Note: In the provided code, the API key is passed via process.env. In a production build, ensure this is handled via your build pipeline.*

4.  **Run Locally**
    ```bash
    npm start
    ```
    Open `http://localhost:3000` (or the port shown in terminal).

---

## 📲 How to Install (PWA)

GramSahayak is designed to be installed on phones **without** the Google Play Store.

1.  Host the app (e.g., on Vercel/Netlify).
2.  Open the link in **Chrome** on Android.
3.  Tap the **Three Dots Menu** (⋮) in the top right.
4.  Select **"Add to Home Screen"** or **"Install App"**.
5.  The app will appear on your home screen and launch in full-screen mode.

---

## 🤝 Contributing

Contributions are welcome! Please focus on:
1.  Improving accessibility for rural users.
2.  Adding support for more regional languages.
3.  Optimizing offline capabilities.

---

## 📄 License

This project is open-source and available under the **MIT License**.
