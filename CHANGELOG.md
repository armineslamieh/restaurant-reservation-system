# Changelog

**Student Name:** Armin Eslamieh  
**Student Number:** 546708

This changelog documents the changes made for the resubmission of the project, based on the feedback received after the initial evaluation.

---

## Changes for Resubmission

### Documentation Improvements
- Updated the main `README.md` to clearly explain how to run the frontend and backend.
- Added a clear section describing the default admin credentials.
- Created a dedicated `documentation/CREDENTIALS.md` file to document:
    - Default admin login details
    - Required environment variables for both client and server
    - Instructions for running the application locally
- Updated `documentation/ARCHITECTURE.md` so it accurately reflects the real project structure and technologies used.
- Updated `documentation/API.md` to list only the endpoints that are actually implemented in the backend.
- Updated `documentation/REQUIREMENTS-CHECKLIST.md` to reflect the current state of the project and remove features that were not implemented.

### Project Cleanup
- Removed the unused and empty `controllers` folder to avoid confusion and better reflect the actual architecture.
- Ensured that no documentation refers to non-existing features such as Server-Sent Events (SSE) or unused architectural layers.
- Confirmed that `node_modules` folders are excluded from the final submission zip, as required.

### Environment Configuration
- Cleaned up `server/.env.example` so it only contains valid backend environment variables.
- Clearly documented how environment variables should be configured for both frontend and backend.

---

## Notes
- No application functionality was changed during this resubmission.
- All changes were focused on documentation clarity, project structure, and alignment with the given feedback.
- The goal of these changes was to make the project easier to understand, configure, and evaluate.

---

End of changelog.
