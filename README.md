# chargefree

Implement a simple, pre-cancellation survery for [Chargeebee](https://www.chargebee.com) merchants to collect feedback and send collected information further to destinations e.g., database, analytics or as simple as [Slack](https://slack.com/intl/en-in/).

This project was created because [Chargeebee Retention](https://www.chargebee.com/retention/) is too costly and comes at an additional cost on top existing heavy platform fees from [Chargeebee](https://www.chargebee.com). It makes least sense to pay more for something as minimal as this.

## Usage

To run the project, make sure you have [Docker](https://www.docker.com/) installed. Once installed, run below commands to start the project:

```shell
# create a .env file from included example
cp .env.example .env

# update chargebee API details etc. in .env file

# start required services using Docker
docker compose up -d
```

Server should be running and accessible on [127.0.0.1:3000](http://127.0.0.1:3000/) locally.

## Customisation

### Reasons

You can add as many as reasons in the `fixtures/cancellation-reasons.json` file, just make sure to always keep `Other` at the end of it.

### Destinations

Upon submission, you can perform as many as actions as you want such as sending data to your analytics platform etc. For e.g., we have included a [Slack](https://slack.com/intl/en-in/) notification example in `actions/notify-on-slack.js` file that sends a message to [Slack](https://slack.com/intl/en-in/) whenever a cancellation happens.

Similarly, you can create as many as actions as desired in `actions` folder and add them to `actions/index.js` file.

## Deployment

To build the container for remote deployment, use below commands:

```shell
# build Docker image locally
docker build -t chargefree .

# push Docker image to a registry
docker push chargefree
```
