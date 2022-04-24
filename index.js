const avro = require("avsc");
const axios = require("axios").default;
//Server config
const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
// Kafka & Schema registry config
const schemaRegistry = "http://localhost:8081/subjects/";
const kafka = require("kafka-node");
const client = new kafka.KafkaClient({ kafkaHost: "localhost:9092" });
const producer = new kafka.Producer(client);

app.use(bodyParser.json());

app.post("/topics/:topic", async (req, res) => {
  const topic = req.params.topic;
  const message = req.body;
  axios
    .get(`${schemaRegistry}${topic}-value/versions/latest`)
    .then((response) => {
      const schema = JSON.parse(response.data.schema);
      const type = avro.Type.forSchema(schema);
      const bMessage = type.toBuffer(message);
      await producer.send(
        [
          {
            topic: topic,
            messages: bMessage,
          },
        ],
        (err) => {
          if (err) {
            console.log(err);
            res.status(500).json({
              msg: err,
            });
          }
        }
      );
      res.status(200).json({
        msg: "Message sent to kafka!",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
