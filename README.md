# Image Uploader
## Tweak Challenge

The Image Uploader module is a full AWS Serverless API featuring User sign up and login, and private images upload, list and download.

### Resources:

- Serverless auto deploy
- API Gateway authorizer with Cognito
- Lambda in Node.js 10.x
- S3 image storage

### Requirements:

- Node
- AWS account configured with admin privileges (CloudFormation) in the execution environment

### Execution:

1. `$ npm install`
1. `$ npm run deploy`

### Endpoints:
- **/users** POST:

    Sign-up new User.

    + Request:

        Body:
        ```
        {
            "email": "username",
            "password": "6chars"
        }
        ```

    + Response:

        Status: 204

* **/users/login** POST:

    Sign-in created User.

    + Request:

        Body:
        ```
        {
            "email": "username",
            "password": "password"
        }
        ```

    + Response:

        Status: 200

        Body:
        ```
        {
            "accessToken": "JWT"
        }
        ```

* **/images** POST:

    Upload image in Base64 format for authenticated User's folder.

    Example in `endpoints/images/__tests__/payload.json`

    + Request:

        Headers:

        - Authorization: "Bearer JWT"

        Body:
        ```
        {
            "filename": "string",
            "contentType": "image/jpg" | "image/png"
        }
        ```

    + Response:

        Status: 204

* **/images** GET:

    List images stored in authenticated User's folder.

    + Request:

        Headers:

        - Authorization: "Bearer JWT"
    
    + Response:

        Status: 200

        Body:
        ```
        [
            {
                "filename": "string",
                "link": "URL"
            }
        ]

* **/images/{filename}** GET:

    Redirects to download image through signed URL.

    + Request:

        Headers:

        - Authorization: "Bearer JWT"

    + Response:

        Status: 301

        Headers:

        - Location: "Signed S3 URL"


### Disclaimer

I did tried to implement full Cognito Identity credential to upload/download S3 files but wasn't able in time.