# "New edition is out" — Outlook / Microsoft 365 notification

**Status: design only. Nothing in this project sends email.**
No credentials, tenant IDs or mailing lists are included, and none should be
committed to this folder.

This document describes how BioAni's IT team could announce each new edition of
Inside BioAni by email once the newsletter is hosted somewhere employees can
reach (intranet, SharePoint, or a published link).

---

## What the email would do

When an editor publishes a new month, every employee receives one short Outlook
email:

- Subject: `Inside BioAni — October 2026 is out`
- A small cover image (the masthead and month), 2–4 cover lines taken from the
  edition (new joiners count, birthdays count, founder's letter, game), and one
  button: **Read the October edition**.
- Sent from a shared mailbox such as `newsletter@bioani.in` or `hr@bioani.in`.
- Plain, light email layout; readable in Outlook desktop, web and mobile.

Birthday wishes stay inside the newsletter. No per-person birthday emails are
part of this design.

---

## Option A — Power Automate (recommended, no code)

Best fit if BioAni already uses Microsoft 365 and hosts the newsletter on
SharePoint.

1. **Trigger:** "When a file is created or modified" in the SharePoint library
   that holds the published `inside-bioani.html` (or when an item is added to a
   small "Editions" SharePoint list with columns *Edition id*, *Label*, *Link*,
   *Cover lines*, *Approved*).
2. **Condition:** continue only when *Approved* = Yes, so drafts never send.
3. **Action:** "Send an email (V2)" from the shared mailbox, To: an existing
   all-staff distribution list or Microsoft 365 group.
4. **Body:** a simple HTML email with the edition label, cover lines and link
   filled in from the list item.
5. **Guard:** a *Sent on* column set after sending, checked before sending, so a
   re-upload does not email everyone twice.

Owner: IT / M365 admin. Needs: a shared mailbox, a distribution list, and a
Power Automate licence that includes the SharePoint and Outlook connectors.

---

## Option B — Microsoft Graph `sendMail` (for a scripted publish step)

Suitable if publishing is done by a script (for example, after `build.py`).

- Register an app in **Microsoft Entra ID** with the application permission
  `Mail.Send`, restricted with an **application access policy** to the single
  shared mailbox that sends the newsletter.
- Store the client secret or certificate in a secret store (Azure Key Vault or
  the server's environment), never in this repository.
- After a successful build and upload, call:

```
POST https://graph.microsoft.com/v1.0/users/{shared-mailbox}/sendMail
{
  "message": {
    "subject": "Inside BioAni — October 2026 is out",
    "body": { "contentType": "HTML", "content": "<rendered template>" },
    "toRecipients": [ { "emailAddress": { "address": "{all-staff-list}" } } ]
  },
  "saveToSentItems": true
}
```

- Keep a small log (`edition id → sent at`) so each edition is announced once.

---

## Data the email needs from the newsletter

All of it already exists in the edition data, so nothing is typed twice:

| Email field | Source |
|---|---|
| Edition label | `IB.editions[id].label` |
| Cover lines | the same counts the cover uses (new joiners, birthdays, founder's letter status, game) |
| Link | the hosted newsletter URL + `?edition={id}` |
| Sender / reply-to | `IB.config.hrEmail` or a dedicated newsletter mailbox |

`notify.config.example.json` in this folder lists the non-secret settings an
implementation would read. It is an example only and is not loaded by the page.

---

## Privacy and good practice

- Send to a distribution list, not a pasted list of addresses.
- No dates of birth, ages or personal details in the email itself.
- Include one line at the bottom: *Questions or a story for next month? Write to
  hr@bioani.in.*
- Test by sending to a small test group before the first all-staff send.
