
# OlxIITBBS - [@Link](https://olxiitbbs.netlify.app)

Welcome to OlxIITBBS, your one-stop solution for buying and selling pre-owned items within the IIT BBS community.


## Features

- Secure user authentication.
- Session storage implemention to ensure that users don't need to login each time they visit.
- Password Reset through OTP verification on email.
- Seamlessly buy and sell old items.
- Add products to your wishlist and purchase them later.
- Communicate directly with the seller through live messaging (Using web sockets).
- Easily search and filter products by category as per your requirements.
- Easily Toggle between light and dark themes according to your convenience.
<!-- - Advertise and feature your product for a minimal fee. -->

### Upcoming Features
- Admins can control and supervise the website's operations.
- Access detailed analytics (admin-only feature).

## Development
#### Tech Stack Used : MERN (MongoDB, ExpressJs, React, NodeJs)
#### Other Technologies Used : Socket.io, Tailwind CSS

#### Author  - [@Nishant-Tomar1](https://www.github.com/Nishant-Tomar1)
## API Documentation

For detailed API documentation, please visit our [PostMan API Documentation](https://documenter.getpostman.com/view/30488668/2sA3XV9fEi)
## Installation

#### Clone the repository:

```bash
  git clone https://github.com/Nishant-Tomar1/OlxIITBBS.git
  cd OlxIITBBS
```

#### Install dependencies for both backend and frontend:

```bash
  cd backend
  npm install
  cd ../frontend
  npm install
```

#### Create a '.env' file in the backend directory and add your environment variables:

```bash
  PORT = your_port
  MONGODB_URI = your_mongodbURI
  CORS_ORIGIN = your_frontend_port

  ACCESS_TOKEN_SECRET = your_access_token_secret
  ACCESS_TOKEN_EXPIRY = access_token_expiry
  REFRESH_TOKEN_SECRET = your_refresh_token_secret
  REFRESH_TOKEN_EXPIRY = refresh_token_expiry

  CLOUDINARY_CLOUD_NAME = cloudinary_project_name
  CLOUDINARY_API_KEY = your_cloudinary_api_key
  CLOUDINARY_API_SECRET = your_cloudinary_api_secret

  SMTP_HOST = smtp_email
  SMTP_PORT = smtp_port
  SMTP_MAIL = your_email
  SMTP_PASS = your_smtp_password
```

#### Start the backend:
```bash
  cd backend
  npm run dev
```
#### Start the frontend:
```bash
  cd frontend
  npm run start
```
## Contributing

Contributions are always welcome!
Please fork the repository and submit a pull request.

