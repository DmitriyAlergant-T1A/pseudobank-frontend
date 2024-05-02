const https = require('https');
const FormData = require('form-data')

// Make sure to set the OPENAI_API_KEY environment variable in a .env file (create if does not exist) - see .env.example

class OpenAI {
  static createChatBody(body, stream) {
    // Text messages are stored inside request body using the Deep Chat JSON format:
    // https://deepchat.dev/docs/connect
    const chatBody = {
      messages: body.messages.map((message) => {
        return {role: message.role === 'ai' ? 'assistant' : message.role, content: message.text};
      }),
      model: body.model,
    };
    if (stream) chatBody.stream = true;
    return chatBody;
  }

  static async chat(body, res, next) {
    const chatBody = OpenAI.createChatBody(body);
    const req = https.request(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + process.env.OPENAI_API_KEY,
        },
      },
      (reqResp) => {
        let data = '';
        reqResp.on('error', next); // forwarded to error handler middleware in ErrorUtils.handle
        reqResp.on('data', (chunk) => {
          data += chunk;
        });
        reqResp.on('end', () => {
          const result = JSON.parse(data);
          if (result.error) {
            next(result.error); // forwarded to error handler middleware in ErrorUtils.handle
          } else {
            // Sends response back to Deep Chat using the Response format:
            // https://deepchat.dev/docs/connect/#Response
            res.json({text: result.choices[0].message.content});
          }
        });
      }
    );
    req.on('error', next); // forwarded to error handler middleware in ErrorUtils.handle
    // Send the chat request to openAI
    req.write(JSON.stringify(chatBody));
    req.end();
  }

  static async chatStream(body, res, next) {
    const chatBody = OpenAI.createChatBody(body, true);
    const req = https.request(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + process.env.OPENAI_API_KEY,
        },
      },
      (streamResp) => {
        streamResp.on('error', next); // forwarded to error handler middleware in ErrorUtils.handle
        streamResp.on('data', (chunk) => {
          try {
            if (chunk?.toString().match(/^\{\n\s+\"error\"\:/)) {
              console.error('Error in the retrieved stream chunk:', chunk?.toString());
              return next(JSON.parse(chunk?.toString()).error); // forwarded to error handler middleware in ErrorUtils.handle
            }
            const lines = chunk?.toString()?.split('\n') || [];
            const filtredLines = lines.filter((line) => line.trim());
            filtredLines.forEach((line) => {
              const data = line.toString().replace('data:', '').replace('[DONE]', '').replace('data: [DONE]', '').trim();
              if (data) {
                try {
                  const result = JSON.parse(data);
                  if (result.choices[0].delta?.content) {
                    // Sends response back to Deep Chat using the Response format:
                    // https://deepchat.dev/docs/connect/#Response
                    res.write(`data: ${JSON.stringify({text: result.choices[0].delta.content})}\n\n`);
                  }
                } catch (e) {} // sometimes OpenAI sends incomplete JSONs that you don't need to use
              }
            });
          } catch (error) {
            console.error('Error when retrieving a stream chunk');
            return next(error); // forwarded to error handler middleware in ErrorUtils.handle
          }
        });
        streamResp.on('end', () => {
          res.end();
        });
        streamResp.on('abort', () => {
          res.end();
        });
      }
    );
    req.on('error', next); // forwarded to error handler middleware in ErrorUtils.handle
    // Send the chat request to openAI
    req.write(JSON.stringify(chatBody));
    req.end();
  }

  // By default - the OpenAI API will accept 1024x1024 png images, however other dimensions/formats can sometimes work by default
  // You can use an example image here: https://github.com/OvidijusParsiunas/deep-chat/blob/main/example-servers/ui/assets/example-image.png
  static async imageVariation(req, res, next) {
    // Files are stored inside a form using Deep Chat request FormData format:
    // https://deepchat.dev/docs/connect
    const formData = new FormData();
    if ((req.files)?.[0]) {
      const imageFile = (req.files)?.[0];
      formData.append('image', imageFile.buffer, imageFile.originalname);
    }
    const formReq = https.request(
      'https://api.openai.com/v1/images/variations',
      {
        method: 'POST',
        headers: {
          ...formData.getHeaders(),
          Authorization: 'Bearer ' + process.env.OPENAI_API_KEY,
        },
      },
      (reqResp) => {
        let data = '';
        reqResp.on('error', next); // forwarded to error handler middleware in ErrorUtils.handle
        reqResp.on('data', (chunk) => {
          data += chunk;
        });
        reqResp.on('end', () => {
          const result = JSON.parse(data);
          if (result.error) {
            next(result.error); // forwarded to error handler middleware in ErrorUtils.handle
          } else {
            // Sends response back to Deep Chat using the Response format:
            // https://deepchat.dev/docs/connect/#Response
            res.json({files: [{type: 'image', src: result.data[0].url}]});
          }
        });
      }
    );
    formReq.on('error', next); // forwarded to error handler middleware in ErrorUtils.handle
    // Send the request to openAI
    formData.pipe(formReq);
    formReq.end();
  }
}

module.exports = { OpenAI };