function scheduleNpsFetch() {
  // Delete existing triggers for the function to avoid duplicates
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach((trigger) => {
    if (trigger.getHandlerFunction() === "fetchRefinerNpsData") {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // Create a new time-based trigger for each weekday
  const daysOfWeek = [
    ScriptApp.WeekDay.MONDAY,
    ScriptApp.WeekDay.TUESDAY,
    ScriptApp.WeekDay.WEDNESDAY,
    ScriptApp.WeekDay.THURSDAY,
    ScriptApp.WeekDay.FRIDAY,
  ];

  daysOfWeek.forEach((day) => {
    ScriptApp.newTrigger("fetchRefinerNpsData")
      .timeBased()
      .onWeekDay(day)
      .atHour(9) // 9 AM IST
      .nearMinute(0) // +/- 15 minutes from the configured minute
      .create();
  });
}
