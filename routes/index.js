const chargebee = require("chargebee");
const express = require("express");

const postCancelActions = require("../actions");
const reasons = require("../fixtures/cancellation-reasons.json");
const { generate, verify } = require("../middleware/verify-signed-url");

chargebee.configure({
  site: process.env.CHARGEBEE_SITE,
  api_key: process.env.CHARGEBEE_API_KEY,
});

const router = express.Router();

router.get("/", function (req, res, next) {
  res.render("index", { title: "Chargefree" });
});

router.get("/cancel-request/:subscriptionId", function (req, res, next) {
  const subscriptionId = req.params.subscriptionId;
  chargebee.subscription
    .retrieve(subscriptionId)
    .request(function (error, result) {
      if (error) {
        next(error);
      } else {
        const signedUrl = generate("/cancel/" + subscriptionId, req);
        res.send({ signedUrl });
      }
    });
});

router.get("/cancel/:subscriptionId", verify, function (req, res, next) {
  const { subscriptionId } = req.params;
  chargebee.subscription
    .retrieve(subscriptionId)
    .request(function (error, result) {
      if (error) {
        next(error);
      } else {
        const { customer, subscription } = result;
        res.render("cancel", {
          title: "Confirm cancellation",
          customer,
          subscription,
          reasons,
          csrfToken: req.csrfToken(),
        });
      }
    });
});

router.post("/cancel", async function (req, res, next) {
  const { subscriptionId } = req.body;
  const { feedback, reason } = req.body;

  try {
    const result = await chargebee.subscription
      // .cancel(subscriptionId, { end_of_term: true })
      .retrieve(subscriptionId)
      .request();

    for (const action of postCancelActions) {
      await action(result, { reason, feedback });
    }

    res.render("cancel-confirmation", {
      title: "Cancellation confirmed",
      customer: result.customer,
      subscription: result.subscription,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
