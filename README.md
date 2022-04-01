## Description:

A web application that allows booking equipment for rental, managing reservations and current rentals made on-site. Along with the desktop application forms one coherent **rental management system**.

![responsible](/readme_images/responsible.png "Responsible mobile screenshot")

## Rental management system

Project created in a team of two. I was responsible for the client side (web application created in TypeScript, React - this repo) and my collegue was responsible for the employee side (desktop application written in Java). Beyond the implementation, we were both responsible for the design of the system (compare existing solutions, set the requirements for our system..)

Theoretical background was described in our [engineering thesis](/engineering-thesis.pdf). The paper was written and defended at AGH University of Science and Technology in January 2022 with a grade of 5.0.

![uml diagram](/readme_images/uml-diagram.png "UML diagram")



## Tech stack:

- **TypeScript**
- **React**
- HTML5
- CSS (CSS-in-JS)
- MongoDB Atlas
- Material-ui
- React Router
- EmailJS
- Google OAuth Authentication
- Axios
- npm
- Jest
- CryptoJS

## Functional requirements

### Authentication:

1. Customer registration via e-mail, including confirmation of email correctness by
entering the code sent to the mailbox, as well as through a hyperlink in the message received.

2. Customer registration with a unique code generated by the employee if rented on-site without reservation. The user shall be provided with access to rental management, including tracking of the price charged at any time. The user only needs to fill in his login data, such as email and password.

3. Customer registration with SSO. The customer only has to fill in / confirm his personal data.

4. Customer login to an account created in any way, including SSO.

### The customer can:

5. Edit his personal data.

6. Change the password or delete the account.

7. View products available for rental.

8. Filter products by selected rental time and equipment type, including rental price calculation and rental company opening hours set in desktop application.

9. Reserve product and get an automatic confirmation by email.

10. Get an overview of all reservations made, both current, cancelled and archived.

11. Cancel a reservation.

12. Track the rental status, including displaying the charged amount until check, together with a presentation of the charging method (hourly or daily).

13. Send an e-mail enquiry to the employee directly from the reservation or rental so that he do not have to provide any service details or personal information.

14. View contact details for the rental company, updated in real time from the desktop application.

### General:

14. Maintain the user session even after closing the browser. Logging out takes place only after pressing the Logout button.

16. Responsiveness and accesibility on mobile devices.

17. Rotuing support. Ability to save a link to a selected service and navigate to the page of this service.

## Screenshots:

![responsible](/readme_images/reservations.png "Responsible screenshots")
![responsible](/readme_images/login.png "Responsible screenshots")
![responsible](/readme_images/overview.png "Responsible screenshots")
![responsible](/readme_images/reservation.png "Responsible screenshots")
![responsible](/readme_images/profile.png "Responsible screenshots")
![responsible](/readme_images/google-login.png "Responsible screenshots")
![responsible](/readme_images/email-verification.png "Responsible screenshots")
![responsible](/readme_images/email-requests.png "Responsible screenshots")

## Possible improvements:

- implement some global state management system like redux to tidy up the code
- clean up spaghetti code
- hash passwords instead of encrypting them (?)