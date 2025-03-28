> A Node.js program that creates PDFs from JSON. Can be hosted as an API or GUI. It will be used to automate the creation, and delivery of invoices, contracts, quota's etc. 

<center>
    <a href="https://github.com/Safe-and-Fast-Software/PDF-automator/graphs/contributors">
        <img src="https://img.shields.io/github/contributors/Safe-and-Fast-Software/PDF-automator" alt="Contributors"/>
    </a>
    <a href="https://github.com/Safe-and-Fast-Software/PDF-automator/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22">
        <img src="https://img.shields.io/github/issues/Safe-and-Fast-Software/PDF-automator/good%20first%20issue" alt="Good first issues" />
    </a>
    <a href="https://opensource.org/licenses/MIT" alt="Good first issues">
        <img src="https://img.shields.io/badge/License-GPL%20v2.0-green.svg" alt="Licence badge" />
    </a>
</center>

# PDF Automator
Have you always wanted to create invoices, contracts, quota's and more automatically? Well this tool allows you to create PDFs for free using JSON objects. All you have to do is create templates for your company, using JSON. And then you can create instances using the API, or the web GUI! All for free if you self host it!

## Deployment
All you have to do to deploy this for yourself assuming you've installed [docker](https://docker.com) is run the following commands to get the code application onto your system:

```BASH
git clone https://github.com/Safe-and-Fast-Software/PDF-Automator.git
cd PDF-Automator
```

Then create a copy of [`template.env`](./template.env) called `.env` and fill it in.
```BASH
cp template.env .env
$EDITOR .env
```

Now start the application:

```BASH
docker compose up --detach
```

and that's it! You should now have it running on your server! Just connect a reverse proxy of choice to it and you're off to the races!!

## Development

To develop, all you have to do is clone the repository, fill in some environment variables and start up the container:

```BASH
git clone https://github.com/Safe-and-Fast-Software/PDF-Automator.git
cd PDF-Automator
```

Then create a copy of [`template.env`](./template.env) called `.env` and fill it in.

```BASH
cp template.env .env
$EDITOR .env
```

Now start the application:

```BASH
docker compose \
  --file docker-compose.yaml \
  --file docker-compose.dev.yaml \
  up --force-recreate --build \
  --abort-on-container-exit 
```

and that's it! You should now have it running on your computer! Just connect to `localhost:$PORT`.
