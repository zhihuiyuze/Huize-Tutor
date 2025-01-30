﻿# Huize-Tutor

---

```plaintext
┌───────────────────────────────────────────────────────────────────┐
│                         iOS/Android App                         │
│                 (Handwriting & Text Input UI)                   │
└───────────────┬─────────────────────────┬────────────────────────┘
                │                         │
                │  1) Open the App        │
                │     (Check Auth)        │
                │                         │
                ▼                         ▼
       ┌────────────────────┐    ┌───────────────────────────┐
       │ Is user logged in? │ →  │ If not logged in: Prompt  │
       └────────────────────┘    │ Sign-Up or Login Screen   │
                │                └───────────────────────────┘
       (Yes) →─┼──────────────────────────────────────────────┐
                │                                             │
                │ (No)                                        │
                ▼                                             │
 ┌─────────────────────────────────────┐                        │
 │  2) Sign Up / Login (via Email)    │                        │
 │      - Validate Credentials        │                        │
 │      - Store/Update Sessions in    │                        │
 │        Redis (JWT token, etc.)     │                        │
 └─────────────────────────────────────┘                        │
                │                                             │
                ▼                                             │
 ┌───────────────────────────────────────────────────────┐      │
 │  3) Authentication Successful / Existing Session      │◄────┘
 │     - User Info / Subscription Status is known        │
 │     - Display main interface (handwriting board, etc) │
 └───────────────────────────────────────────────────────┘
                │
                │
                └─── 4) Payment & Subscription Flow (Recharge)
                     (Triggered when user wants to purchase credits
                      or subscribe to a plan)
                     
                     ┌───────────────────────────────────────────┐
                     │           Payment Interface               │
                     │   - Apple In-App Purchase (iOS)           │
                     │   - Google Play Billing (Android)         │
                     │   - Stripe (if using external payment)    │
                     └───────────────────────────────────────────┘
                                     │
                                     ▼
                     ┌───────────────────────────────────────────┐
                     │   Verify Payment (Server-Side Check)      │
                     │   - Validate Receipt with Apple/Google    │
                     │   - Validate Payment Intent with Stripe   │
                     │   - Update Subscription/Credits in Redis  │
                     └───────────────────────────────────────────┘
                                     │
                                     ▼
                     ┌───────────────────────────────────────────┐
                     │  Update User Subscription Info            │
                     │  - Store new subscription status /        │
                     │    credits in Redis & MySQL               │
                     │  - Show confirmation to user              │
                     └───────────────────────────────────────────┘
                                     │
                                     ▼
 ┌─────────────────────────────────────────────────────────────┐
 │  5) User Submits Request (Homework/Question)               │
 │     - Handwriting data or text input is captured           │
 │     - Client sends request to server with user token       │
 └─────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
 ┌────────────────────────────────────────────────────────────────┐
 │            Cloudflare (CDN + WAF + HTTPS)                     │
 │    - Receives API call, checks for unusual traffic            │
 │    - Potentially serves Captcha or blocks if suspicious       │
 │    - Forwards valid requests to Nginx                         │
 └────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
 ┌─────────────────────────────────────────────────────────────┐
 │  Nginx (Reverse Proxy)                                      │
 │   - Routes request to Python backend (Flask/FastAPI)        │
 └─────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
     ┌─────────────────────────────────────────────────────┐
     │   6) Python Backend (Flask/FastAPI)                │
     │      - Verify JWT / User Status via Redis          │
     │      - Check if user has enough credits or is      │
     │        within subscription limits                  │
     │      - RAG Flow: Retrieve context (MySQL or        │
     │        vector DB), assemble prompt                 │
     │      - Call GPT API (OpenAI / Deepseek)            │
     └─────────────────────────────────────────────────────┘
                                     │
                                     ▼
     ┌─────────────────────────────────────────────────────┐
     │   GPT API Response                                  │
     │   - Return AI-generated hint or solution            │
     │   - Possibly store conversation in MySQL            │
     │   - Update usage metrics (credits consumed, etc.)   │
     └─────────────────────────────────────────────────────┘
                                     │
                                     ▼
     ┌─────────────────────────────────────────────────────┐
     │  7) Python Backend Returns Response                │
     │     - Pack AI result into JSON                     │
     └─────────────────────────────────────────────────────┘
                                     │
                                     ▼
 ┌─────────────────────────────────────────────────────────────┐
 │  8) iOS/Android App Displays Result                        │
 │     - Student sees interactive hints or correctness        │
 │       check from AI                                        │
 │     - User can proceed to next question / or re-check flow │
 └─────────────────────────────────────────────────────────────┘
```

---

### Explanation of Main Steps

1. **Open the App / Check Auth**  
   - The user opens the mobile application. The app checks if there is a valid session/JWT token stored locally or if the user is already logged in.

2. **Sign Up / Login**  
   - If not logged in, the user is prompted to either sign up or log in with email/password (or other methods). The back end stores/validates credentials in Redis/MySQL.  

3. **Authentication Successful**  
   - Once login is confirmed, the user is recognized and the main interface loads. The server knows the user's subscription status or credits.

4. **Payment & Subscription**  
   - If the user wants to recharge or purchase a subscription:
     - iOS: Apple In-App Purchase,  
     - Android: Google Play Billing,  
     - External Payment: Stripe, etc.  
   - The server verifies the purchase receipt or transaction token and updates the user’s subscription status/credits in Redis/MySQL.

5. **User Submits Request**  
   - The student inputs a query or uploads handwriting data. The client sends the request (along with the user’s JWT token) to the server.

6. **Cloudflare & Nginx**  
   - Cloudflare secures and filters traffic (CDN, WAF, DDoS protection).  
   - Nginx receives the forwarded requests and routes them to the Python backend.

7. **Python Backend / RAG Flow**  
   - The backend verifies the user’s token (Redis).  
   - Checks subscription or credit balance.  
   - Executes a Retrieval-Augmented Generation flow: retrieving context (from MySQL or a vector database), assembling the prompt, and calling the GPT API (OpenAI/Deepseek).

8. **Return AI Response**  
   - The GPT API returns AI-generated answers.  
   - The backend processes and stores conversation data in MySQL if needed, updates credits usage, and sends the final JSON response back to the app.

9. **App Displays AI Result**  
   - The user sees the hints or solution, plus whether the answer is correct, steps to improve, or any further guidance.  
   - The cycle can continue for further questions or reviews.

---
