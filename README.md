# Storage Management System

This project is a **Storage Management System** developed to manage and track storage capacities over time, providing a historical view of storage updates and cleanup orders.

## Features

* **Storage History Tracking** : Keeps track of changes in storage capacities.
* **Cleanup Orders** : Manages orders to clean up storage and tracks their status.
* **API Endpoints** : Provides REST API endpoints to interact with storage data and cleanup orders.
* **CSV Export** : Allows exporting storage history data as a CSV file.

## Technologies Used

* **Python** : Backend development.
* **Django** : Web framework for building the API.
* **Django Rest Framework (DRF)** : For creating RESTful APIs.
* **React** : Frontend for interacting with the system.
* **Material UI** : UI components library for frontend design.
* **Docker** : To containerize the application for easy deployment.

### Accessing the System

## How to Run the Project Locally

1. Clone the repository:
   `git clone git@github.com:Matheus-mVilela/b2blue-storage-volume-control-system.git`
2. Navigate to the project folder:
   `cd b2blue-storage-volume-control-system`
3. Build Containers
   `make build`
4. Apply migrations:
   `make migrate`
5. Start the backend services:
   `make up-backend`
6. Open a new terminal and start the frontend:
   `make up-frontend`
7. The project should now be up and running locally!

* You can access the **API** at `http://localhost:8000/`.
* The **Frontend** can be accessed at `http://localhost:3000`.
