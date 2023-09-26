const resumeUrl = { "VITE_POCKETBASE_URL": "http://localhost:5555", "VITE_RESUME_URL": "http://localhost:8080", "VITE_OPENAI_API_KEY": "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", "VITE_COMPANY_NAME": "MockInterview.tech", "VITE_CONTACT_INFO": "mockinterview.app@gmail.com", "VITE_STRIPE_PUBLIC_KEY": "pk_test_cCwXXdbuzfrMhtOhU2JBmyhn", "VITE_STRIPE_SECRET_KEY": "sk_test_bvszjhM9LnizMfBrwsHZSJva", "VITE_STRIPE_ID_BEST_PRODUCT": "price_1Nu2CpL5tBw90QNmGrMxd1ge", "VITE_STRIPE_ID_BETTER_PRODUCT": "price_1Nu3FoL5tBw90QNmt8IVUUKX", "VITE_STRIPE_ID_GOOD_PRODUCT": "price_1Nu3EvL5tBw90QNmCEP13Wtc", "VITE_NONCE_SIGNING_SECRET": "ByTd38IQSzmgs3S9FoNfaY8F", "BASE_URL": "/", "MODE": "production", "DEV": false, "PROD": true, "SSR": true }["VITE_RESUME_URL"];
const getAIQuestion = async (req) => {
  try {
    const response = await fetch(`${resumeUrl}/ai-question`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(req)
    });
    if (response.ok) {
      const d = await response.json();
      return d.question;
    } else {
      console.error("Error uploading interview answer");
      return null;
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return null;
  }
};
const answerQuestion = async (answer) => {
  try {
    let response = await fetch(`${resumeUrl}/answer`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(answer)
    });
    if (response.ok) {
      const d = await response.json();
      return d;
    } else {
      console.error("API returned an error: ", response);
      return null;
    }
  } catch (e) {
    console.error("An error occurred: ", e);
    return null;
  }
};
const answerFollowup = async (answerText, followupId) => {
  try {
    let response = await fetch(`${resumeUrl}/followup/${followupId}`, {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify({ followup_answer: answerText })
    });
    if (response.ok) {
      const d = await response.json();
      return d.followup;
    } else {
      console.error("API returned an error: ", response);
      return null;
    }
  } catch (e) {
    console.error("An error occurred: ", e);
    return null;
  }
};
const buildSummary = async (answerId) => {
  try {
    const response = await fetch(`${resumeUrl}/summary`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ answer_id: answerId })
    });
    if (response.ok) {
      const d = await response.json();
      return d.feedback;
    } else {
      console.error("API returned an error: ", response);
      return null;
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return null;
  }
};
const getAnswer = async (answerId) => {
  try {
    const response = await fetch(`${resumeUrl}/answer/${answerId}`, {
      method: "GET",
      credentials: "include"
    });
    if (response.ok) {
      const d = await response.json();
      return {
        answer: d.answer,
        question: d.question
      };
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
      return d.feedback;
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
    console.error("An error occurred:", error);
    return null;
  }
};
export {
  answerQuestion as a,
  answerFollowup as b,
  buildSummary as c,
  getSummaries as d,
  getSummary as e,
  getAnswer as f,
  getAIQuestion as g
};
