# Huize-Tutor

---

![image](https://github.com/user-attachments/assets/e6696b8d-37fb-4aeb-a597-7d787a0c1a22)


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
