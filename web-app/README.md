# RidePool - Pakistani Ride Booking Web App

RidePool is a ride booking web application designed specifically for users in Pakistan. It allows users to conveniently book rides and share them with multiple users. The application is built using HTML, CSS, and JavaScript, with data storage and user authentication handled by Firebase. Additionally, Twilio integration enables seamless communication through WhatsApp.

## Features

- User Registration and Authentication: Users can create an account and securely log in to the application using their email and password.
- Ride Booking: Users can book rides by providing their pickup and drop-off locations, selecting a travel mode, and specifying the number of passengers.
- Multiple User Accommodation: RidePool allows users to share a ride with multiple individuals, making it convenient for groups or colleagues traveling together.
- Real-time Path Updates: The application integrates with Google Maps to provide real-time updates on the selected path for the ride.
- Twilio WhatsApp Integration: Users can receive notifications and updates about their ride through WhatsApp, thanks to the integration with Twilio.

## Technologies Used

- HTML: Used for creating the structure and layout of the web pages.
- CSS: Used for styling the web application and ensuring an appealing user interface.
- JavaScript: Implemented various functionalities and client-side interactions.
- Firebase: Handles user authentication, data storage, and real-time updates.
- Twilio: Integrated to enable WhatsApp notifications and communication.

## Installation and Setup

1. Clone the repository: `git clone https://github.com/danishzulfiqar/ridepool.git`
2. Open the project directory.
3. Set up Firebase:
   - Create a Firebase project and obtain the necessary configuration details (Firebase API keys, authentication settings).
   - Update the Firebase configuration in the JavaScript files (`firebase.js`) to establish the connection.
4. Set up Twilio:
   - Create a Twilio account and acquire the required API credentials (Account SID, Auth Token).
   - Update the Twilio integration details in the appropriate files (`twilio.js`).
5. Deploy the project on a web server or use a local development environment to run the application.

## Usage

1. Open the web application in your preferred web browser.
2. Register an account or log in using your credentials.
3. Explore the available options and functionalities.
4. Book a ride by providing the necessary details (pickup and drop-off locations, number of passengers).
5. Share the ride with multiple users, if desired.
6. Receive notifications and updates about the ride through WhatsApp.

## Contributors

- Danish Zulfiqar
- Dr Riaz Hussain

## License

This project is licensed under the MIT License.

## Acknowledgements

We would like to express our gratitude to the following resources and libraries that contributed to the development of this project:

- Firebase: Backend infrastructure and real-time data synchronization.
- Twilio: Integration for WhatsApp communication.
- Google Maps API: Provides mapping and location-related functionalities.
- Font Awsome: Front-end Icons.
- Articles [Algo 1](https://eng.lyft.com/matchmaking-in-lyft-line-9c2635fe62c4), [Algo 2](https://eng.lyft.com/matchmaking-in-lyft-line-691a1a32a008), [Algo 3](https://eng.lyft.com/matchmaking-in-lyft-line-part-3-d8f9497c0e51)

## Ride Together! Save Together!
