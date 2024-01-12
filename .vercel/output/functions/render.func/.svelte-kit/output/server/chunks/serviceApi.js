const resumeUrl = { "VITE_ENV": "development", "VITE_POCKETBASE_URL": "http://localhost:5555", "VITE_RESUME_URL": "http://localhost:8080", "VITE_OPENAI_API_KEY": "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", "VITE_COMPANY_NAME": "MockInterview.tech", "VITE_CONTACT_INFO": "concierge@mockinterview.tech", "VITE_STRIPE_PUBLIC_KEY": "pk_test_cCwXXdbuzfrMhtOhU2JBmyhn", "VITE_STRIPE_SECRET_KEY": "sk_test_bvszjhM9LnizMfBrwsHZSJva", "VITE_STRIPE_ID_BEST_PRODUCT": "price_1Nu2CpL5tBw90QNmGrMxd1ge", "VITE_STRIPE_ID_BETTER_PRODUCT": "price_1Nu3FoL5tBw90QNmt8IVUUKX", "VITE_STRIPE_ID_GOOD_PRODUCT": "price_1Nu3EvL5tBw90QNmCEP13Wtc", "VITE_NONCE_SIGNING_SECRET": "ByTd38IQSzmgs3S9FoNfaY8F", "VITE_EXCHANGE_END_CODE": "^_^", "BASE_URL": "/", "MODE": "production", "DEV": false, "PROD": true, "SSR": true }["VITE_RESUME_URL"];
const postConversation = async (conversation) => {
  try {
    const response = await fetch(`${resumeUrl}/conversation`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ ...conversation })
    });
    if (response.ok) {
      const d = await response.json();
      return { ...d.conversation, added_part: d.added_part };
    } else {
      console.error("API returned an error: ", response);
      return null;
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return null;
  }
};
const putConversation = async (conversation) => {
  try {
    const response = await fetch(`${resumeUrl}/conversation`, {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify({ ...conversation })
    });
    if (response.ok) {
      const d = await response.json();
      return { ...d.conversation, added_part: d.added_part };
    } else {
      console.error("API returned an error: ", response);
      return null;
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return null;
  }
};
const getConversation = async (conversationId) => {
  try {
    const response = await fetch(`${resumeUrl}/conversations/${conversationId}`, {
      method: "GET",
      credentials: "include"
    });
    if (response.ok) {
      const d = await response.json();
      return { ...d.conversation };
    } else {
      console.error("API returned an error: ", response);
      return null;
    }
  } catch (error) {
    console.error("An error occurred: ", error);
    return null;
  }
};
const getSummary = async (summaryId) => {
  try {
    const response = await fetch(`${resumeUrl}/summary/${summaryId}`, {
      method: "GET",
      credentials: "include"
    });
    if (response.ok) {
      const d = await response.json();
      return d.summary;
    } else {
      console.error("API returned an error: ", response);
      return null;
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return null;
  }
};
const getSummaries = async () => {
  try {
    const response = await fetch(`${resumeUrl}/summary`, {
      method: "GET",
      credentials: "include"
    });
    if (response.ok) {
      const d = await response.json();
      return d.summaries;
    } else {
      console.error("API returned an error: ", response);
      return null;
    }
  } catch (error) {
    console.error("An error occurred: ", error);
    return null;
  }
};
const postSummary = async (summarize_request) => {
  try {
    const response = await fetch(`${resumeUrl}/summary`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ ...summarize_request })
    });
    if (response.ok) {
      const d = await response.json();
      return d.summary;
    } else {
      console.error("API returned an error: ", response);
      return null;
    }
  } catch (error) {
    console.error("An error occurred: ", error);
    return null;
  }
};
export {
  postConversation as a,
  postSummary as b,
  getSummaries as c,
  getConversation as d,
  getSummary as g,
  putConversation as p
};
