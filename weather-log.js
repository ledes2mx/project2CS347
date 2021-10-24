const express = require('express');
const service = express();

const port = 8443;
service.listen(port, () => {
    console.log('I am alive on port ${port}!');
});