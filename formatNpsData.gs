function formatWebNpsData(npsData) {
  // Assuming `npsData` contains the following keys:
  // promoters, nps, detractors, passives, total
  const { promoters, nps, detractors, passives, total } = npsData;

  // Format the message
  return `
  :calendar: *Web NPS Score for the Last 30 Days*\n
  *NPS Score*: ${Number(nps).toFixed(2)}
  *Total Responses*: ${total}\n
  :smiley: *Promoters*: ${promoters}
  :white_frowning_face: *Detractors*: ${detractors}
  :neutral_face: *Passives*: ${passives}
  `;
}

function formatMobileNpsData(npsData) {
  // Assuming `npsData` contains the following keys:
  // promoters, nps, detractors, passives, total
  const { promoters, nps, detractors, passives, total } = npsData;

  // Format the message
  return `
  :calendar: *Mobile NPS Score for the Last 30 Days*\n
  *NPS Score*: ${Number(nps).toFixed(2)}
  *Total Responses*: ${total}\n
  :smiley: *Promoters*: ${promoters}
  :white_frowning_face: *Detractors*: ${detractors}
  :neutral_face: *Passives*: ${passives}
  `;
}

function formatAdminNpsData(npsData) {
  // Assuming `npsData` contains the following keys:
  // promoters, nps, detractors, passives, total
  const { promoters, nps, detractors, passives, total } = npsData;

  // Format the message
  return `
  :calendar: *Admin NPS Score for the Last 30 Days*\n
  *NPS Score*: ${Number(nps).toFixed(2)}
  *Total Responses*: ${total}\n
  :smiley: *Promoters*: ${promoters}
  :white_frowning_face: *Detractors*: ${detractors}
  :neutral_face: *Passives*: ${passives}
  `;
}

function formatSpenderNpsData(npsData) {
  // Assuming `npsData` contains the following keys:
  // promoters, nps, detractors, passives, total
  const { promoters, nps, detractors, passives, total } = npsData;

  // Format the message
  return `
  :calendar: *Spender NPS Score for the Last 30 Days*\n
  *NPS Score*: ${Number(nps).toFixed(2)}
  *Total Responses*: ${total}\n
  :smiley: *Promoters*: ${promoters}
  :white_frowning_face: *Detractors*: ${detractors}
  :neutral_face: *Passives*: ${passives}
  `;
}