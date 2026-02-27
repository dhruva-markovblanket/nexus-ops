# Nexus Ops Enterprise Portal

## Version 1.2.0

### Project Overview
Nexus Ops is a comprehensive, centralized operations control portal tailored for academic institutions. It provides dedicated, specialized dashboard views for Administrators, Teachers, and Students, unifying system infrastructure, learning management, and campus security under a single, highly performant web application.

The platform is designed with a premium, robust user interface utilizing modern glassmorphism aesthetics, dynamic data visualizations, and interactive 3D topography mappings to enhance situational awareness and user experience.

### Key Features
*   **Role-Based Access Control**: Secure, partitioned dashboard interfaces specific to Admin, Teacher, and Student roles, ensuring data privacy and relevant operational tools.
*   **Dynamic Sub-Navigation**: Deeply integrated React Router architecture supporting robust nested URLs (`/admin/:tab`, `/student/:tab`, `/teacher/:tab`) for seamless state preservation and shareable links.
*   **Admin Operations Center**: Real-time system metrics, automated event logging, and a 3D Live Threat Topography map providing immediate visual feedback on cluster health and network anomalies.
*   **Student Dashboard**: Academic performance tracking, timetable integration, and an interactive 3D Campus Map built on WebGL for spatial orientation and facility discovery.
*   **Teacher Dashboard**: Comprehensive classroom management, grading analytics, and streamlined communication channels for academic personnel.
*   **Premium Aesthetic**: A curated dark-mode design system leveraging CSS variables, smooth micro-animations, and responsive charting libraries.

### Technology Stack
*   **Frontend Runtime**: React 19 (Vite)
*   **Routing Architecture**: React Router DOM (v7)
*   **3D Graphics Engine**: Three.js, @react-three/fiber, @react-three/drei
*   **Data Visualization**: Recharts
*   **Iconography**: Lucide React
*   **Styling**: Pure CSS Modules with utility classes

### Local Development Setup

To initialize the development environment locally:

1.  Clone the repository.
2.  Install frontend dependencies:
    ```bash
    cd frontend
    npm install
    ```
3.  Install backend dependencies (simulated server):
    ```bash
    cd backend
    npm install
    ```
4.  Start the development servers concurrently:
    ```bash
    # In terminal 1
    cd frontend && npm run dev
    
    # In terminal 2
    cd backend && npm start
    ```

### Recent Architecture Updates (v1.2.0)
*   Implemented parameterized dashboard routing for direct URL access to specific operational tabs.
*   Integrated `@react-three/fiber` to replace static placeholders with interactive WebGL components.
*   Deployed the `CampusMap3D` visualizer within the Student portal.
*   Deployed the `SecurityMap3D` animated threat visualizer within the Admin portal.
*   Refactored core CSS variables for enhanced visual hierarchy and component depth.

### Security Implementation Note
The current iteration utilizes a simulated authentication layer for demonstration purposes. In a production environment, this must be replaced with robust JWT-based or OAuth2 authentication validating against the backend API endpoint.

---
*Proprietary system software designed for internal institutional use.*
