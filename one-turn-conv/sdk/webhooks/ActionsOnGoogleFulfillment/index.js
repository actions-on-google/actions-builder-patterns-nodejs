/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const { conversation } = require('@assistant/conversation');
const functions = require('firebase-functions');

const app = conversation({debug: true});

const jokes = {
  'short': 'You know why you never see elephants hiding up in trees? <break time=".4" /> Because they’re really good at it.',
  'knock knock': 'Knock, knock <break time=".5" /> \n  \n Who <break time=".5" /> \n  \n Is there an owl in there?'
};

app.handle('joke', conv => {
  const jokeType = conv.intent.params.jokeType.resolved;
  conv.add(`<speak>Here is your joke:<break time=".35" /> ${jokes[jokeType]} Bye! </speak>`);
});

exports.ActionsOnGoogleFulfillment = functions.https.onRequest(app);
