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

app.handle('inIntent', conv => {
  const favoriteNumIntent = conv.intent.params.favoriteNum.original;
  conv.add(`Your favorite number through intents is ${favoriteNumIntent}. Now lets go back to what you can do.`);
});

app.handle('inScene', conv => {
  const favoriteNumScene = conv.request.scene.slots.favoriteNumSlots.value;
  conv.add(`Your favorite number through scene is ${favoriteNumScene}. Now lets go back to what you can do.`);
});

app.handle('partialData', conv=> {
  if (conv.scene.name === "PartialDataScene"){
    hasTime = conv.scene.slots.sceneDateTime.value.hours;
    hasDate = conv.scene.slots.sceneDateTime.value.day;
  } else {
    hasTime = conv.intent.params.dateTime.resolved.hours;
    hasDate = conv.intent.params.dateTime.resolved.day;
  }
  conv.add(`The slot was matched and it ` +
    (hasTime ? ' has' : ' is missing') + ' a time and' +
    (hasDate ? ' has' : ' is missing') + ' a date. ' );
});


exports.ActionsOnGoogleFulfillment = functions.https.onRequest(app);