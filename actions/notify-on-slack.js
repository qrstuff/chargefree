const axios = require("axios");

const webhookUrl = process.env.SLACK_WEBHOOK_URL;

async function notifyOnSlack({ customer, subscription }, { reason, feedback }) {
  const subscriptionItem = subscription.subscription_items[0];

  const message = {
    text: `Customer ${customer.email} has cancelled their *${subscriptionItem.item_price_id}* subscription with ID _${subscription.id}_.`,
    attachments: [
      {
        color: "#ff0000",
        title: "Cancellation details:",
        fields: [
          {
            title: "Full name",
            value: `${customer.first_name} ${customer.last_name}`.trim(),
            short: true,
          },
          {
            title: "Email address",
            value: customer.email,
            short: true,
          },
          {
            title: "Plan name & MRR",
            value: `${subscriptionItem.item_price_id} - ${subscriptionItem.amount / 100}`,
            short: true,
          },
          {
            title: "Cancellation reason",
            value: reason,
            short: true,
          },
          {
            title: "Feedback",
            value: feedback || "_none_",
            short: false,
          },
        ],
        ts: Math.floor(Date.now() / 1000),
      },
    ],
  };

  await axios.post(webhookUrl, message);
}

module.exports = { notifyOnSlack };
