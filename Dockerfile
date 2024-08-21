
FROM node:22.6.0-alpine3.20

RUN addgroup app && adduser -S -G app app

USER app

WORKDIR /app

RUN mkdir data

COPY --chown=app:node package*.json ./

# RUN npm install

COPY --chown=app:node . .   

# ENV Owner="Farshid Ahmadi"
# ENV ACCESS_TOKEN_PRIVATE_KEY=sdfjhj234t2fwd0982i34rf23feoijf042SDF
# ENV REFRESH_TOKEN_PRIVATE_KEY=sdfjhj432t2fwd0982i43rf23feoijf024SDF
# ENV PORT=1001
# ENV VITE_API_BASE_URL=http://localhost:1001
# ENV RETURN_URL=http://localhost:1000
# ENV CONNECTION_STRING=mongodb://127.0.0.1/my-mern-food-ordering

EXPOSE 1001

#  CMD [ "npm" , "run" , "dev" ]