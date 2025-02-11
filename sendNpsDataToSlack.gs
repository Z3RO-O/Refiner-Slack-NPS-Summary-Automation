// Replace with your Slack Webhook URL
const SLACK_WEBHOOK_URL = '<webhook-url>';

function sendNpsDataToSlack(NpsData, source) {
  if (!NpsData) {
    Logger.log('No data received from the API.');
    return; // Exit if no data
  }

  let formattedMessage = '';

  if(source==='web'){
    formattedMessage = formatWebNpsData(NpsData);
  } else if(source==='mobile'){
    formattedMessage = formatMobileNpsData(NpsData);
  } else if(source==='admin'){
    formattedMessage = formatAdminNpsData(NpsData);
  } else{
    formattedMessage = formatSpenderNpsData(NpsData);
  }

  const message = {
    text: `${formattedMessage}`
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(message),
  };

  try {
    const response = UrlFetchApp.fetch(SLACK_WEBHOOK_URL, options);
    Logger.log(`Message sent to Slack: ${response.getContentText()}`);
  } catch (error) {
    Logger.log(`Error sending message to Slack: ${error.message}`);
  }
}