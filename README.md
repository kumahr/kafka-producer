# kafka-producer
Small and dirty generic avro producer

# Installation

```bash
cd kafka-producer
npm install
```

# Usage
```bash
npm start
```
Server will listen on port 3000

# Endpoint

**POST** `/topics/:topic`
```json
{
  "key":"value"
}
```
