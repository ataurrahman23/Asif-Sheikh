# Security Specification: Tarail Blood Bank

## 1. Data Invariants

1. **Identity & Ownership Invariant**: A user may only create or modify their own User or Donor record (`request.auth.uid == userId`).
2. **Role Escalation Protection**: Regular users cannot self-assign the `admin` role or change `isVerified` on donor profiles. Only verified administrators can set `isVerified: true` or update `role: "admin"`.
3. **Verified Badge Invariant**: Verification actions generate an audit log entry in `/audit_logs` and require administrator authorization (`request.auth.token.email in ['asifjony2022@gmail.com']` or presence in admin database).
4. **Rating Integrity**: Users cannot rate themselves, and ratings are limited to 1-5 integer bounds.
5. **Report Isolation**: Reports can be submitted by authenticated users, but can only be read, listed, resolved, or deleted by authorized administrators.
6. **Emergency Request Authorization**: Only the original requester (`userId == request.auth.uid`) or an administrator can update the status (e.g. fulfill or close) of an emergency request.
7. **Hospital Directory Protection**: Only administrators can create, update, or remove entries in the `/hospitals` directory.
8. **No Point/Leaderboard Invariant**: There is no points, leaderboard, or competitive ranking collection. Donation counts are strictly self-reported unless marked verified by an administrator.

## 2. The "Dirty Dozen" Malicious Payloads

1. **Payload 1 (Privilege Escalation on User Profile)**:
   `POST /users/attacker-uid` with `{ "role": "admin", "isSuspended": false }`
   *Expected Result*: PERMISSION_DENIED.

2. **Payload 2 (Self-Verified Donor Badge)**:
   `POST /donors/donor-1` with `{ "userId": "attacker-uid", "isVerified": true, "verifiedBy": "self" }`
   *Expected Result*: PERMISSION_DENIED.

3. **Payload 3 (Impersonated Emergency Request)**:
   `POST /emergency_requests/req-1` with `{ "userId": "victim-uid", "patientName": "Spoofed" }`
   *Expected Result*: PERMISSION_DENIED.

4. **Payload 4 (Unauthorized Status Close on Victim's Request)**:
   `PATCH /emergency_requests/req-victim` by `attacker-uid` with `{ "status": "closed" }`
   *Expected Result*: PERMISSION_DENIED.

5. **Payload 5 (Unauthenticated Report Access / Data Scraping)**:
   `GET /reports/report-123` by unauthenticated or regular user.
   *Expected Result*: PERMISSION_DENIED.

6. **Payload 6 (Hospital Directory Poisoning)**:
   `POST /hospitals/fake-hosp` by regular authenticated user.
   *Expected Result*: PERMISSION_DENIED.

7. **Payload 7 (Audit Log Tampering)**:
   `DELETE /audit_logs/log-1` by any user or client SDK.
   *Expected Result*: PERMISSION_DENIED.

8. **Payload 8 (Out-of-Bounds Star Rating)**:
   `POST /ratings/rate-1` with `{ "rating": 999 }`
   *Expected Result*: PERMISSION_DENIED.

9. **Payload 9 (Self-Rating Attack)**:
   `POST /ratings/rate-1` where `raterUserId == donor.userId`
   *Expected Result*: PERMISSION_DENIED.

10. **Payload 10 (Ghost Field Injection)**:
    `PATCH /donors/donor-1` with `{ "ghostAdminFlag": true }`
    *Expected Result*: PERMISSION_DENIED.

11. **Payload 11 (Oversized Payload / Denial of Wallet)**:
    `POST /donors/donor-1` with 500KB string in `name`.
    *Expected Result*: PERMISSION_DENIED.

12. **Payload 12 (Direct Settings Tampering)**:
    `PUT /settings/developer` by non-admin user.
    *Expected Result*: PERMISSION_DENIED.
