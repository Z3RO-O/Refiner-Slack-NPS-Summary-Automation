function fetchRefinerNpsData() {
  const API_URL = "https://api.refiner.io/v1/responses"; // Refiner Public API
  const AUTH_TOKEN = "Bearer <API_TOKEN>";

  const FORM_UUIDS = {
    web: "<web-form-uuid>", // Web form UUID
    mobile: "<mobile-form-uuid>", // Mobile form UUID
  };

  // Calculate date range for the past 30 days
  const currentDate = new Date();
  const startDate = new Date();
  startDate.setDate(currentDate.getDate() - 30);

  const dateRangeStart = startDate.toISOString().split("T")[0]; // Format YYYY-MM-DD
  const dateRangeEnd = currentDate.toISOString().split("T")[0];

  // Initialize counters for admin and spender
  const adminStats = {
    promoters: 0,
    passives: 0,
    detractors: 0,
    totalResponses: 0
  };

  const spenderStats = {
    promoters: 0,
    passives: 0,
    detractors: 0,
    totalResponses: 0
  };

  // Helper function to process NPS responses to count admin and spender
  function processNpsResponse(item) {
    const score = parseInt(item.data.nps, 10);
    const isAdmin = item.contact.attributes.is_admin === "T";
    
    if (!isNaN(score)) {
      const stats = isAdmin ? adminStats : spenderStats;
      
      if (score >= 9) {
        stats.promoters++;
      } else if (score >= 7 && score <= 8) {
        stats.passives++;
      } else if (score <= 6) {
        stats.detractors++;
      }
      stats.totalResponses++;
    }
  }

  // Helper function to fetch NPS data
  function fetchNpsData(formUuid) {
    let promoters = 0;
    let detractors = 0;
    let passives = 0;
    let totalResponses = 0;

    let pageCursor = null;
    let hasMorePages = true;

    while (hasMorePages) {
      // Construct query parameters
      const queryParams = [
        `form_uuid=${formUuid}`,
        `date_range_start=${dateRangeStart}`,
        `date_range_end=${dateRangeEnd}`,
        "include=partials",
        "with_attributes=1",
        pageCursor ? `page_cursor=${pageCursor}` : "",
      ]
        .filter(Boolean)
        .join("&");

      const url = `${API_URL}?${queryParams}`;

      const options = {
        method: "get",
        headers: {
          Authorization: AUTH_TOKEN,
          Accept: "application/json",
        },
        muteHttpExceptions: true,
      };

      try {
        const response = UrlFetchApp.fetch(url, options);

        if (response.getResponseCode() !== 200) {
          throw new Error(`API request failed with status ${response.getResponseCode()}`);
        }

        const data = JSON.parse(response.getContentText());
        if (!data.items || data.items.length === 0) {
          hasMorePages = false;
          break;
        }

        // Process each response
        data.items.forEach(processNpsResponse);

        // Process responses
        data.items.forEach((item) => {
          const score = parseInt(item.data.nps, 10); // Parse NPS score
          if (!isNaN(score)) {
            if (score >= 9) promoters++;
            else if (score >= 7 && score <= 8) passives++;
            else if (score <= 6) detractors++;
          }
        });

        totalResponses += data.items.length;

        // Update page cursor for the next page
        if (data.pagination && data.pagination.next_page_cursor) {
          pageCursor = data.pagination.next_page_cursor;
        } else {
          hasMorePages = false;
        }
      } catch (error) {
        Logger.log(`Error fetching data: ${error.message}`);
        return null;
      }
    }

    // Calculate NPS score
    const npsScore = totalResponses
      ? ((promoters - detractors) / totalResponses) * 100
      : 0;

    // Prepare the result
    const result = {
      nps: npsScore.toFixed(2),
      total: totalResponses,
      promoters,
      passives,
      detractors,
    };

    Logger.log(`NPS Data: ${JSON.stringify(result)}`);
    return result;
  }

  // Fetch data for both forms
  const webData = fetchNpsData(FORM_UUIDS.web);
  const mobileData = fetchNpsData(FORM_UUIDS.mobile);

  // Calculate NPS score helper function for admin and spender
  function calculateNpsScore(stats) {
    if (stats.totalResponses === 0) return 0;
    return ((stats.promoters - stats.detractors) / stats.totalResponses) * 100;
  }

  if (webData) {
    sendNpsDataToSlack(webData, "web");
  }

  if (mobileData) {
    sendNpsDataToSlack(mobileData, "mobile");
  }

  // Calculate final NPS scores
  if (webData && mobileData) {
    const adminNps = calculateNpsScore(adminStats);
    const spenderNps = calculateNpsScore(spenderStats);

    // Prepare detailed stats
    const adminResults = {
      nps: adminNps.toFixed(2),
      total: adminStats.totalResponses,
      promoters: adminStats.promoters,
      passives: adminStats.passives,
      detractors: adminStats.detractors
    };

    const spenderResults = {
      nps: spenderNps.toFixed(2),
      total: spenderStats.totalResponses,
      promoters: spenderStats.promoters,
      passives: spenderStats.passives,
      detractors: spenderStats.detractors
    };  

    // Send results to Slack
    if (adminResults) {
      sendNpsDataToSlack(adminResults, "admin");
    }
    if (spenderResults) {
      sendNpsDataToSlack(spenderResults, "spender");
    }
  }
}
