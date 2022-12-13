Notes
=====

- Always test each functionality before moving on. For example make requests to ensure the controllers, routes and error handlers are working before moving on.

- NEVER STORE USER PASSWORDS AS STRINGS. Hash them instead

- For your JWT secret, use a key generator to generate the string. A free one can be found at allkeysgenerator.com. Select the 256-bit option for the best security.

- Route parameters vs Query parameters:
    - In Express:
        - route parameters come after the ':'
            - accessed by `req.param`.
        - query parameters come after the '?'.
            - accessed by `req.query`.
