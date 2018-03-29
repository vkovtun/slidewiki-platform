FROM slidewiki/runtime:nodejs-8-slim
MAINTAINER Ali Khalili "hyperir@gmail.com"

ARG BUILD_ENV=local
ENV BUILD_ENV ${BUILD_ENV}

WORKDIR /nodeApp

# ---------------- #
#   Installation   #
# ---------------- #

ADD . /nodeApp
RUN ./make_version.sh

RUN if [ "$BUILD_ENV" = "travis" ] ; then npm prune --production ; else rm -R node_modules ; npm install --production ; fi
RUN npm run install

# -------- #
#   Run!   #
# -------- #

# default value for some configuration variables in case they is left blank in the .env file
ENV SMTP_PORT=25
ENV SSO_ENABLED=true

ENTRYPOINT ["./entrypoint.sh"]
