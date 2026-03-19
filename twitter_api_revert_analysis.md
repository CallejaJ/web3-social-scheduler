# Twitter API Revert & Migration Analysis

## 1. Context & Problem
The bot was migrated from `rettiwt-api` to the official **Twitter API v2** to improve stability. However, the official API returned **403 Forbidden (client-not-enrolled)** errors.

### Discovery:
*   Twitter has **deprecated the Free plan** for many legacy accounts.
*   Apps created under the Free plan can no longer post if they are not part of a "Project" with Basic/Pro access.
*   Even with "Read and Write" permissions, the API rejects posting requests from these restricted developer accounts.

---

## 2. Solution: Reverting to Rettiwt (Scraper)
Since the official API is no longer viable for this account without a $100/mo subscription, we have reverted to **`rettiwt-api`**. This library acts as a browser-based scraper and does not require official API keys.

### Authentication Requirements:
Instead of API keys, Rettiwt uses browser cookies:
1.  **`auth_token`**: The main session cookie.
2.  **`ct0`**: The CSRF token required for write operations (posting).

---

## 3. Implementation Details

### Configuration:
*   **Variable**: `RETTIWT_API_KEY` in Koyeb.
*   **Format**: `auth_token=YOUR_TOKEN; ct0=YOUR_CSRF` (or just the raw `auth_token` value if only reading).

### Handling Token Sanitization:
In `rettiwt-client.js`, we implemented a sanitization block to handle cases where the user pastes the full cookie string from the browser. The bot now automatically extracts the raw `auth_token` value for the library constructor.

### Graceful Fallbacks:
We refactored `follower-welcome.js` and `mention-replies.js` to disable themselves if official API keys are invalid. This prevents the entire bot from crashing on startup.

---

## 4. Troubleshooting Checklist

| Symptom | Cause | Solution |
| :--- | :--- | :--- |
| **Crash on startup** | Secondary modules (Welcome/Replies) failing on `new TwitterApi` | Wrap initialization in `try/catch` (Implemented) |
| **Rettiwt connection error** | Provided token is an object, not a string | Fix constructor call (Implemented) |
| **Not authorized (Reading)** | `auth_token` is expired or invalid | Get a fresh `auth_token` from browser cookies |
| **Not authorized (Posting)** | Missing or mismatched `ct0` CSRF token | Ensure `ct0` is included in the cookie string |

---

## 5. Current Status
*   **Bluesky**: Fully functional.
*   **Twitter**: Connection (Reading) is verified and working. Posting is currently being tested with the combined `auth_token` and `ct0` cookies.
