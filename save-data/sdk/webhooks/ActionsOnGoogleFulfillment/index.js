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

const { conversation, Suggestion } = require('@assistant/conversation');
const functions = require('firebase-functions');

const app = conversation({debug: true});

app.handle('menu', conv => {
  let counter = conv.user.params.counter;
  let favoriteNum = conv.session.params.favoriteNum;
  let message = 'You can save data in the user storage via several ways. Through slots and of course through your webhook.';
  if (favoriteNum){
    message = message + ` I remember that your favorite number is ${favoriteNum}.`;
  }
  if (counter){
    message = message + ` I remember that the counter is at ${counter}.`;
  }
  conv.add(message);
  conv.add(new Suggestion({ title: 'slots'}));
  conv.add(new Suggestion({ title: 'webhook'}));
});

app.handle('counter', conv => {
  if (!conv.user.params.counter){
    conv.user.params.counter = 0;
  }
  conv.user.params.counter = parseInt(conv.user.params.counter) + 1;
  conv.add(`The counter is currently: ${conv.user.params.counter}. You can increase or go back to the main menu.`);
  conv.add(new Suggestion({ title: 'increase'}));
  conv.add(new Suggestion({ title: 'menu'}));
});

exports.ActionsOnGoogleFulfillment = functions.https.onRequest(app);
