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

app.handle('webhook', conv => {
  let message = 'In the webhook we will run a random number generator to determine which scene to send the user. ';
  let randomNum = Math.floor(Math.random() * Math.floor(1));
  if (randomNum === 0){
    conv.add(message.concat('You got the number 0, now you\'ll be sent back to the start!'));
    conv.scene.next = { name: 'Start' };
  } else {
    conv.add(message.concat('You got a 1, now the conversation will end.'));
    conv.scene.next = { name: 'actions.scene.END_CONVERSATION' };
  }
});

app.handle('surfaceCapabilities', conv => {
  const hasAudio =
    conv.device.capabilities.includes('SPEECH');
  const hasLongFormAudio =
    conv.device.capabilities.includes('LONG_FORM_AUDIO');
  const hasMediaPlayback =
    conv.device.capabilities.includes('RICH_RESPONSE');
  const hasWebBrowser =
    conv.device.capabilities.includes('WEB_LINK');
  // Interactive Canvas must be enabled in your project to see this
  const hasInteractiveCanvas =
    conv.device.capabilities.includes('INTERACTIVE_CANVAS');
  let message = 'Looks like your current device ' +
    (hasAudio ? 'has' : 'does not have') + ' the audio output capability, ' +
    (hasLongFormAudio ? 'has' : 'does not have') + ' the long form audio output capability, ' +
    (hasMediaPlayback ? 'has' : 'does not have') + ' the media capability, ' +
    (hasWebBrowser ? 'has' : 'does not have') + ' the browser capability, ' +
    (hasInteractiveCanvas ? 'has' : 'does not have') +
      ' the interactive canvas capability. The conversation can change depending on these factors. ';
  if (hasMediaPlayback){
    conv.add(message.concat('Since this device has browser capabilities, you\'ll go to the conditions scene'));
    conv.scene.next = { name: 'Conditions' };
  } else{
    // to test, in simulator change device to Speaker (e.g. Google Home)
    conv.add(message.concat('Since this device doesn\'t have browser capabilities, the conversation is ending. Bye.'));
    conv.scene.next = { name: 'actions.scene.END_CONVERSATION' };
  }
});

exports.ActionsOnGoogleFulfillment = functions.https.onRequest(app);
