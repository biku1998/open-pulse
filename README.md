# Open pulse

Open pulse is a standalone, self-hosted, open source event monitoring platform

```yml
# plugins:
#   - name: jwt
#     route:
#       - project-create-route
#       - project-get-route
#     config:
#       key_claim_name: iss # This is the 'issuer' claim in the JWT
#       secret_is_base64: false
#       run_on_preflight: true # Run JWT plugin even on CORS preflight requests
#       algorithms: ['HS256']

# consumers:
#   - username: auth-service
#     jwt_secrets:
#       - key: my-auth-key
#         secret: my-shared-secret

_format_version: '2.1'
services:
  - name: microservice1
    url: http://host.docker.internal:3000 # Points to microservice1 running on your host
    routes:
      - name: microservice1-route
        paths:
          - /microservice1

  - name: microservice2
    url: http://host.docker.internal:3001 # Points to microservice2 running on your host
    routes:
      - name: microservice2-route
        paths:
          - /microservice2
```
